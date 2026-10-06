import { useEffect, useRef, useState } from 'react'
import SegmentedControl from './arc/segmented-control/segmented-control'

const sections = [
  { value: 'top', label: 'Home' },
  { value: 'work', label: 'Work' },
  { value: 'about', label: 'About' },
  { value: 'skills', label: 'Skills' },
  { value: 'contact', label: 'Contact' },
]

// Floating glass pill, built on the uiarc segmented control. The highlight
// follows the section in view, and choosing one scrolls to it.
export function Nav() {
  const [active, setActive] = useState('top')
  const lockUntil = useRef(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach(({ value }) => {
      const el = document.getElementById(value)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (value) => {
    setActive(value)
    // Hold the highlight on the chosen section while the page scrolls past others.
    lockUntil.current = performance.now() + 900
    document.getElementById(value)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(
      null,
      '',
      value === 'top' ? location.pathname : `#${value}`,
    )
  }

  return (
    <nav className="nav-pill" aria-label="Primary">
      <SegmentedControl
        label="Sections"
        options={sections}
        value={active}
        onValueChange={go}
        className="nav-pill__switch"
      />
    </nav>
  )
}
