import { featured } from '../data.js'
import { ArrowUpRight } from './Icons.jsx'
import { ImageSlot } from './ImageSlot.jsx'
import { Reveal } from './Reveal.jsx'
import { TypingDemo } from './TypingDemo.jsx'

export function Clak() {
  return (
    <section
      className="clak surface-dark"
      id="clak"
      aria-labelledby="clak-title"
    >
      <div className="container">
        <Reveal className="clak__head">
          <p className="eyebrow">{featured.eyebrow}</p>
          <h2 className="clak__title" id="clak-title">
            {featured.name}.
          </h2>
          <p className="clak__headline">{featured.headline}</p>
          <p className="clak__desc">{featured.description}</p>
          <div className="clak__actions">
            <a
              href={featured.url}
              className="button button--primary"
              target="_blank"
              rel="noreferrer"
            >
              Visit {featured.urlLabel} <ArrowUpRight width={16} height={16} />
            </a>
            <ul className="chips chips--dark" aria-label="Built with">
              {featured.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="window" delay={120}>
          <div className="window__bar" aria-hidden="true">
            <span className="window__lights">
              <i />
              <i />
              <i />
            </span>
            <span className="window__url">{featured.urlLabel}</span>
          </div>
          <ImageSlot
            src={featured.image}
            alt="Clak typing test screenshot"
            hint={`${featured.imageHint} · public/images/projects/`}
            tone="graphite"
          />
        </Reveal>

        <div className="clak__features">
          {featured.features.map((f, i) => (
            <Reveal key={f.title} className="feature" delay={i * 80}>
              <span className="feature__index">0{i + 1}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="clak__try">
          <div className="clak__try-head">
            <h3>Try a few keys.</h3>
            <p>
              A small taste of Clak, right here. Turn on sound for the clicks.
            </p>
          </div>
          <TypingDemo />
        </Reveal>
      </div>
    </section>
  )
}
