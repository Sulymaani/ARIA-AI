import cors from "cors"
import { DeepgramClient } from "@deepgram/sdk"
import dotenv from "dotenv"
import express from "express"
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

app.use(cors())
app.use(express.json({ limit: "1mb" }))

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY in the server environment." })
  }

  const { messages, systemPrompt } = req.body || {}
  if (!Array.isArray(messages) || typeof systemPrompt !== "string") {
    return res.status(400).json({ error: "Expected messages[] and systemPrompt." })
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
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages,
      }),
    })

    const claudeData = await claudeRes.json()
    if (!claudeRes.ok) {
      return res.status(claudeRes.status).json({
        error: claudeData.error?.message || "Claude request failed.",
      })
    }

    const raw = claudeData.content?.find(part => part.type === "text")?.text || "{}"
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    res.json(JSON.parse(clean))
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

const dgLangMap = { EN: "en", BM: "ms", ZH: "zh" }

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
    const dgLive = await dgClient.listen.v1.createConnection({
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
