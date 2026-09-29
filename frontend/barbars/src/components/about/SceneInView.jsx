import { useEffect, useRef, useState } from 'react'

export default function SceneInView({ children, className = '' }) {
  const root = useRef(null)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const node = root.current
    if (!node) return undefined
    let skeletonTimer
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        skeletonTimer = setTimeout(() => setLoading(false), 420)
        observer.unobserve(node)
      }
    }, { rootMargin: '20% 0px' })
    observer.observe(node)
    return () => { observer.disconnect(); clearTimeout(skeletonTimer) }
  }, [])

  return <div ref={root} className={`scene-in-view ${className}`}>
    {loading && <div className="scene-loading-skeleton" role="status" aria-label="Loading 3D scene"><span /><i /><b /></div>}
    {visible ? children : null}
  </div>
}
