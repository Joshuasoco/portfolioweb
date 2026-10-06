import { About } from './components/About.jsx'
import { Certifications } from './components/Certifications.jsx'
import { Contact, Footer } from './components/Contact.jsx'
import HeroSectionBlock from './components/arc/blocks/hero-section/hero-section'
import { Nav } from './components/Nav.jsx'
import { Projects } from './components/Projects.jsx'
import { Skills } from './components/Skills.jsx'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <div id="top">
          <HeroSectionBlock />
        </div>
        <Projects />
        <About />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
