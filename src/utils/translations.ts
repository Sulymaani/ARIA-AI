type Translations = {
  // Shell
  startOver: string
  normalText: string
  largerText: string
  // WelcomeScreen
  institution: string
  greeting: string
  subtitle: string
  tapToSpeak: string
  listening: string
  stillHere: string
  inputPlaceholder: string
  send: string
  // Suggestion chips
  chip_findRoom: string
  chip_findRoomPrompt: string
  chip_profStatus: string
  chip_profStatusPrompt: string
  chip_freeRooms: string
  chip_freeRoomsPrompt: string
  chip_events: string
  chip_eventsPrompt: string
  // InputBar
  inputFollowup: string
  inputRecording: string
  noDataSaved: string
  // App dialogs
  areYouStillThere: string
  resettingIn: (n: number) => string
  yesImHere: string
  tryAgain: string
  fallbackError: string
  newTopic: string
  // Intent labels
  intent_room_finding: string
  intent_professor_finding: string
  intent_room_availability: string
  intent_schedule: string
  intent_faculty_info: string
  intent_out_of_scope: string
  // Status labels
  status_in_office: string
  status_available: string
  status_occupied: string
  status_unavailable: string
  status_teaching: string
  status_meeting: string
  // ResponseCard structural
  directionsTo: (dest: string) => string
  followSteps: string
  nextStep: string
  youHaveArrived: string
  todaySchedule: string
  relatedInfo: string
  floorTypeCap: (floor: number, type: string, cap: number | null) => string
  currentlyClass: (cls: string) => string
  occupiedUntil: (t: string) => string
  freeFrom: (t: string) => string
  timeline_subtitle: (type: string) => string
  floorHeadingHere: (floor: number) => string
  free: string
  busy: string
  room: string
  availabilityByTime: string
  statusOverview: string
  currentStatus: string
  // ContactCard
  emailLabel: string
  officeLabel: string
  researchLabel: string
  // ComparisonTable
  comparisonSubtitle: string
  fieldLabel: string
  // EventList
  eventsTitle: string
  eventsSubtitle: string
  // OutOfScopeCard fallback
  outOfScopeHelp: string
  // Mode indicator
  viewLabel: string
  modeAuto: string
  modeGuided: string
  modeBalanced: string
  modeExpert: string
  switchedTo: (label: string) => string
}

const EN: Translations = {
  startOver: "Start Over",
  normalText: "Normal text size",
  largerText: "Larger text size",
  institution: "FSKTM · Universiti Malaya",
  greeting: "Hello, I'm ARIA",
  subtitle: "I can help you find rooms, check professor availability, view room bookings, and see today's schedule.",
  tapToSpeak: "Tap the orb to speak",
  listening: "Listening — tap to stop",
  stillHere: "Still here? Tap the orb or type below",
  inputPlaceholder: "Or type your question here...",
  send: "Send",
  chip_findRoom: "Find Lab 302",
  chip_findRoomPrompt: "Where is Lab 302?",
  chip_profStatus: "Professor status",
  chip_profStatusPrompt: "Is Prof. Amirah in her office?",
  chip_freeRooms: "Free rooms",
  chip_freeRoomsPrompt: "Which rooms are available now?",
  chip_events: "Today's events",
  chip_eventsPrompt: "What events are happening today?",
  inputFollowup: "Type or speak your follow-up question",
  inputRecording: "Listening — speak now, then stop recording",
  noDataSaved: "No data saved this session",
  areYouStillThere: "Are you still there?",
  resettingIn: (n) => `Resetting in ${n}s...`,
  yesImHere: "Yes, I'm here",
  tryAgain: "Try again",
  fallbackError: "ARIA is using local fallback data because the AI service is unavailable.",
  newTopic: "New topic",
  intent_room_finding: "Room Finding",
  intent_professor_finding: "Professor",
  intent_room_availability: "Room Availability",
  intent_schedule: "Schedule",
  intent_faculty_info: "Faculty Info",
  intent_out_of_scope: "General",
  status_in_office: "In Office",
  status_available: "Available",
  status_occupied: "Occupied",
  status_unavailable: "Unavailable",
  status_teaching: "Teaching",
  status_meeting: "In Meeting",
  directionsTo: (dest) => `Directions to ${dest}`,
  followSteps: "Follow the steps in order. Current step is highlighted.",
  nextStep: "Next step",
  youHaveArrived: "You have arrived",
  todaySchedule: "Today's Schedule",
  relatedInfo: "Related Info",
  floorTypeCap: (floor, type, cap) => `Floor ${floor} · ${type} · Capacity ${cap ?? "N/A"}`,
  currentlyClass: (cls) => `Currently: ${cls}`,
  occupiedUntil: (t) => `Occupied until ${t}`,
  freeFrom: (t) => `Free from ${t}`,
  timeline_subtitle: (type) => `${type} timeline`,
  floorHeadingHere: (floor) => `Floor ${floor} · You're heading here`,
  free: "Free",
  busy: "Busy",
  room: "Room",
  availabilityByTime: "Availability by time block",
  statusOverview: "Status Overview",
  currentStatus: "Current room and professor status",
  emailLabel: "Email",
  officeLabel: "Office",
  researchLabel: "Research",
  comparisonSubtitle: "Side-by-side faculty data comparison",
  fieldLabel: "Field",
  eventsTitle: "Today's Events at FSKTM",
  eventsSubtitle: "Events currently listed for today",
  outOfScopeHelp: "I can help with room finding, professor availability, room bookings, and today's schedule.",
  viewLabel: "View",
  modeAuto: "Auto",
  modeGuided: "Step-by-step",
  modeBalanced: "Standard",
  modeExpert: "Detailed",
  switchedTo: (label) => `Switched to ${label} view`,
}

