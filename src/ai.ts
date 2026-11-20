import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, InferenceSource as SdkInferenceSource } from 'firebase/ai'
import { getFirebaseApp } from './firebase'
import { buildPrompt, type ActionId } from './prompts'

// Cloud fallback model. Originally gemini-2.5-flash-lite (as in Firebase's
// own hybrid web example), but Google restricted the 2.5 models to projects
// that had used them before — a brand-new project gets 404 "no longer
// available to new users", and the error itself names gemini-3.5-flash-lite
// as the replacement (verified live 2026-11-20). A small, cheap cloud model
// is the right fallback for short text tasks.
const CLOUD_MODEL = 'gemini-3.5-flash-lite'

export type InferenceSource = 'ON_DEVICE' | 'IN_CLOUD' | 'UNKNOWN'

export interface RunResult {
  text: string
  source: InferenceSource
  /** Human-readable reason the badge shows, e.g. why cloud was used. */
  sourceNote: string
}

let deviceModelReady: Promise<void> | null = null
let deviceModelProgress = 0

export function getDeviceModelProgress(): number {
  return deviceModelProgress
}

function getModel(highQuality: boolean) {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase is not configured yet. Copy .env.example to .env and fill it in (see SETUP.md).')
  const ai = getAI(app, { backend: new GoogleAIBackend() })
  // Default: try on-device first, fall back to cloud. High-quality mode
  // is the user's explicit choice to go to the cloud first.
  return getGenerativeModel(ai, {
    mode: highQuality ? InferenceMode.PREFER_IN_CLOUD : InferenceMode.PREFER_ON_DEVICE,
    inCloudParams: { model: CLOUD_MODEL },
  })
}

/**
 * Must be called from a user gesture (a button click) and before any
 * generateContent() call — the docs require this, and the model download
 * only starts on a gesture. Calling it twice is harmless: the promise
 * is cached and reused.
 */
export function prepareDeviceModel(onProgress?: (fraction: number) => void): Promise<void> {
  if (!deviceModelReady) {
    deviceModelReady = (async () => {
      try {
        const model = getModel(false)
        await model.initializeDeviceModel((val: number) => {
          deviceModelProgress = val
          onProgress?.(val)
        })
      } catch (err) {
        // initializeDeviceModel can fail when on-device is unavailable
        // (e.g. this browser has no local model). That is not fatal:
        // PREFER_ON_DEVICE then falls back to the cloud at request time,
        // and the badge will say so. Remember the failure so we do not
        // retry the download on every click.
        console.warn('On-device model could not be initialized; cloud fallback will be used.', err)
      }
    })()
  }
  return deviceModelReady
}

export async function runAction(
  action: ActionId,
  text: string,
  targetLang: string,
  highQuality: boolean,
): Promise<RunResult> {
  const model = getModel(highQuality)
  // User gesture: the click that called this function satisfies the
  // activation requirement for initializeDeviceModel().
  await prepareDeviceModel()
  const result = await model.generateContent(buildPrompt(action, text, targetLang))
  const response = result.response
  // Firebase AI Logic exposes which path served the request on
  // `response.inferenceSource`. The SDK's values are the lowercase
  // strings 'on_device' / 'in_cloud' (see the InferenceSource enum in
  // firebase/ai) — comparing against uppercase never matches, which is
  // why the badge used to report UNKNOWN. The badge reads this value —
  // it never guesses from the mode setting.
  const rawSource = (response as unknown as { inferenceSource?: string }).inferenceSource
  const source: InferenceSource =
    rawSource === SdkInferenceSource.ON_DEVICE
      ? 'ON_DEVICE'
      : rawSource === SdkInferenceSource.IN_CLOUD
        ? 'IN_CLOUD'
        : 'UNKNOWN'
  const sourceNote =
    source === 'ON_DEVICE'
      ? highQuality
        ? 'You asked for the cloud (High-quality mode), but the cloud call failed or was unreachable, so this ran on this device by Gemini Nano instead. Your text did not leave this browser.'
        : 'Processed on this device by Gemini Nano. Your text did not leave this browser.'
      : source === 'IN_CLOUD'
        ? highQuality
          ? 'Processed in the cloud (Gemini) — you chose High-quality mode.'
          : 'Processed in the cloud (Gemini) — the on-device model was unavailable or could not handle this request, so it fell back as disclosed.'
        : 'Processed, but the SDK did not report which path served this request.'
  return { text: response.text(), source, sourceNote }
}

/** In-app check for the Nov 13–14 milestone: does this Chrome have Nano? */
export async function checkNanoAvailability(): Promise<string> {
  const lm = (window as unknown as { LanguageModel?: { availability: () => Promise<string> } }).LanguageModel
  if (!lm) return 'not-supported — this browser has no LanguageModel API (use Chrome 139+ on desktop)'
  try {
    return await lm.availability()
  } catch (err) {
    return `error — ${err instanceof Error ? err.message : String(err)}`
  }
}
