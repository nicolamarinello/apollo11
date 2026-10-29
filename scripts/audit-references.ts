import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { mission } from '../src/data/mission.ts'
import { formatMet } from '../src/playback/engine.ts'

const root = new URL('../',import.meta.url)
const manifest = JSON.parse(await readFile(new URL('public/archive/manifest.json',root),'utf8'))
const documents = new Map<string,string>()
for(const asset of manifest.assets.filter((a: {bundled: boolean})=>!a.bundled)) {
  let bytes: Uint8Array
  try { bytes = await readFile(new URL(`.research/${asset.file}`,root)) }
  catch {
    if(!process.argv.includes('--online')) throw new Error('Research snapshots are not bundled. Use npm run audit:references -- --online to retrieve the fingerprinted references.')
    const response = await fetch(asset.url)
    assert.ok(response.ok,`Reference download failed: ${response.status}`)
    bytes = new Uint8Array(await response.arrayBuffer())
  }
  assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256,`${asset.file} changed: review and re-fingerprint before auditing`)
  documents.set(asset.file,new TextDecoder('windows-1252').decode(bytes))
}
const plain = (text: string) => text.replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim()
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g,'')
const rows = [...documents.get('nasa-timeline.html')!.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>plain(m[1]))
for(const item of [...mission.phases,...mission.events,...mission.observations].filter(x=>x.citation.source==='nasa-timeline')) {
  const [label,time] = item.citation.locator.split(' · ')
  const citedMet = time.split(';')[0].split(':').reduce((total: number,part: string)=>total*60+Number(part),0)
  assert.ok(Math.abs(citedMet-item.met)<1e-6,`Time and citation disagree: ${item.citation.locator}`)
  assert.ok(rows.some(row=>normalize(row).includes(normalize(label)) && row.includes(time.split(';')[0])),`Unmatched event: ${item.citation.locator}`)
}
const transcript = plain(documents.get('nasa-landing-journal.html')!)
for(const observation of mission.observations.filter(o=>o.citation.source==='nasa-journal')) {
  const time = formatMet(observation.met)
  const matches = [...transcript.matchAll(new RegExp(`${time} (?:Armstrong|Aldrin)[\\s\\S]*?(?=102:\\d{2}:\\d{2}|$)`,'g'))]
  const normalized = matches.map(m=>m[0].replace(/(\d+) 1\/2/g,(_,integer)=>`${Number(integer)+0.5}`).replace(/Five/g,'5'))
  assert.ok(normalized.some(segment=>[observation.altitudeFt,observation.descentFps].every(n=>n===null || new RegExp(`\\b${String(n).replace('.','\\.')}\\b`).test(segment)) && (observation.fuelPercent===null || segment.includes(`${observation.fuelPercent} percent`))),`Callout mismatch at ${time}`)
}
console.log('Audited all mission events and 12 callouts against fingerprinted NASA references. This checks transcription, not simulation validity.')
