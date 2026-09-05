/* Fitness Master — one immutable set record per set row; explicit edit updates that record. */
(function(){
'use strict';
function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};} }
function write(s){localStorage.setItem('fitnessMaster',JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();}
function makeId(){return crypto?.randomUUID?crypto.randomUUID():('set-'+Date.now()+'-'+Math.random().toString(36).slice(2));}
function findLog(s,name,set){return (s.logs||[]).find(x=>String(x.name)===String(name)&&String(x.set)===String(set)&&String(x.date)===new Date().toLocaleDateString('tr-TR'))||null;}
function install(){
 if(window.__setLogEditGuardInstalled)return;
 document.addEventListener('click',function(e){
   const edit=e.target.closest('.set-log .edit-set');
   if(edit){
     e.preventDefault(); e.stopImmediatePropagation();
     const row=edit.parentElement, save=row.querySelector('.log');
     row.querySelectorAll('input[data-k]').forEach(i=>i.disabled=false);
     if(save){save.disabled=false;save.textContent='Güncelle';save.dataset.editing='1';save.dataset.saved='0';}
     edit.remove(); return;
   }
   const b=e.target.closest('.set-log .log');
   if(!b)return;
   if(b.dataset.editing==='1'){
     e.preventDefault(); e.stopImmediatePropagation();
     const row=b.parentElement, g=k=>row.querySelector(`[data-k="${k}"]`)?.value||'';
     const s=read(), logs=Array.isArray(s.logs)?s.logs:[], id=b.dataset.logId;
     const idx=logs.findIndex(x=>String(x.id||'')===String(id));
     if(idx<0)return;
     logs[idx]=Object.assign({},logs[idx],{kg:g('kg'),reps:g('reps'),rir:g('rir'),updatedAt:new Date().toISOString()});
     s.logs=logs; write(s);
     b.dataset.editing=''; b.dataset.saved='1'; b.disabled=true; b.textContent='Güncellendi ✓';
     row.querySelectorAll('input[data-k]').forEach(i=>i.disabled=true);
     setTimeout(()=>{if(document.body.contains(row))b.insertAdjacentHTML('afterend','<button type="button" class="btn small edit-set">Düzelt</button>');},0);
     return;
   }
   if(b.dataset.saved==='1'){e.preventDefault();e.stopImmediatePropagation();return;}
   setTimeout(function(){
     const s=read(), name=b.dataset.name, set=b.dataset.set;
     const log=findLog(s,name,set);
     if(!log)return;
     if(!log.id)log.id=makeId();
     write(s); b.dataset.logId=log.id; b.dataset.saved='1'; b.disabled=true; b.textContent='Kaydedildi ✓';
     b.insertAdjacentHTML('afterend','<button type="button" class="btn small edit-set">Düzelt</button>');
     const row=b.parentElement; row.querySelectorAll('input[data-k]').forEach(i=>i.disabled=true);
   },0);
 },true);
 window.__setLogEditGuardInstalled=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
