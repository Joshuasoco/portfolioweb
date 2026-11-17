import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { DevMode } from './DevMode.jsx'

// Server render says Ctrl; the client switches to ⌘ on Apple devices without a hydration mismatch.
const noop = () => () => {}
const modKey = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl')

// Figma-style bottom toolbar. Each feature listens for its own window event,
// so the buttons only announce intent; Dev Mode is the one mode it owns.
export function Toolbar() {
  const [dev, setDev] = useState(false)
  const mod = useSyncExternalStore(noop, modKey, () => 'Ctrl')
  const closeDev = useCallback(() => setDev(false), [])

  useEffect(() => {
    const toggle = () => setDev((d) => !d)
    // Shift+D, like Figma's Dev Mode shortcut.
    const key = (e) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== 'd') return
      if (e.target.closest?.('input, textarea, select, [contenteditable], dialog')) return
      e.preventDefault()
      toggle()
    }
    addEventListener('keydown', key)
    addEventListener('toggle-dev-mode', toggle)
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('toggle-dev-mode', toggle)
    }
  }, [])

  const react = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    dispatchEvent(new CustomEvent('open-reactions', { detail: { x: r.left + r.width / 2, y: r.top } }))
  }

  return (
    <>
      <div className="toolbar" role="toolbar" aria-label="Quick actions">
        <button type="button" className="toolbar__btn toolbar__btn--chat" onClick={() => dispatchEvent(new Event('open-cursor-chat'))}>
          Chat <kbd>/</kbd>
        </button>
        <button type="button" className="toolbar__btn" onClick={react}>
          React <kbd>E</kbd>
        </button>
        <button type="button" className="toolbar__btn" aria-pressed={dev} onClick={() => setDev((d) => !d)}>
          Dev Mode <kbd>⇧D</kbd>
        </button>
        <button type="button" className="toolbar__btn" onClick={() => dispatchEvent(new Event('open-command-menu'))}>
          Search <kbd>{mod} K</kbd>
        </button>
      </div>
      {dev && <DevMode onClose={closeDev} />}
    </>
  )
}
