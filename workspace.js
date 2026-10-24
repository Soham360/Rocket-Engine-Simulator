const simulator=document.getElementById('simulator'),learning=document.getElementById('learn');
const switcher=document.createElement('div');switcher.className='workspace-switch';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Workspace panels');
switcher.innerHTML='<button data-panel="simulation" aria-pressed="true">Simulation</button><button data-panel="controls" aria-pressed="false">Engine settings</button>';
simulator.prepend(switcher);document.body.dataset.toolPanel='simulation';
function setPanel(panel){document.body.dataset.toolPanel=panel;switcher.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.panel===panel)));}
switcher.addEventListener('click',event=>{const button=event.target.closest('button');if(button)setPanel(button.dataset.panel);});
function showPage(){const isLearning=location.hash==='#learn';simulator.hidden=isLearning;learning.hidden=!isLearning;document.querySelectorAll('header nav a').forEach(link=>{const selected=link.hash===(isLearning?'#learn':'#simulator');link.classList.toggle('selected',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}
addEventListener('hashchange',showPage);showPage();
document.querySelector('header nav a[href="#simulator"]').addEventListener('click',()=>setPanel('simulation'));
document.querySelector('.skip').addEventListener('click',()=>{if(location.hash==='#learn')location.hash='#simulator';setPanel('controls');document.getElementById('tab-engine').focus();});
document.querySelectorAll('[data-experiment]').forEach(button=>button.addEventListener('click',()=>{setPanel('controls');location.hash='#simulator';}));
