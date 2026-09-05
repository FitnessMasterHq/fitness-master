/* Fitness Master — one-save-per-set with Edit support. */
(function(){
'use strict';
function install(){
  if(window.__setLogEditInstalled)return;
  document.addEventListener('click',function(e){
    const b=e.target.closest('.set-log .log');
    if(!b)return;
    if(b.dataset.saved==='1')return;
    const box=b.parentElement;
    const value=k=>box.querySelector(`[data-k="${k}"]`)?.value||'';
    const kg=value('kg'), reps=value('reps'), rir=value('rir');
    if(!kg && !reps && !rir)return;
    const date=new Date().toLocaleDateString('tr-TR');
    const name=b.dataset.name, set=b.dataset.set;
    let state={};
    try{state=JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(err){}
    state.logs=Array.isArray(state.logs)?state.logs:[];
    state.logs=state.logs.filter(x=>!(String(x.date)===date&&String(x.name)===name&&String(x.set)===String(set)));
    state.logs.push({date,name,set,kg,reps,rir});
    localStorage.setItem('fitnessMaster',JSON.stringify(state));
    b.dataset.saved='1'; b.disabled=true; b.textContent='Kaydedildi ✓';
    const edit=document.createElement('button');
    edit.type='button'; edit.className='btn small edit-set'; edit.textContent='Düzelt';
    edit.dataset.name=name; edit.dataset.set=set;
    b.insertAdjacentElement('afterend',edit);
  },true);
  document.addEventListener('click',function(e){
    const b=e.target.closest('.edit-set');
    if(!b)return;
    const box=b.parentElement, saveBtn=box.querySelector('.log');
    ['kg','reps','rir'].forEach(k=>{const el=box.querySelector(`[data-k="${k}"]`); if(el)el.disabled=false;});
    if(saveBtn){saveBtn.disabled=false; saveBtn.dataset.saved=''; saveBtn.textContent='Kaydet';}
    b.remove();
  },true);
  window.__setLogEditInstalled=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
