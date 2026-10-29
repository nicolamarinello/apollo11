import type { Observation } from './types'

export type PlotChannel = 'altitudeFt' | 'descentFps' | 'fuelPercent'
export const PLOT_WINDOW_SECONDS = 120

export function reportedPlot(observations: readonly Observation[], channel: PlotChannel, now: number) {
  const start = now - PLOT_WINDOW_SECONDS
  const points = observations.flatMap(observation => {
    const value = observation[channel]
    return value === null || observation.met < start || observation.met > now
      ? [] : [{ met: observation.met, value, citation: observation.citation }]
  })
  const max = channel === 'fuelPercent' ? 100 : Math.max(1, ...points.map(point => point.value)) * 1.15
  return { start, end: now, points, latest: points.at(-1) ?? null, max }
}
