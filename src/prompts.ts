// The four LocalScribe actions. Each one is a single-turn text request,
// which is exactly what on-device inference supports. Multi-turn chat,
// tools/function calling and audio/video/PDF input are NOT supported
// on-device (Firebase AI Logic docs) — so this app deliberately has no
// follow-up chat. A follow-up would have to go to the cloud explicitly,
// and that is out of scope for the MVP.
export type ActionId = 'summarize' | 'keypoints' | 'translate' | 'polish'

export const ACTIONS: { id: ActionId; label: string; hint: string }[] = [
  { id: 'summarize', label: 'Summarize', hint: 'A short summary, in the same language as the input.' },
  { id: 'keypoints', label: 'Key points', hint: 'The key points as a short bullet list.' },
  { id: 'translate', label: 'Translate', hint: 'Translate into the target language below.' },
  { id: 'polish', label: 'Polish', hint: 'Rewrite more clearly, keeping the meaning and facts.' },
]

export function buildPrompt(action: ActionId, text: string, targetLang: string): string {
  switch (action) {
    case 'summarize':
      return `Summarize the following text in a few short sentences. Keep all facts and numbers accurate. Do not add information that is not in the text.\n\n---\n${text}`
    case 'keypoints':
      return `Extract the key points of the following text as a short bullet list, one point per line, no more than 8 points. Do not add information that is not in the text.\n\n---\n${text}`
    case 'translate':
      return `Translate the following text into ${targetLang}. Keep the meaning, tone and numbers unchanged. Output only the translation, no explanation.\n\n---\n${text}`
    case 'polish':
      return `Rewrite the following text to be clearer and more polished, in the same language as the input. Keep the meaning, facts and numbers unchanged. Output only the rewritten text, no explanation.\n\n---\n${text}`
  }
}
