import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactChannels from '../components/contact/ContactChannels.jsx'
import ContactForm from '../components/contact/ContactForm.jsx'
import { ClipperExperience } from './AboutPage.jsx'
import { hairstyles } from '../data/hairstyles.js'
import { serviceCatalog } from '../data/services.js'
import './ContactPage.css'

gsap.registerPlugin(ScrollTrigger)
export default function ContactPage() {
  const page = useRef(null)
  const [searchParams] = useSearchParams()
  const selectedStyle = hairstyles.find(({ id }) => id === searchParams.get('style'))
  const selectedService = serviceCatalog.find(({ id }) => id === searchParams.get('service'))
  const inquiryType = searchParams.get('mode') ?? ''
  const clipperParts = useRef({})
  const [powered, setPowered] = useState(false)
  const [clipperSceneReady, setClipperSceneReady] = useState(false)
  const [activePart, setActivePart] = useState('blade')
  const [menuOpen, setMenuOpen] = useState(false)

  const inspectClipper = (part) => {
    if (part === 'power') setPowered((value) => !value)
    setActivePart(part)
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      if (reduceMotion) return
      gsap.from('.contact-intro > *, .contact-form, .contact-hero-visual', { y: 14, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
      gsap.from('.channel-card', { y: 10, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.contact-channel-grid', start: 'top 88%' } })
    }, page)
    return () => context.revert()
  }, [])

  return <div className="contact-page" ref={page}>
    <header className="contact-nav">
      <Link to="/" className="contact-brand">SARUM CUT<span>®</span></Link>
      <nav className="contact-desktop-nav" aria-label="Main navigation">
        <Link to="/">HOME</Link><Link to="/services">SERVICES</Link><Link to="/about">ABOUT</Link><Link to="/contact" aria-current="page">CONTACT</Link>
      </nav>
      <button className="contact-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="contact-mobile-nav">{menuOpen ? 'CLOSE −' : 'MENU +'}</button>
      <Link to="/login" className="contact-book">LOGIN <span>↗</span></Link>
      {menuOpen && <nav className="contact-mobile-nav" id="contact-mobile-nav" aria-label="Mobile navigation">
        <Link to="/" onClick={() => setMenuOpen(false)}>HOME <span>↗</span></Link><Link to="/services" onClick={() => setMenuOpen(false)}>SERVICES <span>↗</span></Link><Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT <span>↗</span></Link><Link to="/contact" aria-current="page" onClick={() => setMenuOpen(false)}>CONTACT <span>↗</span></Link><Link to="/login" onClick={() => setMenuOpen(false)}>LOGIN <span>↗</span></Link>
      </nav>}
    </header>

    <main>
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero-grid" aria-hidden="true" />
        <div className="contact-hero-copy">
          <div className="contact-intro">
            <span className="contact-eyebrow"><i /> SARUM CUT / LAGOS</span>
            <h1 id="contact-title">LET’S<br /><em>CONNECT.</em></h1>
            <p>Ready for a fresh cut? Book your visit or send us a message. We’re based in Lagos and happy to help.</p>
            <div className="contact-intro-foot"><span>YOUR NEXT VISIT STARTS HERE</span><span>01 — 02</span></div>
          </div>
          <ContactForm selectedStyleName={selectedStyle?.name ?? ''} inquiryType={inquiryType} inquiryTitle={selectedService?.title ?? ''} />
        </div>
        <div className="contact-hero-visual">
          <div className="contact-clipper-halo" aria-hidden="true" />
          <div className="contact-clipper-scene"><ClipperExperience partsRef={clipperParts} onInspect={inspectClipper} powered={powered} cameraDistance={4.7} onReady={() => setClipperSceneReady(true)} />{!clipperSceneReady && <div className="scene-skeleton" role="status" aria-label="Loading interactive clipper"><span /><i /><b /></div>}</div>
          <div className="contact-clipper-caption"><span><i /> INTERACTIVE CLIPPER</span><small>{powered ? 'POWER ON' : `INSPECT THE ${activePart.toUpperCase()}`}</small></div>
        </div>
        <div className="contact-scroll-cue"><i /> SCROLL TO EXPLORE</div>
      </section>

      <ContactChannels />

      <section className="contact-availability">
        <div className="availability-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div><span className="contact-eyebrow">03 / FIND THE SHOP</span><h2>SEE YOU<br /><em>IN LAGOS.</em></h2><p>We’re here to help you get the right cut and plan your visit. Send us a note or head straight to booking.</p></div>
        <span className="availability-status"><i /> LAGOS, NIGERIA</span>
      </section>
    </main>

    <footer className="contact-footer"><Link to="/" className="contact-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><Link to="/book-now">BOOK A CHAIR ↗</Link></footer>
  </div>
}
