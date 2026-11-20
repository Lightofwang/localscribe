# LocalScribe

A local-first sensitive-text assistant for **#BuildHybridAI 2026** (Google · Firebase).

Paste a contract, resume, email or any text you would rather not upload. LocalScribe runs
**summarize, key points, translate, polish** — and shows, on every result, exactly where the
work happened:

- 🟢 **Processed locally** — Gemini Nano on this device. Your text never left the browser.
- 🔵 **Processed in the cloud** — Gemini, with the reason shown (you chose High-quality mode,
  or the on-device model was unavailable / could not handle the request).

No follow-up chat, on purpose: Firebase AI Logic on-device inference only supports
single-turn text generation, not chat. Cloud fallback is never silent.

History is stored only in this browser's local storage, with a one-click clear.

## Status

Scaffold ready (2026-11-14). Still to do by the owner:

1. Re-enable Chrome "On-device AI" (`chrome://settings/ai`), restart Chrome, and check the
   in-app Nano availability button — or run `await LanguageModel.availability()` in the console.
   Expected: `available` (ready), `downloadable`/`downloading` (model download first), or still
   `unavailable` (check Chrome 139+, 22 GB free disk, 16 GB RAM, 4+ CPU cores).
2. Create the Firebase project and fill in `.env` (see SETUP.md).
3. Run `npm install && npm run dev`, paste the sample contract, and run all four actions —
   the badge should flip between local and cloud as the paths are exercised.

## Run it

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + production build
```

## Tech

- Vite + React + TypeScript, Firebase JS SDK (`firebase/ai`)
- `InferenceMode.PREFER_ON_DEVICE` by default; `PREFER_IN_CLOUD` only in High-quality mode
- Cloud fallback model: `gemini-3.5-flash-lite`
- The engine badge reads `response.inferenceSource` (`ON_DEVICE` / `IN_CLOUD`) — it never
  guesses from the mode setting.
- `model.initializeDeviceModel()` is called from the action click (a user gesture), as the
  Firebase docs require, before any `generateContent()` call.

## Submission (deadline 2026-12-01 06:00 CST)

- Public repo with an open-source license (this repo, MIT)
- Public YouTube video under 3 minutes (English or English subtitles)
- English text on Devpost

See SETUP.md for the Firebase + App Check steps, including the debug-token step that
otherwise fails localhost calls with an obscure error.
