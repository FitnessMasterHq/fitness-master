/* Fitness Master — reset temporary test weights to baseline 85 kg */
(function(){
  'use strict';
  function reset(){
    try{
      const key='fitnessMaster';
      const state=JSON.parse(localStorage.getItem(key)||'{}');
      state.weight=85;
      if(Array.isArray(state.bodyLogs)){
        state.bodyLogs=state.bodyLogs.filter(x=>!(x&&x.source==='Manuel'&&(String(x.weight)==='88'||String(x.weight)==='89')));
      }
      localStorage.setItem(key,JSON.stringify(state));
      if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();
      if(typeof window.render==='function')window.render('dashboard');
    }catch(e){console.error('Fitness Master weight reset:',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(reset,700));else setTimeout(reset,700);
})();