const BM: Translations = {
  startOver: "Mula Semula",
  normalText: "Saiz teks biasa",
  largerText: "Saiz teks lebih besar",
  institution: "FSKTM · Universiti Malaya",
  greeting: "Hai, saya ARIA",
  subtitle: "Saya boleh membantu anda mencari bilik, semak ketersediaan profesor, lihat tempahan bilik, dan jadual hari ini.",
  tapToSpeak: "Ketuk orb untuk bercakap",
  listening: "Mendengar — ketuk untuk berhenti",
  stillHere: "Masih di sini? Ketuk orb atau taip di bawah",
  inputPlaceholder: "Atau taip soalan anda di sini...",
  send: "Hantar",
  chip_findRoom: "Cari Lab 302",
  chip_findRoomPrompt: "Di mana Lab 302?",
  chip_profStatus: "Status profesor",
  chip_profStatusPrompt: "Adakah Prof. Amirah di pejabatnya?",
  chip_freeRooms: "Bilik kosong",
  chip_freeRoomsPrompt: "Bilik mana yang tersedia sekarang?",
  chip_events: "Acara hari ini",
  chip_eventsPrompt: "Apakah acara yang berlaku hari ini?",
  inputFollowup: "Taip atau cakap soalan susulan anda",
  inputRecording: "Mendengar — cakap sekarang, kemudian berhenti",
  noDataSaved: "Tiada data disimpan sesi ini",
  areYouStillThere: "Adakah anda masih di sini?",
  resettingIn: (n) => `Menetapkan semula dalam ${n}s...`,
  yesImHere: "Ya, saya di sini",
  tryAgain: "Cuba lagi",
  fallbackError: "ARIA menggunakan data tempatan kerana perkhidmatan AI tidak tersedia.",
  newTopic: "Topik baharu",
  intent_room_finding: "Carian Bilik",
  intent_professor_finding: "Profesor",
  intent_room_availability: "Ketersediaan Bilik",
  intent_schedule: "Jadual",
  intent_faculty_info: "Maklumat Fakulti",
  intent_out_of_scope: "Umum",
  status_in_office: "Di Pejabat",
  status_available: "Tersedia",
  status_occupied: "Diduduki",
  status_unavailable: "Tidak Tersedia",
  status_teaching: "Mengajar",
  status_meeting: "Dalam Mesyuarat",
  directionsTo: (dest) => `Arah ke ${dest}`,
  followSteps: "Ikut langkah mengikut urutan. Langkah semasa diserlahkan.",
  nextStep: "Langkah seterusnya",
  youHaveArrived: "Anda telah tiba",
  todaySchedule: "Jadual Hari Ini",
  relatedInfo: "Maklumat Berkaitan",
  floorTypeCap: (floor, type, cap) => `Tingkat ${floor} · ${type} · Kapasiti ${cap ?? "—"}`,
  currentlyClass: (cls) => `Sedang: ${cls}`,
  occupiedUntil: (t) => `Diduduki sehingga ${t}`,
  freeFrom: (t) => `Kosong dari ${t}`,
  timeline_subtitle: (type) => `Garis masa ${type}`,
  floorHeadingHere: (floor) => `Tingkat ${floor} · Anda menuju ke sini`,
  free: "Kosong",
  busy: "Sibuk",
  room: "Bilik",
  availabilityByTime: "Ketersediaan mengikut blok masa",
  statusOverview: "Gambaran Keseluruhan Status",
  currentStatus: "Status bilik dan profesor semasa",
  emailLabel: "E-mel",
  officeLabel: "Pejabat",
  researchLabel: "Penyelidikan",
  comparisonSubtitle: "Perbandingan data fakulti secara berdampingan",
  fieldLabel: "Medan",
  eventsTitle: "Acara Hari Ini di FSKTM",
  eventsSubtitle: "Acara yang disenaraikan untuk hari ini",
  outOfScopeHelp: "Saya boleh membantu mencari bilik, ketersediaan profesor, tempahan bilik, dan jadual hari ini.",
  viewLabel: "Paparan",
  modeAuto: "Auto",
  modeGuided: "Langkah demi langkah",
  modeBalanced: "Standard",
  modeExpert: "Terperinci",
  switchedTo: (label) => `Bertukar ke paparan ${label}`,
}

