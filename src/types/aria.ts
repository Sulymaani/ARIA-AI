export type AriAMode = "guided" | "balanced" | "expert"

export type AriaIntent =
  | "room_finding"
  | "professor_finding"
  | "room_availability"
  | "schedule"
  | "faculty_info"
  | "out_of_scope"

export type AriaStatus =
  | "available"
  | "occupied"
  | "in_office"
  | "teaching"
  | "meeting"
  | "unavailable"

export type AriaScheduleSlot = {
  from: string
  to: string
  status: AriaStatus | string
  label: string
}

export type AriaContext = {
  turn: number
  mode?: string | null
  resolved_room?: string | null
  resolved_professor?: string | null
  intent_history: string[]
  context_summary: string
}

export type ClarifyCardData = {
  type: "ClarifyCard"
  question: string
  options: string[]
}

export type StepIndicatorData = {
  type: "StepIndicator"
  destination: string
  steps: string[]
}

export type RoomCardData = {
  type: "RoomCard"
  room_id: string
  name: string
  floor: number
  type_label: string
  capacity: number | null
  features: string[]
  status: AriaStatus | string
  occupied_until: string | null
  available_from: string | null
  current_class: string | null
  directions: string[]
}

export type ProfessorCardData = {
  type: "ProfessorCard"
  professor_id: string
  name: string
  title: string
  department: string
  office: string
  status: AriaStatus | string
  status_label: string
  current_activity: string | null
  todays_slots: AriaScheduleSlot[]
}

export type TimelineData = {
  type: "Timeline"
  entity_name: string
  entity_type: "professor" | "room"
  slots: AriaScheduleSlot[]
  current_time: string
}

export type MapThumbnailData = {
  type: "MapThumbnail"
  room_id: string
  room_name: string
  floor: number
  landmark: string
}

export type ContextPanelData = {
  type: "ContextPanel"
  items: { label: string; value: string }[]
}

export type AnswerCardData = {
  type: "AnswerCard"
  title: string
  answer: string
  facts?: { label: string; value: string }[]
  tone?: "info" | "success" | "warning"
}

export type ContactCardData = {
  type: "ContactCard"
  name: string
  role: string
  email: string
  office: string
  department: string
  research?: string | null
}

export type DirectoryListData = {
  type: "DirectoryList"
  title: string
  subtitle?: string | null
  items: {
    id: string
    label: string
    detail: string | null
    meta?: string[]
    status?: AriaStatus | string | null
  }[]
}

export type MetricStripData = {
  type: "MetricStrip"
  metrics: {
    label: string
    value: string
    detail?: string | null
    status?: AriaStatus | string | null
  }[]
}

export type ComparisonTableData = {
  type: "ComparisonTable"
  title: string
  columns: string[]
  rows: {
    label: string
    values: string[]
  }[]
}

export type StatusDashboardData = {
  type: "StatusDashboard"
  rows: {
    entity_type: "professor" | "room"
    entity_id: string
    name: string
    status: AriaStatus | string
    status_label: string
    detail: string | null
  }[]
}

export type OccupancyGridData = {
  type: "OccupancyGrid"
  title: string
  time_blocks: string[]
  rows: {
    room_id: string
    name: string
    floor: number
    slots: ("available" | "occupied")[]
  }[]
}

export type ActionChipsData = {
  type: "ActionChips"
  chips: { label: string; action: string }[]
}

export type EventListData = {
  type: "EventList"
  events: {
    id: string
    title: string
    from: string
    to: string
    location: string
    open_to: string
    description: string
  }[]
}

export type OutOfScopeCardData = {
  type: "OutOfScopeCard"
  message: string
}

export type AriaComponent =
  | ClarifyCardData
  | StepIndicatorData
  | RoomCardData
  | ProfessorCardData
  | TimelineData
  | MapThumbnailData
  | ContextPanelData
  | AnswerCardData
  | ContactCardData
  | DirectoryListData
  | MetricStripData
  | ComparisonTableData
  | StatusDashboardData
  | OccupancyGridData
  | ActionChipsData
  | EventListData
  | OutOfScopeCardData

export type AriaResponse = {
  mode: AriAMode
  modeChanged: boolean
  intent: AriaIntent
  outOfScope: boolean
  components: AriaComponent[]
  context: AriaContext
}

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}
