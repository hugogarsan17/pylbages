import { Contact } from './components/Contact'
import { About, Details, FAQ, Hero, Process, Projects, Services } from './components/sections'
import { SiteFooter, MobileContactBar } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { useReveal } from './useReveal'

function App() {
  useReveal()
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Details />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter />
      <MobileContactBar />
    </>
  )
}

export default App
