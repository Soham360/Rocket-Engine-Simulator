export const fuelLabels={methane:'Methane · CH₄',kerosene:'RP-1 kerosene',hydrogen:'Hydrogen · H₂'};
// Cycle-level paths, not measured plumbing, flow rates, or startup timing.
export function flowTopology(engine='generic'){
 const nodes={fuelInlet:{label:'Fuel supply',position:[-1.35,3.3,.65]},oxInlet:{label:'Liquid oxygen supply',position:[1.35,3.3,.65]},fuelPump:{part:'fuelPump'},oxPump:{part:'oxPump'},fuelTurbine:{part:'fuelPump',offset:[0,0,-.25]},oxTurbine:{part:'oxPump',offset:[0,0,-.25]},cooling:{part:'nozzle',location:'cooling'},chamberCooling:{part:'chamber',offset:[-.25,0,.15]},injector:{part:'injector'},chamber:{part:'chamber'},exit:{part:'nozzle',location:'exit'}};
 const edges=[];const add=(from,to,stream,state='liquid')=>edges.push({from,to,stream,state});
 if(engine==='rs25'){
  nodes.fuelBoost={part:'fuelBoost'};nodes.oxBoost={part:'oxBoost'};nodes.fuelPreburner={part:'fuelPreburner'};nodes.secondPreburner={part:'secondPreburner'};
  add('fuelInlet','fuelBoost','fuel');add('fuelBoost','fuelPump','fuel');add('oxInlet','oxBoost','oxidizer');add('oxBoost','oxPump','oxidizer');
  add('fuelPump','cooling','fuel');add('cooling','chamberCooling','fuel');
  for(const [pre,turbine]of [['fuelPreburner','fuelTurbine'],['secondPreburner','oxTurbine']]){add('chamberCooling',pre,'fuel');add('oxPump',pre,'oxidizer');add(pre,turbine,'fuel','hot');add(turbine,'injector','fuel','hot');}
  add('oxPump','injector','oxidizer');
 }else{
  add('fuelInlet','fuelPump','fuel');add('oxInlet','oxPump','oxidizer');add('fuelPump','cooling','fuel');add('cooling','chamberCooling','fuel');
  if(engine==='merlin1d'){
   nodes.gasGenerator={part:'gasGenerator'};nodes.turbineExhaust={part:'exhaust'};nodes.openExhaust={label:'Separate turbine exhaust',position:[-1.4,-1.1,.4]};
   add('chamberCooling','injector','fuel');add('oxPump','injector','oxidizer');add('fuelPump','gasGenerator','fuel');add('oxPump','gasGenerator','oxidizer');add('gasGenerator','fuelTurbine','gas','hot');add('fuelTurbine','turbineExhaust','gas','hot');add('turbineExhaust','openExhaust','gas','hot');
  }else if(engine==='rutherford'){
   add('chamberCooling','injector','fuel');add('oxPump','injector','oxidizer');
  }else{
   nodes.fuelPreburner={part:'fuelPreburner'};nodes.oxPreburner={part:'oxPreburner'};
   add('chamberCooling','fuelPreburner','fuel');add('fuelPump','oxPreburner','fuel');add('oxPump','fuelPreburner','oxidizer');add('oxPump','oxPreburner','oxidizer');
   add('fuelPreburner','fuelTurbine','fuel','hot');add('fuelTurbine','injector','fuel','hot');add('oxPreburner','oxTurbine','oxidizer','hot');add('oxTurbine','injector','oxidizer','hot');
  }
 }
 add('injector','chamber','gas','hot');add('chamber','exit','gas','hot');
 return {nodes,edges};
}
