import { useEffect, useMemo, useState } from 'react'

// Figma Dev Mode for the real page: hover outlines any element, click selects it
// and the panel shows its live computed CSS. Mounted only while Dev Mode is on.
const ignore = '.toolbar, .inspect, .cmdk, .reactions, .you-cursor, .nav-pill, #root, .page, main, body, html'

const px = (v) => `${Math.round(parseFloat(v) * 10) / 10}px`
const hex = (c) => {
  if (!c.startsWith('rgb')) return c
  const [r, g, b, a = 1] = c.match(/[\d.]+/g).map(Number)
  const h = `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()}`
  return a < 1 ? `${h} ${Math.round(a * 100)}%` : h
}
const clear = (c) => c === 'transparent' || /rgba\(.*,\s*0\)$|\/\s*0\)$/.test(c)
const sides = (t, r, b, l) => (t === b && r === l ? (t === r ? t : `${t} ${r}`) : `${t} ${r} ${b} ${l}`)

function inspect(el) {
  const s = getComputedStyle(el)
  const box = el.getBoundingClientRect()
  const groups = []
  const css = []
  const add = (title, label, value, line, swatch) => {
    let g = groups.find((x) => x.title === title)
    if (!g) groups.push((g = { title, rows: [] }))
    g.rows.push({ label, value, swatch })
    if (line) css.push(line)
  }

  add('Layout', 'Width', px(box.width), `width: ${px(box.width)};`)
  add('Layout', 'Height', px(box.height), `height: ${px(box.height)};`)
  if (/flex|grid/.test(s.display)) {
    add('Layout', 'Display', s.display, `display: ${s.display};`)
    if (s.gap !== 'normal') add('Layout', 'Gap', s.gap, `gap: ${s.gap};`)
  }
  const pad = sides(px(s.paddingTop), px(s.paddingRight), px(s.paddingBottom), px(s.paddingLeft))
  if (pad !== '0px') add('Layout', 'Padding', pad, `padding: ${pad};`)

  if (el.textContent.trim()) {
    const family = s.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
    add('Typography', 'Font', family, `font-family: ${family};`)
    add('Typography', 'Weight', s.fontWeight, `font-weight: ${s.fontWeight};`)
    add('Typography', 'Size', px(s.fontSize), `font-size: ${px(s.fontSize)};`)
    if (s.lineHeight !== 'normal') add('Typography', 'Line height', px(s.lineHeight), `line-height: ${px(s.lineHeight)};`)
    if (s.letterSpacing !== 'normal') add('Typography', 'Letter spacing', px(s.letterSpacing), `letter-spacing: ${px(s.letterSpacing)};`)
    add('Typography', 'Color', hex(s.color), `color: ${hex(s.color)};`, s.color)
  }

  if (!clear(s.backgroundColor)) add('Fill', 'Background', hex(s.backgroundColor), `background: ${hex(s.backgroundColor)};`, s.backgroundColor)
  if (s.backgroundImage.includes('gradient')) add('Fill', 'Image', 'Gradient', null, s.backgroundImage)

  if (s.borderRadius !== '0px') add('Border', 'Radius', s.borderRadius, `border-radius: ${s.borderRadius};`)
  if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') {
    const border = `${px(s.borderTopWidth)} ${s.borderTopStyle} ${hex(s.borderTopColor)}`
    add('Border', 'Stroke', border, `border: ${border};`, s.borderTopColor)
  }
  if (s.boxShadow !== 'none') add('Border', 'Effect', 'Drop shadow', null)

  const name = el.dataset.build ?? el.dataset.frame ?? (typeof el.className === 'string' && el.className && `.${el.className.split(' ')[0]}`)
  return { name: name || el.tagName.toLowerCase(), tag: el.tagName.toLowerCase(), groups, css: css.join('\n') }
}

const place = (r) => ({ top: r.top, left: r.left, width: r.width, height: r.height })

export function DevMode({ onClose }) {
  const [hover, setHover] = useState(null)
  const [selected, setSelected] = useState(null)
  const [, remeasure] = useState(0)
  const [copied, setCopied] = useState(false)
  const info = useMemo(() => selected && inspect(selected), [selected])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dev-mode')
    const pick = (e) => (e.target instanceof Element && !e.target.matches(ignore) && !e.target.closest('.toolbar, .inspect, .cmdk, .reactions') ? e.target : null)
    const move = (e) => setHover(pick(e))
    // Capture phase: inspecting a link or button must not follow it.
    const click = (e) => {
      const el = pick(e)
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      setSelected(el)
    }
    const key = (e) => e.key === 'Escape' && !e.target.closest?.('dialog, input') && onClose()
    const sync = () => remeasure((n) => n + 1)
    addEventListener('pointermove', move)
    addEventListener('click', click, true)
    addEventListener('keydown', key)
    addEventListener('scroll', sync, { passive: true })
    addEventListener('resize', sync)
    return () => {
      root.classList.remove('dev-mode')
      removeEventListener('pointermove', move)
      removeEventListener('click', click, true)
      removeEventListener('keydown', key)
      removeEventListener('scroll', sync)
      removeEventListener('resize', sync)
    }
  }, [onClose])

  const copy = () => {
    navigator.clipboard?.writeText(info.css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  // Measured on every render (scroll/resize trigger one) so the boxes stick to their elements.
  const sel = selected?.isConnected && selected.getBoundingClientRect()
  const hov = hover && hover !== selected && hover.isConnected && hover.getBoundingClientRect()

  return (
    <>
      <div className="inspect-layer" aria-hidden="true">
        {hov && <div className="inspect-box is-hover" style={place(hov)} />}
        {sel && (
          <div className="inspect-box" style={place(sel)}>
            <span className="inspect-box__size">
              {Math.round(sel.width)} × {Math.round(sel.height)}
            </span>
          </div>
        )}
      </div>

      <aside className="inspect" aria-label="Dev Mode inspector" aria-live="polite">
        <header className="inspect__head">
          <span className="inspect__badge">Dev Mode</span>
          <button type="button" className="inspect__close" onClick={onClose} aria-label="Exit Dev Mode">
            ×
          </button>
        </header>

        {info ? (
          <div className="inspect__body">
            <p className="inspect__name">
              {info.name} <span>&lt;{info.tag}&gt;</span>
            </p>
            {info.groups.map((g) => (
              <section key={g.title} className="inspect__group">
                <h4>{g.title}</h4>
                <dl>
                  {g.rows.map((r) => (
                    <div key={r.label}>
                      <dt>{r.label}</dt>
                      <dd>
                        {r.swatch && <i className="inspect__swatch" style={{ background: r.swatch }} />}
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
            <section className="inspect__group">
              <h4>
                CSS
                <button type="button" className="inspect__copy" onClick={copy}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </h4>
              <pre className="inspect__code">{info.css}</pre>
            </section>
          </div>
        ) : (
          <p className="inspect__empty">Click anything on the page to see its CSS. Press Esc to exit.</p>
        )}
      </aside>
    </>
  )
}
