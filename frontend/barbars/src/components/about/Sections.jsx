import { Link } from 'react-router-dom'
import { detailCopy, toolCopy } from './content.js'

export function AboutHero({ scene }) {
  return <section className="about-hero"><div className="about-hero-glow" /><div className="about-hero-scene">{scene}</div><div className="about-hero-index"><span>SARUM CUT — LAGOS</span><span>AN INDEPENDENT PRACTICE IN PRECISION</span></div><div className="about-hero-title"><span className="line">BEHIND</span><span className="line serif">THE</span><span className="line">CRAFT<span className="gold-dot">.</span></span></div><div className="about-hero-foot"><p>Every cut has a story.<br/>Every detail has a purpose.</p><a href="#the-tool" aria-label="Scroll to explore">↓</a><span>SCROLL TO ENTER</span></div></section>
}

export function ClipperSection({ scene, activePart, powered, interacted }) {
  return <section className="clipper-experience" id="the-tool"><div className="clipper-heading"><span className="about-eyebrow">01 — THE TOOL</span><span className="clipper-edition">PRECISION SERIES / 01</span></div><div className="clipper-stage"><div className="clipper-canvas">{scene}</div><div className="clipper-crosshair">+</div><div className="clipper-copy"><span className="clipper-copy-index">SARUM CUT / 001</span><h1>BUILT FOR<br/><em>THE HAND.</em></h1><p>A professional tool is an extension of the person holding it. Balanced. Reliable. Ready for the next detail.</p><span className="clipper-drag-hint">{interacted ? 'OBJECT SELECTED' : 'DRAG TO ROTATE · TAP A PART TO INSPECT'}</span></div><div className="clipper-detail"><span className="detail-index">COMPONENT / 0{['blade','lever','power','body'].indexOf(activePart)+1}</span><h2>{detailCopy[activePart][0]}</h2><p>{detailCopy[activePart][1]}</p><span className={`power-status ${powered ? 'is-on' : ''}`}>{powered ? '● POWER ON' : activePart === 'power' ? '○ POWER OFF' : 'INTERACTIVE STUDY'}</span></div><div className="clipper-explode-labels"><span>01 — BLADE</span><span>02 — MOTOR</span><span>03 — BODY</span><span>04 — LEVER</span></div></div><span className="clipper-scroll-hint">SCROLL TO DISASSEMBLE &nbsp; ↓</span></section>
}

export function WorkshopSection({ scene, selectedTool, setSelectedTool }) {
  return <section className="workshop-section"><div className="workshop-head about-reveal"><div><span className="about-eyebrow">02 — THE WORKBENCH</span><h2>TOOLS WITH<br/><em>A PURPOSE.</em></h2></div><p>Every instrument earns its place.<br/>Choose one to take a closer look.</p></div><div className="workshop-canvas">{scene}<span className="workshop-canvas-label">TABLE STUDY / 04:32 PM</span><span className="workshop-select-hint">TAP AN OBJECT TO EXPLORE</span></div><div className="tool-detail about-reveal"><span>SELECTED INSTRUMENT / 0{['CLIPPER','SCISSORS','COMB','RAZOR','BRUSH'].indexOf(selectedTool)+1}</span><div><h3>{toolCopy[selectedTool][0]}</h3><p>{toolCopy[selectedTool][1]}</p></div><button onClick={() => setSelectedTool('CLIPPER')}>RESET VIEW ↗</button></div></section>
}

export function ChairSection({ scene, chairTurned, setChairTurned }) {
  return <section className="chair-section"><div className="chair-scene">{scene}</div><div className="chair-shade" /><div className="chair-copy about-reveal"><span className="about-eyebrow">03 — THE CHAIR</span><p className="chair-overline">WHERE THE TRANSFORMATION BEGINS</p><h2>EVERY CLIENT<br/>GETS THE <em>CHAIR.</em></h2><p>Every client gets the attention.</p><button className="chair-turn" onClick={() => setChairTurned(!chairTurned)}>{chairTurned ? 'RETURN TO THE ROOM' : 'TURN THE CHAIR'} <span>↗</span></button></div>{chairTurned && <div className="chair-quote">TIME SET ASIDE.<br/>ATTENTION FULLY GIVEN.</div>}</section>
}

