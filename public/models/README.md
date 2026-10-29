# NASA Apollo Lunar Module

`nasa-apollo-lunar-module.glb` is the original, unmodified GLB downloaded from [NASA Science's Apollo Lunar Module page](https://science.nasa.gov/3d-resources/apollo-lunar-module/) on 29 October 2026.

**Credit: NASA/Michael D. Carbajal.** Source links, size and SHA-256 are recorded in `manifest.json`. Refer to [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/) for use and attribution; including this file does not imply NASA endorsement of the app.

- Size: 716,840 bytes (700.04 KiB).
- GLB header identifies glTF 2.0; declared file length matches the download.
- JSON metadata lists 134 meshes, 12 materials and 6 embedded images, with no external buffer/image dependencies.
- Requires `KHR_draco_mesh_compression`. The app loads this original file using Three.js `GLTFLoader` with a locally hosted Draco decoder. Geometry is decoded in the browser and has been visually inspected in the scene.
- `src/scene/NasaLunarModule.tsx` clones the loaded scene and materials, scales the horizontal footprint to 2.8 illustrative scene units, centers it horizontally, and places the bottom of the landing pads at −0.89 relative to the phase pose. At touchdown the pads meet the terrain's −0.16 surface plane. This is visual normalization, not a declaration of real-world scale or a measured vehicle pose.
- Materials receive muted gold/neutral colors, increased roughness and flat shading while retaining the original model geometry and textures. Rendering changes happen in memory; the GLB is not rewritten.
- Draco runtime files are under `public/vendor/draco/`, from the pinned Three.js 0.186.1 package, with their license and fingerprints.

Keep this original intact; save any styled or optimized derivative separately with its own provenance. Run `npm run verify:assets` to check the downloaded file's fingerprint.
