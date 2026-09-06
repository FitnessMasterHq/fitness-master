/* Fitness Master — Dashboard sequence bridge. Keeps Dashboard and Training on the same canonical workout resolver. */
(function(){'use strict';
  function apply(){
    const r=window.FitnessMasterSequence;if(!r)return;
    const panel=document.querySelector('.panel.next');if(!panel)return;
    const w=r.nextWorkout();
    const h=panel.querySelector('h2');if(h&&h.textContent!==w)h.textContent=w;
    const focus=window.TRAINING?.[w]?.focus;
    const ps=panel.querySelectorAll('p');if(focus&&ps[0]&&ps[0].textContent!==focus)ps[0].textContent=focus;
    const b=document.getElementById('startNext');
    if(b&&!b.dataset.fmSequenceBound){
      b.dataset.fmSequenceBound='1';
      b.onclick=function(){
        if(window.FitnessMasterTraining?.render){window.FitnessMasterTraining.render();}
        else {const n=document.querySelector('.nav-btn[data-page="training"]');if(n)n.click();}
      };
    }
  }
  function install(){
    rSafe();
    const app=document.getElementById('app');
    if(app)new MutationObserver(apply).observe(app,{childList:true,subtree:true});
    window.addEventListener('fm-cloud-data-updated',apply);
    setTimeout(apply,0);setTimeout(apply,250);
  }
  function rSafe(){try{window.FitnessMasterSequence?.syncLastWorkout?.();}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
