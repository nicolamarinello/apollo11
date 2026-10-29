import { useEffect, useState } from 'react'

interface Archive {
  source: string
  manifest: { luminaryCommit: string; assets: { file: string; sha256: string }[] }
}
let request: Promise<Archive> | undefined

function loadArchive() {
  return request ??= (async () => {
    const [sourceResponse, manifestResponse] = await Promise.all([
      fetch('/archive/luminary099-landing.agc'), fetch('/archive/manifest.json'),
    ])
    if (!sourceResponse.ok || !manifestResponse.ok) throw new Error('Archive unavailable')
    const [bytes, manifest] = await Promise.all([sourceResponse.arrayBuffer(), manifestResponse.json()])
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    if (hash !== manifest.assets.find((asset: {file: string}) => asset.file === 'luminary099-landing.agc')?.sha256) throw new Error('Source integrity check failed')
    return { source: new TextDecoder().decode(bytes), manifest } as Archive
  })()
}

export function useArchive() {
  const [archive, setArchive] = useState<Archive | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    loadArchive().then(value => { if (active) setArchive(value) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])
  return { archive, error }
}
