import type { ArchivalPlayback, Citation, MissionEvent, Observation, Phase, SourceId } from '../playback/types'

export const met = (h: number, m: number, s: number) => h * 3600 + m * 60 + s
const citation = (source: SourceId, locator: string): Citation => ({ source, locator })
const timeline = (locator: string) => citation('nasa-timeline', locator)
const journal = (locator: string) => citation('nasa-journal', locator)

export const sources = {
  'nasa-timeline': {
    title: 'NASA · Apollo 11 mission timeline',
    url: 'https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm',
  },
  'nasa-journal': {
    title: 'NASA · Apollo Lunar Surface Journal',
    url: 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.landing.html',
  },
} as const

const phases: Phase[] = [
  { id: 'P63', label: 'Braking', met: met(102,33,5.01), title: 'The descent begins.', explanation: 'Eagle fires its descent engine. P63 guides the braking phase, reducing orbital velocity before the approach.', citation: timeline('LM powered descent engine ignition · 102:33:05.01') },
  { id: 'P64', label: 'Approach', met: met(102,41,32), title: 'The landing site comes into view.', explanation: 'P64 begins the approach. Eagle pitches toward an upright attitude so the crew can assess the landing area.', citation: timeline('LM approach phase entered · 102:41:32') },
  { id: 'P66', label: 'Crew-assisted', met: met(102,43,22), title: 'Armstrong takes a more direct role.', explanation: 'In P66, Armstrong steers toward a safer site and commands descent rate. The computer continues to assist the landing.', citation: timeline('LM rate of descent landing phase entered · 102:43:22') },
  { id: 'LANDED', label: 'Touchdown', met: met(102,45,39.9), title: 'Eagle has landed.', explanation: 'The mission timeline records lunar landing at 102:45:39.9. Engine cutoff follows at 102:45:41.40, beyond this playback.', citation: timeline('LM lunar landing · 102:45:39.9; engine cutoff · 102:45:41.40') },
]

// Discrete reported readings, never interpolated or presented as continuous downlink.
// Each row is a single callout; absent channels deliberately remain null.
const observation = (m: number, s: number, altitudeFt: number, descentFps: number | null, fuelPercent: number | null = null): Observation => ({
  met: met(102,m,s), altitudeFt, descentFps, fuelPercent,
  citation: journal(`Crew instrument callout · 102:${m}:${String(s).padStart(2,'0')}`),
})
const observations: Observation[] = [
  { met: met(102,32,55), altitudeFt: 50000, descentFps: null, fuelPercent: null, citation: timeline('LM altitude 50,000 feet · 102:32:55') },
  observation(41,51,5000,100),
  observation(42,13,3000,70),
  observation(42,24,2000,50),
  observation(42,37,1000,30),
  observation(43,1,750,23),
  observation(43,26,400,9),
  observation(43,46,300,3.5),
  observation(44,7,250,2.5),
  observation(44,31,160,6.5),
  observation(44,45,100,3.5,5),
  observation(45,17,40,2.5),
  observation(45,21,30,2.5),
]

const events: MissionEvent[] = [
  phases[0],
  { met: met(102,38,22), title: 'A 1202 program alarm.', explanation: 'The mission timeline records a 1202 alarm during braking. This playback marks the recorded event; it does not emulate the computer’s response.', citation: timeline('LM 1202 alarm · 102:38:22') },
  phases[1], phases[2],
  { met: met(102,44,28), title: 'Propellant is running low.', explanation: 'The low-level quantity light is recorded in the mission timeline. This is an event marker, not a continuous fuel measurement.', citation: timeline('LM fuel low-level quantity light · 102:44:28') },
  phases[3],
]

export const mission: ArchivalPlayback = {
  kind: 'archival-callouts', startMet: phases[0].met, endMet: phases[3].met,
  phases, observations, events,
}
