import { projects } from '../data.js'
import { ImageSlot } from './ImageSlot.jsx'
import { Reveal } from './Reveal.jsx'

const tones = ['green', 'mint', 'blue', 'amber']

export function Projects() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Selected work</p>
          <h2 className="section__title" id="work-title">
            More things I’ve built.
          </h2>
          <p className="section__lead">
            From fintech for the informal sector to machine learning in
            healthcare: software that solves a real problem for real people.
          </p>
        </Reveal>

        <div className="projects">
          {projects.map((p, i) => (
            <article
              className={`project ${i % 2 ? 'project--flip' : ''}`}
              key={p.id}
            >
              <Reveal className="project__media">
                <ImageSlot
                  src={p.image}
                  alt={`${p.name} screenshot`}
                  hint={`${p.imageHint} · public/images/projects/`}
                  tone={tones[i % tones.length]}
                />
              </Reveal>
              <Reveal className="project__body" delay={100}>
                <p className="project__role">{p.role}</p>
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
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
