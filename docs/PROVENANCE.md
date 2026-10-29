# Evidence and provenance ledger

Research date: 29 October 2026. Fingerprints and retrieval URLs: [`public/archive/manifest.json`](../public/archive/manifest.json).

## Mission events

[NASA Apollo 11 timeline, SP-4029](https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm) supplies the event table. The powered-descent window is GET 102:33:05.01 to 102:45:39.9. P64 begins at 102:41:32 and the rate-of-descent landing phase at 102:43:22. These are archival event times, not observed program-counter transitions. P63 labels the braking phase at ignition, not the time P63 was first selected by the crew.

Additional event markers: 1202 at 102:38:22 and low-level quantity light at 102:44:28. Engine cutoff at 102:45:41.40 is outside the current window. The 50,000-foot altitude entry at 102:32:55 predates ignition and is displayed with that earlier timestamp.

## Instrument callouts

[Apollo Lunar Surface Journal, The First Lunar Landing](https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.landing.html), revised 10 May 2018. Each row below was checked against the timestamped crew callout in the retrieved document. This checks transcription against that reference; it does not establish downlink accuracy or independently validate each measurement.

| GET | Altitude (ft) | Descent (ft/s, downward positive) | Propellant (%) |
| --- | ---: | ---: | ---: |
| 102:41:51 | 5000 | 100 | — |
| 102:42:13 | 3000 | 70 | — |
| 102:42:24 | 2000 | 50 | — |
| 102:42:37 | 1000 | 30 | — |
| 102:43:01 | 750 | 23 | — |
| 102:43:26 | 400 | 9 | — |
| 102:43:46 | 300 | 3.5 | — |
| 102:44:07 | 250 | 2.5 | — |
| 102:44:31 | 160 | 6.5 | — |
| 102:44:45 | 100 | 3.5 | 5 |
| 102:45:17 | 40 | 2.5 | — |
| 102:45:21 | 30 | 2.5 | — |

The disputed 102:44:00 fuel utterance is excluded. Callouts are rounded, and transcript timing has uncertainty. No continuous trajectory, fuel curve, inferred velocity, or fake surface observation is derived from them. The final airborne callout remains visible at landing with its timestamp.

## Software provenance

[Virtual AGC Luminary documentation](https://www.ibiblio.org/apollo/Luminary.html) distinguishes unflown 99/0 from flown **99/1**, describes binary proofing, and documents a NASSP landing demonstration. The bundled `LUNAR_LANDING_GUIDANCE_EQUATIONS.agc` was downloaded from repository commit `17f42cbf4bcd4b0699815f79e8271fddafb76855`, the last change to this file at retrieval, rather than a mutable branch URL. Its header identifies revision 001 of LMY99 and the MIT Museum transcription history. SHA-256: `544a199bb9808a225b5c14eeead783fe52cdad92c9b10a63697fc1aec921f44f`.

The pinned file's lines 72–77 (listing p.798), 269–277 (p.802) and 951–956 (p.816) provide educational context. Their inclusion is not evidence that these instructions execute at the displayed time. No emulator, rope, PC/bank trace or symbol table is bundled.

## Rights and materials

The AGC file retains its public-domain statement and full attribution header. Virtual AGC's modern emulator is generally GPL; it is not included or linked into this app. Reassess exact component licenses before adding it. NASA-hosted documents can contain third-party copyrighted material: the Journal explicitly reserves rights in its corrected transcript/commentary. Only selected factual instrument values and original paraphrases are used here. Full NASA HTML research downloads are ignored local files, with hashes retained in the manifest. Terrain geometry is authored for this app; the spacecraft geometry comes from NASA's model below.

## Rendered NASA model

The original Apollo Lunar Module GLB from [NASA Science](https://science.nasa.gov/3d-resources/apollo-lunar-module/) is stored at `public/models/nasa-apollo-lunar-module.glb`, credited to NASA/Michael D. Carbajal, and replaces the hand-built placeholder. The model manifest records the direct NASA download URL, retrieval date, byte count, fingerprint, embedded metadata and required Draco compression extension. Geometry is decoded in browser workers with a locally hosted decoder from Three.js 0.186.1. Decoder attribution and hashes are under `public/vendor/draco/`.

The renderer clones the imported scene/materials, preserves the source geometry and textures, applies muted colors/roughness/flat shading, and normalizes the footprint and landing-pad plane to the existing illustrative scene. The original GLB is unchanged, covered by `npm run verify:assets`, and the model is visually checked in the scene. These visual adjustments do not supply a measured trajectory, attitude history or site model, and do not validate an exact LM-5 mission configuration.
