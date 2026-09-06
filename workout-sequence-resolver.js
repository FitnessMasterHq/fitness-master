/* Fitness Master — single source of truth for continuous workout order.
   Canonical order: Push 1 -> Pull 1 -> Legs 1 -> Push 2 -> Pull 2 -> Legs 2 -> repeat.
   Completed sessions are authoritative when available. Legacy lastWorkout is a fallback
   so an older valid progress state cannot make Training restart at Push 1. */
(function(){'use strict';
  const O=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
  function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};}}
  function write(s){localStorage.setItem('fitnessMaster',JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();}
  function time(x){const t=Date.parse(String(x||''));return Number.isFinite(t)?t:0;}
  function dateValue(d){const p=String(d||'').split(/[.\/-]/).map(Number);return p.length===3&&p.every(Number.isFinite)?new Date(p[2],p[1]-1,p[0]).getTime():0;}
  function completed(){
    const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[];
    const x=a.filter(x=>x&&x.status==='completed'&&O.includes(x.workout)).sort((a,b)=>time(b.completedAt)-time(a.completedAt)||dateValue(b.date)-dateValue(a.date))[0];
    if(x)return x;
    const legacy=O.includes(s.lastWorkout)?s.lastWorkout:null;
    return legacy?{workout:legacy,legacy:true}:null;
  }
  function nextAfter(w){const i=O.indexOf(w);return i<0?O[0]:O[(i+1)%O.length];}
  function inProgressFor(w){
    const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[];
    return a.filter(x=>x&&x.status==='in_progress'&&x.workout===w).sort((a,b)=>time(b.updatedAt||b.startedAt)-time(a.updatedAt||a.startedAt))[0]||null;
  }
  function resolve(){
    const s=read(),last=completed(),expected=last?nextAfter(last.workout):null;
    if(expected){
      const p=inProgressFor(expected);
      if(p)return {workout:expected,session:p,latest:last,reason:'resume-next-in-progress'};
      return {workout:expected,session:null,latest:last,reason:'next-after-completed'};
    }
    const p=(Array.isArray(s.workoutSessions)?s.workoutSessions:[]).filter(x=>x&&x.status==='in_progress'&&O.includes(x.workout)).sort((a,b)=>time(b.updatedAt||b.startedAt)-time(a.updatedAt||a.startedAt))[0]||null;
    return {workout:p?.workout||O[0],session:p,latest:null,reason:p?'resume-in-progress':'first-workout'};
  }
  function syncLastWorkout(){
    const s=read(),last=completed();
    if(last&&last.workout&&s.lastWorkout!==last.workout&&!last.legacy){s.lastWorkout=last.workout;write(s);}
    return last?.workout||null;
  }
  function expose(){window.FitnessMasterSequence={ORDER:O,resolve,latestCompleted:completed,nextWorkout:function(){return resolve().workout},syncLastWorkout};syncLastWorkout();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',expose);else expose();
})();
