import { Canvas } from '@react-three/fiber'
import { Component, memo, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BufferGeometry, Color, Float32BufferAttribute, PCFShadowMap, Quaternion, Vector3 } from 'three'
import type { PhaseId } from '../playback/types'
import OrbitCamera from './OrbitCamera'
import { terrainHeight, terrainRocks } from './terrain'

const phaseHeights = { P63: 4.4, P64: 3.1, P66: 1.9, LANDED: 0.73 }

// Original geometry. Scene coordinates are illustrative, never mission coordinates.
function Strut({ from, to, radius = 0.025, color = '#a9a58d' }: { from: [number,number,number]; to: [number,number,number]; radius?: number; color?: string }) {
  const a = new Vector3(...from), b = new Vector3(...to)
  const midpoint = a.clone().add(b).multiplyScalar(0.5)
  const direction = b.clone().sub(a)
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0,1,0), direction.clone().normalize())
  return <mesh castShadow position={midpoint} quaternion={quaternion}>
    <cylinderGeometry args={[radius,radius,direction.length(),5]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
}

function Lander({ phase }: { phase: PhaseId }) {
  const height = phaseHeights[phase]
  const tilt = phase === 'P63' ? -0.5 : phase === 'P64' ? -0.2 : 0
  return <group position={[0,height,0]} rotation={[0,0.35,tilt]} scale={0.78}>
    <mesh castShadow receiveShadow><cylinderGeometry args={[0.75,0.78,0.65,8]} /><meshStandardMaterial color="#b99b57" flatShading roughness={0.9} /></mesh>
    <mesh castShadow position={[0,0.73,0]}><cylinderGeometry args={[0.38,0.61,0.84,5]} /><meshStandardMaterial color="#b8c3c6" flatShading roughness={0.7} /></mesh>
    <mesh castShadow position={[0,1.22,0]}><boxGeometry args={[0.69,0.25,0.58]} /><meshStandardMaterial color="#829096" /></mesh>
    <mesh position={[0,0.85,0.48]} rotation={[-0.18,0,0]}><boxGeometry args={[0.43,0.24,0.035]} /><meshStandardMaterial color="#0d2133" metalness={0.7} roughness={0.3} /></mesh>
    <mesh position={[0,-0.44,0]}><cylinderGeometry args={[0.16,0.28,0.28,8,1,true]} /><meshStandardMaterial color="#4b555e" side={2} /></mesh>
    {[0,1,2,3].map(i => <group key={i} rotation={[0,i * Math.PI / 2 + Math.PI / 4,0]}>
      <Strut from={[0.5,0.16,0]} to={[1.35,-1.1,0]} radius={0.035} />
      <Strut from={[0.6,-0.28,0.25]} to={[1.35,-1.1,0]} radius={0.02} />
      <Strut from={[0.6,-0.28,-0.25]} to={[1.35,-1.1,0]} radius={0.02} />
      <mesh castShadow position={[1.35,-1.12,0]}><cylinderGeometry args={[0.23,0.21,0.055,8]} /><meshStandardMaterial color="#a38d5e" /></mesh>
    </group>)}
    <Strut from={[0.3,1.2,0]} to={[0.3,1.9,0]} radius={0.015} />
    <mesh position={[0.3,1.82,0]} rotation={[Math.PI / 2,0,0.4]}><circleGeometry args={[0.16,8]} /><meshStandardMaterial color="#b2b9b6" side={2} /></mesh>
  </group>
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
  return <section className="scene-container" aria-label="Interactive lunar scene">
    <div className="lunar-scene"><SceneBoundary><Canvas orthographic shadows={{ type: PCFShadowMap }} camera={{position:[10,8,14],zoom:55,near:0.1,far:150}} dpr={[1,1.6]} frameloop="demand" fallback={<div aria-hidden="true"><Fallback /></div>}>
      <color attach="background" args={['#080f1b']} />
      <fog attach="fog" args={['#080f1b',22,62]} />
      <ambientLight intensity={0.7} color="#a6bbd5" />
      <directionalLight castShadow position={[-12,10,8]} intensity={2.6} color="#f4e7cc" shadow-mapSize={[1024,1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-normalBias={0.04} />
      <directionalLight position={[5,2,-5]} intensity={0.6} color="#527da7" />
      <Terrain /><Lander phase={phase} />
      <OrbitCamera focusY={phaseHeights[phase] + 0.35} resetToken={resetToken} />
    </Canvas></SceneBoundary></div>
    <div className="scene-controls"><span className="scene-mouse-hint">Drag to orbit <b>·</b> Scroll to zoom</span><span className="scene-touch-hint">Drag to orbit <b>·</b> Pinch to zoom</span><button onClick={() => setResetToken(token => token + 1)} title="Reset camera view" aria-label="Reset camera view">↺</button></div>
  </section>
}

export default memo(LunarScene)
