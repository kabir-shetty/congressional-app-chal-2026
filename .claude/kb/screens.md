# screens (all default exports in app/(tabs)/)
Common container: p lg, bg background. See idioms in [[arch]].

## index.tsx `Index`
ScrollView gap lg. Hero: HeadingText "Porch Watch"(display) + subtitle "Know the signs before they reach your door." Then `notices: Notice{href,title,body}[]` (ai-scams, check, quiz) rendered as spine blocks (title+body). href kept but NOT rendered as links (removed 5541d6c). Unused style noticeAction.

## check.tsx `ScamChecker`
State local to component: text, images, checkState (status|result|error).
- ScamCheckStatus = idle|loading|success|error; ScamCheckState {status,result:ScamCheckResult|null,error:string|null}.
- `verdictCopy: Record<ScamVerdict,{label,color}>` scam→danger, safe→success, uncertain→border.
- pickImage: requestMediaLibraryPermissionsAsync → Alert if !granted; launchImageLibraryAsync({mediaTypes:["images"], allowsMultipleSelection, quality:1}); appends {uri,width,height}.
- removeImage(uri) filter. handleSubmit: async, set loading → await checkForScam({text,images}) → success|error, reset clears all state. canSubmit = (text.trim()||images.length) && status!=="loading".
- UI: intro "Not sure about something?"; multiline TextInput (surface bg, border 2, minH 140); "Add Screenshot" btn; horizontal thumb list (expo-image 140², "Remove" danger btn each); "Check for Scam"; loading "Checking..."; error danger text; success: left-spine colored by verdict, label, `round(confidence*100)% confident`, explanation, "Check Another".

## quiz.tsx `Quiz`
State local to component. View (not scroll). `useEffect: createQuiz() on mount; cleanup ++latestRun` → quiz built in memory, hidden.
- preparing: "Getting your quiz ready...". prepared: "Start Quiz"(start). error: msg + "Try Again"(createQuiz). finished: "You got {score} of {totalQuestions} right." + "Play Again"(createQuiz).
- `current` set (asking|answered): "Question N of T", "{score} right so far", content (text in surface box | expo-image with item width/height). asking: row "AI"(answer(true)) / "Not AI" secondary(answer(false)). answered: left-spine success/danger, "Correct."/"Not quite.", "This was AI-generated/not AI-generated.", btn isLastQuestion?"See My Score":"Next Question"(next).
- style sectionHeading (fontSize.title) shared by question header + final score.

## ai-scams.tsx `AiScamsInfo`
InfoPage. intro "What's changed about scams lately"/"And what still gives them away." + `topics:{title,body}[]` (4: voice cloning, fake photos/videos, fluent AI writing, red flags: urgency/secrecy/gift card/wire/crypto) as spine blocks.
