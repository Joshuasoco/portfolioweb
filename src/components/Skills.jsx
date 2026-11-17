import { skills } from '../data.js'
import { Reveal } from './Reveal.jsx'

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container frame" data-frame="Skills">
        <Reveal className="section__head" layer="Section header">
          <h2 className="section__title" id="skills-title">
            The right tool for the job.
          </h2>
        </Reveal>
        <div className="bento">
          {skills.map((group, i) => (
            <Reveal
              key={group.title}
              className={`tile ${group.span ? `tile--${group.span}` : ''} ${i === 0 ? 'tile--accent' : ''}`}
              layer={group.title}
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
