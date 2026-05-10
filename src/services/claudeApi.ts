export async function callClaude(messages, systemPrompt) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""
  const res = await fetch(`${apiBaseUrl}/api/claude`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || "ARIA API request failed")
  }

  return data
}
