import { PROFESSORS, PROF_SCHEDULES, ROOMS, ROOM_SCHEDULES, TODAY_EVENTS } from "../data/facultyData"
import type {
  AriaComponent,
  AriaContext,
  AriaIntent,
  AriaResponse,
  AriAMode,
  ProfessorCardData,
  RoomCardData,
} from "../types/aria"
import { getProfStatus, getRoomStatus, getTodayKey } from "../utils/schedule"
import { statusLbl } from "../theme"

const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

const typeLabels = {
  admin: "Admin Office",
  computer_lab: "Computer Lab",
  lecture_hall: "Lecture Hall",
  office: "Office",
  study_room: "Study Room",
}

function findRoom(text) {
  const normalized = normalize(text)
  return ROOMS.find(room => {
    const aliases = [
      room.name,
      room.short,
      room.id,
      room.short.replace(/\s+/g, ""),
      room.name.replace(/^computer\s+/i, ""),
    ].map(normalize)

    return aliases.some(alias => alias && normalized.includes(alias))
  })
}

function findRooms(text) {
  const normalized = normalize(text)
  return ROOMS.filter(room => {
    const aliases = [
      room.name,
      room.short,
      room.id,
      room.short.replace(/\s+/g, ""),
      room.name.replace(/^computer\s+/i, ""),
    ].map(normalize)

    return aliases.some(alias => alias && normalized.includes(alias))
  })
}

function findProfessor(text) {
  const normalized = normalize(text)
  return PROFESSORS.find(professor => {
    const nameParts = normalize(professor.name).split(" ").filter(part => part.length > 2)
    const titlelessName = normalize(professor.name.replace(/^(prof\.?|dr\.?)\s+/i, ""))
    return normalized.includes(titlelessName) || nameParts.some(part => normalized.includes(part))
  })
}

function findProfessorByContext(context: Partial<AriaContext>) {
  return context.resolved_professor ? PROFESSORS.find(professor => professor.id === context.resolved_professor) : null
}

function findOfficeOccupant(text) {
  const normalized = normalize(text)
  const roomNumber = normalized.match(/\b(?:room|office)?\s*(\d{3})\b/)?.[1]
  if (!roomNumber) return null
  return PROFESSORS.find(professor => normalize(professor.office).includes(roomNumber))
}

function makeContactCard(professor) {
  return {
    type: "ContactCard" as const,
    name: professor.name,
    role: professor.title,
    email: professor.email,
    office: professor.office,
    department: professor.department,
    research: professor.research || null,
  }
}

function makeRoomDirectoryItem(room) {
  const status = getRoomStatus(room.id)
  return {
    id: room.id,
    label: room.name,
    detail: `Floor ${room.floor} - ${typeLabels[room.type] || room.type} - Capacity ${room.capacity ?? "N/A"}`,
    meta: room.features?.length ? room.features : [room.block ? `Block ${room.block}` : ""].filter(Boolean),
    status: status.status,
  }
}

function makeProfessorDirectoryItem(professor) {
  const status = getProfStatus(professor.id)
  return {
    id: professor.id,
    label: professor.name,
    detail: `${professor.title} - ${professor.department}`,
    meta: [professor.office, professor.email],
    status: status.status,
  }
}

function makeRoomCard(room): RoomCardData {
  const status = getRoomStatus(room.id)
  return {
    type: "RoomCard",
    room_id: room.id,
    name: room.name,
    floor: room.floor,
    type_label: typeLabels[room.type] || room.type,
    capacity: room.capacity,
    features: room.features,
    status: status.status,
    occupied_until: status.status === "occupied" ? status.to || null : null,
    available_from: status.status === "occupied" ? status.to || null : null,
    current_class: status.label || null,
    directions: room.directions,
  }
}

function makeProfessorCard(professor): ProfessorCardData {
  const status = getProfStatus(professor.id)
  return {
    type: "ProfessorCard",
    professor_id: professor.id,
    name: professor.name,
    title: professor.title,
    department: professor.department,
    office: professor.office,
    status: status.status,
    status_label: statusLbl(status.status),
    current_activity: status.label || null,
    todays_slots: PROF_SCHEDULES[professor.id]?.[getTodayKey()] || [],
  }
}

function buildContext(context: Partial<AriaContext>, intent: AriaIntent, room, professor, mode: AriAMode = "balanced"): AriaContext {
  return {
    ...context,
    turn: (context.turn || 0) + 1,
    mode,
    resolved_room: room?.id || context.resolved_room || null,
    resolved_professor: professor?.id || context.resolved_professor || null,
    intent_history: [...(context.intent_history || []), intent].slice(-6),
    context_summary: room
      ? `Last resolved room: ${room.name}.`
      : professor
        ? `Last resolved professor: ${professor.name}.`
        : context.context_summary || "Local fallback response.",
  }
}