const ZH: Translations = {
  startOver: "重新开始",
  normalText: "标准字体大小",
  largerText: "较大字体",
  institution: "FSKTM · 马来亚大学",
  greeting: "你好，我是 ARIA",
  subtitle: "我可以帮您查找教室、查看教授状态、查询教室预定以及今日课程安排。",
  tapToSpeak: "点击语音球说话",
  listening: "正在聆听 — 点击停止",
  stillHere: "还在吗？点击语音球或在下方输入",
  inputPlaceholder: "或在此输入您的问题...",
  send: "发送",
  chip_findRoom: "查找 Lab 302",
  chip_findRoomPrompt: "Lab 302 在哪里？",
  chip_profStatus: "教授状态",
  chip_profStatusPrompt: "Amirah 教授在办公室吗？",
  chip_freeRooms: "空闲教室",
  chip_freeRoomsPrompt: "现在哪些教室有空？",
  chip_events: "今日活动",
  chip_eventsPrompt: "今天有哪些活动？",
  inputFollowup: "输入或说出您的后续问题",
  inputRecording: "正在聆听 — 请说话，然后停止录音",
  noDataSaved: "本次会话未保存数据",
  areYouStillThere: "您还在吗？",
  resettingIn: (n) => `${n} 秒后重置...`,
  yesImHere: "是的，我在",
  tryAgain: "重试",
  fallbackError: "AI 服务不可用，ARIA 正在使用本地备用数据。",
  newTopic: "新话题",
  intent_room_finding: "查找教室",
  intent_professor_finding: "教授",
  intent_room_availability: "教室可用性",
  intent_schedule: "课程表",
  intent_faculty_info: "院系信息",
  intent_out_of_scope: "一般",
  status_in_office: "在办公室",
  status_available: "空闲",
  status_occupied: "已占用",
  status_unavailable: "不可用",
  status_teaching: "正在授课",
  status_meeting: "开会中",
  directionsTo: (dest) => `前往 ${dest} 的路线`,
  followSteps: "请按顺序跟随步骤，当前步骤已高亮显示。",
  nextStep: "下一步",
  youHaveArrived: "您已到达",
  todaySchedule: "今日课程",
  relatedInfo: "相关信息",
  floorTypeCap: (floor, type, cap) => `${floor} 楼 · ${type} · 容量 ${cap ?? "—"}`,
  currentlyClass: (cls) => `当前：${cls}`,
  occupiedUntil: (t) => `占用至 ${t}`,
  freeFrom: (t) => `从 ${t} 起空闲`,
  timeline_subtitle: (type) => `${type} 时间表`,
  floorHeadingHere: (floor) => `${floor} 楼 · 您正前往此处`,
  free: "空闲",
  busy: "占用",
  room: "教室",
  availabilityByTime: "按时间段的可用性",
  statusOverview: "状态概览",
  currentStatus: "当前教室和教授状态",
  emailLabel: "电子邮件",
  officeLabel: "办公室",
  researchLabel: "研究方向",
  comparisonSubtitle: "院系数据对比",
  fieldLabel: "字段",
  eventsTitle: "FSKTM 今日活动",
  eventsSubtitle: "今日活动列表",
  outOfScopeHelp: "我可以帮助查找教室、教授状态、教室预定以及今日课程安排。",
  viewLabel: "视图",
  modeAuto: "自动",
  modeGuided: "逐步",
  modeBalanced: "标准",
  modeExpert: "详细",
  switchedTo: (label) => `已切换至${label}视图`,
}

const dict: Record<string, Translations> = { EN, BM, ZH }

export const T = (lang: string): Translations => dict[lang] ?? dict.EN

export function statusT(lang: string, status: string): string {
  const t = T(lang)
  return (t as any)[`status_${status}`] ?? status
}
