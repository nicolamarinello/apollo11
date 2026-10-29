import test from 'node:test'
import assert from 'node:assert/strict'
import { mission, met } from '../src/data/mission.ts'
import { advance, formatMet, frameAt } from '../src/playback/engine.ts'

test('historical phase changes occur exactly at the archival time', () => {
  for(const [index,phase] of mission.phases.entries()) {
    assert.equal(frameAt(mission,phase.met).phase.id,phase.id)
    if(index) assert.equal(frameAt(mission,phase.met-0.001).phase.id,mission.phases[index-1].id)
  }
  assert.deepEqual(mission.phases.map(p=>p.id),['P63','P64','P66','LANDED'])
})
test('sparse observations never interpolate, leak future values, or fill absent channels', () => {
  const before = frameAt(mission,met(102,41,50.99))
  assert.equal(before.observation?.altitudeFt,50000)
  assert.equal(before.observation?.descentFps,null)
  const on = frameAt(mission,met(102,41,51))
  assert.equal(on.observation?.altitudeFt,5000)
  assert.equal(frameAt(mission,met(102,42,0)).observation,on.observation)
  assert.equal(on.observation?.fuelPercent,null)
  assert.equal(frameAt(mission,met(102,44,45)).observation?.fuelPercent,5)
  assert.equal(frameAt(mission,met(102,45,17)).observation?.fuelPercent,null)
})
test('seeking backwards resets evidence and touchdown does not invent surface telemetry', () => {
  assert.equal(frameAt(mission,mission.endMet).observation?.altitudeFt,30)
  assert.equal(frameAt(mission,mission.endMet).ended,true)
  assert.equal(frameAt(mission,mission.startMet).observation?.altitudeFt,50000)
  assert.equal(frameAt(mission,mission.startMet).phase.id,'P63')
})
test('playback clamps seeks, advances using elapsed time and stops at touchdown', () => {
  assert.equal(frameAt(mission,-1).met,mission.startMet)
  assert.equal(frameAt(mission,Infinity).met,mission.startMet)
  assert.equal(frameAt(mission,mission.endMet+1).met,mission.endMet)
  assert.equal(advance(mission,mission.startMet,2,30),mission.startMet+60)
  assert.equal(advance(mission,mission.endMet-1,2,30),mission.endMet)
  assert.equal(advance(mission,mission.startMet,-1,30),mission.startMet)
})
test('mission clock does not round to the next phase before it occurs', () => {
  assert.equal(formatMet(met(102,41,31.999)), '102:41:31')
  assert.equal(formatMet(met(102,45,39.9),true), '102:45:39.9')
})
test('dataset evidence is chronological, attributable, and bounded', () => {
  for(const entries of [mission.phases,mission.events,mission.observations]) {
    for(const [index,item] of entries.entries()) {
      assert.ok(item.citation.source)
      assert.ok(item.citation.locator.includes('102:'))
      if(index) assert.ok(item.met>entries[index-1].met)
    }
  }
})
