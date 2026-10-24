# Porch Watch AI server

Standalone Node.js service for Docker deployment. It keeps the Gemini API key
on the server and exposes one authenticated endpoint.

## Run with Docker

Run `cp server/.env.example server/.env`, set `GEMINI_API_KEY`, and replace
`API_TOKEN` with a random value of at least 32 characters. Do not commit `.env`.

```sh
docker build -t porch-watch-ai ./server
docker run --rm --env-file server/.env -p 8080:8080 porch-watch-ai
```

Health check: `GET /healthz`.

## API contract

`POST /v1/ai` requires `Authorization: Bearer <API_TOKEN>` and
`Content-Type: application/json`.

Request:

```json
{
  "system": "Return only JSON.",
  "prompt": "Assess this message.",
  "images": [
    { "mimeType": "image/jpeg", "data": "<base64 image bytes>" }
  ]
}
```

`images` is optional. Up to five JPEG, PNG, WebP, or GIF images are accepted.
Each base64 image is limited to 6 MiB; the complete JSON request is limited to
10 MiB. `system` and `prompt` must each be non-empty and at most 20,000
characters.

Success response: `{ "text": "<Gemini response text>" }`. Errors use
`{ "error": { "message": "..." } }`. Gemini keys are never returned to clients
or included in request URLs.

The Expo client calls this endpoint from `src/services/ai.ts`, configured by
`EXPO_PUBLIC_AI_API_URL` and `EXPO_PUBLIC_AI_API_TOKEN` (see root
`.env.example`). Do not embed a production `API_TOKEN` in a mobile app; deploy
behind caller authentication and rate limits before public use.

Run service tests with `npm test` from this directory.
