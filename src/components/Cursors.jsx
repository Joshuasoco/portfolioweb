import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { profile } from '../data.js'

// Four collaborators "designing" the page. Every [data-build] block starts as a
// wireframe; as it scrolls into view it joins a shared queue, and the next free
// cursor walks over, selects it, and turns it into the real content. With
// nothing to build they wander around the visible part of the page and chat.
const people = [
  { id: 'owner', name: profile.firstName, color: '#18181b', lines: ['Thanks for stopping by 👋', 'Have a look at my projects'] },
  { id: 'design', name: 'Designer', color: '#f24e9e', lines: ['Love this layout ✨', 'Tightening the spacing'] },
  { id: 'dev', name: 'Developer', color: '#0d99ff', lines: ['Shipped 🚀', 'Looks clean on mobile too'] },
  { id: 'agent', name: 'AI Agent', color: '#14ae5c', lines: ['Workflow done ✓', 'Indexing projects…'] },
]

const greeting = `Hi! I'm ${profile.firstName}, welcome to my portfolio 👋`
const ease = [0.65, 0, 0.35, 1]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function Cursors({ pageRef }) {
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({})
  const [sel, setSel] = useState({})
  const [chat, setChat] = useState({})

  useEffect(() => {
    const page = pageRef.current
    // index.html sets js-build only when motion is allowed; otherwise the page is already final.
    if (!page || !document.documentElement.classList.contains('js-build')) return
    let cancelled = false
    const queue = []

    const build = (el) => el.classList.add('is-built')
    const box = (el) => {
      const p = page.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height }
    }
    const inView = (el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight
    }
    const viewPoint = () => {
      const p = page.getBoundingClientRect()
      return { x: rand(0.08, 0.88) * p.width, y: rand(0.2, 0.85) * innerHeight - p.top }
    }
    const go = (id, pt, d) => setPos((s) => ({ ...s, [id]: { x: pt.x, y: pt.y, d } }))
    // One bubble at a time, so chats never pile up on the content.
    let talking = false
    const say = async (id, text, ms) => {
      talking = true
      setChat((c) => ({ ...c, [id]: text }))
      await sleep(ms)
      setChat((c) => ({ ...c, [id]: null }))
      talking = false
    }
    // Idle, but drop everything as soon as there is something to build.
    const idle = async (ms) => {
      for (let t = 0; t < ms && !queue.length && !cancelled; t += 120) await sleep(120)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          queue.push(e.target)
          observer.unobserve(e.target)
        }
        // Build top to bottom, like reading the page.
        queue.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    page.querySelectorAll('[data-build]:not(.is-built)').forEach((el) => observer.observe(el))

    let greeted = false
    let replying = false
    async function worker(p, i) {
      const start = viewPoint()
      go(p.id, { x: i % 2 ? page.clientWidth + 30 : -30, y: start.y }, 0)
      await sleep(60 + i * 70)

      while (!cancelled) {
        const el = queue.shift()
        if (el) {
          if (el.classList.contains('is-built')) continue
          // Scrolled past before anyone got there: finish it quietly.
          if (!inView(el)) {
            build(el)
            continue
          }
          const b = box(el)
          go(p.id, { x: b.x + Math.min(b.w * 0.5, 240), y: b.y + Math.min(b.h * 0.35, 110) }, 0.38)
          await sleep(380)
          if (cancelled) return
          setSel((s) => ({ ...s, [p.id]: { ...box(el), layer: el.dataset.build } }))
          await sleep(120)
          build(el)
          await sleep(260)
          setSel((s) => ({ ...s, [p.id]: null }))
          continue
        }

        // Greet once the hero is finished, from just right of the name.
        const heroDone = !page.querySelector('.hero [data-build]:not(.is-built)')
        if (p.id === 'owner' && !greeted && heroDone) {
          greeted = true
          const name = page.querySelector('.hero__name')
          if (name && inView(name)) {
            const b = box(name)
            // Beside the name when the bubble fits, otherwise just under it.
            const roomRight = page.clientWidth - (b.x + b.w) > 400
            go(p.id, roomRight ? { x: b.x + b.w + 14, y: b.y + b.h * 0.3 } : { x: b.x + 12, y: b.y + b.h - 4 }, 0.5)
            await sleep(500)
          }
          await say(p.id, greeting, 5200)
          continue
        }

        // Joshua waits by the hero until it is done, ready to say hello.
        if (p.id === 'owner' && !greeted) {
          await idle(200)
          continue
        }
        // Stay put while answering the visitor.
        if (p.id === 'owner' && replying) {
          await idle(200)
          continue
        }
        go(p.id, viewPoint(), rand(1.1, 1.9))
        await idle(rand(1700, 3400))
        // Small screens: no random chatter, bubbles would cover the content.
        if (greeted && !talking && !queue.length && innerWidth > 700 && Math.random() < 0.12) say(p.id, pick(p.lines), 2600)
      }
    }

    // The visitor typed in cursor chat (YouCursor.jsx): Joshua flies over and answers.
    const replies = ['Hey, thanks for the message! 😄', 'Glad you’re here 🙌', 'Send me an email, let’s talk!']
    let lastPointer = null
    const track = (e) => (lastPointer = { x: e.clientX, y: e.clientY })
    const reply = async () => {
      if (replying) return
      replying = true
      // Let the welcome (or any bubble) finish first.
      while ((!greeted || talking) && !cancelled) await sleep(200)
      if (lastPointer) {
        const p = page.getBoundingClientRect()
        go('owner', { x: lastPointer.x - p.left + 40, y: lastPointer.y - p.top + 70 }, 0.6)
      }
      await sleep(900)
      if (!cancelled) await say('owner', pick(replies), 3200)
      replying = false
    }
    addEventListener('pointermove', track)
    addEventListener('cursor-chat', reply)

    setActive(true)
    people.forEach(worker)
    return () => {
      cancelled = true
      observer.disconnect()
      removeEventListener('pointermove', track)
      removeEventListener('cursor-chat', reply)
    }
  }, [pageRef])

  if (!active) return null

  return (
    <div className="cursors" aria-hidden="true">
      {people.map((p) => {
        const s = sel[p.id]
        return (
          <motion.div
            key={`sel-${p.id}`}
            className="selection"
            initial={false}
            animate={s ? { opacity: 1, x: s.x, y: s.y, width: s.w, height: s.h } : { opacity: 0 }}
            transition={{ opacity: { duration: 0.15 }, default: { duration: 0 } }}
            style={{ '--sel': p.color }}
          >
            <span className="selection__layer">{s?.layer}</span>
            <i className="selection__handle" data-corner="tl" />
            <i className="selection__handle" data-corner="tr" />
            <i className="selection__handle" data-corner="bl" />
            <i className="selection__handle" data-corner="br" />
            <span className="selection__size">{s && `${Math.round(s.w)} × ${Math.round(s.h)}`}</span>
          </motion.div>
        )
      })}

      {people.map((p) => {
        const at = pos[p.id] ?? { x: -60, y: -60, d: 0 }
        const message = chat[p.id]
        return (
          <motion.div
            key={p.id}
            className="cursor"
            initial={false}
            animate={{ x: at.x, y: at.y }}
            transition={{ duration: at.d, ease }}
            style={{ '--cursor': p.color }}
          >
            <svg className="cursor__arrow" width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M2.5 2 17 8.4l-6.4 2.1-2.3 6.6z"
                fill="var(--cursor)"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <motion.div layout className={`cursor__tag${message ? ' is-chat' : ''}`}>
              <motion.span layout="position" className="cursor__name">
                {p.name}
              </motion.span>
              {message && (
                <motion.span
                  className="cursor__message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {message}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
