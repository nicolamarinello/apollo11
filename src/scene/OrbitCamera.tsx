import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OrthographicCamera } from 'three'

function resetView(orbit: OrbitControls) {
  const damping = orbit.enableDamping
  // Flush residual movement before restoring the saved view.
  orbit.enableDamping = false
  orbit.update()
  orbit.reset()
  orbit.enableDamping = damping
}

export default function OrbitCamera({ focusY, resetToken }: { focusY: number; resetToken: number }) {
  const { camera, gl, invalidate } = useThree()
  const controls = useRef<OrbitControls | null>(null)
  const previousFocus = useRef(0)

  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement)
    orbit.enableDamping = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    orbit.dampingFactor = 0.12
    orbit.rotateSpeed = 0.65
    orbit.zoomSpeed = 0.8
    orbit.panSpeed = 0.65
    orbit.screenSpacePanning = false
    orbit.minPolarAngle = 0.12
    orbit.maxPolarAngle = Math.PI / 2 - 0.16
    orbit.minZoom = 25
    orbit.maxZoom = 150
    orbit.maxTargetRadius = 5
    const onChange = () => invalidate()
    orbit.addEventListener('change', onChange)
    controls.current = orbit
    const canvas = gl.domElement
    canvas.tabIndex = 0
    canvas.setAttribute('aria-label', 'Lunar scene. Drag to orbit; wheel or pinch to zoom; right-drag or two-finger drag to pan. Arrow keys orbit, plus and minus zoom, Home resets.')
    const onKey = (event: KeyboardEvent) => {
      const rotations: Record<string, () => void> = {
        ArrowLeft: () => orbit.rotateLeft(0.12), ArrowRight: () => orbit.rotateLeft(-0.12),
        ArrowUp: () => orbit.rotateUp(0.1), ArrowDown: () => orbit.rotateUp(-0.1),
        '+': () => orbit.dollyIn(1 / 1.15), '=': () => orbit.dollyIn(1 / 1.15), '-': () => orbit.dollyOut(1 / 1.15),
        Home: () => resetView(orbit),
      }
      if (rotations[event.key]) { event.preventDefault(); event.stopPropagation(); rotations[event.key](); orbit.update(); invalidate() }
      // Space is left to the mission playback keyboard shortcut.
    }
    canvas.addEventListener('keydown', onKey)
    return () => {
      canvas.removeEventListener('keydown', onKey)
      orbit.removeEventListener('change', onChange)
      orbit.dispose()
      controls.current = null
    }
  }, [camera, gl, invalidate])

  useEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    const delta = focusY - previousFocus.current
    camera.position.y += delta
    orbit.target.y += delta
    orbit.cursor.set(0, focusY, 0)
    previousFocus.current = focusY
    orbit.update()
    // Home restores this phase's default view even after seeking.
    orbit.target0.set(0, focusY, 0)
    orbit.position0.set(10, focusY + 7, 14)
    orbit.zoom0 = 55
    invalidate()
  }, [focusY, camera, invalidate])

  useEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    resetView(orbit)
    if (camera instanceof OrthographicCamera) camera.updateProjectionMatrix()
    invalidate()
  }, [resetToken, camera, invalidate])

  useFrame((_, delta) => controls.current?.update(delta))
  return null
}
