# data
## types/scam-check.ts
ScamCheckImage{uri,width,height} · ScamCheckInput{text, images:ScamCheckImage[]} · ScamVerdict "likely_scam"|"likely_safe"|"uncertain" · ScamCheckResult{verdict, confidence:0-1, explanation}
## types/quiz.ts
QuizItemContent = {type:"text",text} | {type:"image",uri,width,height} · QuizItem{id, content, isAiGenerated}

## check.tsx state (was useScamCheck hook, now component-local)
ScamCheckStatus = idle|loading|success|error; ScamCheckState {status,result,error}.
- handleSubmit: async, set loading → await checkForScam({text,images}) → success|error. Reset clears checkState + text + images.
`checkForScam(input)` (file-private): callAI({system:SCAM_CHECK_SYSTEM, prompt:text.trim()||"(No text — see the attached screenshots.)", images}) in local try/catch (console.warn + throw "Couldn't reach the checker. Please try again.") → parseJsonReply → `toScamCheckResult` (verdict ∈ verdictCopy keys, confidence number in [0,1], explanation string; else throw UNEXPECTED_REPLY_MESSAGE).

## quiz.tsx state (was useQuiz hook, now component-local)
QUIZ_LENGTH=5. QuizStatus = preparing|prepared|asking|answered|finished|error; QuizState {status,items,index,error,score,lastAnswerCorrect}.
- createQuiz: run id `latestRun` ref (++ per call; unmount cleanup also ++) → reset to initial → sequential loop 5× generateQuizItem() (all-or-nothing: fail any = fail all) → prepared|error; stale run result dropped.
- start: prepared→asking. answer(guessIsAi): no-op unless asking; →answered, score++ if correct. next: no-op unless answered; index+1 → asking, or finished after last.
`generateQuizItem()` (file-private): isAiGenerated = Math.random()<0.5 (code picks, not model) → callAI({system:QUIZ_ITEM_SYSTEM, prompt: AI-style | human-style instruction}) in local try/catch (console.warn + throw "Couldn't load the quiz. Please try again.") → parseJsonReply → require `text` string (else UNEXPECTED_REPLY_MESSAGE) → {id:String(nextQuizItemId++) module counter, content:{type:"text",text}, isAiGenerated}. Text items only.

## services/ai.ts (global AI entry point)
- `AIImage{uri}` · `AIRequest{system, prompt, images?:AIImage[]}` (system = fixed instructions, prompt = user content).
- STUB `callAI(_request): Promise<string>` (raw text reply) throws "callAI is not implemented yet." → both features always error. Implement model call here only.
- `UNEXPECTED_REPLY_MESSAGE` = "Got an unexpected answer. Please try again."
- `parseJsonReply(reply): Record<string, unknown>` strips ``` / ```json fences, JSON.parse; throws UNEXPECTED_REPLY_MESSAGE on parse fail or non-object/array.

No API keys/env/network code exists yet. No persistence.
