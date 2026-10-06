import { profile, projects } from '../data.js'
import { HeroMesh } from './HeroMesh.jsx'

// Mesh points as fractions of the hero (0–1 from the top left) and their reach.
// Colors live in CSS (.hero__mesh), one palette per theme.
const MESH = [
  { x: 0.1, y: 0.88, spread: 0.72 },
  { x: 0.86, y: 0.12, spread: 0.66 },
  { x: 0.16, y: 0.14, spread: 0.56 },
  { x: 0.62, y: 0.62, spread: 0.5 },
  { x: 0.94, y: 0.92, spread: 0.48 },
  { x: 0.44, y: 0.3, spread: 0.34 },
]

export function Hero() {
  return (
    <section className="hero" id="top">
      <HeroMesh
        className="hero__mesh"
        points={MESH}
        grain={0.55}
        speed={0.45}
      />
      <div className="hero__inner">
        <div className="hero__head">
          <p className="hero__eyebrow">
            {profile.name} · {profile.roles.join(', ')}
          </p>
          <h1 className="hero__title">Practical software, powered by AI.</h1>
        </div>

        <div className="hero__row">
          <p className="hero__lead">
            I’m an IT student in {profile.location.split(',')[0]} building AI
            agent workflows and web apps with interfaces that feel effortless.
          </p>
          <div className="hero__cta">
            <div className="hero__actions">
              <a href="#work" className="button button--primary">
                View my work
              </a>
              <a href="#contact" className="button button--glass">
                Get in touch
              </a>
            </div>
            <p className="hero__fine">
              <span className="hero__dot" aria-hidden="true" />
              Open to opportunities
            </p>
          </div>
        </div>

        <nav className="hero__projects" aria-label="Projects">
          <p>Recent projects</p>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>{p.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
