import { ImageIcon, UserIcon } from './Icons.jsx'
import imageAssets from '../image-assets.json'

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
    const image = imageAssets[src]
    return (
      <div className={`image-slot ${className}`} style={{ aspectRatio: ratio }}>
        <img
          src={image?.src ?? src}
          srcSet={image?.srcSet}
          sizes={portrait ? '(max-width: 860px) 132px, (max-width: 1124px) 32vw, 350px' : '(max-width: 860px) calc(100vw - 44px), (max-width: 1124px) 46vw, 520px'}
          width={image?.width}
          height={image?.height}
          alt={alt}
          loading={portrait ? 'eager' : 'lazy'}
          fetchPriority={portrait ? 'high' : 'auto'}
          decoding="async"
        />
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
