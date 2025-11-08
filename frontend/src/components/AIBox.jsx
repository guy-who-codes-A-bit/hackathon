import { useState } from "react";
import OpenAI from "openai";

export default function AiBox() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // ⚠️ only for local dev!
  });

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini", // fast + cheap, perfect for hackathon demo
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for RePlate. ",
          },
          { role: "user", content: prompt },
        ],
      });
      setResponse(completion.choices[0].message.content);
    } catch (err) {
      console.error("AI error:", err);
      setResponse("⚠️ Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border-t bg-white shadow-inner">
      <h2 className="text-lg font-semibold mb-2 text-green-700">
        💬 CityBite AI Assistant
      </h2>
      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something like 'Give me a summary of nearby food hubs'..."
        className="w-full border rounded p-2 mb-2 focus:ring-2 focus:ring-green-400 outline-none"
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="mt-3 p-3 bg-green-50 border rounded text-gray-700 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
