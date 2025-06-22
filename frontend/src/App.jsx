import { useState } from "react"

export default function App() {
  const [msg, setMsg] = useState("")
  const [history, setHistory] = useState([])

  async function send() {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    })
    const data = await res.json()
    setHistory(h => [...h, ["user", msg], ["bot", data.reply]])
    setMsg("")
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      {history.map(([who, text], i) => (
        <div key={i} className={who === "bot" ? "text-blue-700" : "text-black"}>
          <b>{who}:</b> {text}
        </div>
      ))}
      <input value={msg} onChange={e => setMsg(e.target.value)} className="border p-1 w-3/4" />
      <button onClick={send} className="ml-2 border px-3">Send</button>
    </main>
  )
} 