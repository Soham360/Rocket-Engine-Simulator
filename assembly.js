import * as T from './vendor/three.module.js';
import {engines,commonParts} from './engines.js';

// Publicly described subsystem topology with original, approximate geometry.
export function buildAssembly(config){
 const model=engines[config.engine]??engines.generic,shape=model.shape,root=new T.Group(),parts=[];
 const mat={steel:new T.MeshStandardMaterial({color:0xaab3bd,metalness:.82,roughness:.3}),dark:new T.MeshStandardMaterial({color:0x333e49,metalness:.7,roughness:.4}),copper:new T.MeshStandardMaterial({color:0xb77b51,metalness:.8,roughness:.35}),black:new T.MeshStandardMaterial({color:0x252b31,metalness:.45,roughness:.52}),fuel:new T.MeshStandardMaterial({color:0x657d98,metalness:.7,roughness:.35}),oxygen:new T.MeshStandardMaterial({color:0x9caeb2,metalness:.75,roughness:.32}),gold:new T.MeshStandardMaterial({color:0xb09b67,metalness:.7,roughness:.36})};
 const shared={bolt:new T.CylinderGeometry(.026,.026,.065,6),smallBolt:new T.CylinderGeometry(.015,.015,.035,6)};
 function part(id,offset){const group=new T.Group();group.name=id;root.add(group);const [name,description]=commonParts[id];const p={id,name,description,group,offset:new T.Vector3(...offset),anchor:new T.Vector3(),label:null};parts.push(p);return group;}
 function mesh(parent,g,m=mat.steel,pos=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function cyl(parent,r,h,y,m=mat.steel,x=0,z=0){return mesh(parent,new T.CylinderGeometry(r,r,h,40),m,[x,y,z]);}
 function torus(parent,r,t,y,m=mat.steel,x=0,z=0){const o=mesh(parent,new T.TorusGeometry(r,t,8,64),m,[x,y,z]);o.rotation.x=Math.PI/2;return o;}
 function tube(parent,points,r,m=mat.steel){return mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),32,r,10,false),m);}
 function link(parent,a,b,r,m=mat.steel){const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);const o=mesh(parent,new T.CylinderGeometry(r,r,delta.length(),12),m);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
 function flange(parent,r,y,n=16,m=mat.steel,x=0,z=0){cyl(parent,r,.075,y,m,x,z);const bolts=new T.InstancedMesh(shared.bolt,mat.dark,n),dummy=new T.Object3D();for(let i=0;i<n;i++){const a=i/n*Math.PI*2;dummy.position.set(x+Math.cos(a)*r*.86,y+.055,z+Math.sin(a)*r*.86);dummy.updateMatrix();bolts.setMatrixAt(i,dummy.matrix);}bolts.castShadow=true;parent.add(bolts);}
 function volute(parent,x,y,z,r,m){const o=mesh(parent,new T.TorusGeometry(r*.72,r*.28,12,36),m,[x,y,z]);cyl(parent,r*.72,.25,y,mat.dark,x,z).rotation.x=Math.PI/2;const face=cyl(parent,r*.6,.06,y,mat.steel,x,z+.16);face.rotation.x=Math.PI/2;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const bolt=mesh(parent,shared.smallBolt,mat.dark,[x+Math.cos(a)*r*.52,y+Math.sin(a)*r*.52,z+.2]);bolt.rotation.x=Math.PI/2;}return o;}
 function pump(id,x,y,z,offset,m){const p=part(id,offset);volute(p,x,y,z,.33,m);cyl(p,.18,.3,y,mat.dark,x,z).rotation.x=Math.PI/2;const turbine=mesh(p,new T.CylinderGeometry(.24,.24,.25,32),mat.dark,[x,y,z-.3]);turbine.rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const fin=mesh(p,new T.BoxGeometry(.025,.1,.18),mat.steel,[x+Math.cos(a)*.2,y+Math.sin(a)*.2,z-.3]);fin.rotation.z=a;}tube(p,[[x+rSign(x)*.2,y,z],[x+rSign(x)*.4,y+.15,z],[x+rSign(x)*.4,y+.45,z]],.085,m);return p;}
 function rSign(x){return x<0?-1:1;}
 const chamber=part('chamber',[0,.05,0]);
 const linerMat=mat.copper.clone();linerMat.side=T.DoubleSide;const chamberShell=mat.steel.clone();chamberShell.side=T.DoubleSide;
 const chamberPoints=[[.31,.05],[.33,.18],[.46,.4],[.49,.65],[.49,1.18]].map(([r,y])=>new T.Vector2(r,y));
 mesh(chamber,new T.LatheGeometry(chamberPoints,64),linerMat);mesh(chamber,new T.CylinderGeometry(.53,.53,.71,64,1,true),chamberShell,[0,.82,0]);
 for(let i=0;i<40;i++){const a=i/40*Math.PI*2;link(chamber,[.512*Math.cos(a),.44,.512*Math.sin(a)],[.512*Math.cos(a),1.19,.512*Math.sin(a)],.008,mat.copper);}
 torus(chamber,.51,.025,.44);flange(chamber,.59,1.2);torus(chamber,.34,.025,.14);
 const throat=Math.max(.19,Math.min(.37,config.throat*1.4));const exit=Math.max(.65,Math.min(1.65,throat*Math.sqrt(config.expansion)));
 const length=shape==='rs25'?2.75:shape==='rutherford'?1.8:2.3;
 const nozzle=part('nozzle',[0,-1.65,0]);const bellMat=mat.dark.clone();bellMat.side=T.DoubleSide;const points=[];
 for(let i=0;i<=60;i++){const t=i/60;const radius=throat+(exit-throat)*(1-Math.pow(1-t,1.65));points.push(new T.Vector2(radius,-length*t));}
 const bell=mesh(nozzle,new T.LatheGeometry(points.slice().reverse(),96),bellMat);
 const channelCount=shape==='rutherford'?44:72;
 for(let j=0;j<channelCount;j++){const a=j/channelCount*Math.PI*2;const path=points.filter((_,i)=>i%3===0).map(p=>[(p.x+.012)*Math.cos(a),p.y,(p.x+.012)*Math.sin(a)]);tube(nozzle,path,.0075,shape==='raptor'?mat.steel:mat.copper);}
 for(let i=1;i<=5;i++){const t=i/5,r=throat+(exit-throat)*(1-(1-t)**1.65);torus(nozzle,r+.013,.016,-length*t,mat.steel);}torus(nozzle,exit,.035,-length,mat.steel);torus(nozzle,throat,.04,0,mat.steel);
 const injector=part('injector',[0,1,0]);flange(injector,.59,1.34,20);cyl(injector,.51,.17,1.45,mat.dark);cyl(injector,.47,.028,1.24,mat.copper);
 // Alternating raised injector elements make the face legible in exploded view.
 const elements=new T.InstancedMesh(new T.CylinderGeometry(.012,.012,.025,8),mat.steel.clone(),150),dummyElement=new T.Object3D();let element=0;for(let ring=1;ring<=5;ring++)for(let i=0;i<ring*10;i++){const a=i/(ring*10)*Math.PI*2,r=ring*.08;dummyElement.position.set(r*Math.cos(a),1.217,r*Math.sin(a));dummyElement.updateMatrix();elements.setMatrixAt(element,dummyElement.matrix);elements.setColorAt(element++,new T.Color(i%2?0x30373d:0xb09b67));}injector.add(elements);
 const mount=part('mount',[0,2.1,0]);torus(mount,.31,.075,2.35,mat.dark);torus(mount,.45,.055,2.2);cyl(mount,.22,.23,2.48,mat.dark);flange(mount,.34,2.64,12);for(let i=0;i<4;i++){const a=i/4*Math.PI*2;link(mount,[Math.cos(a)*.43,2.2,Math.sin(a)*.43],[Math.cos(a)*.54,1.55,Math.sin(a)*.54],.055,mat.steel);}
 const manifold=part('manifold',[0,-.75,.9]);torus(manifold,exit*.72,.055,-length*.55,mat.steel);torus(manifold,.57,.06,.75,mat.steel);tube(manifold,[[exit*.72,-length*.55,0],[exit*.72+.12,-1,0],[.7,.45,0],[.55,.75,0]],.052,mat.fuel);
 const valves=part('valves',[-1.8,-.5,-.8]);
 for(const [x,z,m]of [[-.65,.2,mat.fuel],[.65,-.2,mat.oxygen]]){tube(valves,[[x,2.6,z],[x,2.15,z],[x*.9,1.6,z],[x*.55,1.45,z]],.09,m);flange(valves,.14,2.55,8,m,x,z);const body=mesh(valves,new T.SphereGeometry(.15,20,12),mat.steel,[x,2.05,z]);mesh(valves,new T.BoxGeometry(.16,.22,.14),mat.dark,[x,2.05,z+.18]);}
 if(shape==='raptor'||shape==='rs25'){
  pump('fuelPump',-.68,1.8,.15,[-2.15,.55,.3],mat.fuel);pump('oxPump',.68,1.85,-.12,[2.15,.55,-.3],mat.oxygen);
  for(const [id,x,z,offset]of [['fuelPreburner',-.42,-.35,[-1.1,1.65,-.65]],[shape==='rs25'?'secondPreburner':'oxPreburner',.44,.35,[1.1,1.65,.65]]]){const p=part(id,offset);cyl(p,.14,.42,1.82,mat.dark,x,z);flange(p,.19,2.05,10,mat.steel,x,z);tube(p,[[x,1.65,z],[x*.7,1.55,z],[0,1.45,z*.5]],.09,mat.steel);}
  tube(valves,[[-.65,1.7,.15],[-.9,1.1,.25],[-.67,.65,.1],[-.55,.75,0]],.07,mat.fuel);tube(valves,[[.68,1.85,-.1],[.9,1.55,-.1],[.4,1.45,-.3]],.08,mat.oxygen);
  if(shape==='rs25'){
   pump('fuelBoost',-1.02,2.25,.25,[-2.3,1.6,.7],mat.fuel);pump('oxBoost',1,2.2,-.25,[2.3,1.6,-.7],mat.oxygen);
   tube(valves,[[-1,2.2,.25],[-1.2,1.9,.35],[-.8,1.8,.15]],.13,mat.fuel);tube(valves,[[1,2.2,-.25],[1.15,2,-.4],[.75,1.85,-.12]],.1,mat.oxygen);
   for(let i=0;i<3;i++)tube(valves,[[.55,1.4,i*.13],[1.12,1.1,i*.13],[.95,.35,i*.13],[.5,.65,i*.13]],.045,mat.steel);
  }
 }else if(shape==='merlin'){
  const pumpGroup=pump('fuelPump',-.72,1.85,.1,[-2,.8,.2],mat.steel);const oxPart=part('oxPump',[-1.4,1.5,-.6]);volute(oxPart,-.72,1.85,-.35,.27,mat.oxygen);link(pumpGroup,[-.72,1.85,.1],[-.72,1.85,-.35],.08,mat.dark);
  const gg=part('gasGenerator',[1.6,1.2,.3]);cyl(gg,.15,.55,1.75,mat.dark,.65,.05);flange(gg,.2,2.05,10,mat.steel,.65,.05);tube(gg,[[.65,1.6,.05],[.4,1.9,-.5],[-.7,1.85,-.55]],.075,mat.steel);
  const ex=part('exhaust',[-1.7,-.5,-1]);tube(ex,[[-.7,1.85,-.55],[-1.05,1.3,-.4],[-1.15,.4,-.3],[-1.1,-.55,-.3]],.105,mat.dark);torus(ex,.11,.025,-.55,mat.steel,-1.1,-.3);
  tube(valves,[[-.7,1.8,.1],[-1,1.2,.1],[-.65,.75,0]],.075,mat.fuel);
 }else{
  for(const [pumpId,motorId,x,m,offset]of [['fuelPump','fuelMotor',-.6,mat.fuel,[-1.7,.6,.2]],['oxPump','oxMotor',.6,mat.oxygen,[1.7,.6,-.2]]]){
   const p=part(pumpId,offset);volute(p,x,1.65,0,.21,m);const motor=part(motorId,[offset[0]*1.2,1.55,offset[2]]);cyl(motor,.19,.55,2,mat.black,x,0);for(let i=0;i<9;i++)torus(motor,.195,.009,1.78+i*.05,mat.steel,x,0);cyl(motor,.09,.12,2.33,mat.steel,x,0);tube(valves,[[x,1.6,0],[x*.8,1.45,0],[x*.5,1.4,0]],.055,m);
  }
 }
 const actuators=part('actuators',[1.8,-.65,1.15]);for(const a of [.2,1.8]){const x=Math.cos(a),z=Math.sin(a);link(actuators,[x*.9,1.35,z*.9],[x*.5,2.35,z*.5],.045,mat.steel);link(actuators,[x*.9,1.35,z*.9],[x*.75,1.75,z*.75],.085,mat.dark);mesh(actuators,new T.SphereGeometry(.09,16,10),mat.steel,[x*.9,1.35,z*.9]);}
 const controller=part('controller',[1.6,1.7,1.6]);mesh(controller,new T.BoxGeometry(.38,.27,.16),mat.dark,[.5,1.42,.55]);for(let i=0;i<6;i++)mesh(controller,new T.BoxGeometry(.4,.012,.18),mat.steel,[.5,1.32+i*.04,.55]);for(let i=0;i<4;i++)tube(controller,[[.65,1.5,.65],[.8,1.7,.55],[.7,2.05,.3+i*.045]],.009,mat.black);
 if(shape==='raptor'){
  const protection=part('protection',[0,.8,-2.4]);const coverMat=mat.dark.clone();coverMat.side=T.DoubleSide;
  for(let i=0;i<4;i++){const a=i*Math.PI/2;const cover=mesh(protection,new T.CylinderGeometry(.72,.83,.7,32,1,true,a+.05,Math.PI/2-.1),coverMat,[0,1.6,0]);for(let j=0;j<3;j++){const aa=a+.2+j*.45;mesh(protection,shared.smallBolt,mat.steel,[Math.cos(aa)*.79,1.28,Math.sin(aa)*.79]);}}
 }
 root.updateMatrixWorld(true);
 for(const p of parts){if(['fuelPump','oxPump'].includes(p.id)&&shape!=='rutherford'){p.name=`${shape==='rs25'?'High-pressure ':''}${p.id==='fuelPump'?'fuel':'oxidizer'} turbopump`;p.name=p.name[0].toUpperCase()+p.name.slice(1);}const box=new T.Box3().setFromObject(p.group);box.getCenter(p.anchor);p.group.traverse(o=>{if(o.isMesh)o.userData.partId=p.id;});}
 return {root,parts,model,bell,exitRadius:exit,nozzleEnd:-length,cutMaterials:[bellMat,linerMat,chamberShell],dispose(){const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
