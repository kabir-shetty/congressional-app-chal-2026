# data
## types/scam-check.ts
ScamCheckImage{uri,width,height} · ScamCheckInput{text, images:ScamCheckImage[]} · `SCAM_VERDICTS` ["likely_scam","likely_safe","uncertain"] → ScamVerdict + `isScamVerdict(v)` · ScamSign{title,detail} · ScamCheckResult{verdict, confidence:0-1 (words only), action, signs:ScamSign[], steps:string[], topic:AiScamTopicId}
## types/quiz.ts
`BundledImageSource` = number (require() asset id) · QuizItemContent = {type:"text",text} | {type:"image",source:BundledImageSource,aspectRatio:number|null,alt} · QuizItem{id, kind, from, content, isScam, explanation}
## constants/quiz-images.ts
`QuizImage{source:BundledImageSource, alt, kind, from, isScam, explanation}` (no width/height: read from asset) · `QUIZ_IMAGES: readonly QuizImage[]` = [] (EMPTY; user to add). Files in `assets/images/quiz/` (only .gitkeep now); each entry needs literal `require("@/assets/images/quiz/<file>")` (Metro bundles static requires only; example in file comment).
## constants/ai-scam-topics.ts
`AiScamTopicId` voice|photos|writing|signs · `AiScamTopic{id,title,intro,items:{title,detail}[],learnLabel}` · `AI_SCAM_TOPICS` (copy from prototype: Cloned voices / Fake photos and videos / Messages that sound perfect / Signs that never change; learnLabels "Learn about cloned voices", "Learn about fake photos and videos", "Learn about messages that sound perfect", "See the signs that never change") · `isAiScamTopicId(v)`.

## check.tsx logic
Stage input|checking|result; state text, focused, images, stage, result. MAX_LIST_ITEMS 4.
- handleSubmit: checking → await checkForScam → setResult + result; catch → console.error("Scam check failed:", caught) + Alert + input. handleReset clears all. canCheck = text.trim()||images.length.
- Picker: `selectionLimit: MAX_AI_IMAGES - images.length`, append `.slice(0, MAX_AI_IMAGES)` (deps [images.length]).
- `SCAM_CHECK_SYSTEM` asks JSON {verdict, confidence 0-1, action (one sentence), signs 1-3 {title,detail}, steps 1-3, topic voice|photos|writing|signs}; plain words, never overstate, "uncertain" when unclear.
- `checkForScam(input)`: callAI({system, prompt:text.trim()||"(No text — see the attached screenshots.)", images}) → parseJsonReply → `toScamCheckResult`: requires isScamVerdict, confidence number in [0,1], non-blank action, ≥1 valid sign (non-blank title+detail), ≥1 non-blank step (lists filtered + sliced to 4); unknown topic → "signs"; else throw UNEXPECTED_REPLY_MESSAGE.
- `sureInWords`: uncertain → "Not sure either way"; confidence ≥0.85 → "Very likely"; else "Fairly sure".

