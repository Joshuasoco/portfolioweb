import { certifications } from '../data.js'
import { Reveal } from './Reveal.jsx'

export function Certifications() {
  return (
    <section
      className="section section--alt"
      id="certifications"
      aria-labelledby="certs-title"
    >
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Certifications</p>
          <h2 className="section__title" id="certs-title">
            Always learning.
          </h2>
        </Reveal>
        <Reveal as="ul" className="certs">
          {certifications.map((c) => (
            <li className="cert" key={c.title}>
              <span className="cert__title">{c.title}</span>
              <span className="cert__issuer">{c.issuer}</span>
              <span className="cert__kind">{c.kind}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
