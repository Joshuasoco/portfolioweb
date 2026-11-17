import { education, languages, profile } from '../data.js'
import { ArrowUpRight } from './Icons.jsx'
import { ImageSlot } from './ImageSlot.jsx'

// Hero and about in one, laid out as a Figma frame: a full-width name,
// then portrait, intro and key facts in three columns.
// data-build names the layer the cursors select while building it (see Cursors.jsx).
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container frame" data-frame="Portfolio">
        <h1 className="hero__name" id="hero-title" data-build="Heading">
          {profile.name}
        </h1>

        <div className="hero__body">
          <div className="hero__photo" data-build="Portrait">
            <ImageSlot
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              hint="1200 × 1500 · public/images/"
              ratio="4 / 5"
              tone="neutral"
              portrait
            />
          </div>

          <div className="hero__main">
            <p className="hero__intro" data-build="Intro">
              IT student and full stack developer in {profile.location}. I build AI agent
              workflows and web apps that are simple to use. My focus is on combining
              clear interfaces with AI and automation to make everyday tasks easier.
            </p>

            <div className="hero__actions" data-build="Buttons">
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

          <dl className="hero__facts" data-build="Details">
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
                <span>Prompt engineering, RAG, agents, MCP</span>
                <span>React, TypeScript, Python</span>
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
      </div>
    </section>
  )
}
