import { useEffect, useState } from 'react'
import { checkNanoAvailability, runAction, type InferenceSource, type RunResult } from './ai'
import { isFirebaseConfigured } from './firebase'
import { ACTIONS, type ActionId } from './prompts'
import './App.css'

interface HistoryItem {
  id: number
  action: ActionId
  source: InferenceSource
  inputPreview: string
  output: string
  at: string
}

const SAMPLE_TEXT =
  'This Agreement is entered into on 1 November 2026 between Acme Ltd and Beta Studio. ' +
  'Beta Studio will deliver a redesigned company website within 45 days of signing, including a homepage, ' +
  'a product catalogue and a contact form. Acme Ltd will pay a total fee of $12,000 in two instalments: ' +
  '50% on signing and 50% on delivery. Either party may terminate this Agreement with 14 days written notice. ' +
  'All confidential information shared during the project must not be disclosed to any third party.'

const HISTORY_KEY = 'localscribe-history-v1'

function loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as HistoryItem[]
  } catch {
    return []
  }
}

export default function App() {
  const [input, setInput] = useState('')
  const [targetLang, setTargetLang] = useState('English')
  const [highQuality, setHighQuality] = useState(false)
  const [running, setRunning] = useState<ActionId | null>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [lastAction, setLastAction] = useState<ActionId | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)
  const [nanoStatus, setNanoStatus] = useState('Not checked yet')
  const [checkingNano, setCheckingNano] = useState(false)

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  async function onAction(action: ActionId) {
    if (!input.trim() || running) return
    setError('')
    setResult(null)
    setRunning(action)
    setLastAction(action)
    try {
      const r = await runAction(action, input.trim(), targetLang, highQuality)
      setResult(r)
      setHistory((h) => [
        {
          id: Date.now(),
          action,
          source: r.source,
          inputPreview: input.trim().slice(0, 120),
          output: r.text,
          at: new Date().toLocaleString(),
        },
        ...h,
      ].slice(0, 20))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setRunning(null)
    }
  }

  async function onCheckNano() {
    setCheckingNano(true)
    setNanoStatus(await checkNanoAvailability())
    setCheckingNano(false)
  }

  const longText = input.length > 8000

  return (
    <main className="page">
      <header>
        <h1>LocalScribe</h1>
        <p className="tagline">
          Paste sensitive text. See exactly where it is processed — on this device, or in the cloud.
        </p>
      </header>

      {!isFirebaseConfigured && (
        <section className="banner">
          <strong>Setup needed:</strong> Firebase is not configured yet. Copy{' '}
          <code>.env.example</code> to <code>.env</code> and paste your web app config from the
          Firebase console (see SETUP.md). The on-device check below works without it.
        </section>
      )}

      <section className="card">
        <h2>1 · Can this browser run the local model?</h2>
        <p>
          LocalScribe runs on Gemini Nano in Chrome when it can. Check this browser first — it needs
          Chrome 139+ on desktop with “On-device AI” enabled in <code>chrome://settings/ai</code>.
        </p>
        <button onClick={onCheckNano} disabled={checkingNano}>
          {checkingNano ? 'Checking…' : 'Check Gemini Nano availability'}
        </button>{' '}
        <span className="mono">Result: {nanoStatus}</span>
        <p className="muted">
          <code>available</code> = ready. <code>downloadable</code> / <code>downloading</code> = the
          model still needs a multi-GB download (start it with any action below).{' '}
          <code>unavailable</code> = check the setting, then Chrome version, disk (22&nbsp;GB free),
          RAM (16&nbsp;GB) and CPU cores (4+).
        </p>
      </section>

      <section className="card">
        <h2>2 · Your text</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a contract, resume, email or any text you would rather not upload…"
          rows={10}
        />
        <div className="row">
          <span className="muted">{input.length} characters</span>
          {longText && (
            <span className="warn">
              Long text — it may exceed the on-device context, so a cloud fallback is likely. The
              badge below will say so if it happens.
            </span>
          )}
          <button className="secondary" onClick={() => setInput(SAMPLE_TEXT)}>
            Try the sample contract
          </button>
          <button className="secondary" onClick={() => { setInput(''); setResult(null); setError('') }}>
            Clear
          </button>
        </div>
        <div className="row">
          <label>
            Translate to:{' '}
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              <option>English</option>
              <option>Chinese</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={highQuality}
              onChange={(e) => setHighQuality(e.target.checked)}
            />
            High-quality mode — send to the cloud on purpose (slower, stronger model, text leaves
            this device)
          </label>
        </div>
        <div className="actions">
          {ACTIONS.map((a) => (
            <button key={a.id} onClick={() => onAction(a.id)} disabled={!input.trim() || running !== null}>
              {running === a.id ? 'Working…' : a.label}
            </button>
          ))}
        </div>
        <p className="muted">
          No follow-up chat here, on purpose: on-device inference only supports single-turn
          requests. Each click is one request, and the badge tells you where it ran.
        </p>
      </section>

      {error && (
        <section className="card error">
          <strong>Something went wrong:</strong> {error}
        </section>
      )}

      {result && lastAction && (
        <section className="card">
          <h2>Result</h2>
          <p className={`badge ${result.source === 'ON_DEVICE' ? 'local' : result.source === 'IN_CLOUD' ? 'cloud' : ''}`}>
            {result.source === 'ON_DEVICE'
              ? '🟢 Processed locally — Gemini Nano on this device'
              : result.source === 'IN_CLOUD'
                ? '🔵 Processed in the cloud — Gemini'
                : '⚪ Processed — path not reported'}
          </p>
          <p className="muted">{result.sourceNote}</p>
          {/* Rendered as text, never innerHTML: model output is untrusted. */}
          <pre className="output">{result.text}</pre>
        </section>
      )}

      <section className="card">
        <h2>History — stored only in this browser</h2>
        {history.length === 0 ? (
          <p className="muted">Nothing yet. Results are saved only in this browser’s local storage.</p>
        ) : (
          <>
            <button className="secondary" onClick={() => setHistory([])}>
              Clear all history
            </button>
            <ul className="history">
              {history.map((h) => (
                <li key={h.id}>
                  <strong>{ACTIONS.find((a) => a.id === h.action)?.label}</strong> ·{' '}
                  {h.source === 'ON_DEVICE' ? '🟢 local' : h.source === 'IN_CLOUD' ? '🔵 cloud' : '⚪ unknown'} ·{' '}
                  <span className="muted">{h.at}</span>
                  <br />
                  <span className="muted">{h.inputPreview}…</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <footer className="muted">
        LocalScribe for #BuildHybridAI 2026. Built with Firebase AI Logic hybrid inference
        (on-device Gemini Nano when available, cloud fallback otherwise). Your text is only sent to
        the cloud when the badge says so.
      </footer>
    </main>
  )
}
