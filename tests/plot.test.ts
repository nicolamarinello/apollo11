import test from 'node:test'
import assert from 'node:assert/strict'
import { mission, met } from '../src/data/mission.ts'
import { reportedPlot } from '../src/playback/plot.ts'

test('plot scrolling excludes future reports and expires old reports', () => {
  const time = met(102,43,26)
  const plot = reportedPlot(mission.observations, 'altitudeFt', time)
  assert.equal(plot.latest?.value, 400)
  assert.ok(plot.points.every(point => point.met <= time && point.met >= time-120))
  assert.equal(plot.points.length, 6)
  assert.equal(reportedPlot(mission.observations,'altitudeFt',met(102,40,0)).latest,null)
})
test('sparse fuel reports remain individual evidence points with fixed percent scale', () => {
  const before = reportedPlot(mission.observations,'fuelPercent',met(102,44,44))
  assert.deepEqual(before.points, [])
  const at = reportedPlot(mission.observations,'fuelPercent',met(102,44,45))
  assert.equal(at.points.length,1)
  assert.equal(at.latest?.value,5)
  const later = reportedPlot(mission.observations,'fuelPercent',mission.endMet)
  assert.deepEqual(later.points,at.points)
  assert.equal(later.max,100)
})
test('plot seeking backwards removes later observations and does not synthesize a playhead sample', () => {
  const on = reportedPlot(mission.observations,'descentFps',met(102,42,13))
  const between = reportedPlot(mission.observations,'descentFps',met(102,42,20))
  assert.deepEqual(between.points,on.points)
  const earlier = reportedPlot(mission.observations,'descentFps',met(102,42,12))
  assert.equal(earlier.latest?.met,met(102,41,51))
  assert.equal(earlier.latest?.value,100)
  assert.ok(earlier.points.every(point => point.met !== met(102,42,12)))
})
