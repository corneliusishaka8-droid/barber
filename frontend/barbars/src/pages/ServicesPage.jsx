import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { hairstyles, hairstyleCategories } from '../data/hairstyles.js'
import { homeServiceSteps, serviceBenefits, serviceCatalog, serviceModes } from '../data/services.js'
import './ServicesPage.css'

const formatNaira = (amount) => `₦${new Intl.NumberFormat('en-NG').format(amount)}`
const formatDollar = (amount) => `$${new Intl.NumberFormat('en-US').format(amount)}`

function ServiceNav({ menuOpen, setMenuOpen }) {
  const close = () => setMenuOpen(false)
  return <header className="services-nav">
    <Link to="/" className="services-brand" onClick={close}>SARUM CUT<span>®</span></Link>
    <nav className={menuOpen ? 'is-open' : ''} aria-label="Main navigation">
      <Link to="/">HOME</Link><Link to="/services" aria-current="page" onClick={close}>SERVICES</Link><Link to="/about" onClick={close}>ABOUT</Link><Link to="/contact" onClick={close}>CONTACT</Link>
    </nav>
    <Link to="/login" className="services-nav-book">LOGIN <span>↗</span></Link>
    <button type="button" className="services-menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'CLOSE −' : 'MENU +'}</button>
  </header>
}

function Price({ style, compact = false }) {
  return <span className={`style-price${compact ? ' is-compact' : ''}`}>
    <strong>{formatNaira(style.priceNGN)}</strong><span>{formatDollar(style.priceUSD)}</span>
  </span>
}

function SkeletonImage({ src, alt, className = '', loading = 'lazy' }) {
  const [loaded, setLoaded] = useState(false)
  return <span className={`services-image-skeleton ${className}${loaded ? ' is-loaded' : ''}`}>
    {!loaded && <span className="services-image-shimmer" aria-hidden="true" />}
    <img className="services-loaded-image" src={src} alt={alt} loading={loading} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
  </span>
}

function StyleStudio({ selected, setSelected, selectedCategory, setSelectedCategory, studioRef }) {
  const stageRef = useRef(null)
  const filteredStyles = selectedCategory === 'All' ? hairstyles : hairstyles.filter(({ category }) => category === selectedCategory)
  const categories = hairstyleCategories

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('.style-avatar-image', { opacity: 0.25, scale: 0.975 }, { opacity: 1, scale: 1, duration: 0.42, ease: 'power2.out', clearProps: 'transform,opacity' })
      gsap.fromTo('.style-info-content', { opacity: 0.55, y: 8 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform,opacity' })
    }, studioRef)
    return () => context.revert()
  }, [selected.id, studioRef])

  const chooseCategory = (category) => {
    setSelectedCategory(category)
    if (category !== 'All' && selected.category !== category) {
      setSelected(hairstyles.find(({ category: styleCategory }) => styleCategory === category))
    }
  }

  return <section className="hairstyle-studio" aria-labelledby="studio-title" ref={studioRef}>
    <div className="services-section-head"><span className="services-eyebrow">01 / THE STYLE STUDIO</span><span className="services-index">SELECT A LOOK · SEE IT TAKE SHAPE</span></div>
    <div className="studio-heading"><h2 id="studio-title">Find your<br /><em>next shape.</em></h2><p>Explore the cut. See the details.<br />Make it your own.</p></div>
    <div className="studio-layout">
      <article className="style-info" aria-live="polite">
        <div className="style-info-content">
          <span className="style-number">STYLE {selected.number} <i /> {selected.category.toUpperCase()}</span>
          <h3>{selected.name}</h3>
          <p className="style-description">{selected.description}</p>
          <Price style={selected} />
          <div className="style-duration"><span>ESTIMATED SESSION</span><strong>{selected.duration}</strong></div>
          <Link className="services-action services-action--filled" to={`/book-now?style=${selected.id}`} state={{ selectedStyle: selected.name }}>BOOK THIS STYLE <span>↗</span></Link>
        </div>
        <div className="studio-side-note"><span>CONSULTATION INCLUDED</span><span>01 — 08</span></div>
      </article>

      <div className="style-avatar-panel" ref={stageRef}>
        <div className="avatar-grid" aria-hidden="true" />
        <span className="avatar-corner avatar-corner--tl" aria-hidden="true" />
        <span className="avatar-corner avatar-corner--br" aria-hidden="true" />
        <div className="avatar-meta"><span>LIVE STYLE PREVIEW</span><span>{selected.number} / 08</span></div>
        <SkeletonImage key={selected.id} className="style-avatar-image" src={selected.image} alt={`Illustrated model wearing the ${selected.name} hairstyle`} loading="eager" />
        <div className="avatar-footer"><span><i /> STYLE PROFILE / {selected.category.toUpperCase()}</span><span>DRAG TO EXPLORE</span></div>
      </div>

      <div className="style-selector" aria-label="Hairstyle options">
        {filteredStyles.map((style) => <button type="button" key={style.id} className={`style-option${selected.id === style.id ? ' is-selected' : ''}`} aria-pressed={selected.id === style.id} onClick={() => setSelected(style)}>
          <span className="style-option-image"><SkeletonImage src={style.image} alt="" loading={style.id === selected.id ? 'eager' : 'lazy'} /><i>{style.number}</i></span>
          <span className="style-option-copy"><strong>{style.shortName}</strong><small>{style.category.toUpperCase()}</small><Price style={style} compact /></span>
          <span className="style-option-indicator" aria-hidden="true">↗</span>
        </button>)}
      </div>

      <div className="style-categories" aria-label="Filter hairstyles by category">
        <span>FILTER /</span>
        {categories.map((category) => <button type="button" key={category} className={selectedCategory === category ? 'is-active' : ''} aria-pressed={selectedCategory === category} onClick={() => chooseCategory(category)}>{category.toUpperCase()}</button>)}
      </div>
    </div>
  </section>
}

