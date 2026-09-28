import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { AboutFooter, AboutHero, ChairSection, ClipperSection, FinalSection, MirrorSection, PhilosophySection, StatsSection, StorySection, TimelineSection, WorkshopSection } from '../components/about/Sections.jsx'
import SceneInView from '../components/about/SceneInView.jsx'
import './AboutPage.css'

gsap.registerPlugin(ScrollTrigger)

const metal = new THREE.MeshStandardMaterial({ color: '#aeb2b0', metalness: 0.92, roughness: 0.24 })
const darkMetal = new THREE.MeshStandardMaterial({ color: '#24282a', metalness: 0.75, roughness: 0.31 })
const rubber = new THREE.MeshStandardMaterial({ color: '#111314', metalness: 0.22, roughness: 0.38 })
const gold = new THREE.MeshStandardMaterial({ color: '#ad8959', metalness: 0.83, roughness: 0.22 })

function Clipper({ partsRef, onInspect, powered }) {
  const root = useRef()
  const indicator = useRef()
  useFrame((state, delta) => {
    if (root.current) {
      const targetY = state.pointer.x * 0.14
      root.current.rotation.y += (targetY - root.current.rotation.y) * delta * 0.55
      if (powered) root.current.position.x = Math.sin(state.clock.elapsedTime * 34) * 0.012
      else root.current.position.x *= 0.82
    }
    if (indicator.current) indicator.current.material.emissiveIntensity = powered ? 2 + Math.sin(state.clock.elapsedTime * 7) * 0.35 : 0
    const parts = partsRef.current
    const amount = parts.explode ?? 0
    if (parts.blade) {
      parts.blade.position.y = 1.12 + amount * 0.78
      parts.blade.position.z = amount * 0.38
    }
    if (parts.body) parts.body.position.y = -amount * 0.14
    if (parts.lever) {
      parts.lever.position.x = 0.66 + amount * 0.46
      parts.lever.position.y = 0.12 + amount * 0.23
    }
    if (parts.motor) {
      parts.motor.position.z = -0.25 - amount * 0.63
      parts.motor.position.y = -0.1 + amount * 0.05
    }
  })
  // Callback refs populate the scene object map after the 3D nodes mount.
  // eslint-disable-next-line react-hooks/refs
  const setPart = (name) => (node) => { if (node) partsRef.current[name] = node }
  const focus = (part) => (event) => { event.stopPropagation(); onInspect(part) }
  return <group ref={root} rotation={[0.12, -0.3, 0]}>
    <group ref={setPart('body')}>
      <RoundedBox args={[1.14, 2.12, 0.68]} radius={0.22} smoothness={4} position={[0, -0.04, 0]} material={rubber} castShadow receiveShadow onClick={focus('body')}>
        <meshStandardMaterial color="#16191a" metalness={0.36} roughness={0.29} />
      </RoundedBox>
      <RoundedBox args={[0.8, 1.58, 0.08]} radius={0.12} smoothness={3} position={[0, -0.03, 0.36]} material={darkMetal} onClick={focus('body')} />
      <mesh position={[0, -0.71, 0.412]} material={gold}><torusGeometry args={[0.16, 0.012, 8, 32]} /></mesh>
      <mesh position={[0, -0.71, 0.41]} ref={indicator} onClick={(e) => { e.stopPropagation(); onInspect('power') }}>
        <circleGeometry args={[0.11, 32]} /><meshStandardMaterial color="#d0ae74" emissive="#dfa956" emissiveIntensity={0} /></mesh>
      {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, -0.86, 0.42]} material={metal}><sphereGeometry args={[0.025, 12, 12]} /></mesh>)}
    </group>
    <group ref={setPart('blade')} position={[0, 1.12, 0]} onClick={focus('blade')}>
      <RoundedBox args={[1.34, 0.28, 0.78]} radius={0.08} smoothness={3} material={metal} castShadow />
      <mesh position={[0, 0.15, 0.03]} material={darkMetal}><boxGeometry args={[1.34, 0.075, 0.73]} /></mesh>
      {Array.from({ length: 17 }, (_, i) => <mesh key={i} position={[-0.62 + i * 0.078, 0.22, 0.34]} material={metal}><boxGeometry args={[0.042, 0.12, 0.19]} /></mesh>)}
      {[-0.48, 0.48].map((x) => <mesh key={x} position={[x, -0.03, 0.405]} material={darkMetal}><cylinderGeometry args={[0.035, 0.035, 0.04, 16]} /></mesh>)}
    </group>
    <group ref={setPart('lever')} position={[0.66, 0.12, 0.02]} rotation={[0, 0, -0.3]} onClick={focus('lever')}>
      <mesh material={gold} position={[0.06, 0, 0]}><boxGeometry args={[0.13, 0.5, 0.08]} /></mesh>
      <mesh material={metal} position={[0.12, -0.21, 0]}><sphereGeometry args={[0.085, 16, 16]} /></mesh>
      <mesh material={darkMetal} position={[0, 0.22, 0]}><cylinderGeometry args={[0.09, 0.09, 0.08, 20]} /></mesh>
    </group>
    <group ref={setPart('motor')} position={[0, -0.1, -0.25]}>
      <RoundedBox args={[0.57, 0.72, 0.34]} radius={0.07} smoothness={2} material={gold} />
      <mesh position={[0, 0.39, 0]} material={metal}><cylinderGeometry args={[0.21, 0.21, 0.22, 24]} /></mesh>
    </group>
    <mesh position={[0, -1.2, 0]} material={darkMetal}><cylinderGeometry args={[0.2, 0.16, 0.18, 24]} /></mesh>
    <mesh position={[0, -1.32, 0]} material={rubber}><torusGeometry args={[0.13, 0.035, 10, 28]} /></mesh>
  </group>
}

