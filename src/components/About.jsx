import { education, languages, profile } from '../data.js'
import { ImageSlot } from './ImageSlot.jsx'
import { Reveal } from './Reveal.jsx'

export function About() {
  return (
    <section
      className="section section--alt"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="container about">
        <Reveal className="about__photo">
          <ImageSlot
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            hint="1200 × 1500 · public/images/"
            ratio="4 / 5"
            tone="neutral"
            portrait
          />
        </Reveal>
        <Reveal className="about__body" delay={100}>
          <p className="eyebrow">About</p>
          <h2 className="section__title" id="about-title">
            Curious by default.
            <br />
            Practical by design.
          </h2>
          <p className="about__text">{profile.summary}</p>

          <dl className="facts">
            <div className="fact">
              <dt>Education</dt>
              <dd>
                <strong>{education.degree}</strong>
                <span>{education.school}</span>
                <span className="muted">{education.period}</span>
              </dd>
            </div>
            <div className="fact">
              <dt>Based in</dt>
              <dd>
                <strong>{profile.location}</strong>
              </dd>
            </div>
            <div className="fact">
              <dt>Languages</dt>
              <dd>
                <strong>{languages.join(' & ')}</strong>
                <span className="muted">Professional proficiency</span>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
