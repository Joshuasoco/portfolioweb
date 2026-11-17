import { useEffect, useRef, useState } from 'react'

// The visitor joins the multiplayer page: a "You" tag rides along with the real
// mouse (the native cursor stays), and "/" opens Figma-style cursor chat.
// Sent messages go out as a `cursor-chat` event so the cursors can answer (see Cursors.jsx).
export function YouCursor() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  const [chatting, setChatting] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState('')

  useEffect(() => {
    // Mouse and trackpad only: a touch screen has no cursor to follow.
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      setOn(true)
    }
    const leave = () => setOn(false)
    const key = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable], dialog')) return
      e.preventDefault()
      setChatting(true)
    }
    const open = () => setChatting(true)
    addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    addEventListener('keydown', key)
    addEventListener('open-cursor-chat', open)
    return () => {
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      removeEventListener('keydown', key)
      removeEventListener('open-cursor-chat', open)
    }
  }, [])

  useEffect(() => {
    if (!sent) return
    const t = setTimeout(() => setSent(''), 4000)
    return () => clearTimeout(t)
  }, [sent])

  const close = () => {
    setChatting(false)
    setDraft('')
  }
  const submit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (text) {
      setSent(text)
      dispatchEvent(new CustomEvent('cursor-chat', { detail: text }))
    }
    close()
  }

  return (
    <div ref={ref} className={`you-cursor${on || chatting ? ' is-on' : ''}`} style={{ '--cursor': '#8b5cf6' }}>
      <div className={`cursor__tag${chatting || sent ? ' is-chat' : ''}`}>
        <span className="cursor__name">You</span>
        {chatting ? (
          <form onSubmit={submit}>
            <input
              className="cursor__input"
              autoFocus
              value={draft}
              maxLength={80}
              placeholder="Say something"
              aria-label="Cursor chat message"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && close()}
              onBlur={close}
            />
          </form>
        ) : (
          sent && <span className="cursor__message">{sent}</span>
        )}
      </div>
    </div>
  )
}
