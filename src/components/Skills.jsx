import { skills } from '../data.js'
import { Reveal } from './Reveal.jsx'

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Toolkit</p>
          <h2 className="section__title" id="skills-title">
            The right tool for the job.
          </h2>
        </Reveal>
        <div className="bento">
          {skills.map((group, i) => (
            <Reveal
              key={group.title}
              className={`tile ${group.span ? `tile--${group.span}` : ''} ${i === 0 ? 'tile--accent' : ''}`}
              delay={(i % 3) * 80}
            >
              <h3 className="tile__title">{group.title}</h3>
              <ul className="tile__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
