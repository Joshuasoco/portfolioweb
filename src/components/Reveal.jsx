// A block the cursors build when it scrolls into view (see Cursors.jsx).
// `layer` is the name shown on its selection box. The HTML is final as rendered;
// the wireframe look only applies under html.js-build.
export function Reveal({ as: Tag = 'div', layer = 'Frame', children, ...rest }) {
  return (
    <Tag data-build={layer} {...rest}>
      {children}
    </Tag>
  )
}
