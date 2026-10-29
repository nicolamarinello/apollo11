# NASA Apollo Lunar Module

`nasa-apollo-lunar-module.glb` is the original, unmodified GLB downloaded from [NASA Science's Apollo Lunar Module page](https://science.nasa.gov/3d-resources/apollo-lunar-module/) on 29 October 2026.

**Credit: NASA/Michael D. Carbajal.** Source links, size and SHA-256 are recorded in `manifest.json`. Refer to [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/) for use and attribution; including this file does not imply NASA endorsement of the app.

- Size: 716,840 bytes (700.04 KiB).
- GLB header identifies glTF 2.0; declared file length matches the download.
- JSON metadata lists 134 meshes, 12 materials and 6 embedded images, with no external buffer/image dependencies.
- Requires `KHR_draco_mesh_compression`: use Three.js `GLTFLoader` with a configured `DRACOLoader` when integrating it. Geometry has not yet been decoded or visually verified in this project.
- The app currently renders its existing simplified model. This downloaded original is prepared for a subsequent scene integration and visual treatment.

Keep this original intact; save any styled or optimized derivative separately with its own provenance. Run `npm run verify:assets` to check the downloaded file's fingerprint.
