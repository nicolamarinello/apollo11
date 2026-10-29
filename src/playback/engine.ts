import type { ArchivalPlayback } from './types'

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))

export function frameAt(dataset: ArchivalPlayback, requestedMet: number) {
  const met = clamp(requestedMet, dataset.startMet, dataset.endMet)
  const phase = dataset.phases.findLast(p => p.met <= met)!
  const event = dataset.events.findLast(e => e.met <= met)!
  const observation = dataset.observations.findLast(o => o.met <= met) ?? null
  return { met, phase, event, observation, progress: (met - dataset.startMet) / (dataset.endMet - dataset.startMet), ended: met >= dataset.endMet }
}

export function advance(dataset: ArchivalPlayback, current: number, elapsedSeconds: number, speed: number) {
  return clamp(current + Math.max(0, elapsedSeconds) * Math.max(0, speed), dataset.startMet, dataset.endMet)
}

export function formatMet(seconds: number, decimal = false) {
  // Integer display floors, so the clock never shows a historical event before it happens.
  const tenths = Math.floor((seconds + 1e-7) * 10)
  const whole = Math.floor(tenths / 10)
  const h = Math.floor(whole / 3600)
  const m = Math.floor((whole % 3600) / 60)
  const s = whole % 60
  return `${String(h).padStart(3,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}${decimal ? `.${tenths % 10}` : ''}`
}

export function formatDuration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`
}
