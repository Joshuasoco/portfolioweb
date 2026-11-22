import { projects } from '../data.js'
import { ArrowUpRight } from './Icons.jsx'
import { ImageSlot } from './ImageSlot.jsx'
import { Reveal } from './Reveal.jsx'

const tones = ['blue', 'green', 'mint', 'neutral', 'amber']

export function Projects() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container frame" data-frame="Work">
        <Reveal className="section__head" layer="Section header">
          <h2 className="section__title" id="work-title">
            Things I’ve built.
          </h2>
          <p className="section__lead">
            Small tools and bigger systems, built for people to use.
          </p>
        </Reveal>

        <div className="projects">
          {projects.map((p, i) => (
            <article
              className={`project ${i % 2 ? 'project--flip' : ''} ${p.badge ? 'project--side' : ''}`}
              id={p.id}
              key={p.id}
            >
              <Reveal className="project__media" layer="Screenshot">
                <ImageSlot
                  src={p.image}
                  alt={`${p.name} screenshot`}
                  hint={`${p.imageHint} · public/images/projects/`}
                  tone={tones[i % tones.length]}
                />
              </Reveal>
              <Reveal className="project__body" layer={p.name}>
                <p className="project__role">
                  {p.role}
                  {p.badge && <span className="project__badge">{p.badge}</span>}
                </p>
                <h3 className="project__name">{p.name}</h3>
                <p className="project__tagline">{p.tagline}</p>
                {p.metric && (
                  <p className="project__metric">
                    <strong>{p.metric.value}</strong> {p.metric.label}
                  </p>
                )}
                <ul className="project__points">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                {p.note && <p className="project__note">{p.note}</p>}
                <ul className="chips" aria-label="Built with">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.url && (
                  <a
                    className="project__link"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit {p.urlLabel} <ArrowUpRight width={15} height={15} />
                  </a>
                )}
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
