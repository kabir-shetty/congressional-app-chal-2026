# data
## types/scam-check.ts
ScamCheckImage{uri,width,height} · ScamCheckInput{text, images:ScamCheckImage[]} · ScamVerdict "likely_scam"|"likely_safe"|"uncertain" · ScamCheckResult{verdict, confidence:0-1, explanation}
## types/quiz.ts
QuizItemContent = {type:"text",text} | {type:"image",uri,width,height} · QuizItem{id, content, isAiGenerated}

## hooks/use-scam-check.ts `useScamCheck()`
status idle|loading|success|error; state {status,result,error}. submit(input): set loading → await checkForScam → success|error. reset()→initial.
STUB `checkForScam(_input): Promise<ScamCheckResult>` throws "not implemented yet". Implement AI call here (file-private).

## hooks/use-quiz.ts `useQuiz()`
status idle|loading|ready|answered|error; state {status,current,error,score,totalAnswered,lastAnswerCorrect}.
- loadNext: keeps score/total, resets per-question fields, await generateQuizItem → ready|error.
- answer(guessIsAi): no-op unless status ready && current; sets answered, correct=guess===isAiGenerated, score/total++.
- resetScore → initial.
STUB `generateQuizItem(): Promise<QuizItem>` throws "not implemented yet".

No API keys/env/network code exists yet. No persistence.
