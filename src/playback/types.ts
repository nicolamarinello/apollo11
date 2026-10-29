export type PhaseId = 'P63' | 'P64' | 'P66' | 'LANDED'
export type SourceId = 'nasa-timeline' | 'nasa-journal'

export interface Citation {
  source: SourceId
  locator: string
}

export interface Observation {
  met: number
  altitudeFt: number | null
  descentFps: number | null
  fuelPercent: number | null
  citation: Citation
}

export interface MissionEvent {
  met: number
  title: string
  explanation: string
  citation: Citation
}

export interface Phase extends MissionEvent {
  id: PhaseId
  label: string
}

export interface ArchivalPlayback {
  kind: 'archival-callouts'
  startMet: number
  endMet: number
  phases: readonly Phase[]
  observations: readonly Observation[]
  events: readonly MissionEvent[]
}

// A future AGC capture is a separate evidence product, not a relabelled callout dataset.
// See docs/TRACE_CONTRACT.md for the required review and validation before use.
export interface AgcCaptureSample {
  met: number
  positionM: readonly [number, number, number]
  orientationXyzw: readonly [number, number, number, number]
  velocityMps: readonly [number, number, number]
  program: number
  engineThrustN: number
  programCounter?: number
}
