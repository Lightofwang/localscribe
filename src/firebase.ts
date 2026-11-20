import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Firebase config comes from `.env` (see `.env.example`). Nothing here
// is a secret on its own — the web API key is public by design — but
// the real protection is Firebase App Check, enforced by the AI Logic
// guided setup in the console.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let app: FirebaseApp | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null
  if (!app) {
    app = initializeApp(firebaseConfig)
    // Local development: the AI Logic guided setup auto-enforces App Check.
    // firebase/ai only attaches an App Check token if App Check was
    // actually activated with initializeAppCheck() — merely setting the
    // debug global is not enough, and without activation requests go out
    // with NO token and the server answers 401 "App Check token is
    // invalid". In debug mode the SDK exchanges the debug token instead
    // of calling reCAPTCHA, so the provider key below is never used on
    // localhost. On activation the SDK prints "Firebase App Check debug
    // token: <uuid>" to the console (only when it first creates one);
    // register that UUID in the console (App Check > app > Manage debug
    // tokens). See SETUP.md step 2. On the deployed site, the real
    // reCAPTCHA provider configured in the console is used instead.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) ?? 'unused-in-debug-mode',
        ),
        isTokenAutoRefreshEnabled: true,
      })
    } else if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY as string),
        isTokenAutoRefreshEnabled: true,
      })
    }
  }
  return app
}
