import { ImageIcon, UserIcon } from './Icons.jsx'

// Shows the image when `src` is set; otherwise a placeholder frame
// that tells you what to drop in and at what size.
export function ImageSlot({
  src,
  alt,
  hint,
  tone = 'blue',
  ratio = '16 / 10',
  portrait = false,
  className = '',
}) {
  if (src) {
    return (
      <div className={`image-slot ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    )
  }

  const Icon = portrait ? UserIcon : ImageIcon

  return (
    <div
      className={`image-slot image-slot--empty tone-${tone} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${alt} (image coming soon)`}
    >
      <div className="image-slot__inner">
        <span className="image-slot__icon">
          <Icon width={22} height={22} />
        </span>
        <span className="image-slot__label">
          {portrait ? 'Photo coming soon' : 'Image coming soon'}
        </span>
        {hint && <span className="image-slot__hint">{hint}</span>}
      </div>
    </div>
  )
}
