# ARIA — AI Room & Information Assistant

A Generative UI kiosk assistant for **FSKTM, Universiti Malaya**. Students and visitors ask natural-language questions about rooms, lecturers, schedules, and events — ARIA assembles the right visual response on the fly from a library of 17 typed UI components, powered by Claude.

> Built as a final-year project demonstrating Generative UI (GenUI) — where the interface itself is the model output, not just the text inside it.

---

## What is Generative UI?

Traditional chatbots return text. ARIA returns **structured component JSON** that the frontend renders as purpose-built cards:

```
User: "Where is HCI Lab A302?"

Claude → {
  type: "RoomCard", name: "HCI Lab A302", floor: 3, status: "available",
  directions: ["Take the lift to Floor 3", "Turn left", "Last door on the left"]
}
         +
         { type: "MapThumbnail", floor: 3, landmark: "..." }
```

The model picks which components to use and populates them — a navigation query gets a `StepIndicator`, a schedule query gets a `Timeline`, an operational query gets a `StatusDashboard`. Same codebase, different interface every time.

---

## Features

- **17 UI card types** — RoomCard, ProfessorCard, StepIndicator, Timeline, StatusDashboard, ComparisonTable, OccupancyGrid, EventList, DirectoryList, MetricStrip, ContactCard, AnswerCard, MapThumbnail, ContextPanel, ClarifyCard, ActionChips, OutOfScopeCard
- **3 response modes** — `guided` (step-by-step for new visitors), `balanced` (default), `expert` (data-dense for operational queries) — auto-selected by the model
- **Live room & lecturer status** — today's timetable data drives real-time availability badges and timeline bars
- **Trilingual** — EN / BM / ZH toggle; UI chrome and AI-generated card content both switch language
- **Voice input** — Deepgram Nova-2 real-time speech-to-text via WebSocket, language-aware
- **Offline fallback** — keyword-matching local fallback fires when the Claude API is unreachable, returning the same component format
- **Response caching** — server-side SHA-256 keyed cache (60 s TTL) to avoid redundant Claude calls
- **Prompt caching** — static system prompt sent with `cache_control: ephemeral` for Anthropic prompt cache hits

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Speech | Deepgram Nova-2 via WebSocket |
| Backend | Node.js, Express |
| Styling | Inline styles with design token system (`src/theme.ts`) |
| Icons | Lucide React |

---

## Project Structure

```
aria-ai/
├── server/
│   └── index.js              # Express server — /api/claude proxy, /api/speech WebSocket
├── src/
│   ├── data/
│   │   └── facultyData.ts    # FSKTM staff, rooms, schedules (real data)
│   ├── types/
│   │   └── aria.ts           # TypeScript schemas for all 17 card types
│   ├── services/
│   │   ├── systemPrompt.ts   # Builds the Claude system prompt with live data + language
│   │   ├── claudeApi.ts      # Calls /api/claude, handles streaming + fallback
│   │   └── localFallback.ts  # Offline keyword-matching path (same card output format)
│   ├── utils/
│   │   ├── schedule.ts       # getRoomStatus / getProfStatus — live slot lookup
│   │   └── translations.ts   # T(lang) dictionary — EN / BM / ZH
│   ├── components/
│   │   ├── appShell.tsx      # Shell header, WelcomeScreen, InputBar
│   │   ├── uiPrimitives.tsx  # Card, Chip, StatusBadge, SectionLabel
│   │   └── response/
│   │       ├── ResponseCards.tsx     # All 17 card implementations
│   │       ├── ComponentRenderer.tsx # Routes component JSON → React component
│   │       └── SkeletonLoader.tsx    # Loading state
│   ├── theme.ts              # Design tokens, statusClr, statusLbl, modeClr
│   └── App.tsx               # Main app state, conversation loop
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A [Deepgram API key](https://console.deepgram.com/) *(required for voice input; text input works without it)*

### 1. Clone and install

```bash
git clone https://github.com/your-username/aria-ai.git
cd aria-ai
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your API keys:

```
ANTHROPIC_API_KEY=sk-ant-...
DEEPGRAM_API_KEY=...
```

### 3. Run (development)

```bash
npm run dev:full
```

This starts both the Vite dev server (port 5173) and the Express API server (port 8787) concurrently.

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
npm run server
```

The Express server serves the built frontend and the API from the same port (default 8787).

---

## Adapting to Another Institution

All faculty-specific data lives in one file: [`src/data/facultyData.ts`](src/data/facultyData.ts).

It exports five named constants consumed by the rest of the app:

| Export | Contents |
|---|---|
| `ROOMS` | Room list with id, name, floor, type, capacity, features, directions |
| `PROFESSORS` | Staff list with id, name, title, department, office, email, research |
| `PROF_SCHEDULES` | Weekly schedule per professor `{ [id]: { [day]: slots[] } }` |
| `ROOM_SCHEDULES` | Today's timetable per room `{ [id]: slots[] }` |
| `TODAY_EVENTS` | Today's events array |

Replace the data in that file — nothing else needs to change.

The system prompt in [`src/services/systemPrompt.ts`](src/services/systemPrompt.ts) is auto-generated from these exports, so Claude always has current data.

---

## Data Sources

Faculty and staff data sourced from:
- [fsktm.um.edu.my](https://fsktm.um.edu.my) — official FSKTM staff directory
- [umexpert.um.edu.my](https://umexpert.um.edu.my) — UM expert profiles

Room assignments and schedules are plausible but not officially published — they are representative for demonstration purposes.

---

## License

MIT
