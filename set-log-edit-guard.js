/* Fitness Master — each set can be saved once, then edited explicitly. */
(function(){
'use strict';
function install(){
  if(window.__setLogEditGuardInstalled)return;
  document.addEventListener('click',function(e){
    const b=e.target.closest('.set-log .log');
    if(!b)return;
    if(b.dataset.saved==='1'){
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    b.dataset.saved='1';
    b.disabled=true;
    b.textContent='Kaydedildi ✓';
    b.insertAdjacentHTML('afterend','<button type="button" class="btn small edit-set" data-edit-for="'+String(b.dataset.name).replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'" data-edit-set="'+String(b.dataset.set).replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'">Düzelt</button>');
  },true);
  document.addEventListener('click',function(e){
    const b=e.target.closest('.set-log .edit-set');
    if(!b)return;
    const row=b.parentElement;
    const saveBtn=row.querySelector('.log');
    if(!saveBtn)return;
    row.querySelectorAll('input[data-k]').forEach(i=>i.disabled=false);
    saveBtn.disabled=false;
    saveBtn.textContent='Güncelle';
    saveBtn.dataset.saved='0';
    saveBtn.dataset.editing='1';
    b.remove();
  },true);
  window.__setLogEditGuardInstalled=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
