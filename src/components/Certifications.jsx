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
            <li className={`cert${c.image ? '' : ' cert--text'}`} key={c.title}>
              {c.image && (
                <a
                  className="cert__preview"
                  href={c.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${c.title} certificate (opens in a new tab)`}
                >
                  <img
                    src={c.thumbnail ?? c.image}
                    alt={`${c.title} certificate awarded to Joshua Co`}
                    width="480"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="cert__view">View certificate <span aria-hidden="true">↗</span></span>
                </a>
              )}
              <div className="cert__details">
                <div className="cert__copy">
                  <span className="cert__title">{c.title}</span>
                  <span className="cert__issuer">{c.issuer}</span>
                </div>
                <span className="cert__kind">{c.kind}</span>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
