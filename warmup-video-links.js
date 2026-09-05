/* Fitness Master — verified warm-up technique links. */
(function(){
'use strict';
const V={
  'Light Cardio':[
    ['Renaissance Periodization — Perfect Warm-Up Routine','https://www.youtube.com/watch?v=HdgDDSjtaLM','Genel ısınma prensipleri']
  ],
  'Scapular Push-Up':[
    ['E3 Rehab — Push-Up / Scapular Mechanics','https://e3rehab.com/pushupmodifications/','Skapular hareket ve teknik']
  ],
  'Scapular Pulldown':[
    ['Renaissance Periodization — Scapular Pulldown','https://www.youtube.com/watch?v=fX36liNtKzw','Doğrudan teknik']
  ],
  'Knee-to-Wall':[
    ['Catalyst University — Knee-to-Wall','https://www.youtube.com/watch?v=wdsxep1BeMY','Ayak bileği dorsifleksiyon tekniği']
  ],
  '90/90 Hip Rotation':[
    ['BarBend / Cressey Sports Performance — 90/90 Hip Switch','https://www.youtube.com/watch?v=qARWIQKokuA','Kalça rotasyonu / mobilite']
  ],
  'Bodyweight Squat':[
    ['University of Delaware — Bodyweight Squat','https://www.youtube.com/watch?v=p0HoQr-ZmWE','Temel squat tekniği'],
    ['Squat University — How to Teach a Perfect Squat','https://squatuniversity.com/2016/02/05/how-to-teach-a-perfect-squat/','Squat hareket kalıbı']
  ],
  'Hip Hinge':[
    ['Jeff Nippard — Romanian Deadlift Technique','https://www.youtube.com/watch?v=44ScXWFaVBs','Kalça menteşesi için referans']
  ],
  'Banded Glute Bridge':[
    ['Renaissance Periodization — Glute Training Technique','https://www.youtube.com/watch?v=U5U6JNIiZ_Q','Glute bridge / hip extension tekniği']
  ],
  'Banded Lateral Walk':[
    ['E3 Rehab — Lateral Hip / Glute Exercise Guidance','https://e3rehab.com/','Glute medius / lateral hip tekniği']
  ],
  'Bodyweight Hip Hinge':[
    ['Jeff Nippard — Romanian Deadlift Technique','https://www.youtube.com/watch?v=44ScXWFaVBs','Hip hinge kalıbı']
  ],
  'Hip Thrust / Booty Builder':[
    ['Renaissance Periodization — Hip Thrust','https://www.youtube.com/watch?v=U5U6JNIiZ_Q','Ana teknik'],
    ['Renaissance Periodization — Hip Thrust / Glute Training','https://www.youtube.com/watch?v=kqi4_EPpwCk','Alternatif teknik']
  ]
};
Object.keys(V).forEach(function(name){
  if(typeof EXERCISES==='undefined')return;
  if(!EXERCISES[name]) EXERCISES[name]={category:'Isınma',primary:'',secondary:'',sets:'',rir:'',setRest:'—',exerciseRest:'30–45 sn',tech:'Kontrollü, ağrısız ROM ile uygula.',videos:V[name]};
  else EXERCISES[name].videos=V[name];
});
})();
