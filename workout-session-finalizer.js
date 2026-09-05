/* Fitness Master — authoritative workout-session completion. */
(function(){'use strict';
const O=['Push 1','Pull 1','Legs 1','Push 2','Pull 2','Legs 2'];
function read(){try{return JSON.parse(localStorage.getItem('fitnessMaster')||'{}');}catch(e){return {};}}
function write(s){localStorage.setItem('fitnessMaster',JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();}
function dv(d){const p=String(d||'').split(/[.\/-]/).map(Number);return p.length===3?new Date(p[2],p[1]-1,p[0]).getTime():0;}
function latest(){const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[],done=a.filter(x=>x&&x.status==='completed');return done.slice().sort((x,y)=>dv(y.date)-dv(x.date)||String(y.completedAt||'').localeCompare(String(x.completedAt||'')))[0]?.workout||null;}
function next(){const l=latest();return l?O[(O.indexOf(l)+1)%O.length]:O[0];}
function sessionId(w,d){return `session-${String(d).replace(/[^0-9]/g,'')}-${w.replace(/\s+/g,'-').toLowerCase()}`;}
function complete(){const s=read(),a=Array.isArray(s.workoutSessions)?s.workoutSessions:[];let id=document.body.dataset.fmSessionId||'';let i=id?a.findIndex(x=>x&&x.id===id):-1;if(i<0){const w=document.body.dataset.fmWorkout||next();const candidates=a.map((x,n)=>({x,n})).filter(q=>q.x&&q.x.status==='in_progress'&&q.x.workout===w).sort((a,b)=>String(b.x.updatedAt||b.x.startedAt||'').localeCompare(String(a.x.updatedAt||a.x.startedAt||'')));if(candidates.length){i=candidates[0].n;id=candidates[0].x.id;}else{const d=new Date().toLocaleDateString('tr-TR');id=sessionId(w,d);i=a.findIndex(x=>x&&x.id===id);if(i<0){a.push({id,date:d,workout:w,status:'in_progress',startedAt:new Date().toISOString(),updatedAt:new Date().toISOString()});i=a.length-1;}}}
const x=a[i],now=new Date().toISOString();a[i]=Object.assign({},x,{status:'completed',completedAt:now,updatedAt:now});s.workoutSessions=a;s.lastWorkout=a[i].workout;write(s);window.dispatchEvent(new CustomEvent('fm-cloud-data-updated'));location.reload();}
function install(){const mo=new MutationObserver(()=>{const b=document.getElementById('completeWorkout');if(b&&!b.dataset.sessionFinalizer){b.dataset.sessionFinalizer='1';b.onclick=complete;}});mo.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});window.FitnessMasterSession={latest,next,sessionId,complete};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();})();
