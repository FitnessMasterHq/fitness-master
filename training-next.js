/* Fitness Master — Training always shows the NEXT session after the latest completed Progress workout. */
(function(){
  'use strict';
  const ORDER=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
  const PROGRAMS={
    'Push 1':{focus:'Göğüs • Omuz • Triceps',warmup:['Light Cardio','Band/Cable External Rotation','Face Pull'],exercises:['Flat Dumbbell Press','Incline Machine / Smith Press','Machine Lateral Raise','Cable Fly / Pec Deck','Seated Machine Shoulder Press','Cable Triceps Extension','Single-Arm Overhead Cable Extension'],core:['Abdominal Machine','Dead Bug']},
    'Pull 1':{focus:'Sırt • Arka omuz • Biceps',warmup:['Light Cardio','Scapular Pulldown','Band/Cable External Rotation','Face Pull'],exercises:['Assisted Pull-up / Neutral-Grip Pulldown','High Row Machine','Cable Row — Neutral Grip','Cable Rear-Delt Fly','Preacher / Machine Curl','Cable Bayesian Curl','Farmer Carry'],core:['Pallof Press','Cable Crunch']},
    'Legs 1':{focus:'Quadriceps • Glute • Hamstring • Calf',warmup:['Light Cardio','Knee-to-Wall','90/90 Hip Rotation','Bodyweight Squat','Hip Hinge'],exercises:['Back Squat','Leg Press','Romanian Deadlift (RDL)','Seated Leg Curl','Leg Extension','Hip Adduction','Hip Abduction','Standing Calf Raise','Seated Calf Raise'],core:['Cable Crunch','Pallof Press'],zone2:true},
    'Push 2':{focus:'Göğüs • Omuz • Triceps',warmup:['Light Cardio','Band/Cable External Rotation','Face Pull'],exercises:['Incline Dumbbell Press','Machine Chest Press','Cable Lateral Raise','Seated Machine Shoulder Press','Cable Fly / Pec Deck','Rope Triceps Pushdown','Overhead Cable Triceps Extension'],core:['Cable Crunch','Pallof Press']},
    'Pull 2':{focus:'Sırt • Arka omuz • Biceps',warmup:['Light Cardio','Scapular Pulldown','Face Pull','Band/Cable External Rotation'],exercises:['Lat Pulldown','Chest-Supported Row','Single-Arm Cable Row','Reverse Pec Deck','Incline Dumbbell Curl','Hammer Curl','Suitcase Carry'],core:[]},
    'Legs 2':{focus:'Glute • Hamstring • Quadriceps • Calf',warmup:['Light Cardio','Banded Glute Bridge','Banded Lateral Walk','90/90 Hip Rotation','Bodyweight Hip Hinge'],exercises:['Hip Thrust / Booty Builder','Hack Squat / Suitable Squat Machine','Bulgarian Split Squat','Seated / Lying Leg Curl','Cable Glute Kickback','Hip Abduction','Leg Extension','Standing Calf Raise','Tibialis Raise'],core:['Hanging Knee Raise','Side Plank'],zone2:true}
  };
  const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/[^a-z0-9çğıöşü]+/g,'').replace(/ı/g,'i');
  const aliases={
    'Incline DB Press':'Incline Dumbbell Press','Cable Fly/Pec Deck':'Cable Fly / Pec Deck','Rope Triceps Pushdown':'Rope Triceps Pushdown','Overhead Cable Triceps Extension':'Overhead Cable Triceps Extension','Machine Chest Press':'Machine Chest Press','Seated Machine Shoulder Press':'Seated Machine Shoulder Press','Cable Lateral Raise':'Cable Lateral Raise'
  };
  function latestWorkout(){
    let s={};try{s=JSON.parse(localStorage.getItem('fitnessMaster')||'{}')}catch(e){return null}
    const logs=Array.isArray(s.logs)?s.logs:[]; if(!logs.length)return null;
    const groups={};
    ORDER.forEach(g=>groups[g]=0);
    const names=Object.keys(PROGRAMS).reduce((o,g)=>{PROGRAMS[g].exercises.concat(PROGRAMS[g].core).forEach(n=>o[norm(n)]=g);return o},{ });
    logs.forEach(x=>{const g=names[norm(aliases[x.name]||x.name)];if(g){const d=String(x.date||'');groups[g]=Math.max(groups[g],Date.parse(d.replace(/\./g,'-'))||0);}});
    const candidates=ORDER.filter(g=>groups[g]>0); if(!candidates.length)return s.lastWorkout&&ORDER.includes(s.lastWorkout)?s.lastWorkout:null;
    candidates.sort((a,b)=>groups[b]-groups[a]); return candidates[0];
  }
  function nextWorkout(){const last=latestWorkout();if(!last)return 'Push 1';return ORDER[(ORDER.indexOf(last)+1)%ORDER.length];}
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function card(n){if(window.EXERCISES&&EXERCISES[n]&&typeof exerciseCard==='function')return exerciseCard(n,false);return `<div class="exercise"><div class="exercise-head"><h3>${esc(n)}</h3></div></div>`;}
  function renderTraining(){
    const app=document.getElementById('app');if(!app)return;
    const last=latestWorkout(), name=nextWorkout(), x=PROGRAMS[name];
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page==='training'));
    app.innerHTML=`<div class="content"><h2>Training</h2><div class="panel"><div class="eyebrow">NEXT SESSION</div><h2>${esc(name)}</h2><p><b>Progress'teki son antrenman:</b> ${esc(last||'Henüz kayıt yok')}</p><p><b>Odak:</b> ${esc(x.focus)}</p></div><h3 class="section-title">1. ISINMA</h3>${x.warmup.map(card).join('')}<h3 class="section-title">2. ANA ANTRENMAN</h3>${x.exercises.map(card).join('')}<h3 class="section-title">3. CORE</h3>${x.core.map(card).join('')}${x.zone2?'<div class="panel"><h3>ZONE 2</h3><p>25–30 dk · hedef HR 126–138 bpm</p></div>':''}</div>`;
  }
  function install(){
    document.addEventListener('click',e=>{const b=e.target.closest('.nav-btn[data-page="training"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();renderTraining();},true);
    window.FitnessMasterTraining={render:renderTraining,nextWorkout};
    window.addEventListener('fm-cloud-data-updated',()=>{if(document.querySelector('.nav-btn.active[data-page="training"]'))renderTraining();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
