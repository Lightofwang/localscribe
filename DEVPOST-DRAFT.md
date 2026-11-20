# LocalScribe — Devpost submission draft (2026-11-15)

For #BuildHybridAI 2026 (Google · Firebase). Deadline 2026-12-01 06:00 CST.
DRAFT — written from the finished scaffold; repo and video links are
placeholders until the repo is public and the video is recorded. All
technical claims below are verified against the scaffold code
(`workspace/goals/buildhybridai-2026-firebase/files/localscribe/`).

## Title

LocalScribe — see exactly where your words are processed

## Tagline

Paste sensitive text. Every result shows whether it was processed on your
device or in the cloud — and why.

## Inspiration

Last month I noticed my browser had quietly downloaded a small AI model onto
my laptop. I didn't ask for it, so I switched it off. That model was Gemini
Nano — and it made me realize: AI tools process our most sensitive text
(contracts, resumes, emails) without ever saying where. LocalScribe exists
so that question always has a visible answer.

(Keep or cut this story — it is the builder's own experience and the
strongest opening, but it is optional.)

## What it does

LocalScribe is a local-first sensitive-text assistant for the web (Chrome).
Paste a contract, resume, email, or any text you would rather not upload,
and run one of four single-turn actions: **Summarize, Key points,
Translate, Polish**. Every result carries an engine badge that reads the
actual inference path — 🟢 processed locally by Gemini Nano, or 🔵
processed in the cloud by Gemini — with the reason shown.

Cloud fallback happens only in three stated cases: the device cannot run
the local model, the text is too long for on-device context, or the user
manually enables High-quality mode. Every fallback is disclosed on the
badge; it is never silent. History is stored only in the browser's local
storage and can be cleared with one click. There is deliberately no
follow-up chat: on-device inference supports single-turn generation only,
so a conversation feature would have to go to the cloud.

## How I built it

- **Firebase AI Logic** (`firebase/ai`): `getGenerativeModel` with
  `InferenceMode.PREFER_ON_DEVICE` by default; `PREFER_IN_CLOUD` only when
  the user enables High-quality mode. Cloud fallback model:
  `gemini-3.5-flash-lite`.
- **The badge reads `response.inferenceSource`** (`ON_DEVICE` /
  `IN_CLOUD`) — the actual path that served the request, never a guess
  from the mode setting.
- **`initializeDeviceModel()` is called from the action click** (a user
  gesture, as the docs require) before any `generateContent()` call, so the
  multi-GB model download only starts when the user asks for work.
- Vite + React + TypeScript. Public repo, MIT license.
- The one trap worth naming: Firebase AI Logic's guided setup
  auto-enforces App Check, so localhost development needs a debug token
  registered in the console — otherwise calls fail with an obscure error.
  The setup guide in the repo documents this step.

## Challenges I ran into

- On-device inference is single-turn only: the four actions had to be
  designed as one-shot requests, and the planned follow-up chat was cut.
- The local model is gated behind a Chrome setting ("On-device AI") that
  many users — including me — have switched off, plus hardware minimums
  (Chrome 139+, 22 GB free disk, 16 GB RAM, 4+ cores). The app has a
  built-in availability check so the user sees this before pasting anything.
- Token counts differ between the on-device and cloud models, so the
  8,000-character long-text hint in the UI is a heuristic, not a verified
  local limit.

## Accomplishments that I'm proud of

- The badge never lies: it reports the path the SDK actually used.
- Cloud fallback is explicit by design — the product's privacy promise is
  enforced in the UI, not just in the docs.
- The whole flow (check → paste → action → badge) works end to end in one
  page, with no sign-up.

## What I learned

Hybrid inference is not "local when possible, cloud when not" as a slogan —
it is a contract with the user: the fallback rules must be stated up front,
and every result must show which side of the contract it fell on.

## What's next for LocalScribe

- Long-text chunking so large documents stay on-device where possible.
- More target languages and a shareable, still-local result view.

## Built With

Firebase AI Logic, Gemini Nano (on-device), Gemini 3.5 Flash-Lite (cloud),
React, TypeScript, Vite

## Try it out / links

- Live demo: _(add after deploy, Nov 25–27 in the plan)_
- GitHub repo (public, MIT): _(add once pushed)_
- Video: _(add after recording, Nov 28–29 in the plan)_

## Checklist against the rules

- [ ] Public repo with an open-source license (MIT — in the scaffold)
- [ ] Public YouTube video under 3 minutes, English narration + subtitles
      (script drafted in `video-script.md`)
- [ ] English text on Devpost (this draft)
- [ ] Real Firebase AI Logic hybrid calls in the repo (judges check the
      code, not just the claim) — `src/ai.ts`
