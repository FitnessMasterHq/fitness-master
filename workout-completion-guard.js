/* Fitness Master — prevent duplicate workout completion clicks. */
(function(){
'use strict';
function install(){
  if(window.__completionGuardInstalled)return;
  document.addEventListener('click',function(e){
    const b=e.target.closest('#completeWorkout');
    if(!b)return;
    if(b.dataset.completed==='1'){
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    b.dataset.completed='1';
    b.disabled=true;
    b.textContent='Antrenman kaydedildi ✓';
    b.setAttribute('aria-disabled','true');
    setTimeout(function(){
      if(document.body.contains(b)) b.disabled=true;
    },0);
  },true);
  window.__completionGuardInstalled=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
