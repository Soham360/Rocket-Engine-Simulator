# IGNITION — Rocket Engine Simulator

Interactive 3D propulsion workbench inspired by the AXIS Robot Arm Simulator. Runs entirely in the browser with no backend or external runtime requests.

## Run

Install Node.js, then run `node server.js`. Open http://127.0.0.1:5174. No dependency installation is needed; Three.js and OrbitControls are vendored with their MIT license.

## Features

- Orbit, zoom, reset camera and chamber/nozzle cutaway.
- Methalox, kerolox and hydrolox presets with adjustable pressure, throat diameter, expansion ratio, throttle, altitude, gimbal and propellant capacity.
- Ignition and shutdown transients, pause/resume, depletion and reset.
- Live thrust, mass flow, specific impulse, chamber pressure, impulse and fuel remaining.
- Thrust trace and CSV export (up to the latest 36,000 samples).
- Save settings to browser storage or import/export validated JSON configurations.
- Responsive layout, keyboard accessible controls, reduced-motion support and three guided experiments.
- Larger scalable text and touch targets, immediate press feedback, active cutaway styling, and a translucent view toolbar.
- Aligned segmented navigation with concise labels, consistent form spacing, telemetry cards and text-backed engine status badges. Compact phone toolbar labels preserve room for the engine; keyboard tab navigation and full accessible names remain available.
- Test controls beside the engine on desktop and a persistent compact toolbar on mobile.
- Undo the latest reset, preset load, or configuration import, restoring settings and recorded telemetry. Restored active tests pause until Resume.
- Interruptible camera reset with reduced-motion, reduced-transparency and increased-contrast preferences.
- Geometry changes are coalesced to animation frames; telemetry charts redraw only when needed. Repeated injector elements and flange fasteners use instanced rendering.
- Screen-sized instrument layout inspired by the Wind Tunnel Simulator: engine, firing controls, metrics and responsive chart fit without page scrolling. Lessons use a separate navigation view; phones switch between Simulation and Engine settings. Longer notes and logs scroll inside their own panels.

## Model

Quasi-steady choked ideal gas flow, a supersonic isentropic area–Mach solver and `F = mdot * Ve + (Pe - Pa) * Ae`. Specific impulse is `F / (mdot * g0)`. Fuel thermodynamic properties are illustrative fixed assumptions, not chemistry calculations. Throttle sets chamber pressure through a 0.6-second first-order response; ambient pressure follows a simplified exponential atmosphere. Unchoked cases return zero flow/thrust because subsonic operation is outside this model. Gimbal affects displayed orientation, not thrust magnitude. Propellant capacity applies at reset. Fuel/geometry/altitude settings apply immediately.

This educational model excludes combustion chemistry, flow separation, pumps, thermal and structural effects. Large overexpanded nozzles can give unreliable predictions. It is not an engineering validation or hardware design tool.

Reference: [NASA rocket thrust equations](https://www.grc.nasa.gov/WWW/k-12/airplane/rktthsum.html).

## Engine assemblies and inspection

Choose Custom study engine, **Raptor 3**, **Merlin 1D**, **RS-25**, or **Rutherford** under Engine assembly. Each has a distinct major-subsystem topology and representative study inputs. Changing the assembly resets the test, with Undo available; configuration JSON and browser saves preserve the engine ID. Older configuration files migrate to the custom study engine.

Use **Explode** to separate parts and expand the viewer. Assembly offers a continuous 0–100% separation slider, numbered component list, explanations, and **Isolate part**. Click the 3D model or a marker to select a component. Labels, cutaway, viewer expansion, and camera reset remain independently available. Explosion and camera motion respect reduced-motion preferences. Calculations continue during inspection, but the plume is hidden in exploded or isolated views.

Models include the chamber liner/jacket, injector face, cooling channels, manifolds, gimbal mount and actuators, valves, feed ducts, controller and harness. Cycle-specific components include two preburners and turbopumps for Raptor; Merlin's gas generator, common-shaft pump arrangement and exhaust duct; RS-25's four pumps and two fuel-rich preburners; and Rutherford's two electric motors without a preburner or gas generator. Raptor uses a dedicated exterior reconstructed from the supplied front photograph: a smooth dark bell, tall narrow valve tower, asymmetric pump housings and swept side duct. Internal preburners and controller geometry appear during inspection; cooling channels remain internal, rather than adding bright ribs to the assembled nozzle. Named engine exteriors retain their reference proportions when study inputs change. RS-25 retains its representative exterior tube construction.

These are original procedural **educational reconstructions of major subsystems**, not manufacturer CAD, exact internal layouts, dimensional replicas or complete bills of materials. Fasteners, channels and injector patterns are illustrative. Proprietary internals, detailed feed routing and engine-specific thermodynamic inputs are approximations. Selecting a named engine does not make the ideal-nozzle telemetry a validated simulation of that engine's power cycle.

Use **Propellant flow** to reveal directional arrows over a translucent assembly. Fuel, oxygen and combustion gas have both colors and F/O/G labels. The Assembly panel contains stream filters, pause/play, single-step and arrow speed. Reduced motion uses static arrows with Step available. Solid routes denote liquid feeds and dashed routes denote hot gas. This repeating cycle schematic is independent of the firing test: arrow spacing and speed do not indicate mass flow, startup timing, or exact internal plumbing.

The diagram distinguishes full-flow staged combustion (separate fuel-rich and oxygen-rich turbine paths), Merlin's separate turbine exhaust, RS-25's two fuel-rich preburners and four pumps, and Rutherford's electric pumps without a preburner. No proprietary routing is claimed. Geometry shows major subsystems and illustrative channels rather than every production part.

Additional inspection tools include component search, front/right/3D camera presets, and an anchored **View** menu for labels, cutaway and reset. Flow inspection and exploded inspection use separate modes so arrows remain aligned with the assembled schematic.

Architecture references:

- [SpaceX Raptor 3 changes](https://www.spacex.com/updates/reusability)
- [SpaceX Falcon 9 / Merlin](https://www.spacex.com/vehicles/falcon-9/)
- [NASA full-flow staged-combustion testing](https://www.nasa.gov/news-release/new-rocket-engine-combustion-cycle-technology-testing-reaches-100-power-level/)
- [NASA RS-25 engine components](https://ntrs.nasa.gov/api/citations/20170008958/downloads/20170008958.pdf)
- [Smithsonian Rutherford engine](https://www.si.edu/object/engine-rutherford-rocket-lab:nasm_A20220292000)
- [Rocket Lab Electron / Rutherford](https://rocketlabcorp.com/launch/electron/)

## Verify and deploy

Run `node --test tests/physics.test.js tests/session.test.js tests/assembly.test.js tests/flow.test.js` and `node build.js`. Tests cover nozzle performance identities, configuration migration, run recovery, cycle-specific component topology, finite geometry, flow graph endpoints, turbine/exhaust routing and reference-geometry stability. Serve `dist/` from any static host. All asset paths are relative, including for repository-subpath hosting such as GitHub Pages. `.openai/hosting.json` holds the separate private Sites preview identity.

Third-party license: `vendor/THREE-LICENSE.txt` (Three.js and OrbitControls).
