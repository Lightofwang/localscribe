# LocalScribe setup — the two things only you can do

## 1. Chrome: turn the local model back on (5 minutes)

This is the step from yesterday: you switched Chrome's "On-device AI" off after noticing
it had started a small local model. That model *is* Gemini Nano — the core of this hackathon.

1. Open `chrome://settings/ai` and turn **On-device AI** on.
2. Fully quit Chrome and reopen it.
3. Open the app (`npm run dev`), click **Check Gemini Nano availability**, and note the result:
   - `available` — ready, build away.
   - `downloadable` / `downloading` — the model (several GB) still has to download. Click any
     action once to start it; the download runs in the background.
   - still `unavailable` — check, in order: Chrome version (needs 139+, ideally 148+;
     `chrome://settings/help`), free disk (needs 22 GB), RAM (16 GB), CPU cores (4+).
     Only then try the flags `chrome://flags/#prompt-api-for-gemini-nano` and
     `chrome://flags/#optimization-guide-on-device-model` set to Enabled, then restart.
4. After the hackathon (2026-12-01) you can switch the setting off again — it does not affect
   anything already submitted.

## 2. Firebase: create the project and paste the config (10 minutes)

1. Go to the [Firebase console](https://console.firebase.google.com) and create a project
   (any name, e.g. `localscribe`; Google Analytics is not needed).
2. In the console go to **AI Services > AI Logic**, click **Get started**, and run the guided
   setup. When asked for a Gemini API provider, choose **Gemini Developer API** (no-cost start).
3. Register the web app when prompted and copy its config values.
4. In this folder: `cp .env.example .env`, then fill in the six `VITE_FIREBASE_*` values.
5. **App Check debug token (localhost only — the quiet trap):** the guided setup auto-enforces
   App Check. In dev mode the app sets `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true`; on first
   load, open DevTools console and copy the printed debug token, then in the console go to
   **Security > App Check > Apps > Manage debug tokens** and register it. Without this,
   localhost calls fail with an obscure error. On the deployed site, use the reCAPTCHA
   provider instead (set `VITE_RECAPTCHA_SITE_KEY` in `.env`).

## 3. Prove both paths (the Nov 13–14 milestone)

```bash
npm install
npm run dev
```

- With Nano `available`: run Summarize on the sample contract — the badge should read
  🟢 local.
- To see the cloud path: tick **High-quality mode** and run it again — the badge should read
  🔵 cloud, and say you chose it.
- If Nano is `unavailable`, the first run should fall back to cloud on its own and say why.

## 4. Deploy (later, Nov 25–27 in the plan)

Any static host works (the app is a plain Vite build). Netlify worked for GhostFeed; `npm run
build` then drag the `dist/` folder, or connect the repo. Remember the App Check note above:
localhost uses the debug token, the deployed site needs the reCAPTCHA provider.
