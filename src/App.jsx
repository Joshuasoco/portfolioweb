import { Certifications } from './components/Certifications.jsx'
import { useRef } from 'react'
import { CommandMenu } from './components/CommandMenu.jsx'
import { Contact, Footer } from './components/Contact.jsx'
import { Cursors } from './components/Cursors.jsx'
import { Hero } from './components/Hero.jsx'
import { Layers } from './components/Layers.jsx'
import { Nav } from './components/Nav.jsx'
import { Projects } from './components/Projects.jsx'
import { Reactions } from './components/Reactions.jsx'
import { Skills } from './components/Skills.jsx'
import { Toolbar } from './components/Toolbar.jsx'
import { YouCursor } from './components/YouCursor.jsx'
import './App.css'

function App() {
  const pageRef = useRef(null)
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <div className="page" ref={pageRef}>
        <main id="main">
          <Hero />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </main>
        <Footer />
        <Cursors pageRef={pageRef} />
      </div>
      <Layers />
      <Toolbar />
      <CommandMenu />
      <Reactions />
      <YouCursor />
    </>
  )
}

export default App
