import { useEffect, useRef } from 'react'
import { sources } from '../data/mission'
import manifest from '../../public/archive/manifest.json'

export default function EvidenceDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close() }, [])
  return <dialog ref={ref} onCancel={onClose} onClick={e => { if(e.target === ref.current) onClose() }} aria-labelledby="evidence-title">
    <div className="dialog-inner">
      <div className="panel-heading"><span className="eyebrow">THE HISTORICAL RECORD</span><button onClick={onClose} aria-label="Close sources">✕</button></div>
      <h2 id="evidence-title">What you’re watching.</h2>
      <p>This first build replays archival events and discrete instrument readings reported by the crew. It is <strong>not an AGC-driven simulation or continuous telemetry recording</strong>.</p>
      <p>Readings stay at their reported values, with their original timestamps. Missing channels are blank. At touchdown, the final airborne reading remains a historical callout; it is not a surface measurement.</p>
      <p>The lander, terrain, altitude spacing, and attitude are schematic illustrations of each phase. They do not reproduce the trajectory or landing site. No thrust or fuel curve is inferred.</p>
      <div className="evidence-section"><h3>Mission evidence</h3>{Object.entries(sources).map(([id,source]) => <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}<p>Event times follow NASA’s mission timeline. Callouts follow the Lunar Surface Journal’s transcript timestamps; these are rounded reports, with transcription and synchronization uncertainty.</p></div>
      <div className="evidence-section"><h3>Original software</h3><p>Luminary 99 revision 1, preserved by Virtual AGC. Highlights identify an educational context, not a program counter. No emulator, rope binary, symbol table, or execution trace is loaded.</p><a href={`https://github.com/virtualagc/virtualagc/tree/${manifest.luminaryCommit}/Luminary099`} target="_blank" rel="noreferrer">Pinned source · {manifest.luminaryCommit.slice(0,12)} ↗</a><a href="/archive/manifest.json" target="_blank" rel="noreferrer">Provenance and SHA-256 fingerprints ↗</a></div>
      <div className="evidence-section"><h3>Credits & reuse</h3><p>The included AGC file is marked public domain by Virtual AGC. The Lunar Surface Journal’s corrected transcript and commentary carry Eric M. Jones’s copyright; we link to them and use selected factual readings, without republishing that document. All scene geometry is original to this project.</p></div>
    </div>
  </dialog>
}
