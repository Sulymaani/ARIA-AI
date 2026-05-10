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

function findProfessor(text) {
  const normalized = normalize(text)
  return PROFESSORS.find(professor => {
    const nameParts = normalize(professor.name).split(" ").filter(part => part.length > 2)
    const titlelessName = normalize(professor.name.replace(/^(prof\.?|dr\.?)\s+/i, ""))
    return normalized.includes(titlelessName) || nameParts.some(part => normalized.includes(part))
  })
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
  const asksEvents = /\b(event|events|schedule|today|happening)\b/.test(normalized)
  const asksAvailability = /\b(free|available|occupied|busy|availability|booking|bookings)\b/.test(normalized)

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
