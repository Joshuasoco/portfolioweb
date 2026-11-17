import { useEffect, useState } from 'react'
import { projects, skills } from '../data.js'

// Figma's left sidebar for the real page: one row per frame and its layers.
// Names must match the data-frame / data-build names on the page (Hero.jsx, Projects.jsx, …).
const tree = [
  { id: 'top', name: 'Portfolio', layers: ['Heading', 'Portrait', 'Intro', 'Buttons', 'Details'] },
  { id: 'work', name: 'Work', layers: projects.map((p) => p.name) },
  { id: 'skills', name: 'Skills', layers: skills.map((s) => s.title) },
  { id: 'certifications', name: 'Certifications', layers: ['Certificates'] },
  { id: 'contact', name: 'Contact', layers: [] },
]

const find = (id, layer) => document.querySelector(`#${id} [data-build="${CSS.escape(layer)}"]`)

export function Layers() {
  const [active, setActive] = useState('top')
  // 0 until mounted, so the server HTML and first client render agree (all layers look built).
  const [version, setVersion] = useState(0)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    const frame = requestAnimationFrame(bump)
    // The cursors flip .is-built as they work; follow along so rows "finish" with the page.
    const built = new MutationObserver(bump)
    const page = document.querySelector('.page')
    if (page) built.observe(page, { subtree: true, attributeFilter: ['class'] })
    const seen = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    tree.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) seen.observe(el)
    })
    const clearHover = () => setHover(null)
    addEventListener('scroll', clearHover, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      built.disconnect()
      seen.disconnect()
      removeEventListener('scroll', clearHover)
    }
  }, [])

  const isBuilt = (id, layer) => {
    if (!version || !document.documentElement.classList.contains('js-build')) return true
    return find(id, layer)?.classList.contains('is-built') ?? true
  }

  const goTo = (el, block = 'start') => {
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block })
    el.classList.remove('is-flash')
    void el.offsetWidth // restart the flash animation on repeat clicks
    el.classList.add('is-flash')
    setTimeout(() => el.classList.remove('is-flash'), 1200)
  }

  const box = hover?.isConnected && hover.getBoundingClientRect()

  return (
    <>
      <nav className="layers" aria-label="Layers">
        <p className="layers__title">Layers</p>
        <ul>
          {tree.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className="layers__row layers__row--frame"
                aria-current={active === f.id ? 'location' : undefined}
                onClick={() => document.getElementById(f.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="layers__icon" aria-hidden="true">#</span>
                {f.name}
              </button>
              {f.layers.length > 0 && (
                <ul>
                  {f.layers.map((layer) => (
                    <li key={layer}>
                      <button
                        type="button"
                        className={`layers__row${isBuilt(f.id, layer) ? '' : ' is-wire'}`}
                        onClick={() => goTo(find(f.id, layer), 'center')}
                        onMouseEnter={() => setHover(find(f.id, layer))}
                        onMouseLeave={() => setHover(null)}
                      >
                        <span className="layers__icon" aria-hidden="true">▢</span>
                        {layer}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {box && (
        <div
          className="layers-hover"
          aria-hidden="true"
          style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
        />
      )}
    </>
  )
}
