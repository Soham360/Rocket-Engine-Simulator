// Keep one recoverable test snapshot. Resuming a restored burn is deliberate.
export function captureTest(test){return {...test,config:{...test.config},samples:test.samples.map(s=>({...s}))};}
export function restoreTest(snapshot){const restored=captureTest(snapshot);if(['running','shutdown'].includes(restored.mode)){restored.resumeMode=restored.mode;restored.mode='paused';}return restored;}
