import { useEffect, useRef, useState } from 'react'

const emojis = ['👍', '❤️', '🔥', '😂', '🎉', '👀']

// Figma-style emoji reactions: "E" (or the toolbar) opens a wheel at the cursor,
// each pick floats an emoji up from that spot. 1–6 pick by key, Esc or E closes.
export function Reactions() {
  const [wheel, setWheel] = useState(null)
  const [floats, setFloats] = useState([])
  const pointer = useRef(null)
  const nextId = useRef(0)

  useEffect(() => {
    const at = () => pointer.current ?? { x: innerWidth / 2, y: innerHeight / 2 }
    const move = (e) => (pointer.current = { x: e.clientX, y: e.clientY })
    const toggle = (e) => setWheel((w) => (w ? null : (e.detail ?? at())))
    const key = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable], dialog')) return
      if (e.key.toLowerCase() === 'e' && !e.shiftKey) setWheel((w) => (w ? null : at()))
      else if (e.key === 'Escape') setWheel(null)
    }
    // Clicks elsewhere close it; the toolbar toggles it on its own.
    const outside = (e) => !e.target.closest?.('.reactions, .toolbar') && setWheel(null)
    addEventListener('pointermove', move)
    addEventListener('keydown', key)
    addEventListener('pointerdown', outside)
    addEventListener('open-reactions', toggle)
    return () => {
      removeEventListener('pointermove', move)
      removeEventListener('keydown', key)
      removeEventListener('pointerdown', outside)
      removeEventListener('open-reactions', toggle)
    }
  }, [])

  const send = (emoji) => {
    const id = nextId.current++
    // Scatter each float sideways by -40..40px, varied per id.
    const dx = ((id * 37) % 81) - 40
    // ponytail: capped at 30 live floats so button mashing can't flood the DOM.
    setFloats((f) => [...f.slice(-29), { id, emoji, x: wheel.x, y: wheel.y - 40, dx }])
  }

  const pickByNumber = (e) => {
    const n = Number(e.key)
    if (n >= 1 && n <= emojis.length) send(emojis[n - 1])
  }

  return (
    <>
      {wheel && (
        <div
          className="reactions"
          role="group"
          aria-label="Send a reaction"
          style={{ left: Math.min(Math.max(wheel.x, 170), innerWidth - 170), top: Math.max(wheel.y, 80) }}
          onKeyDown={pickByNumber}
        >
          {emojis.map((emoji, i) => (
            <button key={emoji} type="button" autoFocus={i === 0} aria-label={`React ${emoji} (${i + 1})`} onClick={() => send(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}
      <div className="reaction-floats" aria-hidden="true">
        {floats.map((f) => (
          <span
            key={f.id}
            className="reaction-float"
            style={{ left: f.x, top: f.y, '--dx': `${f.dx}px` }}
            onAnimationEnd={() => setFloats((all) => all.filter((x) => x.id !== f.id))}
          >
            {f.emoji}
          </span>
        ))}
      </div>
    </>
  )
}
