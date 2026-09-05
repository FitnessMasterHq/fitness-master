/* Fitness Master — database-safe set logging: one record per set, explicit edit updates it. */
(function(){
'use strict';
function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};}}
function save(s){localStorage.setItem('fitnessMaster',JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();}
function id(){return crypto?.randomUUID?crypto.randomUUID():('set-'+Date.now()+'-'+Math.random().toString(36).slice(2));}
function install(){
 if(window.__setLogEditInstalled)return;
 document.addEventListener('click',function(e){
  const edit=e.target.closest('.set-log .edit-set');
  if(edit){
   e.preventDefault();e.stopImmediatePropagation();
   const box=edit.parentElement,btn=box.querySelector('.log');
   box.querySelectorAll('input[data-k]').forEach(x=>x.disabled=false);
   if(btn){btn.disabled=false;btn.dataset.editing='1';btn.textContent='Güncelle';}
   edit.remove();return;
  }
  const b=e.target.closest('.set-log .log');if(!b)return;
  const box=b.parentElement;
  const value=k=>box.querySelector(`[data-k="${k}"]`)?.value||'';
  const kg=value('kg'),reps=value('reps'),rir=value('rir');
  if(b.dataset.editing==='1'){
   e.preventDefault();e.stopImmediatePropagation();
   const s=read(),logs=Array.isArray(s.logs)?s.logs:[],idx=logs.findIndex(x=>String(x.id)===String(b.dataset.logId));
   if(idx<0)return;
   logs[idx]=Object.assign({},logs[idx],{kg,reps,rir,updatedAt:new Date().toISOString()});s.logs=logs;save(s);
   b.dataset.editing='';b.dataset.saved='1';b.disabled=true;b.textContent='Güncellendi ✓';box.querySelectorAll('input[data-k]').forEach(x=>x.disabled=true);
   b.insertAdjacentHTML('afterend','<button type="button" class="btn small edit-set">Düzelt</button>');return;
  }
  if(b.dataset.saved==='1'){e.preventDefault();e.stopImmediatePropagation();return;}
  if(!kg&&!reps&&!rir){e.preventDefault();e.stopImmediatePropagation();return;}
  e.preventDefault();e.stopImmediatePropagation();
  const s=read(),logs=Array.isArray(s.logs)?s.logs:[],date=new Date().toLocaleDateString('tr-TR'),name=b.dataset.name,set=b.dataset.set;
  let existing=logs.find(x=>String(x.date)===date&&String(x.name)===name&&String(x.set)===String(set));
  if(existing){b.dataset.logId=existing.id||(existing.id=id());existing.kg=kg;existing.reps=reps;existing.rir=rir;existing.updatedAt=new Date().toISOString();}
  else{existing={id:id(),date,name,set,kg,reps,rir,createdAt:new Date().toISOString()};logs.push(existing);b.dataset.logId=existing.id;}
  s.logs=logs;save(s);
  b.dataset.saved='1';b.disabled=true;b.textContent='Kaydedildi ✓';box.querySelectorAll('input[data-k]').forEach(x=>x.disabled=true);
  b.insertAdjacentHTML('afterend','<button type="button" class="btn small edit-set">Düzelt</button>');
 },true);
 window.__setLogEditInstalled=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
