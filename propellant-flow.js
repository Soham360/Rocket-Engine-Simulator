import * as T from './vendor/three.module.js';
import {flowTopology} from './flow-topology.js';
const colors={fuel:0xd58316,oxidizer:0x1679d4,gas:0x9863ce};
export function createPropellantFlow(assembly,engineId){
 const root=new T.Group(),{nodes,edges}=flowTopology(engineId),positions={},tracks=[],labels=[];
 for(const [id,node]of Object.entries(nodes)){
  const part=assembly.parts.find(p=>p.id===node.part);if(node.position)positions[id]=new T.Vector3(...node.position);
  else if(part){positions[id]=part.anchor.clone().add(new T.Vector3(...(node.offset??[0,0,0])));if(node.location==='cooling')positions[id].set(-assembly.exitRadius*.65,assembly.nozzleEnd*.8,.3);if(node.location==='exit')positions[id].set(0,assembly.nozzleEnd-.3,0);}
 }
 for(const edge of edges){const a=positions[edge.from],b=positions[edge.to];if(!a||!b)continue;const middle=a.clone().lerp(b,.5);middle.z=Math.max(a.z,b.z)+.25;
  const curve=new T.CatmullRomCurve3([a,middle,b]);const points=curve.getPoints(40);const material=edge.state==='hot'?new T.LineDashedMaterial({color:colors[edge.stream],dashSize:.09,gapSize:.055,transparent:true,opacity:.65,depthTest:false}):new T.LineBasicMaterial({color:colors[edge.stream],transparent:true,opacity:.6,depthTest:false});
  const line=new T.Line(new T.BufferGeometry().setFromPoints(points),material);line.computeLineDistances();line.renderOrder=22;root.add(line);
  const arrows=Array.from({length:3},()=>{const arrow=new T.Mesh(new T.ConeGeometry(.048,.15,12),new T.MeshBasicMaterial({color:colors[edge.stream],depthTest:false}));arrow.renderOrder=24;root.add(arrow);return arrow;});tracks.push({edge,curve,line,arrows});
 }
 labels.push({id:'fuel',position:positions.fuelInlet.clone(),stream:'fuel'},{id:'oxidizer',position:positions.oxInlet.clone(),stream:'oxidizer'},{id:'gas',position:positions.exit.clone(),stream:'gas'});
 let filter='all';
 function draw(phase){for(const track of tracks){const visible=filter==='all'||track.edge.stream===filter;track.line.visible=visible;for(let i=0;i<track.arrows.length;i++){const arrow=track.arrows[i];arrow.visible=visible;const t=(phase*.22+i/3)%1;arrow.position.copy(track.curve.getPointAt(t));arrow.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),track.curve.getTangentAt(t).normalize());}}}
 draw(0);
 return {root,labels,draw,filter(value){filter=value;},dispose(){root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}};
}
