/* Fitness Master — warm-up heart-rate guidance.
   Evidence basis: NSCA general warm-up = 5–10 min low-to-moderate intensity;
   target is gradual HR elevation without fatigue. HRmax equations are estimates.
*/
(function(){
  'use strict';
  const AGE=47;
  const HRMAX=Math.round(207-(0.7*AGE)); // ACSM-listed Gelish equation: 174 bpm
  const LOW=Math.round(HRMAX*0.50);     // 87 bpm
  const HIGH=Math.round(HRMAX*0.60);    // 104 bpm
  const MAX=Math.round(HRMAX*0.63);     // practical ceiling: ~110 bpm
  function add(){
    const content=document.querySelector('#app .content');
    if(!content || !/^Training$/i.test(content.querySelector('h2')?.textContent||'')) return;
    const old=document.getElementById('warmup-hr-guidance'); if(old) old.remove();
    const h=[...content.querySelectorAll('h3')].find(x=>/1\. ISINMA/i.test(x.textContent||''));
    if(!h) return;
    const box=document.createElement('div');
    box.id='warmup-hr-guidance';
    box.className='panel warmup-hr';
    box.innerHTML='<b>Isınma kalp hızı hedefi</b><br>'+LOW+'–'+HIGH+' bpm hedef; <b>'+MAX+' bpm üzerine çıkma.</b><br><span class="muted">Amaç nabzı kademeli yükseltmek, yorulmak değil. Saat/göğüs bandındaki gerçek HR esas alınır. Baş dönmesi, göğüs ağrısı veya olağandışı nefes darlığında dur.</span>';
    h.insertAdjacentElement('afterend',box);
  }
  window.addEventListener('load',add);
  document.addEventListener('click',()=>setTimeout(add,0));
  const mo=new MutationObserver(()=>{if(document.querySelector('#app .content')) add();});
  if(document.readyState!=='loading') mo.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>mo.observe(document.getElementById('app')||document.body,{childList:true,subtree:true}));
})();
