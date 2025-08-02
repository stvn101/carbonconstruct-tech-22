// src/home101/claude/ClaudePanel.tsx

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import offlineMemory from './ClaudeOfflineMemory.md?raw'

export const ClaudePanel = () => {
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Simulated Claude call – replace this with your actual fetch or SDK
    const fetchClaude = async () => {
      try {
        // Fake delay + simulate offline/failure
        await new Promise((r) => setTimeout(r, 1000))
        const success = Math.random() > 0.5 // flip a coin
        if (success) {
          setAiResponse("✅ Claude says: Your carbon estimate is below threshold. Good job!")
        } else {
          throw new Error("Simulated Claude API fail")
        }
      } catch (err) {
        setError(true)
      }
    }

    fetchClaude()
  }, [])

  return (
    <div className="rounded-xl border bg-white p-4 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-primary">🧠 Claude Response</h2>

      {aiResponse && <p className="text-green-700">{aiResponse}</p>}

      {error && (
        <div className="bg-muted border-l-4 border-yellow-500 text-yellow-900 p-4">
          <ReactMarkdown>{offlineMemory}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
