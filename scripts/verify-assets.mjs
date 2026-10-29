import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const root = new URL('../public/archive/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'))
for (const asset of manifest.assets.filter(a => a.bundled)) {
  const data = await readFile(new URL(asset.file, root))
  assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256, asset.file)
  assert.equal(data.length, asset.bytes)
  console.log(`Verified pinned asset: ${asset.file}`)
}
