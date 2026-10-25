# Porch Watch AI server

Standalone Node.js service for Docker deployment. It calls Gemini through
Vertex AI using Google Cloud Application Default Credentials (ADC), so there
is no Gemini API key, and exposes one authenticated endpoint.

## Google Cloud setup

1. Enable the Vertex AI API in your project.
2. Give the identity the server runs as the `Vertex AI User` role
   (`roles/aiplatform.user`).

## Run with Docker

Run `cp server/.env.example server/.env`, set `GOOGLE_CLOUD_PROJECT`, and
replace `API_TOKEN` with a random value of at least 32 characters. Do not
commit `.env`.

```sh
docker build -t porch-watch-ai ./server
```

On Google Cloud (Cloud Run, GCE, GKE), attach a service account with the role
above; ADC finds it through the metadata server:

```sh
docker run --rm --env-file server/.env -p 8787:8787 porch-watch-ai
```

Anywhere else, mount a credentials file read-only and point ADC at it. For
local development, `gcloud auth application-default login` writes one:

```sh
docker run --rm --env-file server/.env -p 8787:8787 \
  -v "$HOME/.config/gcloud/application_default_credentials.json:/secrets/adc.json:ro" \
  -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/adc.json \
  porch-watch-ai
```

The container runs as the `node` user (uid 1000), so the mounted file must be
readable by that uid. Prefer workload identity federation or an attached
service account over long-lived service account keys.

`GOOGLE_CLOUD_LOCATION` defaults to `global`; set a region such as
`us-central1` to pin processing to it. `GEMINI_MODEL` defaults to
`gemini-2.5-flash`.

Health check: `GET /healthz`. The server listens on `PORT` (default `8787`);
if you change it, change both sides of `-p` to match.

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
`{ "error": { "message": "..." } }`. Google Cloud credentials and access tokens
never leave the server.

The Expo client calls this endpoint from `src/services/ai.ts`, configured by
`EXPO_PUBLIC_AI_API_URL` and `EXPO_PUBLIC_AI_API_TOKEN` (see root
`.env.example`). Do not embed a production `API_TOKEN` in a mobile app; deploy
behind caller authentication and rate limits before public use.

Run service tests with `npm test` from this directory.
