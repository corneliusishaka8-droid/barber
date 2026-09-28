import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import * as THREE from 'three'
import WorkPage from './pages/WorkPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function ScrollToRouteTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function HomeNavLink({ className, children, onClick }) {
  const location = useLocation()
  return <Link to="/" className={className} onClick={(event) => {
    onClick?.(event)
    if (!event.defaultPrevented && location.pathname === '/') {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }}>{children}</Link>
}

function Chair() {
  const group = useRef()
  const seat = useRef()
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += (state.pointer.x * 0.16 - group.current.rotation.y) * delta * 1.3
    group.current.rotation.x += (-state.pointer.y * 0.045 - group.current.rotation.x) * delta
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.035
  })
  const leather = new THREE.MeshStandardMaterial({ color: '#201b18', roughness: 0.3, metalness: 0.12 })
  const brass = new THREE.MeshStandardMaterial({ color: '#a67d4c', metalness: 0.82, roughness: 0.23 })
  const black = new THREE.MeshStandardMaterial({ color: '#0c0c0d', metalness: 0.7, roughness: 0.26 })
  return <group ref={group} position={[0, -0.65, 0]} scale={1.05}>
    <mesh position={[0, -0.35, 0]} material={black}><cylinderGeometry args={[0.48, 0.52, 0.12, 48]} /></mesh>
    <mesh position={[0, -0.12, 0]} material={brass}><cylinderGeometry args={[0.12, 0.16, 0.38, 32]} /></mesh>
    <mesh position={[0, 0.05, 0]} material={black}><cylinderGeometry args={[0.36, 0.36, 0.08, 40]} /></mesh>
    <mesh ref={seat} position={[0, 0.24, 0]} material={leather}><boxGeometry args={[1.12, 0.25, 0.88, 4, 2, 4]} /></mesh>
    <mesh position={[0, 0.87, -0.23]} rotation={[-0.12, 0, 0]} material={leather}><boxGeometry args={[1.08, 1.08, 0.24, 4, 4, 2]} /></mesh>
    <mesh position={[0, 1.47, -0.24]} material={leather}><boxGeometry args={[0.82, 0.35, 0.27, 4, 2, 2]} /></mesh>
    {[-1, 1].map((side) => <group key={side} position={[side * 0.68, 0.37, 0]}>
      <mesh position={[0, 0.02, 0]} material={brass}><boxGeometry args={[0.09, 0.13, 0.9]} /></mesh>
      <mesh position={[0, 0.16, -0.19]} material={leather}><boxGeometry args={[0.16, 0.28, 0.48]} /></mesh>
      <mesh position={[0, -0.1, 0.42]} material={brass}><cylinderGeometry args={[0.035, 0.035, 0.35, 16]} /></mesh>
    </group>)}
    <mesh position={[0, 0.92, -0.39]} material={brass}><boxGeometry args={[0.04, 1.03, 0.035]} /></mesh>
    <mesh position={[0, 0.25, 0.51]} material={brass}><boxGeometry args={[0.68, 0.045, 0.05]} /></mesh>
    <mesh position={[0, -0.04, 0]} material={black}><cylinderGeometry args={[0.045, 0.045, 0.52, 16]} /></mesh>
  </group>
}

function Scene() {
  return <Canvas dpr={[1, 1.6]} camera={{ position: [0, 1.1, 6], fov: 35 }} gl={{ antialias: true, alpha: true }}>
    <color attach="background" args={['#090909']} />
    <ambientLight intensity={0.45} />
    <spotLight position={[3, 6, 3]} intensity={100} angle={0.38} penumbra={0.8} color="#f3c990" />
    <pointLight position={[-3, 1, 2]} intensity={18} color="#d78b49" />
    <Suspense fallback={null}><Float speed={1.2} rotationIntensity={0.035} floatIntensity={0.15}><Chair /></Float><Environment preset="city" /></Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#080808" metalness={0.42} roughness={0.24} /></mesh>
    <ContactShadows position={[0, -1.03, 0]} opacity={0.55} scale={8} blur={2.5} far={4} />
  </Canvas>
}

