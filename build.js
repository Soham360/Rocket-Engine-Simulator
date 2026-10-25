import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','design.css','workspace.css','workspace.js','app.js','scene.js','physics.js','session.js','engines.js','assembly.js','assembly-ui.js','assembly.css','raptor-assembly.js','propellant-flow.js','flow-topology.js','flow.css','polish.css'])await copyFile(file,`dist/${file}`);
await cp('vendor','dist/vendor',{recursive:true});
console.log('Static site built in dist/');
