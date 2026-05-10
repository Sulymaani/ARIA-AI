import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"

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

app.listen(port, () => {
  console.log(`ARIA API server listening on http://127.0.0.1:${port}`)
})
