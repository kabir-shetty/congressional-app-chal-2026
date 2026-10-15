# data
## types/scam-check.ts
ScamCheckImage{uri,width,height} · ScamCheckInput{text, images:ScamCheckImage[]} · ScamVerdict "likely_scam"|"likely_safe"|"uncertain" · ScamCheckResult{verdict, confidence:0-1, explanation}
## types/quiz.ts
QuizItemContent = {type:"text",text} | {type:"image",uri,width,height} · QuizItem{id, content, isAiGenerated}

## check.tsx state (was useScamCheck hook, now component-local)
ScamCheckStatus = idle|loading|success|error; ScamCheckState {status,result,error}.
- handleSubmit: async, set loading → await checkForScam({text,images}) → success|error. Reset clears checkState + text + images.
STUB `checkForScam(_input): Promise<ScamCheckResult>` throws "not implemented yet" → check always lands in error. Implement AI call here (file-private in check.tsx).

## quiz.tsx state (was useQuiz hook, now component-local)
QUIZ_LENGTH=5. QuizStatus = preparing|prepared|asking|answered|finished|error; QuizState {status,items,index,error,score,lastAnswerCorrect}.
- createQuiz: run id `latestRun` ref (++ per call; unmount cleanup also ++) → reset to initial → sequential loop 5× generateQuizItem() (all-or-nothing: fail any = fail all) → prepared|error; stale run result dropped.
- start: prepared→asking. answer(guessIsAi): no-op unless asking; →answered, score++ if correct. next: no-op unless answered; index+1 → asking, or finished after last.
STUB `generateQuizItem(): Promise<QuizItem>` throws "not implemented yet" → quiz always lands in error. Implement AI call here (file-private in quiz.tsx).

No API keys/env/network code exists yet. No persistence.
