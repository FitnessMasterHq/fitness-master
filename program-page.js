/* Fitness Master — Program page */
(function(){
  'use strict';
  const PROGRAMS={
    'Push 1':{focus:'Göğüs • Omuz • Triceps',warmup:['Bike / Elliptical — 4–5 dk çok hafif','Band/Cable External Rotation — 1×12/yan','Scapular Push-Up — 1×10','Flat Dumbbell Press — 2–3 kademeli ramp-up seti'],exercises:['Flat Dumbbell Press','Incline Machine / Smith Press','Machine Lateral Raise','Cable Fly / Pec Deck','Seated Machine Shoulder Press','Cable Triceps Extension','Single-Arm Overhead Cable Extension'],core:['Abdominal Machine','Dead Bug']},
    'Pull 1':{focus:'Sırt • Arka omuz • Biceps',warmup:['Bike / Elliptical — 4–5 dk çok hafif','Scapular Pulldown — 1×10–12','Band/Cable External Rotation — 1×12/yan','Assisted Pull-up / Neutral-Grip Pulldown — 2–3 kademeli ramp-up seti'],exercises:['Assisted Pull-up / Neutral-Grip Pulldown','High Row Machine','Cable Row — Neutral Grip','Cable Rear-Delt Fly','Preacher / Machine Curl','Cable Bayesian Curl','Farmer Carry'],core:['Pallof Press','Cable Crunch']},
    'Legs 1':{focus:'Quadriceps • Glute • Hamstring • Calf',warmup:['Bike — 5 dk çok hafif','Knee-to-Wall — 8/yan','90/90 Hip Rotation — 6/yan','Bodyweight Squat — 8–10','Hip Hinge — 8–10','Back Squat — 3 kademeli ramp-up seti'],exercises:['Back Squat','Leg Press','Romanian Deadlift (RDL)','Seated Leg Curl','Leg Extension','Hip Adduction','Hip Abduction','Standing Calf Raise','Seated Calf Raise'],core:['Cable Crunch','Pallof Press'],postCardio:'Zone 2 — 25–30 dk; yoğunluk cihazındaki gerçek Zone 2 / konuşma testi ile doğrulanacak'},
    'Push 2':{focus:'Göğüs • Omuz • Triceps',warmup:['Bike / Elliptical — 4–5 dk çok hafif','Band/Cable External Rotation — 1×12/yan','Scapular Push-Up — 1×10','Incline Dumbbell Press — 2–3 kademeli ramp-up seti'],exercises:['Incline Dumbbell Press','Machine Chest Press','Cable Lateral Raise','Seated Machine Shoulder Press','Cable Fly / Pec Deck','Rope Triceps Pushdown','Overhead Cable Triceps Extension'],core:['Cable Crunch','Pallof Press']},
    'Pull 2':{focus:'Sırt • Arka omuz • Biceps',warmup:['Bike / Elliptical — 4–5 dk çok hafif','Scapular Pulldown — 1×10–12','Band/Cable External Rotation — 1×12/yan','Lat Pulldown — 2–3 kademeli ramp-up seti'],exercises:['Lat Pulldown','Chest-Supported Row','Single-Arm Cable Row','Reverse Pec Deck','Incline Dumbbell Curl','Hammer Curl'],core:['Suitcase Carry']},
    'Legs 2':{focus:'Glute • Hamstring • Quadriceps • Calf',warmup:['Bike — 5 dk çok hafif','Banded Glute Bridge — 10','Banded Lateral Walk — 8/yan','90/90 Hip Rotation — 6/yan','Bodyweight Hip Hinge — 8–10','Hip Thrust / Booty Builder — 2–3 kademeli ramp-up seti'],exercises:['Hip Thrust / Booty Builder','Hack Squat / Suitable Squat Machine','Bulgarian Split Squat','Seated / Lying Leg Curl','Cable Glute Kickback','Hip Abduction','Leg Extension','Standing Calf Raise','Tibialis Raise'],core:['Hanging Knee Raise','Side Plank'],postCardio:'Zone 2 — 25–30 dk; yoğunluk cihazındaki gerçek Zone 2 / konuşma testi ile doğrulanacak'}
  };
  const ORDER=Object.keys(PROGRAMS);
  const NORMALIZE=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function card(name,log){return (window.EXERCISES&&EXERCISES[name])?exerciseCard(name,!!log):`<div class="exercise"><div class="exercise-head"><h3>${esc(name)}</h3></div><p class="muted">Bu hareket programda tanımlı; Exercise Library kaydı henüz tamamlanmamış.</p></div>`;}
  function latestWorkoutFromHistory(){
    try{
      const state=JSON.parse(localStorage.getItem('fitnessMaster')||'{}');
      const logs=Array.isArray(state.logs)?state.logs:[];
      if(!logs.length)return ORDER[0];
      const dates=[...new Set(logs.map(x=>String(x.date||'')).filter(Boolean))].sort((a,b)=>{
        const pa=a.split(/[.\/-]/).map(Number), pb=b.split(/[.\/-]/).map(Number);
        const da=pa.length>=3?new Date(pa[2],pa[1]-1,pa[0]).getTime():0;
        const db=pb.length>=3?new Date(pb[2],pb[1]-1,pb[0]).getTime():0;
        return db-da;
      });
      const latest=dates[0];
      const dayLogs=logs.filter(x=>String(x.date||'')===latest);
      let best=ORDER[0],bestScore=0;
      ORDER.forEach(group=>{
        const names=[...PROGRAMS[group].exercises,...PROGRAMS[group].core].map(NORMALIZE);
        const score=dayLogs.reduce((n,x)=>n+(names.includes(NORMALIZE(x.name))?1:0),0);
        if(score>bestScore){best=group;bestScore=score;}
      });
      return bestScore?best:(state.lastWorkout&&PROGRAMS[state.lastWorkout]?state.lastWorkout:ORDER[0]);
    }catch(e){return ORDER[0];}
  }
  function programPage(name){
    const x=PROGRAMS[name]||PROGRAMS[ORDER[0]];
    return `<div class="content"><h2>Program</h2>
      <div class="panel"><div class="eyebrow">MASTER PROGRAM</div><h2>${esc(name)}</h2><p><b>Odak:</b> ${esc(x.focus)}</p>
      <p class="muted">Son kaydedilen antrenmana göre gösteriliyor.</p>
      <div class="log-row"><label class="label" style="align-self:center">Program seç</label><select id="programSelect" class="input">${ORDER.map(n=>`<option value="${esc(n)}" ${n===name?'selected':''}>${esc(n)}</option>`).join('')}</select></div></div>
      <h3 class="section-title">1. ISINMA</h3>${x.warmup.map(n=>card(n,false)).join('')}
      <h3 class="section-title">2. ANA ANTRENMAN</h3>${x.exercises.map(n=>card(n,false)).join('')}
      <h3 class="section-title">3. CORE</h3>${x.core.map(n=>card(n,false)).join('')}
      ${x.postCardio?`<h3 class="section-title">4. CARDIO</h3><div class="panel"><b>${esc(x.postCardio)}</b></div>`:''}
    </div>`;
  }
  function show(name){const app=document.getElementById('app');if(!app)return;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page==='program'));const selected=name||latestWorkoutFromHistory();app.innerHTML=programPage(selected);const sel=document.getElementById('programSelect');if(sel)sel.onchange=()=>show(sel.value);}
  function install(){const nav=document.querySelector('.nav');if(!nav)return;const b=nav.querySelector('[data-page="program"]');if(b)b.onclick=()=>show(latestWorkoutFromHistory());window.FitnessMasterProgram={show,order:ORDER,latestWorkoutFromHistory};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
