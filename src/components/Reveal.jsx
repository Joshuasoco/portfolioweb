import { useEffect, useRef } from 'react'

// Fades content up into place the first time it scrolls into view.
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // The HTML is readable before hydration and if JavaScript never runs.
    // Only content below the initial viewport needs a scroll reveal.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    el.classList.add('is-pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          el.classList.remove('is-pending')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      el.classList.remove('is-pending')
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
