/* Fitness Master — final session/navigation guard. Uses completed workout sessions as the authoritative progression source. */
(function(){'use strict';
const O=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};}}
function dv(d){const p=String(d||'').split(/[.\/-]/).map(Number);return p.length===3?new Date(p[2],p[1]-1,p[0]).getTime():0;}
function latest(){const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[],done=a.filter(x=>x&&x.status==='completed');if(done.length)return done.slice().sort((x,y)=>dv(y.date)-dv(x.date)||String(y.completedAt||'').localeCompare(String(x.completedAt||'')))[0].workout||null;return null;}
function next(){const l=latest();return l?O[(O.indexOf(l)+1)%O.length]:O[0];}
function sessionId(w,d){return `session-${String(d).replace(/[^0-9]/g,'')}-${w.replace(/\s+/g,'-').toLowerCase()}`;}
function complete(b){const w=document.body.dataset.fmWorkout||next(),d=new Date().toLocaleDateString('tr-TR'),s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[],id=sessionId(w,d),i=a.findIndex(x=>x&&x.id===id),r={id,date:d,workout:w,status:'completed',completedAt:new Date().toISOString()};if(i>=0)a[i]=Object.assign({},a[i],r);else a.push(r);s.workoutSessions=a;s.lastWorkout=w;localStorage.setItem('fitnessMaster',JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();window.dispatchEvent(new CustomEvent('fm-cloud-data-updated'));if(typeof window.render==='function')window.render('dashboard');}
function install(){const mo=new MutationObserver(()=>{const b=document.getElementById('completeWorkout');if(b&&!b.dataset.sessionFinalizer){b.dataset.sessionFinalizer='1';b.onclick=()=>complete(b);}});mo.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});window.FitnessMasterSession={latest,next,sessionId,complete};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
