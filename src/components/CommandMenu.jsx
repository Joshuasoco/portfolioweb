import { useEffect, useRef, useState } from 'react'
import { profile, projects } from '../data.js'

const jump = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const open = (url) => () => window.open(url, '_blank', 'noreferrer')

const commands = [
  { group: 'Jump to', label: 'About', run: jump('top') },
  { group: 'Jump to', label: 'Work', run: jump('work') },
  { group: 'Jump to', label: 'Skills', run: jump('skills') },
  { group: 'Jump to', label: 'Certifications', run: jump('certifications') },
  { group: 'Jump to', label: 'Contact', run: jump('contact') },
  ...projects.map((p) => ({ group: 'Projects', label: p.name, hint: p.tagline, run: jump(p.id) })),
  { group: 'Actions', label: 'Copy email', hint: profile.email, run: () => navigator.clipboard?.writeText(profile.email) },
  { group: 'Actions', label: 'Send an email', run: () => (location.href = `mailto:${profile.email}`) },
  { group: 'Actions', label: 'Open GitHub', run: open(profile.github) },
  { group: 'Actions', label: 'Open LinkedIn', run: open(profile.linkedin) },
  { group: 'Actions', label: 'Toggle Dev Mode', hint: 'Inspect the CSS · ⇧D', run: () => dispatchEvent(new Event('toggle-dev-mode')) },
]

// ⌘K / Ctrl+K quick actions (the toolbar's Search button sends `open-command-menu`).
// Native <dialog> gives the focus trap, Esc to close and the backdrop for free.
export function CommandMenu() {
  const dialog = useRef(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  const q = query.trim().toLowerCase()
  const results = commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ''}`.toLowerCase().includes(q))

  const show = () => {
    setQuery('')
    setIndex(0)
    dialog.current?.showModal()
  }

  useEffect(() => {
    const key = (e) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey)) return
      e.preventDefault()
      if (dialog.current?.open) dialog.current.close()
      else show()
    }
    addEventListener('keydown', key)
    addEventListener('open-command-menu', show)
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('open-command-menu', show)
    }
  }, [])

  const run = (c) => {
    dialog.current?.close()
    // Let the dialog release scroll and focus before acting.
    requestAnimationFrame(c.run)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setIndex((i) => (i + step + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter' && results[index]) {
      e.preventDefault()
      run(results[index])
    }
  }

  return (
    <dialog
      ref={dialog}
      className="cmdk"
      aria-label="Quick actions"
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
    >
      <input
        className="cmdk__input"
        placeholder="Search sections, projects, actions…"
        value={query}
        role="combobox"
        aria-expanded="true"
        aria-controls="cmdk-list"
        aria-activedescendant={results[index] ? `cmdk-${index}` : undefined}
        onChange={(e) => {
          setQuery(e.target.value)
          setIndex(0)
        }}
        onKeyDown={onKeyDown}
      />
      <ul className="cmdk__list" id="cmdk-list" role="listbox">
        {results.map((c, i) => {
          const head = c.group !== results[i - 1]?.group
          return (
            <li key={`${c.group}-${c.label}`} role="presentation">
              {head && <p className="cmdk__group">{c.group}</p>}
              <button
                type="button"
                id={`cmdk-${i}`}
                role="option"
                aria-selected={i === index}
                className="cmdk__item"
                tabIndex={-1}
                onMouseMove={() => setIndex(i)}
                onClick={() => run(c)}
              >
                <span>{c.label}</span>
                {c.hint && <span className="cmdk__hint">{c.hint}</span>}
              </button>
            </li>
          )
        })}
        {!results.length && <li className="cmdk__empty">No results for “{query}”</li>}
      </ul>
    </dialog>
  )
}
