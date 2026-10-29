# Eagle · Apollo 11 powered descent

An immersive educational web app in React, TypeScript, Vite and React Three Fiber. The initial local build opens directly into a dark navy technical illustration, with a stylized Lunar Module, restrained gold, historical callouts, original assembly source and a thin red mission timeline.

## Run

Requires Node 22.12+ (developed on Node 24).

```sh
npm ci
npm run dev
```

```sh
npm test
npm run verify:assets
npm run build
```

Use Space to play/pause and left/right arrows to seek ten seconds. The timeline and phase buttons support seeking. Available playback speeds: 1×, 5×, 10×, 30×, 60×. Playback pauses while the page is hidden and stops at touchdown. The viewport is immersive from load; browser-level fullscreen needs the fullscreen button because browsers require a user gesture.

## Evidence status

**This build is an archival event/callout playback, not a verified AGC-driven simulation or continuous downlinked telemetry.** No validated machine-readable AGC descent trace was obtained. It must not be advertised as one.

The mission is limited to the historical P63 → P64 → crew-assisted P66 → touchdown sequence. A small set of factual readings is transcribed from NASA-hosted records, with source and timestamp for every row. The app holds the latest complete observation without interpolating; missing channels remain blank. These are rounded instrument callouts, not rigorously verified telemetry. The time since the original report is always visible. The renderer uses phase illustrations, not a reconstructed trajectory.

Original Luminary source is real, pinned and fingerprinted. Highlighting means educational context. There is no instruction trace. Original flight sequence tables contain references to P65/P67; displaying archival software does not add those alternative flight paths to the playback.

See [provenance](docs/PROVENANCE.md), [implementation plan](docs/PLAN.md), [capture contract](docs/TRACE_CONTRACT.md) and [third-party notices](THIRD_PARTY_NOTICES.md).

## Architecture

- `src/data/mission.ts`: source-attributed events, phase boundaries and discrete observations.
- `src/playback/`: pure time/evidence lookup and transport state. No scene calculations.
- `src/scene/`: original low-poly illustration, with no telemetry calculations.
- `src/components/`: source context and evidence disclosure.
- `public/archive/`: pinned AGC file plus provenance fingerprints.

The source panel loads the exact archived file rather than a hand-retyped facsimile. NASA HTML snapshots used during research are ignored local files, not application assets.

`npm run audit:references -- --online` retrieves the two fingerprinted NASA references and checks event rows and numeric callouts against them. When the ignored `.research/` snapshots exist, the audit uses those instead. A changed reference fingerprint fails for review; it is never silently accepted. This verifies transcription against a reference, not historical simulation accuracy.

## Current limits

No position/attitude/downlink trace, continuous fuel history, audio synchronization, mapped landing-site terrain, live AGC execution, or verified program-counter map. Source transcription checks are documented separately from simulation validation. Browser fallback retains playback if WebGL is unavailable.
