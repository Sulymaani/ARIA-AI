export async function callClaude(messages, systemPrompt) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)

  try {
    const res = await fetch(`${apiBaseUrl}/api/claude`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt }),
      signal: controller.signal,
    })
    clearTimeout(timer)

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || "ARIA API request failed")
    return data
  } catch (err: any) {
    clearTimeout(timer)
    if (err.name === "AbortError") throw new Error("Request timed out — ARIA took too long to respond.")
    throw err
  }
}