export function PhilosophySection() {
  return <section className="philosophy-section"><span className="about-eyebrow about-reveal">04 — WHAT WE BELIEVE</span><h2 className="belief-heading"><span>MORE THAN</span><span>A <em>HAIRCUT.</em></span></h2><div className="belief-bottom"><p>We believe a great haircut is more than appearance. It is <span>precision.</span> <span>confidence.</span> <span>craft.</span> <span>character.</span></p><span className="belief-mark">THE SARUM CUT POINT OF VIEW / 2026</span></div></section>
}

export function StorySection() {
  return <section className="story-section"><div className="story-portrait"><div className="portrait-image" role="img" aria-label="Portrait of a Lagos barber" /><div className="portrait-caption"><span>ADE / FOUNDER & MASTER BARBER</span><span>LAGOS, NIGERIA — 06°27' N</span></div><span className="portrait-number">01</span></div><div className="story-copy about-reveal"><span className="about-eyebrow">05 — THE STORY</span><h2>A CRAFT<br/>LEARNED <em>BY HAND.</em></h2><p>It started with a chair, a set of well-used tools, and a belief that the small things deserved just as much care as the big ones.</p><p>Over the years, the work became a practice. A conversation before the first cut. A steady hand through every line. A little more time spent getting the shape right.</p><p>Now, the chair is a place to pause, reset, and leave feeling more like yourself. That is the measure we come back to, every day.</p><Link to="/booking" className="about-text-link">MEET US IN THE CHAIR <span>↗</span></Link></div></section>
}

export function TimelineSection() {
  const milestones = [['2018','THE BEGINNING','One chair. One point of view.'],['2020','THE CRAFT','A practice built around the details.'],['2023','THE COMMUNITY','A room that feels like your own.'],['2026','THE NEXT CHAPTER','The same care. A wider horizon.']]
  return <section className="story-timeline"><div className="timeline-heading about-reveal"><span className="about-eyebrow">06 — THE YEARS IN BETWEEN</span><h2>STILL <em>IN THE MAKING.</em></h2></div><div className="timeline-track"><div className="timeline-line"><i className="timeline-progress" /></div>{milestones.map(([year,title,copy],i)=><article className="timeline-item about-reveal" key={year}><span className="timeline-dot">0{i+1}</span><strong>{year}</strong><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
}

export function StatsSection() {
  const statistics = [['10','YEARS OF EXPERIENCE'],['5000','CLIENTS IN THE CHAIR'],['20','SIGNATURE STYLES'],['100','ATTENTION TO DETAIL']]
  return <section className="about-stat-section"><div className="about-stat-grid">{statistics.map(([value,label],i)=><div className="about-stat" key={label}><strong className="about-stat-value">{value}</strong><span>{label}</span>{i===1&&<small>+</small>}</div>)}</div><span className="stat-section-note">NOT NUMBERS FOR THE WALL. YEARS IN THE WORK.</span></section>
}

export function MirrorSection() {
  return <section className="mirror-section"><div className="mirror-copy about-reveal"><span className="about-eyebrow">07 — THE MIRROR</span><h2>THE REFLECTION<br/>IS <em>ALL YOURS.</em></h2><p>YOUR STYLE. &nbsp; YOUR IDENTITY. &nbsp; YOUR CHOICE.</p></div><div className="mirror-object"><div className="mirror-frame"><div className="mirror-glass"><span className="mirror-reflection">YOUR STYLE<br/>YOUR IDENTITY<br/>YOUR CHOICE</span></div></div><span className="mirror-base" /></div></section>
}

export function FinalSection() {
  return <section className="about-final"><span className="about-eyebrow">THE TOOLS ARE READY.</span><h2 className="final-words"><span>TOOLS ARE</span><span>JUST <em>TOOLS.</em></span><span>THE CRAFT IS IN</span><span>THE HANDS THAT USE THEM.</span></h2><Link to="/booking" className="about-book-link">BOOK YOUR CHAIR <span>↗</span></Link></section>
}

export function AboutFooter() {
  return <footer className="about-footer"><Link to="/">SARUM CUT<span>®</span></Link><span>BEHIND THE CRAFT · LAGOS, NG</span><Link to="/">BACK TO HOME ↑</Link></footer>
}
