import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/config", (_req, res) => {
  res.json({ configured: Boolean(process.env.AI_API_URL && process.env.AI_API_KEY && process.env.AI_MODEL) });
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: "Send at least one message." });
  if (!process.env.AI_API_URL || !process.env.AI_API_KEY || !process.env.AI_MODEL) {
    return res.status(503).json({ error: "The AI provider is not configured yet. Add AI_API_URL, AI_API_KEY, and AI_MODEL to your .env file." });
  }
  try {
    const upstream = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model: process.env.AI_MODEL, messages, temperature: 0.85, stream: false })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || data.message || `AI provider returned ${upstream.status}.` });
    const reply = data.choices?.[0]?.message?.content ?? data.output_text ?? data.reply;
    if (!reply) return res.status(502).json({ error: "The provider response did not contain a recognized chat reply. Check that your API is OpenAI-compatible." });
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ error: `Could not reach the AI provider: ${err.message}` });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI chat website running at http://localhost:${port}`));
