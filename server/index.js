import cors from "cors"
import { DeepgramClient } from "@deepgram/sdk"
import dotenv from "dotenv"
import express from "express"
import { createHash } from "node:crypto"
import { createServer } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { WebSocketServer } from "ws"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const distDir = path.join(rootDir, "dist")

dotenv.config({ path: path.join(rootDir, ".env") })

const app = express()
const port = Number(process.env.PORT || 8787)
const responseCache = new Map()
const RESPONSE_CACHE_TTL_MS = 60_000
const RESPONSE_CACHE_MAX_ENTRIES = 50

app.use(cors())
app.use(express.json({ limit: "1mb" }))

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`
}

function hashValue(value) {
  return createHash("sha256").update(typeof value === "string" ? value : stableStringify(value)).digest("hex")
}

function isValidSystem(system) {
  if (typeof system === "string") return true
  return Array.isArray(system) && system.every(block =>
    block &&
    block.type === "text" &&
    typeof block.text === "string" &&
    (!block.cache_control || block.cache_control.type === "ephemeral")
  )
}

function getSystemPromptHashes(system) {
  if (typeof system === "string") {
    return { staticPromptHash: "none", dynamicPromptHash: hashValue(system) }
  }

  const staticText = system.filter(block => block.cache_control).map(block => block.text).join("\n")
  const dynamicText = system.filter(block => !block.cache_control).map(block => block.text).join("\n")

  return {
    staticPromptHash: staticText ? hashValue(staticText) : "none",
    dynamicPromptHash: dynamicText ? hashValue(dynamicText) : "none",
  }
}

function buildResponseCacheKey({ model, messages, system }) {
  return hashValue({
    model,
    messages,
    ...getSystemPromptHashes(system),
  })
}

function getCachedResponse(key) {
  const cached = responseCache.get(key)
  if (!cached) return null
  if (Date.now() > cached.expiresAt) {
    responseCache.delete(key)
    return null
  }
  return cached.value
}

function setCachedResponse(key, value) {
  while (responseCache.size >= RESPONSE_CACHE_MAX_ENTRIES) {
    const oldestKey = responseCache.keys().next().value
    responseCache.delete(oldestKey)
  }

  responseCache.set(key, {
    value,
    expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
  })
}

function logClaudeUsage(usage) {
  if (!usage) return
  console.log("Claude usage", {
    input_tokens: usage.input_tokens || 0,
    cache_creation_input_tokens: usage.cache_creation_input_tokens || 0,
    cache_read_input_tokens: usage.cache_read_input_tokens || 0,
    output_tokens: usage.output_tokens || 0,
  })
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY in the server environment." })
  }

  const { messages, system, systemPrompt } = req.body || {}
  const requestSystem = system ?? systemPrompt
  if (!Array.isArray(messages) || !isValidSystem(requestSystem)) {
    return res.status(400).json({ error: "Expected messages[] and a valid system prompt." })
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514"
  const cacheKey = buildResponseCacheKey({ model, messages, system: requestSystem })
  const cachedResponse = getCachedResponse(cacheKey)
  if (cachedResponse) {
    console.log("ARIA response cache hit")
    res.set("x-aria-response-cache", "hit")
    return res.json(cachedResponse)
  }

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        system: requestSystem,
        messages,
      }),
    })

    const claudeData = await claudeRes.json()
    if (!claudeRes.ok) {
      return res.status(claudeRes.status).json({
        error: claudeData.error?.message || "Claude request failed.",
      })
    }

    logClaudeUsage(claudeData.usage)
    const raw = claudeData.content?.find(part => part.type === "text")?.text || "{}"
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const parsed = JSON.parse(clean)
    setCachedResponse(cacheKey, parsed)
    res.set("x-aria-response-cache", "miss")
    res.json(parsed)
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: "Could not get a valid ARIA response from Claude." })
  }
})

app.use(express.static(distDir))
app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"))
})

const server = createServer(app)
const wss = new WebSocketServer({ noServer: true })

const dgLangMap = { EN: "en", BM: "ms", ZH: "zh", en: "en", ms: "ms", zh: "zh" }

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (url.pathname === "/api/speech") {
    wss.handleUpgrade(req, socket, head, ws => wss.emit("connection", ws, req))
  } else {
    socket.destroy()
  }
})

wss.on("connection", async (clientWs, req) => {
  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    clientWs.send(JSON.stringify({ error: "Missing DEEPGRAM_API_KEY on the server." }))
    clientWs.close()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const lang = dgLangMap[url.searchParams.get("lang")] || "en"

  try {
    const dgClient = new DeepgramClient({ apiKey })
    const dgLive = await dgClient.listen.v1.connect({
      model: "nova-2",
      language: lang,
      punctuate: true,
      interim_results: true,
      endpointing: 300,
      smart_format: true,
      keywords: ["FSKTM:2", "KL302:1.5", "KL201:1.5", "KL307:1.5"],
    })

    dgLive.on("open", () => {
      if (clientWs.readyState === 1) {
        clientWs.send(JSON.stringify({ ready: true }))
      }
    })

    clientWs.on("message", (data, isBinary) => {
      if (isBinary && dgLive.readyState === 1) dgLive.sendMedia(data)
    })
    clientWs.on("close", () => dgLive.close())

    dgLive.on("message", (data) => {
      if (data.type && data.type !== "Results") return
      const alt = data.channel?.alternatives?.[0]
      if (alt?.transcript && clientWs.readyState === 1) {
        clientWs.send(JSON.stringify({ transcript: alt.transcript, isFinal: data.is_final }))
      }
    })

    dgLive.on("error", (err) => {
      if (clientWs.readyState === 1) {
        clientWs.send(JSON.stringify({ error: err.message || "Deepgram transcription error" }))
      }
    })

    dgLive.on("close", () => {
      if (clientWs.readyState === 1) clientWs.close()
    })

    dgLive.connect()
  } catch (error) {
    console.error(error)
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify({ error: "Could not connect to Deepgram transcription." }))
      clientWs.close()
    }
  }
})

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the existing ARIA server or change PORT in .env.`)
    process.exit(1)
  }
  throw error
})

server.listen(port, () => {
  console.log(`ARIA API server listening on http://127.0.0.1:${port}`)
})
