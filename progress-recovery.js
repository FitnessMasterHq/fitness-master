/* Fitness Master — canonical Progress recovery: keep only the real Push 2 session */
(function(){
  'use strict';
  const KEY='fitnessMaster';
  const REAL_PUSH2=[
    ['Incline DB Press','1','10','15','5'],['Incline DB Press','2','12','12','5'],['Incline DB Press','3','14','12','3'],
    ['Machine Chest Press','1','25','13','3'],['Machine Chest Press','2','30','11','1'],['Machine Chest Press','3','30','8',''],
    ['Cable Lateral Raise','1','2.5','12','5'],['Cable Lateral Raise','2','5','10','0'],['Cable Lateral Raise','3','2.5','12','5'],
    ['Seated Machine Shoulder Press','1','10','15','5'],['Seated Machine Shoulder Press','2','17.5','9','3'],
    ['Cable Fly/Pec Deck','1','10','12','3'],['Cable Fly/Pec Deck','2','10','12','3'],
    ['Rope Triceps Pushdown','1','13','15','5'],['Rope Triceps Pushdown','2','16.5','10','1'],['Rope Triceps Pushdown','3','9.5','10',''],
    ['Overhead Cable Triceps Extension','1','10','10','1'],['Overhead Cable Triceps Extension','2','10','10','1'],
    ['Cable Crunch','1','35','12','2'],['Cable Crunch','2','35','12','1'],['Cable Crunch','3','35','12','1'],
    ['Pallof Press','1','5','15','3'],['Pallof Press','2','5','15','3']
  ];
  const canonical=REAL_PUSH2.map(x=>({date:'04.09.2026',name:x[0],set:x[1],kg:x[2],reps:x[3],rir:x[4]}));
  function restore(){
    let s={}; try{s=JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){return false;}
    const logs=Array.isArray(s.logs)?s.logs:[];
    /* Progress was contaminated by test entries. Until a clean session is recorded,
       the only authoritative workout history is the real Push 2 session. */
    const same=(a,b)=>a&&a.date===b.date&&a.name===b.name&&String(a.set)===String(b.set)&&String(a.kg)===String(b.kg)&&String(a.reps)===String(b.reps)&&String(a.rir||'')===String(b.rir||'');
    const clean=logs.length===canonical.length&&canonical.every(w=>logs.some(x=>same(x,w)));
    if(clean)return false;
    s.logs=canonical;
    s.dataResetVersion=Math.max(Number(s.dataResetVersion||0),5);
    s.progressResetVersion=Math.max(Number(s.progressResetVersion||0),5);
    localStorage.setItem(KEY,JSON.stringify(s));
    if(window.FitnessMasterFirebaseSync&&window.FitnessMasterFirebaseSync.pushNow) setTimeout(()=>window.FitnessMasterFirebaseSync.pushNow(),150);
    if(typeof window.render==='function')window.render('progress');
    return true;
  }
  restore();
  window.addEventListener('fm-cloud-sync-ready',()=>setTimeout(restore,300));
  window.addEventListener('fm-cloud-data-updated',()=>setTimeout(restore,300));
})();
