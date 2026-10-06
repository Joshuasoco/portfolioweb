// Minimal stand-in for `next/image`, so uiarc components that import it run under Vite.
// `fill` stretches the image over its positioned parent, as in Next.js.
export default function Image({ fill, sizes, style, ...props }) {
  const fillStyle = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : null
  return <img sizes={sizes} style={{ ...fillStyle, ...style }} {...props} />
}