export function createLocalFallbackResponse(text: string, context: Partial<AriaContext> = {}): AriaResponse {
  const normalized = normalize(text)
  const room = findRoom(text)
  const professor = findProfessor(text)
  const contextProfessor = findProfessorByContext(context)
  const officeOccupant = findOfficeOccupant(text)
  const mentionedRooms = findRooms(text)
  const asksEvents = /\b(event|events|schedule|today|happening)\b/.test(normalized)
  const asksAvailability = /\b(free|available|occupied|busy|availability|booking|bookings)\b/.test(normalized)
  const asksContact = /\b(email|contact|office|department|research|who is in|who uses)\b/.test(normalized)
  const asksCount = /\b(how many|count|total|number of)\b/.test(normalized)
  const asksList = /\b(list|show|which|what|all)\b/.test(normalized)
  const asksOverview = /\b(overview|summary|summarize|in the system|faculty data)\b/.test(normalized)
  const asksCompare = /\b(compare|comparison|versus|vs|better|which one)\b/.test(normalized)
  const requestedProfessor = professor || (/\b(dr|professor|prof|lecturer|teacher|email|contact|office)\b/.test(normalized) ? contextProfessor : null)

  if (asksCompare && mentionedRooms.length >= 2) {
    const roomsToCompare = mentionedRooms.slice(0, 4)
    return {
      mode: "expert",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "ComparisonTable",
          title: "Room Comparison",
          columns: roomsToCompare.map(room => room.short),
          rows: [
            { label: "Name", values: roomsToCompare.map(room => room.name) },
            { label: "Floor", values: roomsToCompare.map(room => String(room.floor)) },
            { label: "Capacity", values: roomsToCompare.map(room => String(room.capacity ?? "N/A")) },
            { label: "Features", values: roomsToCompare.map(room => room.features.join(", ") || "None listed") },
            { label: "Status", values: roomsToCompare.map(room => statusLbl(getRoomStatus(room.id).status)) },
          ],
        },
      ],
      context: buildContext(context, "faculty_info", null, null, "expert"),
    }
  }

  if (asksOverview) {
    const labs = ROOMS.filter(room => room.type === "computer_lab")
    const availableRooms = ROOMS.filter(room => ROOM_SCHEDULES[room.id] && getRoomStatus(room.id).status === "available")
    return {
      mode: "expert",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "MetricStrip",
          metrics: [
            { label: "Professors", value: String(PROFESSORS.length), detail: "Faculty directory", status: null },
            { label: "Rooms", value: String(ROOMS.length), detail: "Known spaces", status: null },
            { label: "Labs", value: String(labs.length), detail: "Computer labs", status: null },
            { label: "Free Now", value: String(availableRooms.length), detail: "Scheduled rooms", status: "available" },
          ],
        },
        {
          type: "DirectoryList",
          title: "Faculty Directory Snapshot",
          subtitle: "Known professors and primary departments",
          items: PROFESSORS.map(makeProfessorDirectoryItem),
        },
      ],
      context: buildContext(context, "faculty_info", null, null, "expert"),
    }
  }

  if (asksCount && /\b(professor|professors|lecturer|lecturers|staff)\b/.test(normalized)) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "AnswerCard",
          title: "Professor Count",
          answer: `There are ${PROFESSORS.length} professors in the current ARIA faculty directory.`,
          facts: [
            { label: "Professors", value: String(PROFESSORS.length) },
            { label: "Departments", value: String(new Set(PROFESSORS.map(p => p.department)).size) },
          ],
          tone: "info",
        },
      ],
      context: buildContext(context, "faculty_info", null, null),
    }
  }

  if (asksCount && /\b(room|rooms|lab|labs|space|spaces)\b/.test(normalized)) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "AnswerCard",
          title: "Room Count",
          answer: `There are ${ROOMS.length} known rooms and spaces in the current ARIA directory.`,
          facts: [
            { label: "Total rooms", value: String(ROOMS.length) },
            { label: "Computer labs", value: String(ROOMS.filter(r => r.type === "computer_lab").length) },
            { label: "Study rooms", value: String(ROOMS.filter(r => r.type === "study_room").length) },
          ],
          tone: "info",
        },
      ],
      context: buildContext(context, "faculty_info", null, null),
    }
  }

  if (asksContact && officeOccupant) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "AnswerCard",
          title: "Office Occupant",
          answer: `${officeOccupant.name} is listed for ${officeOccupant.office}.`,
          facts: [{ label: "Department", value: officeOccupant.department }],
          tone: "info",
        },
        makeContactCard(officeOccupant),
      ],
      context: buildContext(context, "faculty_info", null, officeOccupant),
    }
  }

  if (asksContact && requestedProfessor) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [makeContactCard(requestedProfessor)],
      context: buildContext(context, "faculty_info", null, requestedProfessor),
    }
  }

  if (asksList && /\b(professor|professors|lecturer|lecturers|department|departments)\b/.test(normalized)) {
    const departmentMatch = PROFESSORS.find(professor => normalized.includes(normalize(professor.department)))
    const professors = departmentMatch ? PROFESSORS.filter(professor => professor.department === departmentMatch.department) : PROFESSORS
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "DirectoryList",
          title: departmentMatch ? `${departmentMatch.department} Professors` : "Faculty Professors",
          subtitle: `${professors.length} result${professors.length === 1 ? "" : "s"} in the known directory`,
          items: professors.map(makeProfessorDirectoryItem),
        },
      ],
      context: buildContext(context, "faculty_info", null, null),
    }
  }

  if (asksList && /\b(room|rooms|lab|labs|projector|whiteboard|floor|office|study)\b/.test(normalized)) {
    const floor = normalized.match(/\bfloor\s*(\d)\b/)?.[1]
    const wantsLabs = /\b(lab|labs)\b/.test(normalized)
    const wantsProjector = /\bprojector|projectors\b/.test(normalized)
    const wantsWhiteboard = /\bwhiteboard|whiteboards\b/.test(normalized)
    const wantsStudy = /\bstudy\b/.test(normalized)
    const rooms = ROOMS.filter(room => {
      if (floor && String(room.floor) !== floor) return false
      if (wantsLabs && room.type !== "computer_lab") return false
      if (wantsStudy && room.type !== "study_room") return false
      if (wantsProjector && !room.features.includes("projector")) return false
      if (wantsWhiteboard && !room.features.includes("whiteboard")) return false
      return true
    })
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "faculty_info",
      outOfScope: false,
      components: [
        {
          type: "DirectoryList",
          title: "Room Directory",
          subtitle: `${rooms.length} matching room${rooms.length === 1 ? "" : "s"}`,
          items: rooms.map(makeRoomDirectoryItem),
        },
      ],
      context: buildContext(context, "faculty_info", null, null),
    }
  }

  if (room) {
    const components: AriaComponent[] = [makeRoomCard(room)]
    if (!asksAvailability) {
      components.push({
        type: "MapThumbnail",
        room_id: room.id,
        room_name: room.name,
        floor: room.floor,
        landmark: room.landmark,
      })
    }

    return {
      mode: "balanced",
      modeChanged: false,
      intent: asksAvailability ? "room_availability" : "room_finding",
      outOfScope: false,
      components,
      context: buildContext(context, asksAvailability ? "room_availability" : "room_finding", room, null),
    }
  }

  if (professor) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "professor_finding",
      outOfScope: false,
      components: [
        makeProfessorCard(professor),
        {
          type: "ContextPanel",
          items: [
            { label: "Office", value: professor.office },
            { label: "Email", value: professor.email },
            { label: "Research", value: professor.research },
          ],
        },
      ],
      context: buildContext(context, "professor_finding", null, professor),
    }
  }

  if (asksEvents) {
    return {
      mode: "balanced",
      modeChanged: false,
      intent: "schedule",
      outOfScope: false,
      components: [{ type: "EventList", events: TODAY_EVENTS }],
      context: buildContext(context, "schedule", null, null),
    }
  }

  if (asksAvailability) {
    return {
      mode: "expert",
      modeChanged: false,
      intent: "room_availability",
      outOfScope: false,
      components: [
        {
          type: "StatusDashboard",
          rows: ROOMS.filter(room => ROOM_SCHEDULES[room.id]).slice(0, 8).map(room => {
            const status = getRoomStatus(room.id)
            return {
              entity_type: "room",
              entity_id: room.id,
              name: room.short,
              status: status.status,
              status_label: statusLbl(status.status),
              detail: status.label || `Floor ${room.floor}`,
            }
          }),
        },
      ],
      context: buildContext(context, "room_availability", null, null, "expert"),
    }
  }

  return {
    mode: "guided",
    modeChanged: false,
    intent: "out_of_scope",
    outOfScope: true,
    components: [
      {
        type: "OutOfScopeCard",
        message: "I could not reach the AI service, but I can still help if you ask about a known room, professor, room availability, or today's events.",
      },
    ],
    context: buildContext(context, "out_of_scope", null, null, "guided"),
  }
}
