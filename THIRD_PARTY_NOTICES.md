# Third-party materials

- `public/archive/luminary099-landing.agc`: original Apollo Luminary 1A build 099 revision 001 source, transcribed by Virtual AGC contributors from MIT Museum listing images. File header declares public domain and credits Hartmuth Gutsche, Paul Fjeld, Deborah Douglas and subsequent contributors. Header is retained intact. See the pinned URL and checksum in the provenance manifest.
- NASA SP-4029 Apollo 11 event timeline: factual mission times, linked in the application. Not bundled as a document.
- Apollo Lunar Surface Journal, Eric M. Jones: selected factual crew instrument readings and reference links. Corrected transcript/commentary copyright © 1995 Eric M. Jones, all rights reserved. No full transcript or commentary redistributed.
- Runtime packages retain their own licenses in `node_modules`: React/React DOM, React Three Fiber, Three.js and tooling. No Virtual AGC/NASSP runtime code is incorporated.
- Google Fonts: Inter, IBM Plex Mono and Barlow Condensed are requested via stylesheet under their open font licenses; system fallback fonts work without network access.
- `public/models/nasa-apollo-lunar-module.glb`: original Apollo Lunar Module GLB from NASA Science. Credit: **NASA/Michael D. Carbajal**. Source and checksum are in `public/models/manifest.json`; usage reference: [NASA media guidelines](https://www.nasa.gov/nasa-brand-center/). Used in the scene with runtime material/scale adjustments; the downloaded file remains unmodified.
- `public/vendor/draco/`: Google Draco decoder files distributed with Three.js 0.186.1, under Apache-2.0. The upstream README, full license and file fingerprints are included. Decoding runs locally in browser workers. Three.js also includes decoder assets in its production bundle.

No license for the original application code has been selected by the repository owner yet. Do not assume that the public-domain status of historical AGC software applies to the new application or its dependencies.
