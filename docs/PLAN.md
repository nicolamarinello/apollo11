# Implementation and evidence plan

## First increment (implemented)

- Local React/TypeScript/Vite application; no marketing page.
- Navy technical illustration, original simplified R3F Lunar Module and terrain.
- Historical phase timeline, discrete callouts, source-linked educational notes.
- Seek/play/pause/speed controls, keyboard access, viewport layout and fullscreen control.
- Genuine, pinned Luminary 99/1 source excerpts labeled as contextual highlights.
- Provenance, integrity checks and playback tests.

## Scene and interface refinement (implemented)

- Mouse/touch orbit, wheel/pinch zoom, constrained pan and reset; keyboard camera controls when focused.
- Demand rendering with control-driven invalidation and reduced-motion support.
- Procedural crater bowls and raised rims, faceted regolith, deterministic rock placement and shadows; terrain remains illustrative.
- Compact scrolling plots of the preceding two minutes of reported altitude, descent rate and propellant. Sample timestamps, gaps and source links are retained; values are never synthesized to fill a graph.
- Code panel available on demand; guidance phase integrated with the mission clock; responsive plot strip on small screens.
- NASA/Michael D. Carbajal's Lunar Module GLB replaces the placeholder; local Draco decoding, muted materials, normalized footprint and landing-pad alignment. Original asset and geometry are preserved, with credit available in the sources dialog.

This increment establishes the visual and playback architecture. It does **not** satisfy the verified simulation/telemetry milestone below.

## Next increment: obtain a reproducible historical capture

Investigate a suitable NASSP/Orbiter Apollo 11 scenario using Virtual AGC. Virtual AGC's [Luminary page](https://www.ibiblio.org/apollo/Luminary.html) documents a landing demonstration using 99/1; a video is evidence of feasibility, not an exportable or validated trace.

1. Identify simulator versions, license terms, scenario state and rope revision. Pin every input.
2. Establish a reproducible replay of the actual crew-assisted descent, including control inputs and timing. A successful autonomous landing would not satisfy this task.
3. Export state and AGC mode changes at a documented cadence. Preserve missing and suspect channels; record coordinate frames, units, clocks, initial conditions, random seeds and restart behavior.
4. Compare ignition, P64, P66, landing, attitude, altitude, velocities and propellant behavior against the Apollo 11 Mission Report, with explicit tolerances and results. Resolve contact-light, landing and engine-cutoff definitions separately.
5. Publish the capture provenance, checksums, input scripts and independent comparison results before marking the dataset verified. A plausible visual landing is insufficient.

An alternative is archival measured telemetry with independently checked extraction and documented accuracy. Digitizing a chart requires calibration and uncertainty estimates; interpolation does not upgrade it to measured telemetry.

## Then: authentic source mapping

Build the precise rope using a pinned yaYUL version and retain its symbol table/listing. Capture program-counter/bank state with timestamps. Validate address-to-source mapping against the assembled binary. Only that evidence enables execution highlighting. Program-mode context alone remains labeled context.

## Then: renderer driven by evidence

Consume validated position/quaternion samples via a renderer adapter with explicit coordinate conversions. Define visual interpolation separately from measured channels. Add regression comparisons at historical milestones, endpoint seeking, gaps and changing playback speed. Keep schematic terrain labeled until a mapped surface is introduced.

## Scope and release gate

No P65 alternate landing and no live browser AGC in this stage. Do not publish a claim of authentic AGC-driven playback until capture, licensing review and comparison results exist. A release should expose its evidence report and reproducible capture, not merely its source-code repository.
