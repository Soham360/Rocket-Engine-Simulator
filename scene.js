import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {fuels} from './physics.js';

export function createScene(container){
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9eef2);scene.fog=new THREE.Fog(0xe9eef2,14,30);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;container.append(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(38,1,.1,60);const home=new THREE.Vector3(6,3.2,7),homeTarget=new THREE.Vector3(0,.2,0);camera.position.copy(home);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.copy(homeTarget);controls.enableDamping=!reducedMotion.matches;controls.minDistance=4;controls.maxDistance=16;controls.maxPolarAngle=Math.PI*.85;
 let resetting=false,lastGeometry='',lastFuel='',cut=false,exitRadius=1;
 const cameraVelocity=new THREE.Vector3(),targetVelocity=new THREE.Vector3();
 // A critically damped spring starts at the live camera position.
 function cancelReset(){resetting=false;cameraVelocity.set(0,0,0);targetVelocity.set(0,0,0);}
 controls.addEventListener('start',cancelReset);
 function clearOrbitMomentum(){const damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=damping;}
 reducedMotion.addEventListener('change',()=>{clearOrbitMomentum();controls.enableDamping=!reducedMotion.matches;if(reducedMotion.matches&&resetting){camera.position.copy(home);controls.target.copy(homeTarget);cancelReset();controls.update();}});
 function spring(value,velocity,target,dt){const omega=15,decay=Math.exp(-omega*dt);for(const axis of ['x','y','z']){const offset=value[axis]-target[axis],c=velocity[axis]+omega*offset;value[axis]=target[axis]+(offset+c*dt)*decay;velocity[axis]=(velocity[axis]-omega*c*dt)*decay;}}
 scene.add(new THREE.HemisphereLight(0xffffff,0x718199,3));const light=new THREE.DirectionalLight(0xfff5e9,4);light.position.set(3,8,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);scene.add(light);const fill=new THREE.DirectionalLight(0xabcfff,2);fill.position.set(-4,2,-4);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0xe4eaf0,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-5.2;floor.receiveShadow=true;scene.add(floor);const grid=new THREE.GridHelper(30,60,0xb9c8d8,0xd4dee8);grid.position.y=-5.19;scene.add(grid);
 const engine=new THREE.Group();scene.add(engine);
 const steel=new THREE.MeshStandardMaterial({color:0x9aa8ba,metalness:.8,roughness:.31}),dark=new THREE.MeshStandardMaterial({color:0x354557,metalness:.75,roughness:.45}),blue=new THREE.MeshStandardMaterial({color:0x3974b8,metalness:.55,roughness:.32}),copper=new THREE.MeshStandardMaterial({color:0xad7756,metalness:.75,roughness:.4});
 function mesh(geometry,material){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;engine.add(m);return m;}
 function cylinder(r1,r2,h,y,mat=steel){const m=mesh(new THREE.CylinderGeometry(r1,r2,h,48),mat);m.position.y=y;return m;}
 const ringGeometry=new THREE.TorusGeometry(1,.02,8,64);
 function ring(r,y,mat=steel){const m=mesh(ringGeometry,mat);m.rotation.x=Math.PI/2;m.position.y=y;m.scale.set(r,r,1);return m;}
 function pipe(points,r,mat){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,r,10,false),mat);}
 // Hardware stays allocated. Sliders only update the nozzle geometry and rings.
 ring(.56,.65);ring(.56,1.3);cylinder(.65,.65,.14,1.6,dark);cylinder(.51,.51,.15,1.74,blue);cylinder(.35,.42,.36,1.98);ring(.36,2.17);
 const boltGeometry=new THREE.CylinderGeometry(.045,.045,.18,6);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;mesh(boltGeometry,dark).position.set(Math.cos(a)*.57,1.64,Math.sin(a)*.57);}
 pipe([[.35,2.15,.1],[.95,2.25,.1],[1.1,1.7,.1],[.95,1.05,.1],[.5,.8,.1]],.1,blue);pipe([[-.32,2.1,0],[-.85,2.15,0],[-1,1.5,0],[-.78,.65,0],[-.48,.5,0]],.075,copper);mesh(new THREE.SphereGeometry(.26,24,16),dark).position.set(1.02,1.55,.1);mesh(new THREE.BoxGeometry(.3,.28,.04),blue).position.set(0,1,.54);
 const bellMaterial=steel.clone();bellMaterial.side=THREE.DoubleSide;const bell=mesh(new THREE.BufferGeometry(),bellMaterial);
 const coolingRings=Array.from({length:19},()=>ring(1,0,copper)),lip=ring(1,-1.55,dark);
 const plume=mesh(new THREE.ConeGeometry(1,3.3,48,1,true),new THREE.MeshBasicMaterial({transparent:true,opacity:.55,depthWrite:false,side:THREE.DoubleSide}));plume.rotation.z=Math.PI;plume.castShadow=false;
 const glow=mesh(new THREE.ConeGeometry(1,2,32,1,true),new THREE.MeshBasicMaterial({color:0xe8f7ff,transparent:true,opacity:.9,depthWrite:false}));glow.rotation.z=Math.PI;glow.castShadow=false;plume.visible=glow.visible=false;
 function build(c){const signature=`${c.throat}/${c.expansion}`;
  if(signature!==lastGeometry){lastGeometry=signature;const throat=c.throat*2.5;exitRadius=Math.min(1.65,throat*Math.sqrt(c.expansion));const points=[];
   for(let i=0;i<=40;i++){const t=i/40;points.push(new THREE.Vector2(throat+(exitRadius-throat)*t**.7,-.05-1.5*t));}
   points.reverse();points.push(new THREE.Vector2(.5,.35),new THREE.Vector2(.54,.7),new THREE.Vector2(.54,1.3),new THREE.Vector2(.4,1.55));bell.geometry.dispose();bell.geometry=new THREE.LatheGeometry(points,80);
   coolingRings.forEach((ring,i)=>{const t=i/18,r=throat+(exitRadius-throat)*t**.7;ring.scale.set(r,r,1);ring.position.y=-.05-1.5*t;});lip.scale.set(exitRadius,exitRadius,1);
  }
  if(c.fuel!==lastFuel){lastFuel=c.fuel;plume.material.color.setHex(fuels[c.fuel].color);}
 }
 function reset(){clearOrbitMomentum();if(reducedMotion.matches){camera.position.copy(home);controls.target.copy(homeTarget);cancelReset();controls.update();}else resetting=true;}
 const observer=new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});observer.observe(container);
 return {build,reset,cutaway(){cut=!cut;bellMaterial.clippingPlanes=cut?[new THREE.Plane(new THREE.Vector3(0,0,-1),0)]:[];bellMaterial.needsUpdate=true;return cut;},render(c,level,time,paused,dt=1/60){
  if(resetting){spring(camera.position,cameraVelocity,home,dt);spring(controls.target,targetVelocity,homeTarget,dt);if(camera.position.distanceTo(home)<.0001&&controls.target.distanceTo(homeTarget)<.0001){camera.position.copy(home);controls.target.copy(homeTarget);cancelReset();}}
  engine.rotation.z=-c.gimbal*Math.PI/180;plume.visible=glow.visible=level>.005;const flicker=paused||reducedMotion.matches?1:1+Math.sin(time*39)*.025;
  plume.scale.set(exitRadius*.85,(.25+level*.75)*flicker,exitRadius*.85);plume.position.y=-1.55-1.65*plume.scale.y;glow.scale.set(exitRadius*.48,.25+level*.75,exitRadius*.48);glow.position.y=-1.55-glow.scale.y;plume.material.opacity=.25+level*.3;controls.update(dt);renderer.render(scene,camera);
 }};
}
