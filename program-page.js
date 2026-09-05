/* Fitness Master — Program page */
(function(){
  'use strict';
  const PROGRAMS={
    'Push 1':{focus:'Göğüs • Omuz • Triceps',warmup:['Light Cardio','Band/Cable External Rotation','Face Pull'],exercises:['Flat Dumbbell Press','Incline Machine / Smith Press','Machine Lateral Raise','Cable Fly / Pec Deck','Seated Machine Shoulder Press','Cable Triceps Extension','Single-Arm Overhead Cable Extension'],core:['Abdominal Machine','Dead Bug']},
    'Pull 1':{focus:'Sırt • Arka omuz • Biceps',warmup:['Light Cardio','Scapular Pulldown','Band/Cable External Rotation','Face Pull'],exercises:['Assisted Pull-up / Neutral-Grip Pulldown','High Row Machine','Cable Row — Neutral Grip','Cable Rear-Delt Fly','Preacher / Machine Curl','Cable Bayesian Curl','Farmer Carry'],core:['Pallof Press','Cable Crunch']},
    'Legs 1':{focus:'Quadriceps • Glute • Hamstring • Calf',warmup:['Light Cardio','Knee-to-Wall','90/90 Hip Rotation','Bodyweight Squat','Hip Hinge'],exercises:['Back Squat','Leg Press','Romanian Deadlift (RDL)','Seated Leg Curl','Leg Extension','Hip Adduction','Hip Abduction','Standing Calf Raise','Seated Calf Raise'],core:['Cable Crunch','Pallof Press']},
    'Push 2':{focus:'Göğüs • Omuz • Triceps',warmup:['Light Cardio','Band/Cable External Rotation','Face Pull'],exercises:['Incline Dumbbell Press','Machine Chest Press','Cable Lateral Raise','Seated Machine Shoulder Press','Cable Fly / Pec Deck','Rope Triceps Pushdown','Overhead Cable Triceps Extension'],core:['Cable Crunch','Pallof Press']},
    'Pull 2':{focus:'Sırt • Arka omuz • Biceps',warmup:['Light Cardio','Scapular Pulldown','Face Pull','Band/Cable External Rotation'],exercises:['Lat Pulldown','Chest-Supported Row','Single-Arm Cable Row','Reverse Pec Deck','Incline Dumbbell Curl','Hammer Curl','Suitcase Carry'],core:['Suitcase Carry']},
    'Legs 2':{focus:'Glute • Hamstring • Quadriceps • Calf',warmup:['Light Cardio','Banded Glute Bridge','Banded Lateral Walk','90/90 Hip Rotation','Bodyweight Hip Hinge'],exercises:['Hip Thrust / Booty Builder','Hack Squat / Suitable Squat Machine','Bulgarian Split Squat','Seated / Lying Leg Curl','Cable Glute Kickback','Hip Abduction','Leg Extension','Standing Calf Raise','Tibialis Raise'],core:['Hanging Knee Raise','Side Plank']}
  };
  const ORDER=Object.keys(PROGRAMS);
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function card(name,log){return (window.EXERCISES&&EXERCISES[name])?exerciseCard(name,!!log):`<div class="exercise"><div class="exercise-head"><h3>${esc(name)}</h3></div><p class="muted">Bu hareket programda tanımlı; Exercise Library kaydı henüz tamamlanmamış.</p></div>`;}
  function programPage(name){
    const x=PROGRAMS[name]||PROGRAMS[ORDER[0]];
    return `<div class="content"><h2>Program</h2>
      <div class="panel"><div class="eyebrow">MASTER PROGRAM</div><h2>${esc(name)}</h2><p><b>Odak:</b> ${esc(x.focus)}</p>
      <div class="log-row"><label class="label" style="align-self:center">Program seç</label><select id="programSelect" class="input">${ORDER.map(n=>`<option value="${esc(n)}" ${n===name?'selected':''}>${esc(n)}</option>`).join('')}</select></div></div>
      <h3 class="section-title">1. ISINMA</h3>${x.warmup.map(n=>card(n,false)).join('')}
      <h3 class="section-title">2. ANA ANTRENMAN</h3>${x.exercises.map(n=>card(n,false)).join('')}
      <h3 class="section-title">3. CORE</h3>${x.core.map(n=>card(n,false)).join('')}
    </div>`;
  }
  function show(name){const app=document.getElementById('app');if(!app)return;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page==='program'));app.innerHTML=programPage(name||ORDER[0]);const sel=document.getElementById('programSelect');if(sel)sel.onchange=()=>show(sel.value);}
  function install(){const nav=document.querySelector('.nav');if(!nav)return;const b=nav.querySelector('[data-page="program"]');if(b)b.onclick=()=>show(ORDER[0]);window.FitnessMasterProgram={show,order:ORDER};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