function ClipperExperience({ partsRef, onInspect, powered }) {
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.1, 5.2], fov: 34 }} gl={{ antialias: true, alpha: true }} shadows="percentage">
    <color attach="background" args={['#0b0b0a']} />
    <ambientLight intensity={0.45} />
    <spotLight position={[3, 5, 4]} intensity={85} color="#edd2aa" angle={0.36} penumbra={0.8} castShadow />
    <pointLight position={[-3, 0, 1]} intensity={18} color="#c98c52" />
    <Suspense fallback={null}>
      <Float speed={0.85} rotationIntensity={0.025} floatIntensity={0.08}>
        <Clipper partsRef={partsRef} onInspect={onInspect} powered={powered} />
      </Float>
      <Environment preset="studio" />
    </Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#0c0c0b" metalness={0.48} roughness={0.28} /></mesh>
    <ContactShadows position={[0, -1.72, 0]} opacity={0.52} scale={7} blur={2.2} far={4} />
    <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.075} minPolarAngle={Math.PI * 0.32} maxPolarAngle={Math.PI * 0.68} />
  </Canvas>
}

function ToolScene({ selectedTool, setSelectedTool }) {
  return <Canvas dpr={[1, 1.4]} camera={{ position: [0, 3.8, 7.2], fov: 37 }}>
    <color attach="background" args={['#0c0c0b']} /><ambientLight intensity={0.55} /><spotLight position={[1, 7, 4]} intensity={110} color="#d9bd96" angle={0.6} penumbra={1} /><Environment preset="city" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow><boxGeometry args={[10, 5.5, 0.25]} /><meshStandardMaterial color="#1a1713" metalness={0.3} roughness={0.52} /></mesh>
    {['CLIPPER', 'SCISSORS', 'COMB', 'RAZOR', 'BRUSH'].map((tool, i) => <Float key={tool} speed={0.8 + i * 0.12} floatIntensity={0.12} rotationIntensity={0.08}>
      <group position={[-3.2 + i * 1.6, 0, (i % 2) * 0.55]} rotation={[0.7 + i * 0.1, 0.15, i % 2 ? 0.5 : -0.35]} onClick={() => setSelectedTool(tool)}>
        {i === 0 && <><RoundedBox args={[0.6, 1.1, 0.35]} radius={0.12}><meshStandardMaterial color={selectedTool === tool ? '#b28d5e' : '#272727'} metalness={0.65} roughness={0.28} /></RoundedBox><mesh position={[0, 0.61, 0]} material={metal}><boxGeometry args={[0.68, 0.15, 0.4]} /></mesh></>}
        {i === 1 && <><mesh material={metal} rotation={[0, 0, -0.34]}><boxGeometry args={[0.08, 1.4, 0.035]} /></mesh><mesh material={gold} rotation={[0, 0, 0.34]}><boxGeometry args={[0.08, 1.4, 0.035]} /></mesh><mesh material={metal} position={[0, -0.47, 0]}><torusGeometry args={[0.22, 0.035, 8, 24]} /></mesh></>}
        {i === 2 && <mesh material={selectedTool === tool ? gold : darkMetal}><boxGeometry args={[0.42, 1.65, 0.09]} /></mesh>}
        {i === 3 && <><RoundedBox args={[0.3, 1.35, 0.19]} radius={0.1} material={darkMetal} /><mesh position={[0, 0.74, 0]} material={metal}><boxGeometry args={[0.43, 0.19, 0.25]} /></mesh></>}
        {i === 4 && <><mesh material={gold}><cylinderGeometry args={[0.14, 0.22, 0.52, 20]} /></mesh><mesh position={[0, 0.43, 0]} material={darkMetal}><cylinderGeometry args={[0.3, 0.25, 0.14, 20]} /></mesh></>}
      </group>
    </Float>)}
    <OrbitControls enablePan={false} enableZoom={false} enableDamping minPolarAngle={0.7} maxPolarAngle={1.15} />
  </Canvas>
}