const services = [
  ['01', 'THE SIGNATURE CUT', 'A considered cut, shaped to your character.', '₦18,000', '✂'],
  ['02', 'SKIN FADE', 'Clean transitions. Uncompromising precision.', '₦15,000', '◒'],
  ['03', 'BEARD DESIGN', 'Sculpted lines and a finish that lasts.', '₦10,000', '⌁'],
  ['04', 'THE FULL RITUAL', 'Cut, beard, hot towel and a moment to reset.', '₦28,000', '✳'],
]
const photos = [
  ['photo-1503951914875-452162b0f3f1', 'The ritual'], ['photo-1621605815971-fbc98d665033', 'Precision'], ['photo-1622286342621-4bd786c2447c', 'The details'], ['photo-1599351431202-1e0f0137899a', 'The finish'],
]
function Photo({ id, className = '', label }) {
  return <div className={`photo ${className}`} role="img" aria-label={label} style={{ backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,.48)), url(https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82)` }} />
}

function LandingPage() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeStyle, setActiveStyle] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [cursorActive, setCursorActive] = useState(false)
  const root = useRef(null)
  const cursorRef = useRef(null)
  const videoRef = useRef(null)
  const chairRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis
    if (!reduced) {
      lenis = new Lenis({ duration: 0.52, smoothWheel: true, wheelMultiplier: 1.35, touchMultiplier: 1.2 })
      lenis.on('scroll', ScrollTrigger.update)
      const ticker = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
      return () => { gsap.ticker.remove(ticker); lenis.destroy() }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setProgress((p) => {
      const next = Math.min(p + 2 + Math.random() * 7, 100)
      if (next === 100) clearInterval(timer)
      return next
    }), 42)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress < 100) return
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [progress])

  useEffect(() => {
    // The loader is decorative; it must never block access to the page.
    const failsafe = setTimeout(() => {
      setProgress(100)
      setLoading(false)
    }, 2500)
    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 80, opacity: 0, duration: 1.2, stagger: 0.13, ease: 'power4.out', delay: 0.2 })
      gsap.from('.hero-note', { opacity: 0, y: 20, duration: 1, delay: 0.85 })
      gsap.to('.hero-copy', { yPercent: -36, opacity: 0.25, scale: 0.91, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-stage', { scale: 1.1, yPercent: 12, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.utils.toArray('.reveal').forEach((el) => gsap.from(el, { y: 55, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } }))
      gsap.utils.toArray('.gallery .photo').forEach((el, i) => gsap.to(el, { y: i % 2 ? -50 : 38, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } }))
      gsap.from('.stat-number', { textContent: 0, duration: 2, snap: { textContent: 1 }, ease: 'power2.out', stagger: 0.2, scrollTrigger: { trigger: '.about', start: 'top 70%' } })
      ScrollTrigger.create({ trigger: '.film', start: 'top top', end: '+=1300', pin: true, scrub: true, onUpdate: (self) => {
        const video = videoRef.current
        if (video?.duration && Number.isFinite(video.duration)) video.currentTime = self.progress * video.duration
        gsap.set('.film-frame', { scale: 0.82 + self.progress * 0.18 })
        gsap.set('.film-title', { opacity: 1 - Math.min(self.progress * 3, 1), y: -self.progress * 80 })
        gsap.set('.film-caption', { opacity: Math.max(0, (self.progress - 0.78) * 4.5) })
      } })
      ScrollTrigger.create({ trigger: '.styles', start: 'top top', end: '+=1050', pin: '.styles-inner', scrub: true, onUpdate: (self) => {
        const nextStyle = Math.min(4, Math.floor(self.progress * 5))
        setActiveStyle((current) => current === nextStyle ? current : nextStyle)
      } })
      const servicesTrack = document.querySelector('.services-track')
      if (window.matchMedia('(min-width: 800px)').matches && servicesTrack) {
        gsap.to(servicesTrack, { x: () => -(servicesTrack.scrollWidth - window.innerWidth), ease: 'none', scrollTrigger: { trigger: '.services', start: 'top top', end: () => `+=${servicesTrack.scrollWidth - window.innerWidth}`, pin: true, scrub: true, invalidateOnRefresh: true } })
      }
    }, root)
    const header = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', header, { passive: true })
    return () => { ctx.revert(); window.removeEventListener('scroll', header) }
  }, [loading])

  useEffect(() => {
    const setX = gsap.quickTo(cursorRef.current, 'x', { duration: 0.28, ease: 'power3.out' })
    const setY = gsap.quickTo(cursorRef.current, 'y', { duration: 0.28, ease: 'power3.out' })
    const move = (event) => { setX(event.clientX); setY(event.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const toggleMenu = () => setMenuOpen((open) => !open)
  const closeMenu = () => setMenuOpen(false)
  const hoverProps = { onMouseEnter: () => setCursorActive(true), onMouseLeave: () => setCursorActive(false) }
  return <div className="site" ref={root}>
    <div className={`loader ${loading ? '' : 'loader--out'}`} aria-hidden={!loading}><span className="loader-word">SARUM CUT</span><span className="loader-count">{String(Math.floor(progress)).padStart(2, '0')}<small> / 100</small></span><div className="loader-line"><i style={{ width: `${progress}%` }} /></div><span className="loader-caption">PREPARING THE EXPERIENCE</span><button className="loader-enter" onClick={() => { setProgress(100); setLoading(false) }}>ENTER EXPERIENCE <span>↗</span></button></div>
    <div ref={cursorRef} className={`cursor ${cursorActive ? 'cursor--active' : ''}`} aria-hidden="true"><span>VIEW</span></div>
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <HomeNavLink className="brand" onClick={closeMenu}>SARUM CUT<span>®</span></HomeNavLink>
      <nav className="nav-links" aria-label="Main navigation"><HomeNavLink>HOME</HomeNavLink><Link to="/services">SERVICES</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></nav>
      <Link className="nav-book" to="/booking">BOOK A CHAIR <span>↗</span></Link>
      <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}><i /><i /></button>
    </header>
    <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}><span className="menu-label">NAVIGATE</span><HomeNavLink onClick={closeMenu}><small>01</small>HOME<span>↗</span></HomeNavLink>{[['SERVICES','/services'],['ABOUT','/about'],['CONTACT','/contact']].map(([name, href],i)=><Link key={name} to={href} onClick={closeMenu}><small>0{i+2}</small>{name}<span>↗</span></Link>)}<p>LAGOS · NIGERIA<br/>OPEN DAILY 09:00—20:00</p></div>

    <main>
      <section className="hero" id="home">
        <div className="hero-stage" ref={chairRef}><Scene /></div>
        <div className="hero-vignette" />
        <div className="hero-topline"><span>EST. MMXIV — LAGOS, NG</span><span>CRAFTED FOR THE INDIVIDUAL</span></div>
        <div className="hero-copy"><p className="eyebrow"><i /> THE MODERN BARBERSHOP</p><h1>THE CRAFT<br/>OF <em>PRECISION</em><b>.</b></h1><div className="hero-bottom"><p>More than a cut.<br/>A study in who you are.</p><a href="#intro" className="round-link" aria-label="Scroll to discover">↓</a><span className="hero-index">01 / 06</span></div></div>
        <div className="hero-note"><span className="note-line" /> SCROLL TO ENTER</div>
      </section>

      <section className="intro section-pad" id="intro"><div className="section-kicker reveal"><span>01 — OUR PHILOSOPHY</span><span>MADE BY HAND. NEVER BY HABIT.</span></div><div className="intro-content reveal"><p className="intro-overline">THE DETAILS ARE THE DIFFERENCE</p><h2>A GOOD CUT CHANGES<br/>MORE THAN <em>YOUR LOOK.</em></h2><div className="intro-bottom"><p>It changes the way you carry yourself. Every line, every blend, every final touch is considered. This is the craft of precision — and your time in our chair is where it begins.</p><a href="#about" className="text-link">GET TO KNOW US <span>↗</span></a></div></div></section>

      <section className="film" id="work"><div className="film-backdrop" /><div className="film-heading"><span className="eyebrow">A CLOSER LOOK AT THE CRAFT</span><h2 className="film-title">PRECISION<br/><em>IN MOTION</em></h2></div><div className="film-frame"><video ref={videoRef} muted playsInline preload="metadata" poster="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1800&q=85" aria-label="Cinematic barber at work"><source src="/videos/haircut.mp4" type="video/mp4" /></video><div className="video-placeholder"><span>01 — THE RITUAL</span></div></div><div className="film-caption"><span>THE RESULT</span><span>EVERY MOVEMENT, INTENTIONAL.</span></div><span className="film-scroll">SCROLL TO REVEAL · 00—100</span></section>

      <section className="styles" aria-label="Haircut styles"><div className="styles-inner"><div className="styles-visual"><div className="portrait-frame"><Photo id="photo-1503951914875-452162b0f3f1" label="Portrait of a fresh modern haircut"/><span className="portrait-index">STYLE STUDY / 0{activeStyle+1}</span><span className="portrait-cross">+</span></div><div className="style-orbit">BARBER · PRECISION · BARBER · PRECISION ·</div></div><div className="styles-copy"><p className="eyebrow">02 — THE FINISH</p><span className="style-number">0{Math.min(activeStyle+1,5)}</span><h2>{['LONG','MEDIUM','TAPER','FADE','FINISHED'][activeStyle]}</h2><p className="style-desc">Every style begins with a conversation. We find the shape that feels like you, then make every detail count.</p><div className="style-steps">{['LONG','MEDIUM','TAPER','FADE','FINISHED'].map((s,i)=><span key={s} className={activeStyle===i?'active':''}>{`0${i+1}`}<i>{s}</i></span>)}</div><span className="drag-cue">↔ &nbsp; DRAG TO EXPLORE</span></div></div></section>

      <section className="services" id="services"><div className="services-track"><div className="service-intro"><span className="eyebrow">03 — THE MENU</span><h2>MADE TO<br/>BE <em>YOURS.</em></h2><p>Four ways to leave feeling more like yourself.</p><span className="side-note">OUR SERVICES · 2026</span></div>{services.map(([number,title,description,price,icon])=><article className="service-panel" key={number}><div className="service-top"><span>{number} / 04</span><span>{icon}</span></div><div><h3>{title}</h3><p>{description}</p></div><div className="service-bottom"><strong>{price}</strong><a href="#booking" className="service-book">BOOK <span>↗</span></a></div><span className="service-watermark">{number}</span></article>)}</div></section>

      <section className="about section-pad" id="about"><div className="section-kicker reveal"><span>04 — THE BARBER</span><span>THE HAND BEHIND THE WORK</span></div><div className="about-grid"><div className="about-image reveal"><Photo id="photo-1503951914875-452162b0f3f1" label="Master barber in his studio"/><span className="image-caption">ADE — FOUNDER & MASTER BARBER</span><span className="image-count">LAGOS / NIGERIA</span></div><div className="about-copy reveal"><p className="eyebrow">A PERSONAL APPROACH</p><h2>MASTER<br/>THE<br/><em>CRAFT.</em></h2><p className="about-text">“The best haircut isn’t the one that gets noticed. It’s the one that feels like it was always yours.”</p><div className="stats"><div><strong className="stat-number">12</strong><span>YEARS OF EXPERIENCE</span></div><div><strong className="stat-number">500</strong><span>CLIENTS & COUNTING</span></div></div><a href="#contact" className="text-link">A LITTLE MORE ABOUT US <span>↗</span></a></div></div></section>

      <section className="gallery section-pad"><div className="section-kicker reveal"><span>05 — SELECTED MOMENTS</span><span>THE WORK SPEAKS</span></div><div className="gallery-head reveal"><h2>IN GOOD<br/><em>COMPANY.</em></h2><p>A few moments from the chair.<br/>More on the gram <a href="https://instagram.com" target="_blank" rel="noreferrer">@barber.studio ↗</a></p></div><div className="gallery-grid">{photos.map(([id,label],i)=><figure key={id} className={`gallery-item item-${i+1}`}><Photo id={id} label={label}/><figcaption><span>0{i+1} — {label.toUpperCase()}</span><span>↗</span></figcaption></figure>)}</div></section>

      <section className="booking" id="booking"><div className="booking-text"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>YOUR CHAIR<br/>IS <em>WAITING.</em></h2><p className="booking-sub">A considered cut is one conversation away.</p><a href="https://wa.me/2348000000000" className="booking-link" {...hoverProps}><span>BOOK YOUR APPOINTMENT</span><i>↗</i></a></div><div className="booking-chair"><Scene /></div><span className="booking-mark">B<span>®</span></span></section>
    </main>
    <footer id="contact"><div className="footer-main"><Link className="footer-brand" to="/">SARUM CUT<span>®</span></Link><div className="footer-motto">THE CRAFT OF PRECISION.<br/><span>THE COMFORT OF YOUR OWN CHAIR.</span></div><a href="https://maps.google.com/?q=Lagos+Nigeria" target="_blank" rel="noreferrer" className="footer-address">LAGOS, NIGERIA <span>↗</span></a></div><div className="footer-lower"><span>© 2026 SARUM CUT STUDIO</span><div><a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TIKTOK ↗</a><a href="mailto:hello@barber.studio">EMAIL ↗</a></div><HomeNavLink>BACK TO HOME ↑</HomeNavLink></div></footer>
  </div>
}

function App() {
  return <>
    <ScrollToRouteTop />
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/work" element={<WorkPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="*" element={null} />
    </Routes>
  </>
}

export default App
