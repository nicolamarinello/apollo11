import original from '../../public/archive/luminary099-landing.agc?raw'
import manifest from '../../public/archive/manifest.json'
import type { PhaseId } from '../playback/types'

const excerpts = {
  P63: { start: 72, end: 77, focus: 75, label: 'WHATGUID', page: '798', note: 'The guidance dispatch table selects the braking-phase calculation.' },
  P64: { start: 269, end: 277, focus: 269, label: 'STARTP64', page: '802', note: 'This entry changes the major mode to P64 and prepares approach guidance.' },
  P66: { start: 951, end: 956, focus: 955, label: 'P66VERTA', page: '816', note: 'The P66 vertical-guidance entry schedules the rate-of-descent task.' },
} as const

export default function SourcePanel({ phase }: { phase: PhaseId }) {
  if (phase === 'LANDED') return <aside className="source-panel landed-panel"><div className="eyebrow">LUMINARY 99 / REV 1</div><p>Historical playback complete.</p><span className="muted">No execution trace is loaded.</span></aside>
  const excerpt = excerpts[phase]
  const lines = original.split('\n').slice(excerpt.start - 1, excerpt.end)
  const url = `https://github.com/virtualagc/virtualagc/blob/${manifest.luminaryCommit}/Luminary099/LUNAR_LANDING_GUIDANCE_EQUATIONS.agc#L${excerpt.start}`
  return <aside className="source-panel" aria-label="Original guidance source">
    <div className="panel-heading"><span className="eyebrow">LUMINARY 99 / REV 1</span><span className="source-dot" /></div>
    <a className="routine-name" href={url} target="_blank" rel="noreferrer">{excerpt.label} <span>↗</span></a>
    <div className="source-caption">ASSEMBLY LISTING · P. {excerpt.page}</div>
    <pre aria-label="Assembly excerpt">{lines.map((line, index) => <div key={index} className={excerpt.start + index === excerpt.focus ? 'code-focus' : ''}><span className="line-number">{excerpt.start + index}</span><code>{line.replace(/\t/g, '  ')}</code></div>)}</pre>
    <p>{excerpt.note}</p>
    <div className="context-label">CONTEXT HIGHLIGHT · NO EXECUTION TRACE</div>
  </aside>
}
