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
- Test controls beside the engine on desktop and a persistent compact toolbar on mobile.
- Undo the latest reset, preset load, or configuration import, restoring settings and recorded telemetry. Restored active tests pause until Resume.
- Interruptible camera reset with reduced-motion, reduced-transparency and increased-contrast preferences.
- Geometry changes retain static hardware, coalesce nozzle updates to animation frames, and draw telemetry charts only when needed.

## Model

Quasi-steady choked ideal gas flow, a supersonic isentropic area–Mach solver and `F = mdot * Ve + (Pe - Pa) * Ae`. Specific impulse is `F / (mdot * g0)`. Fuel thermodynamic properties are illustrative fixed assumptions, not chemistry calculations. Throttle sets chamber pressure through a 0.6-second first-order response; ambient pressure follows a simplified exponential atmosphere. Unchoked cases return zero flow/thrust because subsonic operation is outside this model. Gimbal affects displayed orientation, not thrust magnitude. Propellant capacity applies at reset. Fuel/geometry/altitude settings apply immediately.

This educational model excludes combustion chemistry, flow separation, pumps, thermal and structural effects. Large overexpanded nozzles can give unreliable predictions. It is not an engineering validation or hardware design tool.

Reference: [NASA rocket thrust equations](https://www.grc.nasa.gov/WWW/k-12/airplane/rktthsum.html).

## Verify and deploy

Run `node --test tests/physics.test.js tests/session.test.js` and `node build.js`. Serve `dist/` from any static host. All asset paths are relative, including for repository-subpath hosting such as GitHub Pages. `.openai/hosting.json` holds the separate private Sites preview identity.

Third-party license: `vendor/THREE-LICENSE.txt` (Three.js and OrbitControls).
