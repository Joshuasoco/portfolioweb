import { profile } from '../data.js'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'

const year = new Date().getFullYear()

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <Reveal className="container contact__inner">
        <p className="eyebrow">Contact</p>
        <h2 className="contact__title" id="contact-title">
          Let’s build something
          <br />
          people love to use.
        </h2>
        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ul className="contact__links">
          <li>
            <a
              className="button button--primary"
              href={`mailto:${profile.email}`}
            >
              <MailIcon width={16} height={16} /> Email me
            </a>
          </li>
          <li>
            <a
              className="button button--ghost"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon width={16} height={16} /> GitHub
            </a>
          </li>
          <li>
            <a
              className="button button--ghost"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon width={16} height={16} /> LinkedIn
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {year} {profile.name}. Designed and built in{' '}
          {profile.location.split(',')[0]}.
        </p>
        <p>
          <a href="#top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}