function ServicesMenu() {
  return <section className="services-menu-section" aria-labelledby="services-menu-title">
    <div className="services-section-head"><span className="services-eyebrow">02 / THE MENU</span><span className="services-index">A GOOD CUT IS ONLY THE BEGINNING</span></div>
    <div className="services-menu-heading"><h2 id="services-menu-title">More than<br /><em>a haircut.</em></h2><p>Professional services shaped around your style, hair type, and occasion.</p></div>
    <div className="service-list">{serviceCatalog.map((service) => <article className="service-line" key={service.id}>
      <span className="service-line-number">{service.number}</span><div className="service-line-copy"><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-line-category">{service.category.toUpperCase()}</span><Link to={`/contact?service=${service.id}`} aria-label={`Ask about ${service.title}`}>↗</Link>
    </article>)}</div>
  </section>
}

function ServiceModes() {
  return <section className="service-modes" aria-labelledby="service-modes-title">
    <div className="services-section-head"><span className="services-eyebrow">03 / YOUR SESSION, YOUR WAY</span><span className="services-index">CHOOSE WHERE WE MEET</span></div>
    <div className="service-modes-intro"><h2 id="service-modes-title">In the studio.<br /><em>Or at yours.</em></h2><p>One standard of care, wherever you feel most comfortable.</p></div>
    <div className="service-mode-grid">{Object.values(serviceModes).filter(({ available }) => available).map((mode) => <article className="service-mode-card" key={mode.title}>
      <span className="service-mode-label">{mode.label}</span><span className="service-mode-glyph" aria-hidden="true">{mode.title === 'In studio' ? '⌂' : '↗'}</span>
      <div><h3>{mode.title}</h3><p>{mode.description}</p></div>
      <Link to={`/contact?mode=${mode.title === 'At home' ? 'home-service' : 'studio'}`} className="service-mode-link">{mode.action}<span>↗</span></Link>
    </article>)}</div>
    {serviceModes.home.available && <div className="home-service-process">
      <div><span className="services-eyebrow">HOME SERVICE / FOUR STEPS</span><h3>From your door<br />to the final detail.</h3></div>
      <ol>{homeServiceSteps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
      <p className="home-fee-note">Ask about any travel fee when you share your location. It is confirmed before you book.</p>
    </div>}
  </section>
}

function WhySarum() {
  return <section className="services-why" aria-labelledby="why-title">
    <div className="services-section-head"><span className="services-eyebrow">04 / THE SARUM STANDARD</span><span className="services-index">MADE BY HAND · NEVER BY HABIT</span></div>
    <div className="why-heading"><h2 id="why-title">Good work.<br /><em>Good feeling.</em></h2><p>Small details add up to a style that feels entirely yours.</p></div>
    <div className="benefit-grid">{serviceBenefits.map((benefit) => <article className="benefit-item" key={benefit.number}><span>{benefit.number}</span><h3>{benefit.title}</h3><p>{benefit.description}</p></article>)}</div>
  </section>
}

export default function ServicesPage() {
  const pageRef = useRef(null)
  const studioRef = useRef(null)
  const [selected, setSelected] = useState(hairstyles[0])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('.services-hero-copy > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' })
      gsap.fromTo('.services-hero-meta > *', { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.45, stagger: 0.12, clearProps: 'opacity' })
    }, pageRef)
    return () => context.revert()
  }, [])

  return <div className="services-page" ref={pageRef}>
    <ServiceNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main>
      <section className="services-hero" aria-labelledby="services-title">
        <div className="services-hero-grid" aria-hidden="true" />
        <div className="services-hero-copy"><span className="services-eyebrow"><i /> OUR SERVICES / LAGOS</span><h1 id="services-title">YOUR STYLE.<br /><em>OUR CRAFT.</em></h1><p>From precision cuts to complete styling, discover a look designed around you.</p><a className="hero-discover" href="#style-studio"><span>EXPLORE YOUR STYLE</span><b>↓</b></a></div>
        <div className="services-hero-meta"><span>01 — 05<br /><small>THE SERVICE INDEX</small></span><span>PRECISION / PERSONAL / PROFESSIONAL</span></div>
        <span className="services-hero-orbit" aria-hidden="true">SARUM CUT · LAGOS · YOUR STYLE · SARUM CUT · LAGOS · YOUR STYLE ·</span>
      </section>
      <div id="style-studio"><StyleStudio selected={selected} setSelected={setSelected} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} studioRef={studioRef} /></div>
      <ServicesMenu />
      <ServiceModes />
      <WhySarum />
      <section className="services-cta">
        <span className="services-eyebrow">05 / MAKE IT YOURS</span><h2>Ready for your<br /><em>next look?</em></h2><p>Choose your style and start planning your session.</p>
        <div><Link to={`/book-now?style=${selected.id}`} state={{ selectedStyle: selected.name }} className="services-action services-action--filled">BOOK {selected.shortName} <span>↗</span></Link><Link to="/book-now" className="services-action">CONTACT THE STUDIO <span>↗</span></Link></div>
        <span className="services-cta-index">SARUM CUT® / LAGOS</span>
      </section>
    </main>
    <footer className="services-footer"><Link to="/" className="services-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><Link to="/book-now">BOOK A CHAIR ↗</Link></footer>
  </div>
}
