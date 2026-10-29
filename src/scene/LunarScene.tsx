import { Canvas } from '@react-three/fiber'
import { Component, memo, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BufferGeometry, Color, Float32BufferAttribute, PCFShadowMap } from 'three'
import type { PhaseId } from '../playback/types'
import OrbitCamera from './OrbitCamera'
import { terrainHeight, terrainRocks } from './terrain'
import NasaLunarModule from './NasaLunarModule'

const phaseHeights = { P63: 4.4, P64: 3.1, P66: 1.9, LANDED: 0.73 }

// Scene coordinates and phase poses remain illustrative, not mission coordinates.
function Lander({ phase, onReady, onError }: { phase: PhaseId; onReady: () => void; onError: () => void }) {
  const height = phaseHeights[phase]
  const tilt = phase === 'P63' ? -0.5 : phase === 'P64' ? -0.2 : 0
  return <group position={[0,height,0]} rotation={[0,0.35,tilt]}><NasaLunarModule onReady={onReady} onError={onError} /></group>
}

function Terrain() {
  const geometry = useMemo(() => {
    const points: number[] = []
    const colors: number[] = []
    const baseColor = new Color('#627080')
    const size = 68, n = 128
    for(let i=0;i<n;i++) for(let j=0;j<n;j++) {
      const x=(i/n-0.5)*size, z=(j/n-0.5)*size, d=size/n
      const shade = 0.88 + 0.1 * Math.sin(i * 13.37 + j * 17.13) + terrainHeight(x,z) * 0.035
      for(const [a,b] of [[x,z],[x,z+d],[x+d,z],[x+d,z],[x,z+d],[x+d,z+d]]) {
        points.push(a,terrainHeight(a,b),b)
        colors.push(baseColor.r * shade, baseColor.g * shade, baseColor.b * shade)
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position',new Float32BufferAttribute(points,3))
    g.setAttribute('color',new Float32BufferAttribute(colors,3))
    g.computeVertexNormals()
    return g
  }, [])
  const rocks = useMemo(terrainRocks, [])
  return <>
    <mesh receiveShadow geometry={geometry}><meshStandardMaterial vertexColors flatShading roughness={1} /></mesh>
    {rocks.map((rock,i)=><mesh key={i} castShadow receiveShadow position={[rock.x,rock.y,rock.z]} scale={[rock.scale,rock.scale*0.65,rock.scale*0.85]} rotation={[0,rock.rotation,0.2]}><dodecahedronGeometry args={[1,0]} /><meshStandardMaterial color="#77818b" flatShading roughness={1} /></mesh>)}
  </>
}

class SceneBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false }
  static getDerivedStateFromError() { return {failed:true} }
  render() { return this.state.failed ? <Fallback /> : this.props.children }
}
function Fallback() { return <div className="scene-fallback"><span>◇</span><p>Eagle · lunar descent</p><small>3D view unavailable. Historical playback remains available.</small></div> }

function LunarScene({ phase }: { phase: PhaseId }) {
  const [resetToken, setResetToken] = useState(0)
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const modelReady = useCallback(() => setModelStatus('ready'), [])
  const modelError = useCallback(() => setModelStatus('error'), [])
  return <section className="scene-container" aria-label="Interactive lunar scene">
    <div className="lunar-scene"><SceneBoundary><Canvas orthographic shadows={{ type: PCFShadowMap }} camera={{position:[10,8,14],zoom:55,near:0.1,far:150}} dpr={[1,1.6]} frameloop="demand" fallback={<div aria-hidden="true"><Fallback /></div>}>
      <color attach="background" args={['#080f1b']} />
      <fog attach="fog" args={['#080f1b',22,62]} />
      <ambientLight intensity={0.7} color="#a6bbd5" />
      <directionalLight castShadow position={[-12,10,8]} intensity={2.6} color="#f4e7cc" shadow-mapSize={[1024,1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-normalBias={0.04} />
      <directionalLight position={[5,2,-5]} intensity={0.6} color="#527da7" />
      <Terrain /><Lander phase={phase} onReady={modelReady} onError={modelError} />
      <OrbitCamera focusY={phaseHeights[phase] + 0.35} resetToken={resetToken} />
    </Canvas></SceneBoundary></div>
    {modelStatus !== 'ready' && <div className="model-status" role="status">{modelStatus === 'loading' ? 'Loading NASA Lunar Module…' : 'NASA model unavailable. Reload to try again.'}</div>}
    <div className="scene-controls"><span className="scene-mouse-hint">Drag to orbit <b>·</b> Scroll to zoom</span><span className="scene-touch-hint">Drag to orbit <b>·</b> Pinch to zoom</span><button onClick={() => setResetToken(token => token + 1)} title="Reset camera view" aria-label="Reset camera view">↺</button></div>
  </section>
}

export default memo(LunarScene)
