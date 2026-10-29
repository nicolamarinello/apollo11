import { mission, sources } from '../data/mission'
import { formatMet } from '../playback/engine'
import { reportedPlot } from '../playback/plot'
import type { PlotChannel } from '../playback/plot'

const channels: { channel: PlotChannel; label: string; unit: string }[] = [
  { channel: 'altitudeFt', label: 'Altitude', unit: 'ft' },
  { channel: 'descentFps', label: 'Descent', unit: 'ft/s' },
  { channel: 'fuelPercent', label: 'Propellant', unit: '%' },
]
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 })
const scaleNumber = (value: number) => value >= 1000 ? `${number(value / 1000)}k` : number(value)

export default function TelemetryPlots({ met }: { met: number }) {
  return <section className="telemetry-plots" aria-label="Scrolling plots of archival instrument reports">
    <div className="plot-heading">CREW REPORTS <span>−2 MIN → NOW</span></div>
    {channels.map(({ channel, label, unit }) => {
      const plot = reportedPlot(mission.observations, channel, met)
      const latest = plot.latest
      const latestDescription = latest ? `${number(latest.value)} ${unit}, reported at ${formatMet(latest.met)}, ${Math.floor(met - latest.met)} seconds before playhead` : 'No reports in the last two minutes'
      return <figure className={`telemetry-plot ${channel}`} key={channel}>
        <figcaption><span>{label} <small>{unit}</small></span><span className="plot-value">{latest ? number(latest.value) : '—'}</span></figcaption>
        <svg viewBox="0 0 200 55" role="group" aria-label={`${label}: ${latestDescription}. Discrete reports; no interpolation.`}>
          <path className="plot-grid" d="M22 8H193 M22 46H193" />
          <text className="plot-axis" x="0" y="11">{scaleNumber(plot.max)}</text>
          <text className="plot-axis" x="0" y="48">0</text>
          <path className="plot-now" d="M193 5V49" />
          {plot.points.map(point => {
            const x = 22 + (point.met - plot.start) / (plot.end - plot.start) * 171
            const y = 46 - point.value / plot.max * 38
            const description = `${number(point.value)} ${unit} at ${formatMet(point.met)} · ${point.citation.locator}`
            return <a key={point.met} href={sources[point.citation.source].url} target="_blank" rel="noreferrer" aria-label={`${label}: ${description}`}>
              <title>{description}</title>
              <circle className="plot-hit" cx={x} cy={y} r="8" />
              <path className="plot-sample" d={`M${x - 2} ${y}h4`} />
              <circle className="plot-dot" cx={x} cy={y} r="1.8" />
            </a>
          })}
          {!latest && <text className="plot-empty" x="106" y="30" textAnchor="middle">No reports in window</text>}
        </svg>
        <div className="plot-timestamp">{latest ? <a href={sources[latest.citation.source].url} target="_blank" rel="noreferrer" title={latestDescription}>AT {formatMet(latest.met)} <span>↗</span></a> : <span>Awaiting a reported reading</span>}</div>
      </figure>
    })}
    <p className="plot-footnote">Discrete reports · gaps retained</p>
  </section>
}
