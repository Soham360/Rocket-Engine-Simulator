import * as T from './vendor/three.module.js';
import {engines,commonParts} from './engines.js';

// Exterior proportions follow the user-supplied front photograph. Hidden internals
// are cycle-level teaching geometry, never presented as SpaceX production CAD.
export function buildRaptor3(){
 const root=new T.Group(),parts=[];
 const dark=new T.MeshStandardMaterial({color:0x24292e,metalness:.42,roughness:.62});
 const steel=new T.MeshStandardMaterial({color:0x929ba4,metalness:.78,roughness:.33});
 const black=new T.MeshStandardMaterial({color:0x141a20,metalness:.48,roughness:.48});
 const copper=new T.MeshStandardMaterial({color:0xb27c56,metalness:.7,roughness:.45,side:T.DoubleSide});
 const blue=new T.MeshStandardMaterial({color:0x2e536f,metalness:.7,roughness:.4});
 const cutMaterials=[];
 function part(id,offset,internal=false){const group=new T.Group();root.add(group);const [name,description]=commonParts[id];parts.push({id,name,description,group,offset:new T.Vector3(...offset),anchor:new T.Vector3(),internal});return group;}
 function mesh(p,g,m=dark,pos=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function cyl(p,r,h,y,m=dark,x=0,z=0){return mesh(p,new T.CylinderGeometry(r,r,h,48),m,[x,y,z]);}
 function ring(p,r,t,y,m=dark,x=0,z=0){const o=mesh(p,new T.TorusGeometry(r,t,10,64),m,[x,y,z]);o.rotation.x=Math.PI/2;return o;}
 function pipe(p,points,r,m=dark){return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),48,r,14,false),m);}
 function flange(p,r,y,n=20,x=0,z=0){cyl(p,r,.06,y,steel,x,z);const bolts=new T.InstancedMesh(new T.CylinderGeometry(.018,.018,.05,6),steel,n),d=new T.Object3D();for(let i=0;i<n;i++){const a=i/n*Math.PI*2;d.position.set(x+Math.cos(a)*r*.86,y+.045,z+Math.sin(a)*r*.86);d.updateMatrix();bolts.setMatrixAt(i,d.matrix);}p.add(bolts);}
 function lathe(p,profile,m){const curve=new T.CatmullRomCurve3(profile.map(([r,y])=>new T.Vector3(r,y,0)));const points=curve.getPoints(100).map(v=>new T.Vector2(v.x,v.y));return mesh(p,new T.LatheGeometry(points,96),m);}
 const nozzle=part('nozzle',[0,-1.5,0]);const bellMat=dark.clone();bellMat.side=T.DoubleSide;cutMaterials.push(bellMat);
 const bell=lathe(nozzle,[[1.13,-2.28],[1.12,-2.15],[1.04,-1.7],[.88,-1.1],[.69,-.55],[.58,-.28],[.61,-.19],[.62,-.13],[.53,-.07],[.4,.04],[.35,.18]],bellMat);
 ring(nozzle,1.13,.017,-2.28,black);ring(nozzle,.615,.027,-.16);ring(nozzle,.41,.018,.05);
 const numeral=new T.Shape();numeral.moveTo(-.055,.15);numeral.lineTo(.01,.2);numeral.lineTo(.06,.2);numeral.lineTo(.06,-.16);numeral.lineTo(.01,-.16);numeral.lineTo(.01,.13);numeral.lineTo(-.055,.1);numeral.closePath();
 const serial=mesh(nozzle,new T.ShapeGeometry(numeral),new T.MeshStandardMaterial({color:0xe6e7e8,roughness:.9}),[.28,-.67,.73]);serial.rotation.y=.22;
 const chamber=part('chamber',[0,.05,0]);const shellMat=dark.clone();shellMat.side=T.DoubleSide;cutMaterials.push(shellMat,copper);
 lathe(chamber,[[.35,.13],[.38,.27],[.4,.42],[.36,.55],[.36,.69],[.43,.76],[.43,.95],[.45,1.12]],shellMat);
 const liner=lathe(chamber,[[.32,.13],[.34,.35],[.35,.65],[.39,1.1]],copper);liner.userData.inspectionOnly=true;
 ring(chamber,.44,.035,.79);ring(chamber,.43,.025,.34);cyl(chamber,.46,.19,1.07);ring(chamber,.48,.033,1.19);
 const injector=part('injector',[0,.95,0]);flange(injector,.55,1.27,32);cyl(injector,.5,.13,1.35);flange(injector,.54,1.43,28);
 const face=cyl(injector,.43,.035,1.2,copper);face.userData.inspectionOnly=true;
 const posts=new T.InstancedMesh(new T.CylinderGeometry(.011,.011,.025,8),steel,120),d=new T.Object3D();let index=0;for(let row=1;row<=4;row++)for(let i=0;i<row*12;i++){const a=i/(row*12)*Math.PI*2;d.position.set(row*.085*Math.cos(a),1.17,row*.085*Math.sin(a));d.updateMatrix();posts.setMatrixAt(index++,d.matrix);}posts.userData.inspectionOnly=true;injector.add(posts);
 const mount=part('mount',[0,1.9,0]);cyl(mount,.18,.18,2.98,steel,-.17);cyl(mount,.21,.07,3.09,black,-.17);ring(mount,.205,.012,3.08,blue,-.17);cyl(mount,.24,.08,2.85,steel,-.17);flange(mount,.26,2.78,16,-.17);
 const valves=part('valves',[-1.5,.55,-.7]);cyl(valves,.28,.42,2.47,black,-.17);flange(valves,.34,2.72,20,-.17);flange(valves,.34,2.23,18,-.17);cyl(valves,.25,.21,2.08,black,-.17);
 for(const x of [-.4,-.17,.07]){const port=cyl(valves,.069,.09,2.47,steel,x,.275);port.rotation.x=Math.PI/2;const cap=cyl(valves,.05,.03,2.47,black,x,.33);cap.rotation.x=Math.PI/2;}
 pipe(valves,[[.09,2.54,-.03],[.37,2.54,-.03],[.55,2.42,-.03],[.57,2.17,-.03]],.025,steel);
 const fp=part('fuelPump',[-1.65,.65,-.3]);cyl(fp,.24,.31,1.97,dark,.25,-.28);flange(fp,.29,2.12,18,.25,-.28);cyl(fp,.19,.12,2.25,black,.25,-.28);ring(fp,.19,.012,2.3,blue,.25,-.28);
 const op=part('oxPump',[1.8,.6,.2]);const pump=mesh(op,new T.TorusGeometry(.21,.09,16,48),steel,[.66,1.75,.05]);pump.rotation.y=.3;const pumpCap=cyl(op,.21,.12,1.75,dark,.66,.12);pumpCap.rotation.x=Math.PI/2;
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const b=mesh(op,new T.CylinderGeometry(.015,.015,.045,6),steel,[.66+Math.cos(a)*.22,1.75+Math.sin(a)*.22,.23]);b.rotation.x=Math.PI/2;}
 pipe(op,[[.66,1.85,.05],[.79,1.77,.09],[.91,1.49,.12],[.82,1.07,.22],[.61,.49,.38],[.32,.35,.4],[-.25,.37,.32]],.105,black);
 pipe(op,[[.5,1.55,-.25],[.72,1.35,-.23],[.77,.9,-.2],[.62,.54,-.13],[.36,.4,-.08]],.095,dark);
 const manifold=part('manifold',[0,-.65,.85]);ring(manifold,.44,.05,.4,black);ring(manifold,.44,.055,.95,black);pipe(manifold,[[-.37,.42,.18],[-.48,.58,.22],[-.43,.95,.16],[-.32,1.13,.11]],.045,dark);
 // These passages sit inside the smooth jacket, not on its exterior.
 for(let j=0;j<32;j++){const a=j/32*Math.PI*2;const channel=pipe(manifold,[[1.05*Math.cos(a),-2.1,1.05*Math.sin(a)],[.81*Math.cos(a),-1.1,.81*Math.sin(a)],[.43*Math.cos(a),-.2,.43*Math.sin(a)],[.33*Math.cos(a),.65,.33*Math.sin(a)]],.008,copper);channel.userData.inspectionOnly=true;}
 for(const [id,x,z,offset]of [['fuelPreburner',-.19,-.27,[-1.1,1.4,-.65]],['oxPreburner',.3,-.08,[1.1,1.4,.55]]]){const p=part(id,offset,true);cyl(p,.13,.38,1.76,black,x,z);flange(p,.17,1.98,12,x,z);pipe(p,[[x,1.57,z],[x*.6,1.49,z],[0,1.46,0]],.075,dark);}
 const controller=part('controller',[1.4,1.6,1.2],true);mesh(controller,new T.BoxGeometry(.26,.2,.12),black,[.39,1.6,.28]);for(let i=0;i<3;i++)pipe(controller,[[.49,1.65,.3],[.6,1.72,.24],[.52,1.97,.11+i*.04]],.008,black);
 const actuators=part('actuators',[1.6,-.3,-1]);for(const x of [-.4,.4]){pipe(actuators,[[x,1.57,-.46],[x*.82,1.94,-.46],[x*.5,2.34,-.31]],.033,steel);cyl(actuators,.065,.3,1.78,black,x,-.46);}
 const protection=part('protection',[0,.35,-1.7]);parts.at(-1).name='Integrated powerhead housings';parts.at(-1).description='Compact structural and protective housings. This replaces the earlier invented outer shroud; detailed internal integration is not publicly documented.';
 lathe(protection,[[.47,1.43],[.48,1.62],[.37,1.89],[.28,2.06]],dark);ring(protection,.49,.028,1.47,black);
 root.updateMatrixWorld(true);for(const p of parts){new T.Box3().setFromObject(p.group).getCenter(p.anchor);p.group.traverse(o=>{if(o.isMesh)o.userData.partId=p.id;});}
 return {root,parts,model:engines.raptor3,bell,exitRadius:1.13,nozzleEnd:-2.28,cutMaterials,referenceExterior:true,dispose(){const gs=new Set(),ms=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)ms.add(o.material);});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());}};
}
