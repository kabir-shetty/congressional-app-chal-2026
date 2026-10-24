# data
## types/scam-check.ts
ScamCheckImage{uri,width,height} · ScamCheckInput{text, images:ScamCheckImage[]} · ScamVerdict "likely_scam"|"likely_safe"|"uncertain" · ScamCheckResult{verdict, confidence:0-1, explanation}
## types/quiz.ts
QuizItemContent = {type:"text",text} | {type:"image",uri,width,height} · QuizItem{id, content, isScam, explanation:string}

## check.tsx state (was useScamCheck hook, now component-local)
ScamCheckStatus = idle|loading|success; ScamCheckState {status,result} (no error state).
- handleSubmit: async, set loading → await checkForScam({text,images}) → success; on throw `console.error("Scam check failed:", caught)` (whole error) + `Alert.alert("Couldn't check that", "Please check your internet connection, then try again.")` + reset to initialCheckState (no in-screen error UI, user request). Reset clears checkState + text + images.
Picker: `selectionLimit: MAX_AI_IMAGES - images.length`, appended list `.slice(0, MAX_AI_IMAGES)` (pickImage deps [images.length]); "Add a screenshot" disabled when isLoading || images.length >= MAX_AI_IMAGES.
`checkForScam(input)` (file-private): callAI({system:SCAM_CHECK_SYSTEM, prompt:text.trim()||"(No text — see the attached screenshots.)", images}) (no try/catch; errors propagate to handleSubmit) → parseJsonReply → `toScamCheckResult` (verdict ∈ verdictCopy keys, confidence number in [0,1], explanation string; else throw UNEXPECTED_REPLY_MESSAGE).

## quiz.tsx state (was useQuiz hook, now component-local)
QUIZ_LENGTH=5. QuizStatus = preparing|prepared|asking|answered|finished|error; QuizState {status,items,index,error,score,results:boolean[] (per answered question; reset by initialState),lastAnswerCorrect}.
- createQuiz: run id `latestRun` ref (++ per call; unmount cleanup also ++) → reset to initial → shuffle 7 `QUIZ_SCENARIOS`, use first 5 unique; `Promise.all` calls `generateQuizItem(scenario)` concurrently, preserving scenario order (all-or-nothing: fail any = fail all) → prepared|error; stale run result dropped.
- start: prepared→asking. answer(guessIsScam): no-op unless asking; →answered, score++ if correct. next: no-op unless answered; index+1 → asking, or finished after last.
`generateQuizItem(scenario:QuizScenario)` (file-private): isScam = Math.random()<0.5; scenario is unique within a quiz, selected in code from 7 strings → callAI({system:QUIZ_ITEM_SYSTEM, prompt:`Write a ${scam|legitimate} ${scenario}.`}) in local try/catch (console.warn + throw "Check that you're online, then tap Try again.") → parseJsonReply → require non-blank `text` + `explanation` strings (else UNEXPECTED_REPLY_MESSAGE) → {id:String(nextQuizItemId++) module counter, content:{type:"text",text}, isScam, explanation}. Text items only.

## services/ai.ts (global AI entry point)
- `AIImage{uri,width,height}` · `AIRequest{system, prompt, images?:AIImage[]}` (system = fixed instructions, prompt = user content).
- Config: `EXPO_PUBLIC_AI_API_URL` (server base; trailing / stripped) → module `ENDPOINT` = `${base}/v1/ai`; `EXPO_PUBLIC_AI_API_TOKEN` (Bearer; inlined in bundle, not secret). Set in root `.env.local` (template `.env.example`).
- `export MAX_AI_IMAGES = 5`; MAX_IMAGE_BYTES 6 MiB (decoded, = base64.length*3/4); MAX_REQUEST_BYTES 10 MiB (payload string length). REQUEST_TIMEOUT_MS 60_000. MAX_IMAGE_WIDTH 1280, MAX_IMAGE_PIXELS 1280*6000, IMAGE_QUALITY 0.7.
- `encodeImage(image)` (private): ImageManipulator.manipulate(uri) → resize scale=min(1, 1280/w, sqrt(MAX_PIXELS/(w*h))) (width-based; no longest-edge cap so tall screenshots stay readable) → renderAsync → saveAsync{JPEG, compress 0.7, base64} → `{mimeType:"image/jpeg", data}`; throws on no data / >6 MiB; finally release() ref + context.
- `callAI(request): Promise<string>`: throws if ENDPOINT/token unset ("AI server is not configured (...)") or images > MAX_AI_IMAGES → encode images sequentially (memory) → JSON {system,prompt,images|undefined}, size check → fetch POST, Authorization Bearer, Content-Type json, AbortController+setTimeout (not AbortSignal.timeout); body read inside timeout; abort → "AI request timed out after 60s." (cause) → !ok → "AI server error {status}: {error.message|no details}" → non-string `text` → UNEXPECTED_REPLY_MESSAGE → return text.
- `UNEXPECTED_REPLY_MESSAGE` = "Got an unexpected answer. Please try again."
- `parseJsonReply(reply): Record<string, unknown>` strips ``` / ```json fences, JSON.parse; throws UNEXPECTED_REPLY_MESSAGE on parse fail or non-object/array.

No persistence.

## server/
- Standalone Node 22 HTTP service, no npm dependencies. `GET /healthz`; authenticated `POST /v1/ai`.
- Env required: `GEMINI_API_KEY`, `API_TOKEN` (≥32 chars); optional `GEMINI_MODEL` (default `gemini-2.5-flash`), `PORT` (default `8080`).
- Request `{system,prompt,images?:[{mimeType,data}]}`; images base64, max 5, MIME JPEG/PNG/WebP/GIF, max 6 MiB each; JSON max 10 MiB.
- Response `{text}`; errors `{error:{message}}`. Upstream: Gemini `generateContent`, API key in `x-goog-api-key`.
- `Dockerfile`, `.env.example`, tests, deploy/API contract in `server/README.md`. Client = services/ai.ts `callAI`.
