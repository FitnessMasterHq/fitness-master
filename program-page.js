/* Fitness Master — Program page */
(function(){
  'use strict';
  const ORDER=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function programPage(name){
    const x=TRAINING[name]||{};
    const warm=x.warmup||[], ex=x.exercises||[], core=x.core||[];
    return `<div class="content"><h2>Program</h2>
      <div class="panel">
        <div class="eyebrow">MASTER PROGRAM</div>
        <h2>${esc(name)}</h2>
        <p><b>Odak:</b> ${esc(x.focus||'')}</p>
        <div class="log-row"><label class="label" style="align-self:center">Program seç</label><select id="programSelect" class="input">${ORDER.map(n=>`<option value="${esc(n)}" ${n===name?'selected':''}>${esc(n)}</option>`).join('')}</select></div>
      </div>
      <h3 class="section-title">1. ISINMA</h3>
      ${warm.length?warm.map(n=>exerciseCard(n,false)).join(''):'<div class="panel muted">Bu program için ısınma henüz tanımlanmamış.</div>'}
      <h3 class="section-title">2. ANA ANTRENMAN</h3>
      ${ex.length?ex.map(n=>exerciseCard(n,false)).join(''):'<div class="panel muted">Bu program için ana hareketler henüz tanımlanmamış.</div>'}
      <h3 class="section-title">3. CORE</h3>
      ${core.length?core.map(n=>exerciseCard(n,false)).join(''):'<div class="panel muted">Bu program için Core hareketleri henüz tanımlanmamış.</div>'}
    </div>`;
  }
  function show(name){
    const app=document.getElementById('app'); if(!app)return;
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page==='program'));
    app.innerHTML=programPage(name||ORDER[0]);
    const sel=document.getElementById('programSelect');
    if(sel)sel.onchange=()=>show(sel.value);
  }
  function install(){
    const nav=document.querySelector('.nav'); if(!nav)return;
    if(!nav.querySelector('[data-page="program"]')){
      const b=document.createElement('button'); b.className='nav-btn'; b.dataset.page='program'; b.textContent='Program';
      nav.insertBefore(b,nav.querySelector('[data-page="training"]')||null);
      b.onclick=()=>show(ORDER[0]);
    }
    window.FitnessMasterProgram={show,order:ORDER};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