function ChairModel({ chairTurned }) {
  const chair = useRef()
  useFrame((_, delta) => {
    if (!chair.current) return
    const destination = chairTurned ? -0.3 + Math.PI * 2 : -0.3
    chair.current.rotation.y += (destination - chair.current.rotation.y) * Math.min(delta * 1.7, 1)
  })
  return <group ref={chair} rotation={[0, -0.3, 0]}>
      <mesh position={[0, -0.25, 0]} material={darkMetal}><cylinderGeometry args={[0.58, 0.65, 0.14, 32]} /></mesh>
      <mesh position={[0, -0.02, 0]} material={gold}><cylinderGeometry args={[0.13, 0.16, 0.36, 24]} /></mesh>
      <RoundedBox args={[1.35, 0.27, 1]} radius={0.14} smoothness={3} position={[0, 0.23, 0]}><meshStandardMaterial color="#211b16" roughness={0.35} /></RoundedBox>
      <RoundedBox args={[1.27, 1.16, 0.27]} radius={0.14} smoothness={3} position={[0, 0.91, -0.28]} rotation={[-0.09, 0, 0]}><meshStandardMaterial color="#211b16" roughness={0.35} /></RoundedBox>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.75, 0.35, 0]}><mesh material={gold}><boxGeometry args={[0.1, 0.12, 0.9]} /></mesh><mesh position={[0, 0.18, -0.2]}><RoundedBox args={[0.17, 0.32, 0.5]} radius={0.08}><meshStandardMaterial color="#211b16" /></RoundedBox></mesh></group>)}
      <mesh position={[0, 1.58, -0.29]}><RoundedBox args={[0.93, 0.34, 0.28]} radius={0.13}><meshStandardMaterial color="#211b16" /></RoundedBox></mesh>
  </group>
}

function ChairScene({ chairTurned }) {
  return <Canvas dpr={[1, 1.4]} camera={{ position: [0, 1.2, 5.5], fov: 35 }}>
    <color attach="background" args={['#10100f']} /><ambientLight intensity={0.48} /><spotLight position={[3, 5, 2]} intensity={90} color="#e3c69d" angle={0.42} penumbra={0.9} /><Environment preset="warehouse" />
    <ChairModel chairTurned={chairTurned} />
    <ContactShadows position={[0, -0.34, 0]} opacity={0.5} scale={6} blur={2.5} /><OrbitControls enablePan={false} enableZoom={false} />
  </Canvas>
}

