/* Fitness Master — single source of truth for continuous workout order.
   Training follows the latest workout visible in Progress, then advances exactly one slot.
   Canonical order: Push 1 -> Pull 1 -> Legs 1 -> Push 2 -> Pull 2 -> Legs 2 -> repeat.
   In-progress sessions are resumable only when they belong to the Progress-derived next slot. */
(function(){'use strict';
  const O=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
  function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};}}
  function time(x){const t=Date.parse(String(x||''));return Number.isFinite(t)?t:0;}
  function dateValue(d){const p=String(d||'').split(/[.\/-]/).map(Number);return p.length===3&&p.every(Number.isFinite)?new Date(p[2],p[1]-1,p[0]).getTime():0;}
  function norm(s){return String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();}
  function programs(){return window.FitnessMasterCurated?.PROGRAMS||window.TRAINING||{};}
  function progressLatest(){
    const s=read(),logs=Array.isArray(s.logs)?s.logs:[];if(!logs.length)return null;
    const dates=[...new Set(logs.map(x=>String(x?.date||'')).filter(Boolean))].sort((a,b)=>dateValue(b)-dateValue(a));
    for(const date of dates){
      const day=logs.filter(x=>String(x?.date||'')===date),scores=[];
      O.forEach(w=>{const p=programs()[w]||{},names=[...(p.exercises||[]),...(p.core||[])].map(norm);const score=day.reduce((n,x)=>n+(names.includes(norm(x?.name))?1:0),0);if(score)scores.push({workout:w,score});});
      if(scores.length){scores.sort((a,b)=>b.score-a.score||O.indexOf(a.workout)-O.indexOf(b.workout));return {workout:scores[0].workout,date,score:scores[0].score};}
    }
    return null;
  }
  function sessionCompletedFallback(){
    const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[];
    return a.filter(x=>x&&x.status==='completed'&&O.includes(x.workout)).sort((a,b)=>time(b.completedAt)-time(a.completedAt)||dateValue(b.date)-dateValue(a.date))[0]||null;
  }
  function completed(){return progressLatest()||sessionCompletedFallback()||(O.includes(read().lastWorkout)?{workout:read().lastWorkout,legacy:true}:null);}
  function nextAfter(w){const i=O.indexOf(w);return i<0?O[0]:O[(i+1)%O.length];}
  function inProgressFor(w){
    const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[];
    return a.filter(x=>x&&x.status==='in_progress'&&x.workout===w).sort((a,b)=>time(b.updatedAt||b.startedAt)-time(a.updatedAt||a.startedAt))[0]||null;
  }
  function resolve(){
    const last=completed(),expected=last?nextAfter(last.workout):O[0];
    const p=inProgressFor(expected);
    return {workout:expected,session:p,latest:last,reason:p?'resume-progress-next':'next-after-progress'};
  }
  function syncLastWorkout(){const s=read(),last=completed();if(last&&last.workout&&s.lastWorkout!==last.workout){s.lastWorkout=last.workout;localStorage.setItem('fitnessMaster',JSON.stringify(s));}return last?.workout||null;}
  function expose(){window.FitnessMasterSequence={ORDER:O,resolve,latestCompleted:completed,latestProgress:progressLatest,nextWorkout:function(){return resolve().workout},syncLastWorkout};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',expose);else expose();
})();
