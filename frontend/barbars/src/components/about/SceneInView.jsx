import { useEffect, useRef, useState } from 'react'

export default function SceneInView({ children, className = '' }) {
  const root = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = root.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(node)
      }
    }, { rootMargin: '20% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={root} className={`scene-in-view ${className}`}>{visible ? children : null}</div>
}
