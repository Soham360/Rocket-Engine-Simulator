import {test} from 'node:test';
import assert from 'node:assert/strict';
import {captureTest,restoreTest} from '../session.js';
import {defaults} from '../physics.js';
test('recover a run and its configuration without resuming the burn',()=>{
 const run={config:{...defaults},remaining:900,time:12,impulse:30000,level:.75,mode:'running',sampleClock:.04,samples:[{t:12,thrust:20000}]};
 const saved=captureTest(run);run.config.throttle=20;run.samples[0].thrust=1;
 const restored=restoreTest(saved);assert.equal(restored.config.throttle,75);assert.equal(restored.samples[0].thrust,20000);assert.equal(restored.mode,'paused');assert.equal(restored.remaining,900);assert.equal(restored.sampleClock,.04);
 restored.samples[0].thrust=2;assert.equal(saved.samples[0].thrust,20000);
});
test('ready and paused tests retain their state on recovery',()=>{for(const mode of ['ready','paused','off','empty'])assert.equal(restoreTest({config:defaults,mode,samples:[]}).mode,mode);});
test('recovering a shutdown pauses it and preserves the shutdown target',()=>{const restored=restoreTest({config:defaults,mode:'shutdown',samples:[]});assert.equal(restored.mode,'paused');assert.equal(restored.resumeMode,'shutdown');});
