import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  docId: string;
};

export default function Chatbot({ docId }: Props) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages([...messages, { role: "user", content: input }]);
    setLoading(true);
    setInput("");

    // Stream responses if supported
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId, question: input }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    let answer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      answer += new TextDecoder().decode(value);
      setMessages(msgs => [...msgs.slice(0, -1), msgs[msgs.length-1], { role: "assistant", content: answer }]);
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-xl p-4 my-4 bg-white">
      <div className="mb-2 font-bold">Ask about this document</div>
      <div className="max-h-60 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}>{msg.content}</span>
          </div>
        ))}
        {loading && <LoadingSpinner />}
      </div>
      <form className="flex space-x-2" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your question..."
          className="flex-1 border rounded px-2 py-1"
          disabled={loading}
          required
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
