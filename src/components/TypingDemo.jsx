import { useRef, useState } from 'react'
import { SoundIcon } from './Icons.jsx'

const PHRASE = 'simple tools built with care feel right'

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

// A short synthesized switch click: a filtered noise transient plus a low "thock".
function playClick(ctx) {
  const t = ctx.currentTime
  const length = Math.floor(ctx.sampleRate * 0.035)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 2200 + Math.random() * 900
  filter.Q.value = 0.8
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.55
  noise.connect(filter).connect(noiseGain).connect(ctx.destination)
  noise.start(t)

  const body = ctx.createOscillator()
  body.frequency.setValueAtTime(190, t)
  body.frequency.exponentialRampToValueAtTime(70, t + 0.05)
  const bodyGain = ctx.createGain()
  bodyGain.gain.setValueAtTime(0.22, t)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  body.connect(bodyGain).connect(ctx.destination)
  body.start(t)
  body.stop(t + 0.08)
}

export function TypingDemo() {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)
  const [pressed, setPressed] = useState(() => new Set())
  const [sound, setSound] = useState(false)
  const audioRef = useRef(null)
  const inputRef = useRef(null)

  const done = result !== null

  const toggleSound = () => {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) audioRef.current = new Ctx()
    }
    audioRef.current?.resume()
    setSound((s) => !s)
    inputRef.current?.focus()
  }

  const reset = () => {
    setTyped('')
    setStartedAt(null)
    setResult(null)
    inputRef.current?.focus()
  }

  const onChange = (e) => {
    if (done) return
    const value = e.target.value.toLowerCase().slice(0, PHRASE.length)
    const now = performance.now()
    const start = startedAt ?? now
    if (startedAt === null) setStartedAt(now)
    setTyped(value)

    if (value.length === PHRASE.length) {
      let correct = 0
      for (let i = 0; i < value.length; i++)
        if (value[i] === PHRASE[i]) correct++
      const minutes = Math.max((now - start) / 60000, 1 / 600)
      setResult({
        wpm: Math.round(correct / 5 / minutes),
        accuracy: Math.round((correct / value.length) * 100),
      })
    }
  }

  const onKeyDown = (e) => {
    const key = e.key === ' ' ? 'space' : e.key.toLowerCase()
    setPressed((prev) => new Set(prev).add(key))
    if (sound && audioRef.current && !e.repeat && !e.metaKey && !e.ctrlKey) {
      playClick(audioRef.current)
    }
  }

  const onKeyUp = (e) => {
    const key = e.key === ' ' ? 'space' : e.key.toLowerCase()
    setPressed((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  return (
    <div className="typing">
      <label className="typing__stage" htmlFor="typing-input">
        <span className="visually-hidden">Type the phrase: {PHRASE}</span>
        <span className="typing__text" aria-hidden="true">
          {PHRASE.split('').map((ch, i) => {
            let state = 'pending'
            if (i < typed.length) state = typed[i] === ch ? 'correct' : 'wrong'
            const isCaret = i === typed.length && !done
            return (
              <span
                key={i}
                className={`typing__char is-${state} ${isCaret ? 'is-caret' : ''}`}
              >
                {ch === ' ' && state === 'wrong' ? '·' : ch}
              </span>
            )
          })}
        </span>
        <input
          id="typing-input"
          ref={inputRef}
          className="typing__input"
          value={typed}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => setPressed(new Set())}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          readOnly={done}
        />
        {!startedAt && (
          <span className="typing__hint">Click here and start typing</span>
        )}
      </label>

      <div className="typing__bar">
        <div className="typing__stats" aria-live="polite">
          {done ? (
            <>
              <span>
                <strong>{result.wpm}</strong> wpm
              </span>
              <span>
                <strong>{result.accuracy}%</strong> accuracy
              </span>
            </>
          ) : (
            <span>
              <strong>{typed.length}</strong>/{PHRASE.length}
            </span>
          )}
        </div>
        <div className="typing__controls">
          <button
            type="button"
            className="icon-button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
          >
            <SoundIcon on={sound} />
          </button>
          <button type="button" className="text-button" onClick={reset}>
            {done ? 'Try again' : 'Restart'}
          </button>
        </div>
      </div>

      <div className="keyboard" aria-hidden="true">
        {ROWS.map((row, r) => (
          <div className="keyboard__row" key={r}>
            {row.map((k) => (
              <span
                key={k}
                className={`key ${pressed.has(k) ? 'is-down' : ''}`}
              >
                {k}
              </span>
            ))}
          </div>
        ))}
        <div className="keyboard__row">
          <span
            className={`key key--space ${pressed.has('space') ? 'is-down' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}
