import { Canvas } from '@react-three/fiber'
import { Component, useMemo } from 'react'
import type { ReactNode } from 'react'
import { BufferGeometry, Float32BufferAttribute, Quaternion, Vector3 } from 'three'
import type { PhaseId } from '../playback/types'

// Original geometry. Scene coordinates are illustrative, never mission coordinates.
function Strut({ from, to, radius = 0.025, color = '#a9a58d' }: { from: [number,number,number]; to: [number,number,number]; radius?: number; color?: string }) {
  const a = new Vector3(...from), b = new Vector3(...to)
  const midpoint = a.clone().add(b).multiplyScalar(0.5)
  const direction = b.clone().sub(a)
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0,1,0), direction.clone().normalize())
  return <mesh position={midpoint} quaternion={quaternion}>
    <cylinderGeometry args={[radius,radius,direction.length(),5]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
}

function Lander({ phase }: { phase: PhaseId }) {
  const height = phase === 'LANDED' ? 0.78 : phase === 'P66' ? 1.9 : phase === 'P64' ? 3.1 : 4.4
  const tilt = phase === 'P63' ? -0.5 : phase === 'P64' ? -0.2 : 0
  return <group position={[0,height,0]} rotation={[0,0.35,tilt]} scale={0.78}>
    <mesh><cylinderGeometry args={[0.75,0.78,0.65,8]} /><meshStandardMaterial color="#b99b57" flatShading roughness={0.9} /></mesh>
    <mesh position={[0,0.73,0]}><cylinderGeometry args={[0.38,0.61,0.84,5]} /><meshStandardMaterial color="#b8c3c6" flatShading roughness={0.7} /></mesh>
    <mesh position={[0,1.22,0]}><boxGeometry args={[0.69,0.25,0.58]} /><meshStandardMaterial color="#829096" /></mesh>
    <mesh position={[0,0.85,0.48]} rotation={[-0.18,0,0]}><boxGeometry args={[0.43,0.24,0.035]} /><meshStandardMaterial color="#0d2133" metalness={0.7} roughness={0.3} /></mesh>
    <mesh position={[0,-0.44,0]}><cylinderGeometry args={[0.16,0.28,0.28,8,1,true]} /><meshStandardMaterial color="#4b555e" side={2} /></mesh>
    {[0,1,2,3].map(i => <group key={i} rotation={[0,i * Math.PI / 2 + Math.PI / 4,0]}>
      <Strut from={[0.5,0.16,0]} to={[1.35,-1.1,0]} radius={0.035} />
      <Strut from={[0.6,-0.28,0.25]} to={[1.35,-1.1,0]} radius={0.02} />
      <Strut from={[0.6,-0.28,-0.25]} to={[1.35,-1.1,0]} radius={0.02} />
      <mesh position={[1.35,-1.12,0]}><cylinderGeometry args={[0.23,0.21,0.055,8]} /><meshStandardMaterial color="#a38d5e" /></mesh>
    </group>)}
    <Strut from={[0.3,1.2,0]} to={[0.3,1.9,0]} radius={0.015} />
    <mesh position={[0.3,1.82,0]} rotation={[Math.PI / 2,0,0.4]}><circleGeometry args={[0.16,8]} /><meshStandardMaterial color="#b2b9b6" side={2} /></mesh>
  </group>
}

function Terrain() {
  const geometry = useMemo(() => {
    const points: number[] = []
    const size = 42, n = 24
    const y = (x: number,z: number) => {
      const rimDistance = Math.hypot(x - 6,z + 2)
      const crater = -0.75 * Math.exp(-Math.pow(rimDistance / 2.6,4)) + 0.24 * Math.exp(-Math.pow((rimDistance - 2.9) / 0.45,2))
      return -0.12 + 0.08 * Math.sin(x * 1.2) * Math.sin(z * 0.7) + crater
    }
    for(let i=0;i<n;i++) for(let j=0;j<n;j++) {
      const x=(i/n-0.5)*size, z=(j/n-0.5)*size, d=size/n
      for(const [a,b] of [[x,z],[x,z+d],[x+d,z],[x+d,z],[x,z+d],[x+d,z+d]]) points.push(a,y(a,b),b)
    }
    const g = new BufferGeometry()
    g.setAttribute('position',new Float32BufferAttribute(points,3)); g.computeVertexNormals()
    return g
  }, [])
  return <>
    <mesh geometry={geometry}><meshStandardMaterial color="#354456" flatShading roughness={1} /></mesh>
    <gridHelper args={[38,38,'#607084','#465568']} position={[0,0.025,0]} material-transparent material-opacity={0.09} />
    {[[3,-3,0.35],[-4,2,0.25],[6,4,0.3],[-2,-5,0.18],[2,5,0.14]].map(([x,z,s],i)=><mesh key={i} position={[x,s*0.3,z]} scale={[s,s*0.6,s]} rotation={[0,i,0]}><dodecahedronGeometry args={[1,0]} /><meshStandardMaterial color="#3c4958" flatShading /></mesh>)}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.035,0]}><ringGeometry args={[1.45,1.46,64]} /><meshBasicMaterial color="#b49a65" transparent opacity={0.25} /></mesh>
  </>
}

class SceneBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false }
  static getDerivedStateFromError() { return {failed:true} }
  render() { return this.state.failed ? <Fallback /> : this.props.children }
}
function Fallback() { return <div className="scene-fallback"><span>◇</span><p>Eagle · lunar descent</p><small>3D view unavailable. Historical playback remains available.</small></div> }

export default function LunarScene({ phase }: { phase: PhaseId }) {
  return <div className="lunar-scene" role="img" aria-label="Stylized Lunar Module above schematic lunar terrain">
    <SceneBoundary><Canvas aria-hidden="true" orthographic camera={{position:[10,8,14],zoom:57,near:0.1,far:100}} dpr={[1,1.6]} frameloop="demand" fallback={<Fallback />} onCreated={({camera}) => camera.lookAt(0,1.7,0)}>
      <color attach="background" args={['#080f1b']} />
      <fog attach="fog" args={['#080f1b',15,37]} />
      <ambientLight intensity={1.5} color="#a6bbd5" />
      <directionalLight position={[-5,10,5]} intensity={3.2} color="#f4e0b4" />
      <directionalLight position={[5,2,-5]} intensity={1.6} color="#527da7" />
      <Terrain /><Lander phase={phase} />
    </Canvas></SceneBoundary>
  </div>
}
