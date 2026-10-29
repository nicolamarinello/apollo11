// Original illustrative topography. These craters are not mapped Apollo 11 features.
export const craters = [
  { x: 6, z: -4, radius: 3.8, depth: 1.05 },
  { x: -7, z: 1, radius: 2.7, depth: 0.7 },
  { x: 1, z: 8, radius: 2.4, depth: 0.6 },
  { x: -5, z: -10, radius: 4.6, depth: 1.2 },
  { x: 13, z: 8, radius: 5.1, depth: 1.3 },
  { x: -13, z: 12, radius: 5.6, depth: 1.1 },
  { x: 2, z: -20, radius: 7, depth: 1.7 },
  { x: 18, z: -13, radius: 3.2, depth: 0.8 },
  { x: -20, z: -9, radius: 6, depth: 1.3 },
  { x: 9, z: 2, radius: 0.8, depth: 0.22 },
  { x: -2, z: 5, radius: 0.65, depth: 0.18 },
  { x: -4, z: -3, radius: 0.9, depth: 0.25 },
]

export function terrainHeight(x: number, z: number) {
  const undulation = 0.11 * Math.sin(x * 0.41 + z * 0.22) + 0.07 * Math.cos(z * 0.63 - x * 0.19)
  const grain = 0.032 * Math.sin(x * 3.7 + z * 2.1) * Math.cos(z * 4.3 - x)
  let height = -0.16 + undulation + grain
  for (const crater of craters) {
    const q = Math.hypot(x - crater.x, z - crater.z) / crater.radius
    const bowl = q < 1 ? -crater.depth * (1 - q * q) ** 2 : 0
    const rim = crater.depth * 0.24 * Math.exp(-(((q - 1) / 0.13) ** 2))
    height += bowl + rim
  }
  // A smooth central pad keeps the illustrative landed feet on the surface.
  const blend = Math.min(1, Math.max(0, (Math.hypot(x, z) - 1.8) / 1.5))
  const smooth = blend * blend * (3 - 2 * blend)
  return -0.16 * (1 - smooth) + height * smooth
}

export function terrainRocks() {
  let seed = 11071969
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  return Array.from({ length: 90 }, () => {
    const x = (random() - 0.5) * 42, z = (random() - 0.5) * 42
    const scale = 0.07 + random() ** 3 * 0.5
    return { x, z, y: terrainHeight(x, z) + scale * 0.24, scale, rotation: random() * Math.PI * 2 }
  }).filter(rock => Math.hypot(rock.x, rock.z) > 2.4)
}