export default function AboutPage() {
  const page = useRef(null)
  const clipperParts = useRef({})
  const heroClipperParts = useRef({})
  const [activePart, setActivePart] = useState('blade')
  const [powered, setPowered] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [selectedTool, setSelectedTool] = useState('CLIPPER')
  const [chairTurned, setChairTurned] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Clear any pins left by a previous route before measuring this page.
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    ScrollTrigger.clearScrollMemory('manual')
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from('.about-hero-title .line', { yPercent: 110, opacity: 0, stagger: 0.13, duration: 1.2, ease: 'power4.out', delay: 0.1 })
        gsap.to('.about-hero-glow', { opacity: 0.75, scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: true } })
        const explodedView = { progress: 0 }
        const timeline = gsap.timeline({ scrollTrigger: { trigger: '.clipper-experience', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
        timeline.to('.clipper-copy', { y: -80, opacity: 0.2, duration: 0.2 }, 0.15)
        timeline.to('.clipper-explode-labels', { opacity: 1, duration: 0.1 }, 0.42)
        timeline.to(explodedView, { progress: 1, duration: 0.22, onUpdate: () => { clipperParts.current.explode = explodedView.progress } }, 0.42)
        timeline.to(explodedView, { progress: 0, duration: 0.2, onUpdate: () => { clipperParts.current.explode = explodedView.progress } }, 0.79)
        gsap.utils.toArray('.about-reveal').forEach((el) => gsap.from(el, { y: 46, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 83%' } }))
        gsap.from('.portrait-image', { clipPath: 'inset(12% 12% 12% 12%)', scale: 1.08, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.story-portrait', start: 'top 72%' } })
        gsap.to('.timeline-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.story-timeline', start: 'top 65%', end: 'bottom 60%', scrub: true } })
        gsap.from('.about-stat-value', { textContent: 0, duration: 1.6, snap: { textContent: 1 }, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.about-stat-grid', start: 'top 80%' } })
        gsap.to('.portrait-image', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.story-portrait', start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.to('.mirror-reflection', { opacity: 0.75, y: -20, scrollTrigger: { trigger: '.mirror-section', start: 'top 75%', end: 'center center', scrub: true } })
        gsap.from('.final-words span', { y: 45, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.about-final', start: 'top 72%' } })
      }
    }, page)
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()) }
  }, [])

  const inspect = (part) => {
    setInteracted(true)
    if (part === 'power') { setPowered((value) => !value); setActivePart('power') }
    else setActivePart(part)
    if (part === 'lever' && clipperParts.current.lever) gsap.to(clipperParts.current.lever.rotation, { z: -0.75, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' })
    if (part === 'blade') gsap.fromTo('.clipper-detail', { x: 14, opacity: 0.35 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' })
  }

  return <div className="about-page" ref={page}>
    <header className="about-nav"><Link to="/" className="about-brand">SARUM CUT<span>®</span></Link><span className="about-nav-title">THE CRAFT, UP CLOSE</span><Link to="/" className="about-home">← HOME</Link></header>
    <main>
      <AboutHero scene={<SceneInView><ClipperExperience partsRef={heroClipperParts} onInspect={inspect} powered={powered} /></SceneInView>} />
      <ClipperSection scene={<SceneInView><ClipperExperience partsRef={clipperParts} onInspect={inspect} powered={powered} /></SceneInView>} activePart={activePart} powered={powered} interacted={interacted} />
      <WorkshopSection scene={<SceneInView><ToolScene selectedTool={selectedTool} setSelectedTool={setSelectedTool} /></SceneInView>} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <ChairSection scene={<SceneInView><ChairScene chairTurned={chairTurned} /></SceneInView>} chairTurned={chairTurned} setChairTurned={setChairTurned} />
      <PhilosophySection />
      <StorySection />
      <TimelineSection />
      <StatsSection />
      <MirrorSection />
      <FinalSection />
    </main>
    <AboutFooter />
  </div>
}
