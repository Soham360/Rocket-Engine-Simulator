import {test} from 'node:test';import assert from 'node:assert/strict';
import {buildAssembly} from '../assembly.js';import {engines,engineConfig} from '../engines.js';import {defaults,validate,performance} from '../physics.js';
test('named assemblies contain cycle-appropriate subsystems',()=>{
 for(const id of Object.keys(engines)){const config=validate(engineConfig(id,defaults)),a=buildAssembly(config),ids=a.parts.map(p=>p.id);assert.equal(new Set(ids).size,ids.length);for(const required of ['mount','injector','chamber','nozzle','fuelPump','oxPump','valves','controller'])assert.ok(ids.includes(required),`${id}: ${required}`);
  if(id==='rutherford'){assert.ok(ids.includes('fuelMotor')&&ids.includes('oxMotor'));assert.ok(!ids.includes('fuelPreburner')&&!ids.includes('gasGenerator'));}
  if(id==='merlin1d'){assert.ok(ids.includes('gasGenerator')&&ids.includes('exhaust'));assert.ok(!ids.includes('fuelPreburner'));}
  if(id==='rs25')for(const p of ['fuelBoost','oxBoost','fuelPreburner','secondPreburner'])assert.ok(ids.includes(p));
  if(id==='raptor3')for(const p of ['protection','fuelPreburner','oxPreburner'])assert.ok(ids.includes(p));
  assert.ok(Number.isFinite(performance(config).thrust));a.dispose();
 }
});
test('all component vertices and explosion offsets are finite',()=>{for(const id of Object.keys(engines)){const a=buildAssembly(engineConfig(id,defaults));for(const p of a.parts){assert.ok(p.offset.toArray().every(Number.isFinite));p.group.traverse(o=>{if(o.geometry?.attributes.position)for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value));});}a.dispose();}});
test('legacy files migrate and engine IDs survive save validation',()=>{const legacy={...defaults};delete legacy.engine;assert.equal(validate(legacy).engine,'generic');for(const id of Object.keys(engines)){const config=engineConfig(id,defaults);assert.deepEqual(validate(JSON.parse(JSON.stringify(config))),config);}for(const id of ['unknown','toString','__proto__'])assert.throws(()=>validate({...defaults,engine:id}));});
