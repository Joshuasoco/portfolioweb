import { education, languages, profile, projects } from '../data.js'
import { ArrowUpRight } from './Icons.jsx'
import { ImageSlot } from './ImageSlot.jsx'

const clak = projects.find((p) => p.id === 'clak')

// Hero and about in one: who I am, what I'm building, and the key facts.
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__text">
          <h1 className="hero__name" id="hero-title">
            {profile.name}
          </h1>
          <p className="hero__intro">
            IT student and web developer in {profile.location}. I build AI agent
            workflows and web apps that are simple to use, like{' '}
            <a href={clak.url} target="_blank" rel="noreferrer">
              {clak.name}
            </a>
            , {clak.tagline.charAt(0).toLowerCase() + clak.tagline.slice(1)}
          </p>

          <div className="hero__actions">
            <a
              className="button button--primary"
              href={`mailto:${profile.email}`}
            >
              Get in touch
            </a>
            <a
              className="hero__link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight width={14} height={14} />
            </a>
            <a
              className="hero__link"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight width={14} height={14} />
            </a>
          </div>
        </div>

        <div className="hero__photo">
          <ImageSlot
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            hint="1200 × 1500 · public/images/"
            ratio="4 / 5"
            tone="neutral"
            portrait
          />
        </div>
      </div>
      <div className="container">
        <dl className="hero__facts">
          <div>
            <dt>Studying</dt>
            <dd>
              BS Information Technology
              <span>{education.school}</span>
              <span>{education.period}</span>
            </dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>
              AI agents &amp; web development
              <span>Prompt engineering, MCP, React</span>
            </dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>
              {languages.join(' & ')}
              <span>Professional proficiency</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
