import { useLoader } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Box3, Color, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const decoder = new DRACOLoader().setDecoderPath('/vendor/draco/').setWorkerLimit(2)
// Match the illustrative scene's existing landing-gear plane and footprint.
const FOOT_PLANE = -0.89
const FOOTPRINT = 2.8

function ImportedModule({ onReady }: { onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, '/models/nasa-apollo-lunar-module.glb', loader => loader.setDRACOLoader(decoder))
  const model = useMemo(() => {
    // Clone the scene and materials; the cached NASA geometry and original file stay intact.
    const object = gltf.scene.clone(true)
    const materials = new Map<MeshStandardMaterial, MeshStandardMaterial>()
    object.traverse(node => {
      if (!(node instanceof Mesh)) return
      node.castShadow = true
      node.receiveShadow = true
      const style = (material: MeshStandardMaterial) => {
        if (!materials.has(material)) {
          const styled = material.clone()
          const { r, g, b } = styled.color
          if (r > b * 1.4 && g > b * 1.1) styled.color.set('#bca168')
          else styled.color.lerp(new Color('#93a2b2'), 0.12)
          styled.roughness = 0.88
          styled.metalness = 0.06
          styled.flatShading = true
          styled.envMapIntensity = 0.3
          materials.set(material, styled)
        }
        return materials.get(material)!
      }
      node.material = Array.isArray(node.material)
        ? node.material.map(material => style(material as MeshStandardMaterial))
        : style(node.material as MeshStandardMaterial)
    })
    object.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(object, true)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = FOOTPRINT / Math.max(size.x, size.z)
    const root = new Group()
    root.name = 'NASA Apollo Lunar Module · NASA/Michael D. Carbajal'
    root.userData.source = '/models/nasa-apollo-lunar-module.glb'
    root.scale.setScalar(scale)
    root.position.set(-center.x * scale, FOOT_PLANE - bounds.min.y * scale, -center.z * scale)
    root.add(object)
    return { root, materials }
  }, [gltf.scene])

  useEffect(() => {
    onReady()
    return () => { model.materials.forEach(material => material.dispose()) }
  }, [model, onReady])

  return <primitive object={model.root} dispose={null} />
}

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function NasaLunarModule({ onReady, onError }: { onReady: () => void; onError: () => void }) {
  return <ModelBoundary onError={onError}><Suspense fallback={null}><ImportedModule onReady={onReady} /></Suspense></ModelBoundary>
}
