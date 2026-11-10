# Alliteratio AI Chat Website

A responsive chat website with a server-side API proxy. Your API key stays on the server and is not exposed to browser JavaScript.

## Requirements
- Node.js 18 or newer
- An AI provider endpoint compatible with the OpenAI Chat Completions request format

## Run locally
1. Extract this project.
2. In the project folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL` using the exact values from your provider's API documentation.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Provider compatibility
The server sends `{ model, messages, temperature, stream: false }` and expects `choices[0].message.content` (or a simple `reply` / `output_text` field) in the response. If Alliteratio uses a different request or response format, adjust the `/api/chat` handler in `server.js` to match its documentation.

## Deploy
Deploy the Node app to a host that supports Node.js. Set the three AI environment variables in the host's secret/environment-variable settings. Do not commit `.env` or put your API key in `public/` files.
