// Geometry is a documented-architecture reconstruction, not manufacturer CAD.
export const engines={
 generic:{name:'Custom study engine',maker:'IGNITION',cycle:'Full-flow staged combustion · study model',fuel:'methane',shape:'raptor',description:'A customizable teaching assembly with two turbopumps and two preburners. Geometry and thermodynamic inputs are illustrative.',source:'https://www.grc.nasa.gov/WWW/k-12/airplane/rktthsum.html',sourceName:'NASA · Rocket thrust equations',settings:{pressure:80,throat:.18,expansion:18,altitude:0,propellant:12000}},
 raptor3:{name:'Raptor 3',maker:'SpaceX',cycle:'Full-flow staged combustion',fuel:'methane',shape:'raptor',description:'Compact methane / oxygen engine for Starship. SpaceX describes integrated sensors, controllers and thermal protection. The internal plumbing, pump placement and protective covers here are interpretive, not a released Raptor 3 CAD assembly.',source:'https://www.spacex.com/updates/reusability',sourceName:'SpaceX · Raptor 3 change highlights',settings:{pressure:300,throat:.28,expansion:34,altitude:0,propellant:30000}},
 merlin1d:{name:'Merlin 1D',maker:'SpaceX',cycle:'Gas-generator cycle',fuel:'kerosene',shape:'merlin',description:'Falcon 9 sea-level engine using oxygen and RP-1. A gas generator drives a common-shaft turbopump; its exhaust exits separately from the main thrust chamber. Positions, dimensions and internals are simplified.',source:'https://www.spacex.com/vehicles/falcon-9/',sourceName:'SpaceX · Falcon 9 / Merlin',settings:{pressure:97,throat:.22,expansion:16,altitude:0,propellant:15000}},
 rs25:{name:'RS-25',maker:'Aerojet Rocketdyne / NASA',cycle:'Fuel-rich staged combustion',fuel:'hydrogen',shape:'rs25',description:'Shuttle / SLS hydrogen engine with two low-pressure pumps, two high-pressure pumps and two preburners. The wide nozzle, extensive feed ducts and four-pump architecture distinguish this reconstruction.',source:'https://ntrs.nasa.gov/api/citations/20170008958/downloads/20170008958.pdf',sourceName:'NASA · Next-generation RS-25 engines',settings:{pressure:207,throat:.26,expansion:69,altitude:0,propellant:30000}},
 rutherford:{name:'Rutherford',maker:'Rocket Lab',cycle:'Electric-pump-fed',fuel:'kerosene',shape:'rutherford',description:'Electron engine with two electric-motor-driven propellant pumps. It has no gas generator or preburner. Batteries are vehicle equipment and are not part of this engine assembly. Pump, motor and chamber geometry is illustrative.',source:'https://www.si.edu/object/engine-rutherford-rocket-lab:nasm_A20220292000',sourceName:'Smithsonian · Rocket Lab Rutherford',settings:{pressure:30,throat:.05,expansion:14,altitude:0,propellant:1000}}
};
export function engineConfig(id,base){const engine=engines[id];if(!Object.hasOwn(engines,id))throw Error('Unknown engine model.');return {...base,...engine.settings,engine:id,fuel:engine.fuel,throttle:75,gimbal:0};}
export const commonParts={
 mount:['Gimbal & thrust mount','Transfers thrust into the vehicle structure. The engine pivots at this interface.'],
 injector:['Injector head','Distributes fuel and oxidizer into the main chamber. The visible hole pattern is schematic, not a manufacturing drawing.'],
 chamber:['Combustion chamber','Contains the main high-pressure combustion zone. The copper-colored liner is surrounded by a structural cooling jacket.'],
 nozzle:['Regeneratively cooled nozzle','Expands hot gas through the throat and bell. Longitudinal passages illustrate fuel cooling; visible channels are deliberately exaggerated.'],
 manifold:['Cooling & distribution manifolds','Collect and distribute coolant around the chamber and nozzle. Individual port locations are illustrative.'],
 fuelPump:['Fuel pump','Raises the fuel supply pressure. In turbine-driven engines its turbine is driven by hot gas; Rutherford uses an electric motor.'],
 oxPump:['Oxidizer pump','Raises the oxygen supply pressure before delivery to the combustion system.'],
 fuelPreburner:['Fuel-rich preburner','Produces hot gas to drive a turbine. Raptor and RS-25 cycle layouts differ; this geometry illustrates the subsystem.'],
 oxPreburner:['Oxygen-rich preburner','Raptor’s oxygen-rich branch drives the oxidizer turbopump. Its hot gas ultimately enters the main chamber.'],
 secondPreburner:['Oxidizer-side fuel-rich preburner','RS-25 uses a second fuel-rich preburner to drive the high-pressure oxidizer turbopump.'],
 gasGenerator:['Gas generator','Burns a small propellant stream to drive Merlin’s turbopump. Its exhaust is routed outside the main chamber.'],
 fuelBoost:['Low-pressure fuel turbopump','Boosts the hydrogen inlet pressure before the high-pressure fuel pump.'],
 oxBoost:['Low-pressure oxidizer turbopump','Boosts the oxygen inlet pressure before the high-pressure oxidizer pump.'],
 fuelMotor:['Fuel pump electric motor','Brushless DC motor drives the fuel pump; electrical power comes from vehicle batteries.'],
 oxMotor:['Oxidizer pump electric motor','A separate brushless DC motor drives the oxygen pump.'],
 valves:['Main valves & feed ducts','Control propellant admission and route liquid between inlets, pumps, cooling circuits and the powerhead.'],
 controller:['Controller & harness','Coordinates valves, sensors and engine operation. Raptor 3 integrates these systems beneath thermal protection; the exploded placement is schematic.'],
 actuators:['Gimbal actuators','Two actuators illustrate pitch and yaw control of a gimbaling engine installation. Vehicle interfaces are simplified.'],
 protection:['Powerhead thermal protection','Interpretive representation of Raptor 3’s integrated thermal protection. Explode or isolate it to expose the teaching model underneath.'],
 exhaust:['Turbine exhaust duct','Carries Merlin’s gas-generator turbine exhaust away from the powerhead, separate from the main nozzle flow.']
};
