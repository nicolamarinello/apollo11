# Future verified capture contract

No conforming capture is bundled today. `AgcCaptureSample` is an initial interface, not a validated format or a functioning capture importer.

A future capture package must provide:

| Area | Required evidence |
| --- | --- |
| Identity | Schema version, capture identifier, creator, date, immutable file checksums |
| Simulator | Exact NASSP/Orbiter/yaAGC versions and commits, configuration and licenses |
| Software | Luminary **99 revision 1** rope hash, assembly inputs and yaYUL build details |
| Reproduction | Initial state, scenario, crew inputs with timestamps, deterministic replay instructions |
| Time | GET/MET epoch, sample cadence, clock synchronization and drift/error bounds |
| Coordinates | Frame origin/axes/handedness, units, altitude datum, quaternion order and transforms |
| Samples | Position, attitude, velocity, major mode, thrust; measured/simulated/missing quality per field |
| Fuel | Definition, units, reserve conventions, source and uncertainty; never inferred as a linear countdown |
| Validation | Independent archival references, per-channel tolerances, comparison results, anomalies and reviewer |
| Execution mapping | Optional PC and bank state, matching symbols/listing/rope, mapping validation |
| Rights | Permission or license for trace, scenario, runtime, model assets and redistribution |

Reject non-finite values, non-monotonic/duplicate time, unknown frames, invalid quaternions, unexplained gaps and missing provenance. A schema check alone cannot certify historical validity. The actual path and crew involvement must be assessed independently; an AGC-guided run is not automatically an Apollo 11 historical reconstruction.

Separate contact-probe indication, load-bearing touchdown and engine cutoff. Document any differences between simulated and historical event times. Never silently align or warp timestamps to make a trace match history.
