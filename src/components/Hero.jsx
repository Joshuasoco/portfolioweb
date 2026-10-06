import { profile } from '../data.js'
import { ChevronRight } from './Icons.jsx'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <p className="hero__status">
          <span className="hero__dot" aria-hidden="true" />
          Open to opportunities · {profile.location}
        </p>
        <h1 className="hero__title">{profile.name}.</h1>
        <p className="hero__roles">
          {profile.roles.map((role, i) => (
            <span key={role}>
              {role}
              {i < profile.roles.length - 1 && (
                <span className="hero__sep" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>
        <p className="hero__lead">
          I build practical, AI-powered software, with interfaces that feel
          effortless.
        </p>
        <div className="hero__actions">
          <a href="#work" className="button button--primary">
            View my work
          </a>
          <a href="#contact" className="link-arrow">
            Get in touch <ChevronRight width={16} height={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
