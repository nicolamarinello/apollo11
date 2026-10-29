import { lazy, Suspense, useEffect, useState } from 'react'
import { mission, sources } from './data/mission'
import { formatDuration, formatMet } from './playback/engine'
import { usePlayback } from './playback/usePlayback'
import SourcePanel from './components/SourcePanel'
import EvidenceDialog from './components/EvidenceDialog'
import TelemetryPlots from './components/TelemetryPlots'

const LunarScene = lazy(() => import('./scene/LunarScene'))

export default function App() {
  const { frame, playing, speed, setSpeed, seek, toggle } = usePlayback()
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenNote, setFullscreenNote] = useState('')
  const { phase, event } = frame
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (evidenceOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLAnchorElement) return
      if (e.target instanceof HTMLCanvasElement && e.code !== 'Space') return
      if (e.code === 'Space') { e.preventDefault(); toggle() }
      if (e.code === 'ArrowRight') { e.preventDefault(); seek(frame.met + 10) }
      if (e.code === 'ArrowLeft') { e.preventDefault(); seek(frame.met - 10) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [frame.met, toggle, seek, evidenceOpen])
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else setFullscreenNote('This browser supports the immersive viewport only.')
    } catch { setFullscreenNote('Fullscreen is unavailable in this view.') }
  }
  return <main className="mission-app">
    <Suspense fallback={<div className="scene-loading">Preparing the lunar scene…</div>}><LunarScene phase={phase.id} /></Suspense>
    <div className="scene-vignette" />
    <header className="mission-header">
      <div className="wordmark"><span className="mission-insignia">A<span>11</span></span><div><h1>EAGLE</h1><p>APOLLO 11 <span>/</span> POWERED DESCENT</p></div></div>
      <div className="header-actions"><span className="archive-status"><i /> ARCHIVAL PLAYBACK</span><button className="code-toggle" onClick={() => setCodeOpen(open => !open)} aria-label={codeOpen ? 'Hide guidance source' : 'Show guidance source'} aria-pressed={codeOpen} title="Original guidance source">〈/〉</button><button className="icon-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{fullscreen ? '⊡' : '⛶'}</button></div>
    </header>
    <div className="mission-clock"><span className="eyebrow">MISSION ELAPSED TIME</span><time>{formatMet(frame.met, true)}</time><div className="phase-status"><strong>{phase.id === 'LANDED' ? 'SURFACE' : phase.id}</strong><span>{phase.label}</span></div></div>
    <TelemetryPlots met={frame.met} />
    {codeOpen && <SourcePanel phase={phase.id} />}
    <section className="mission-note" aria-label="Mission explanation" aria-live="polite">
      <a href={sources[event.citation.source].url} target="_blank" rel="noreferrer" title={event.citation.locator}>{formatMet(event.met,event.met % 1 !== 0)} <span>↗</span></a>
      <h2>{event.title}</h2><p>{event.explanation}</p>
    </section>
    <footer className="playback-footer">
      <div className="transport-row"><div className="transport"><button className="play-button" onClick={toggle} aria-label={playing ? 'Pause playback' : frame.ended ? 'Replay descent' : 'Play descent'}>{playing ? 'Ⅱ' : '▶'}</button><span>{frame.ended ? 'DESCENT COMPLETE' : playing ? 'PLAYING' : 'PAUSED'}</span><span className="elapsed">{formatDuration(frame.met-mission.startMet)} <b>/</b> {formatDuration(mission.endMet-mission.startMet)}</span><select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[1,5,10,30,60].map(value=><option value={value} key={value}>{value}×</option>)}</select></div><button className="evidence-button" onClick={()=>setEvidenceOpen(true)}>SOURCES & METHOD <span>↗</span></button></div>
      <div className="timeline">
        <div className="timeline-track"><div className="timeline-fill" style={{width:`${frame.progress*100}%`}} /><i className="timeline-head" style={{left:`${frame.progress*100}%`}} /></div>
        <input className="timeline-input" type="range" aria-label="Mission timeline" aria-valuetext={`${formatMet(frame.met,true)}, ${phase.label}`} min={mission.startMet} max={mission.endMet} step={0.01} value={frame.met} onChange={e=>seek(Number(e.target.value))} />
        <div className="phase-markers">{mission.phases.map((p,i)=><button key={p.id} className={`phase-marker ${phase.id === p.id ? 'active' : ''} ${i===3 ? 'last' : ''}`} style={{left:`${(p.met-mission.startMet)/(mission.endMet-mission.startMet)*100}%`}} onClick={()=>seek(p.met)} aria-label={`Jump to ${p.id}: ${p.label}`}><i /><strong>{p.id === 'LANDED' ? 'TOUCHDOWN' : p.id}</strong><span>{p.label}</span></button>)}</div>
      </div>
      <div className="footer-fineprint"><span>ARCHIVAL CALLOUTS · SCHEMATIC SCENE · NO AGC TRACE</span><span>SPACE TO PLAY / PAUSE <b>·</b> ← → 10 SECONDS</span></div>
    </footer>
    {fullscreenNote && <div role="status" className="fullscreen-note" onClick={()=>setFullscreenNote('')}>{fullscreenNote}</div>}
    {evidenceOpen && <EvidenceDialog onClose={()=>setEvidenceOpen(false)} />}
  </main>
}
