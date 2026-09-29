import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { globeMarkers } from './contactConfig.js'

const DEFAULT_GLOBE_CONFIG = {
  radius: 1,
  // Keep the map's original colors; tinting the material gray washes out the texture.
  globeColor: '#ffffff',
  textureUrl: '/textures/earth-color.jpg',
  bumpMapUrl: '/textures/earth-normal.jpg',
  showAtmosphere: true,
  atmosphereColor: '#4b9db2',
  atmosphereIntensity: 0.34,
  atmosphereBlur: 3.1,
  bumpScale: 0.035,
  autoRotateSpeed: 0.035,
  enableZoom: true,
  enablePan: false,
  minDistance: 2.7,
  maxDistance: 4.2,
  initialRotation: { x: 0.12, y: -Math.PI / 2 },
  markerSize: 8,
  showWireframe: false,
  wireframeColor: '#82b7c0',
  ambientIntensity: 0.32,
  pointLightIntensity: 1.7,
  backgroundColor: null,
}

function markerPosition(latitude, longitude, radius) {
  const phi = THREE.MathUtils.degToRad(90 - latitude)
  const theta = THREE.MathUtils.degToRad(longitude + 180)
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

function GlobeMarker({ marker, radius, size, active, onClick, onHover }) {
  const [hovered, setHovered] = useState(false)
  const position = useMemo(() => markerPosition(marker.lat, marker.lng, radius * 1.008), [marker.lat, marker.lng, radius])
  const markerSize = marker.size ?? size

  const setHoverState = (next) => {
    setHovered(next)
    onHover?.(next ? marker : null)
  }

  return <group position={position}>
    <Html center distanceFactor={7} occlude zIndexRange={[30, 0]}>
      <button
        className={`contact-marker-button${active || hovered ? ' is-active' : ''}`}
        style={{ '--marker-size': `${markerSize}px` }}
        type="button"
        aria-label={`Show ${marker.label} global connection`}
        aria-pressed={active}
        onClick={(event) => { event.stopPropagation(); onClick?.(marker) }}
        onPointerEnter={() => setHoverState(true)}
        onPointerLeave={() => setHoverState(false)}
        onFocus={() => setHoverState(true)}
        onBlur={() => setHoverState(false)}
      >
        {marker.src ? <img src={marker.src} alt="" loading="lazy" /> : <span className="contact-marker-pulse" />}
      </button>
    </Html>
    {(active || hovered) && <Html center distanceFactor={7} position={[0, 0.12, 0]} occlude style={{ pointerEvents: 'none' }}>
      <span className="contact-globe-tooltip">{marker.label}</span>
    </Html>}
  </group>
}

function Atmosphere({ radius, color, intensity, blur }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      glowIntensity: { value: intensity },
      glowPower: { value: Math.max(1.2, 6.2 - blur) },
    },
    vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 glowColor; uniform float glowIntensity; uniform float glowPower; varying vec3 vNormal; void main() { float rim = pow(max(0.0, 0.76 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), glowPower); gl_FragColor = vec4(glowColor, rim * glowIntensity); }`,
  }), [color, intensity, blur])

  return <mesh scale={radius * 1.035} material={material}>
    <sphereGeometry args={[1, 64, 64]} />
  </mesh>
}

function GlobeSurface({ markers, config, selectedMarker, onMarkerClick, onMarkerHover }) {
  const group = useRef(null)
  const [map, setMap] = useState(null)
  const [bumpMap, setBumpMap] = useState(null)
  const [textureError, setTextureError] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadedTextures = new Set()
    const loader = new THREE.TextureLoader()
    const textures = [
      { url: config.textureUrl, apply: setMap, color: true },
      { url: config.bumpMapUrl, apply: setBumpMap, color: false },
    ]

    textures.forEach(({ url, apply, color }) => {
      if (!url) return
      loader.load(url, (texture) => {
        texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        if (mounted) {
          loadedTextures.add(texture)
          apply(texture)
          if (color) console.info(`Earth texture loaded: ${url} (${texture.image.width}x${texture.image.height})`)
        } else {
          texture.dispose()
        }
      }, undefined, () => {
        console.error(`Failed to load ${color ? 'Earth texture' : 'Earth bump map'}: ${url}`)
        if (mounted && color) setTextureError(true)
      })
    })

    return () => {
      mounted = false
      loadedTextures.forEach((texture) => texture.dispose())
      loadedTextures.clear()
    }
  }, [config.textureUrl, config.bumpMapUrl])

  useFrame((_, delta) => {
    if (group.current && config.autoRotateSpeed > 0) {
      group.current.rotation.y += delta * config.autoRotateSpeed
    }
  })

  return <group ref={group} rotation={[config.initialRotation.x, config.initialRotation.y, 0]}>
    <mesh>
      <sphereGeometry args={[config.radius, 96, 96]} />
      <meshStandardMaterial
        color={config.globeColor}
        map={map}
        bumpMap={bumpMap}
        bumpScale={bumpMap ? config.bumpScale : 0}
        roughness={0.86}
        metalness={0}
      />
    </mesh>
    {config.showWireframe && <mesh>
      <sphereGeometry args={[config.radius * 1.002, 48, 48]} />
      <meshBasicMaterial color={config.wireframeColor} wireframe transparent opacity={0.035} depthWrite={false} />
    </mesh>}
    {markers.map((marker, index) => <GlobeMarker
      key={`${marker.label}-${marker.lat}-${marker.lng}-${index}`}
      marker={marker}
      radius={config.radius}
      size={config.markerSize}
      active={selectedMarker?.label === marker.label}
      onClick={onMarkerClick}
      onHover={onMarkerHover}
    />)}
    {textureError && <Html position={[0, -config.radius * 1.34, 0]} center>
      <span className="contact-globe-fallback">EARTH MAP UNAVAILABLE</span>
    </Html>}
  </group>
}

function GlobeCanvas({ markers, config, selectedMarker, onMarkerClick, onMarkerHover }) {
  return <Canvas
    className="contact-globe-canvas"
    dpr={[1, 1.35]}
    camera={{ position: [0, 0, 3.25], fov: 37 }}
    gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    fallback={<div className="contact-globe-fallback">3D GLOBE UNAVAILABLE</div>}
  >
    {config.backgroundColor && <color attach="background" args={[config.backgroundColor]} />}
    <ambientLight intensity={config.ambientIntensity} />
    <directionalLight position={[3, 2, 4]} intensity={config.pointLightIntensity} color="#d5e9f4" />
    <Suspense fallback={null}>
      <GlobeSurface markers={markers} config={config} selectedMarker={selectedMarker} onMarkerClick={onMarkerClick} onMarkerHover={onMarkerHover} />
      {config.showAtmosphere && <Atmosphere radius={config.radius} color={config.atmosphereColor} intensity={config.atmosphereIntensity} blur={config.atmosphereBlur} />}
    </Suspense>
    <OrbitControls
      enablePan={config.enablePan}
      enableZoom={config.enableZoom}
      minDistance={config.minDistance}
      maxDistance={config.maxDistance}
      enableDamping
      dampingFactor={0.08}
    />
  </Canvas>
}

export default function Globe3D({
  markers = globeMarkers,
  config: configOverrides = {},
  activeMarker,
  onSelect,
  onMarkerClick,
  onMarkerHover,
  className = '',
}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const config = useMemo(() => ({
    ...DEFAULT_GLOBE_CONFIG,
    ...configOverrides,
    initialRotation: { ...DEFAULT_GLOBE_CONFIG.initialRotation, ...configOverrides.initialRotation },
    autoRotateSpeed: reducedMotion ? 0 : configOverrides.autoRotateSpeed ?? DEFAULT_GLOBE_CONFIG.autoRotateSpeed,
  }), [configOverrides, reducedMotion])
  const handleMarkerClick = onMarkerClick ?? onSelect

  return <div className={`contact-globe ${className}`.trim()} aria-label="Interactive textured Earth globe with selectable global connections">
    <GlobeCanvas
      markers={markers}
      config={config}
      selectedMarker={activeMarker}
      onMarkerClick={handleMarkerClick}
      onMarkerHover={onMarkerHover}
    />
    <span className="contact-globe-coordinate contact-globe-coordinate--top">LAT {activeMarker?.lat.toFixed(2)} / LNG {activeMarker?.lng.toFixed(2)}</span>
    <span className="contact-globe-coordinate contact-globe-coordinate--bottom">GLOBAL CONNECTIONS / {markers.length} CITIES</span>
  </div>
}