## quiz.tsx logic
QUIZ_LENGTH=5, IMAGE_QUESTION_CHANCE=0.3, MAX_IMAGE_HEIGHT=480, FALLBACK_IMAGE_RATIO=9/16. QuizStatus = preparing|asking|answered|finished|error (no "prepared"/Start step); QuizState {status,items,index,error,score,results:boolean[],lastAnswerCorrect}.
- `shuffled<T>(readonly T[])` Fisher-Yates copy.
- `planQuizSlots(exclude)` (before any AI call): 5 slots, each independently Math.random()<0.3 → pop unique image from shuffled QUIZ_IMAGES minus `exclude`; pool empty/exhausted → {type:"ai"}. `QuizSlot` = {type:"image",image} | {type:"ai"}.
- `buildQuiz(exclude = new Set())` (async, so sync throws reject): scenarios = shuffled(7 `QUIZ_SCENARIOS` {kind,about}: Text message/bank, Voicemail/grandchild, Email/package, Phone call/government agency, Social media message/friend, Email/computer or account problem, Text message/prize or refund) → `Promise.all(slots.map(image ? imageQuizItem : generateQuizItem(scenarios[next++])))` → AI calls = 5 − image count, concurrent, distinct scenarios, slot order kept, rejects if any fails.
- `settle(promise)` → `QuizBuild` {ok:true,items} | {ok:false,error}; never rejects (background builds can't raise unhandled rejections). `pickFallbackImages()` = shuffled(QUIZ_IMAGES).slice(0, 5).
- Component ref `quizBuild: Promise<QuizBuild>|null` = background build or in-flight one (shared).
- createQuiz: run id `latestRun` ref (++ per call; unmount cleanup ++) → reset → `pending = (quizBuild.current ??= settle(buildQuiz()))` (double tap / StrictMode remount reuse it) → await → stale run → return (newer run awaits same promise) → `quizBuild.current = null` (applying run consumes) → ok → asking. Failed → fallback images.map(imageQuizItem) (try/catch → console.warn) → non-empty → asking with image-only quiz (may be <5) + `quizBuild.current = settle(buildQuiz(new Set(fallbackImages)))` silent background build for next "Try again" (shows preparing if still pending; if it failed, images again + new background build) → empty (QUIZ_IMAGES [] today) → error with build.error message (old behavior).
- scoreLine(score, total): score === total / ≥ total×0.6 / else.
- `imageQuizItem(image)`: Asset.fromModule(source) width/height → aspectRatio (null if unknown) → item {kind, from, content image {source, aspectRatio, alt}, isScam, explanation}.
- answer(guessIsScam): only when asking → answered, score++ if correct. next: only when answered → index+1 asking, or finished.
`generateQuizItem(scenario)`: isScam = Math.random()<0.5 → callAI({system:QUIZ_ITEM_SYSTEM, prompt:`Write a ${scam|legitimate} ${kind.toLowerCase()} ${about}.`}) in try/catch (console.warn + throw "Check that you're online, then tap Try again.") → parseJsonReply → require non-blank `from`, `text`, `explanation` (else UNEXPECTED_REPLY_MESSAGE) → {id:String(nextQuizItemId++), kind:scenario.kind, from, content:{type:"text",text}, isScam, explanation}. System prompt asks 555 numbers / made-up names for sender.

## services/ai.ts (global AI entry point)
- `AIImage{uri,width,height}` · `AIRequest{system, prompt, images?:AIImage[]}` (system = fixed instructions, prompt = user content).
- Config: `EXPO_PUBLIC_AI_API_URL` (server base; trailing / stripped) → module `ENDPOINT` = `${base}/v1/ai`; `EXPO_PUBLIC_AI_API_TOKEN` (Bearer; inlined in bundle, not secret). Set in root `.env` (gitignored; template `.env.example`).
- `export MAX_AI_IMAGES = 5`; MAX_IMAGE_BYTES 6 MiB (decoded, = base64.length*3/4); MAX_REQUEST_BYTES 10 MiB (payload string length). REQUEST_TIMEOUT_MS 60_000. MAX_IMAGE_WIDTH 1280, MAX_IMAGE_PIXELS 1280*6000, IMAGE_QUALITY 0.7.
- `encodeImage(image)` (private): ImageManipulator.manipulate(uri) → resize scale=min(1, 1280/w, sqrt(MAX_PIXELS/(w*h))) (width-based; no longest-edge cap so tall screenshots stay readable) → renderAsync → saveAsync{JPEG, compress 0.7, base64} → `{mimeType:"image/jpeg", data}`; throws on no data / >6 MiB; finally release() ref + context.
- `callAI(request): Promise<string>`: throws if ENDPOINT/token unset ("AI server is not configured (...)") or images > MAX_AI_IMAGES → encode images sequentially (memory) → JSON {system,prompt,images|undefined}, size check → fetch POST, Authorization Bearer, Content-Type json, AbortController+setTimeout (not AbortSignal.timeout); body read inside timeout; abort → "AI request timed out after 60s." (cause) → !ok → "AI server error {status}: {error.message|no details}" → non-string `text` → UNEXPECTED_REPLY_MESSAGE → return text.
- `UNEXPECTED_REPLY_MESSAGE` = "Got an unexpected answer. Please try again."
- `parseJsonReply(reply): Record<string, unknown>` strips ``` / ```json fences, JSON.parse; throws UNEXPECTED_REPLY_MESSAGE on parse fail or non-object/array.

No persistence.

## server/
- Standalone Node 22 ESM HTTP service; one dep `google-auth-library` ^11.3.1. `GET /healthz`; authenticated `POST /v1/ai` (Bearer `API_TOKEN`, timing-safe compare).
- Gemini via Vertex AI + Google Cloud ADC (no API key). `vertexGenerateUrl({project,location,model})` (exported): global → `https://aiplatform.googleapis.com/v1/projects/P/locations/global/publishers/google/models/M:generateContent`; else `https://<loc>-aiplatform.googleapis.com/...`. Header `authorization: Bearer <ADC token>`.
- Env: `GOOGLE_CLOUD_PROJECT` (required), `GOOGLE_CLOUD_LOCATION` (default `global`, /^[a-z0-9-]+$/), `GEMINI_MODEL` (default `gemini-2.5-flash`), `API_TOKEN` (≥32 chars), `PORT` (default 8787); ADC sources: `GOOGLE_APPLICATION_CREDENTIALS` file, gcloud user ADC, metadata server (attached SA). Needs Vertex AI API + `roles/aiplatform.user`.
- loadConfig → {apiToken, project, location, model, port, getAccessToken: () => GoogleAuth({scopes cloud-platform}).getAccessToken(), fetchImpl}. Token fetched per request after auth+validation (library caches); throw/empty → console.error (ADC message logged server-side) + 502 "Gemini service is unavailable.".
- Request `{system,prompt,images?:[{mimeType,data}]}`; images base64, max 5, MIME JPEG/PNG/WebP/GIF, max 6 MiB each; JSON max 10 MiB. Upstream body {systemInstruction, contents:[{role:"user", parts:[text, inlineData…]}]}, 60s timeout (504). Response `{text}`; errors `{error:{message}}`.
- Tests (`npm test`, node --test): 8 (health, 401, Vertex URL + bearer + body mapping, invalid image, ADC throw/null → 502, regional host, config defaults). Client = services/ai.ts `callAI`.
