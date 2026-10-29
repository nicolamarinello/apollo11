import { useCallback, useEffect, useState } from 'react'
import { mission } from '../data/mission'
import { advance, clamp, frameAt } from './engine'

export function usePlayback() {
  const [time, setTime] = useState(mission.startMet)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const ended = time >= mission.endMet
  useEffect(() => { if (ended) setPlaying(false) }, [ended])
  useEffect(() => {
    if (!playing || ended) return
    let id: number
    let previous: number | undefined
    const tick = (now: number) => {
      if (previous !== undefined && !document.hidden && now - previous >= 100) {
        setTime(t => advance(mission, t, (now - previous!) / 1000, speed))
        previous = now
      }
      if (previous === undefined || document.hidden) previous = now
      id = requestAnimationFrame(tick)
    }
    const resetClock = () => { previous = undefined }
    document.addEventListener('visibilitychange', resetClock)
    id = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); document.removeEventListener('visibilitychange', resetClock) }
  }, [playing, speed, ended])
  const seek = useCallback((value: number) => setTime(clamp(value, mission.startMet, mission.endMet)), [])
  const toggle = useCallback(() => {
    if (ended) { setTime(mission.startMet); setPlaying(true) }
    else setPlaying(p => !p)
  }, [ended])
  return { frame: frameAt(mission, time), playing: playing && !ended, speed, setSpeed, seek, toggle }
}
