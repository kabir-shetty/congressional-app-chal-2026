# screens (all default exports in app/(tabs)/)
Common container: p lg, bg background. See idioms in [[arch]].

## index.tsx `Index`
ScrollView gap lg. Hero: HeadingText "Porch Watch"(display) + subtitle "Know the signs before they reach your door." Then `notices: Notice{href,title,body}[]` (ai-scams, check, quiz) rendered as spine blocks (title+body). href kept but NOT rendered as links (removed 5541d6c). Unused style noticeAction.

## check.tsx `ScamChecker`
Local state: text, images:ScamCheckImage[]. Hook useScamCheck → {status,result,error,submit,reset}.
- `verdictCopy: Record<ScamVerdict,{label,color}>` scam→danger, safe→success, uncertain→border.
- pickImage: requestMediaLibraryPermissionsAsync → Alert if !granted; launchImageLibraryAsync({mediaTypes:["images"], allowsMultipleSelection, quality:1}); appends {uri,width,height}.
- removeImage(uri) filter. handleSubmit→submit({text,images}). handleReset→reset+clear.
- canSubmit = (text.trim()||images.length) && status!=="loading". Inputs disabled while loading.
- UI: intro "Not sure about something?"; multiline TextInput (surface bg, border 2, minH 140); "Add Screenshot" btn; horizontal thumb list (expo-image 140², "Remove" danger btn each); "Check for Scam"; loading "Checking..."; error danger text; success: left-spine colored by verdict, label, `round(confidence*100)% confident`, explanation, "Check Another".

## quiz.tsx `Quiz`
Hook useQuiz → {status,current,error,score,totalAnswered,lastAnswerCorrect,loadNext,answer} (resetScore unused by UI). View (not scroll).
- questionNumber = totalAnswered + (current?1:0).
- idle: "Start Quiz". loading: "Loading question...". error: msg + "Try Again"(loadNext).
- ready|answered: "Question N", "{score} right so far", content (text in surface box | expo-image with item width/height). ready: row "AI"(answer(true)) / "Not AI" secondary(answer(false)). answered: left-spine success/danger, "Correct."/"Not quite.", "This was AI-generated/not AI-generated.", "Next Question".

## ai-scams.tsx `AiScamsInfo`
InfoPage. intro "What's changed about scams lately"/"And what still gives them away." + `topics:{title,body}[]` (4: voice cloning, fake photos/videos, fluent AI writing, red flags: urgency/secrecy/gift card/wire/crypto) as spine blocks.
