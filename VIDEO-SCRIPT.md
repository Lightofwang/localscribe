# LocalScribe — demo video script (draft, 2026-11-15)

Target: public YouTube video under 3 minutes, English narration + burned-in
subtitles (same method as GhostFeed: generated English narration, user does
not speak). Narration below is ~255 words, about 1:45 at normal pace —
the finished video runs ~2:15–2:30 once the on-screen demo beats are added,
same pattern as GhostFeed (88 s narration over a 2:06 video).

Status: DRAFT — written from the finished scaffold before the app has run
end to end. The one open dependency: the local demo in Scene 3 needs the
Chrome Nano re-check to come back `available` (or `downloadable`, after the
model downloads). If Nano ends up `unavailable`, Scene 3 cannot be recorded
as written — record the cloud-fallback path instead and swap Scene 3's lines
for the fallback wording in the note at the bottom.

## Scene 1 — Hook (0:00–0:18)

> "Last month, I noticed my browser had quietly downloaded a small AI model
> onto my laptop. I didn't ask for it. So I switched it off. That moment is
> why I built LocalScribe."

On screen: LocalScribe homepage, tagline visible — "Paste sensitive text.
See exactly where it is processed."

Note: this opening uses the builder's own story (Chrome started a local
model, they switched it off). Confirmed by the builder on 2026-11-15: KEEP
this opening.

## Scene 2 — The problem (0:18–0:40)

> "Every day we paste contracts, resumes, and emails into AI tools — and we
> have no idea where the words go. LocalScribe answers one question, on
> every single result: was this processed on your device, or in the cloud?"

On screen: the four action buttons — Summarize, Key points, Translate,
Polish — and the engine badge area.

## Scene 3 — The local demo (0:40–1:15)

> "Here's a contract. I paste it in, hit Summarize — and look at the badge.
> Green: processed on this device by Gemini Nano. The text never left the
> browser. LocalScribe runs on Firebase AI Logic, which tries the on-device
> model first."

On screen: click "Try the sample contract" (Acme Ltd / Beta Studio, $12,000,
45 days, 50% on signing), click Summarize, hold on the green badge and its
note: "Processed on this device by Gemini Nano. Your text did not leave
this browser."

## Scene 4 — Four actions, no chat (1:15–1:45)

> "Same idea, four jobs: summarize, key points, translate, polish. Each one
> is a single request — that's all the on-device model supports, so there's
> no chat history being built up anywhere. History lives only in this
> browser, and one click clears it."

On screen: Key points on the same contract, then Translate to Chinese;
scroll to History, click Clear.

## Scene 5 — Cloud fallback, never silent (1:45–2:15)

> "Sometimes the cloud is the right call — a long document, or you want the
> best quality. So there's a High-quality mode. Turn it on, and the badge
> turns blue and tells you why: processed in the cloud, because you chose
> it. Cloud fallback is never silent here. If the local model can't handle
> a request, the badge says so."

On screen: tick High-quality mode, run Summarize again, hold on the blue
badge: "Processed in the cloud (Gemini) — you chose High-quality mode."

## Scene 6 — Close (2:15–2:30)

> "LocalScribe: paste sensitive text, see exactly where it is processed.
> Built with Firebase AI Logic — on-device Gemini Nano first, Gemini in the
> cloud when you say so."

On screen: LocalScribe homepage + GitHub repo link (add once the repo is
public).

## Production notes (from the GhostFeed video, 2026-11-11)

- Keep burned-in subtitles in the lower third, clear of the app's header and
  the engine badge — GhostFeed's subtitles overlapped on-screen titles at
  0:30 / 0:48 / 1:25 / 1:36 / 2:00.
- Spell-check the subtitle file for "Gemini Nano" and "Firebase AI Logic"
  before export (GhostFeed's subtitles read "Kira" for "Kiro" at 2:00).
- Narration clips: generate the English narration, then split at the scene
  gaps (same as GhostFeed's 7 clips + CUT-GUIDE method); listen once per
  clip to confirm content matches its scene before editing.
- The video link can be swapped on Devpost any time before the 2026-12-01
  06:00 CST deadline.

## If Nano is unavailable (fallback wording for Scene 3)

> "Here's a contract. I paste it in, hit Summarize — and the badge tells
> me the truth: this browser has no local model, so the request went to the
> cloud, and the badge says why. LocalScribe never pretends a cloud answer
> came from your device."

On screen: the blue badge with its fallback note. The rest of the script
is unchanged — the product's promise is the visible badge, whichever path
serves the request.
