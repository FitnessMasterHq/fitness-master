/* Fitness Master — conservative legacy session migration. */
(function(){
'use strict';
const KEY='fitnessMaster',VERSION=1,SESSION_ID='session-04092026-push-2',DATE='04.09.2026',WORKOUT='Push 2';
const EXPECTED=[
['Incline DB Press',3],['Machine Chest Press',3],['Cable Lateral Raise',3],['Seated Machine Shoulder Press',2],['Cable Fly/Pec Deck',2],['Rope Triceps Pushdown',3],['Overhead Cable Triceps Extension',2],['Cable Crunch',3],['Pallof Press',2]
];
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){return {};}}
function write(s){localStorage.setItem(KEY,JSON.stringify(s));if(window.FitnessMasterFirebaseSync?.pushNow)window.FitnessMasterFirebaseSync.pushNow();}
function migrate(){const s=read();if(Number(s.legacySessionMigrationVersion||0)>=VERSION)return false;const logs=Array.isArray(s.logs)?s.logs:[];const target=logs.filter(x=>x&&String(x.date)===DATE);const counts=new Map();target.forEach(x=>counts.set(String(x.name||''),(counts.get(String(x.name||''))||0)+1));const exact=EXPECTED.every(([name,n])=>counts.get(name)===n)&&target.length===23;
if(!exact)return false;
const sessions=Array.isArray(s.workoutSessions)?s.workoutSessions:[];const now=new Date().toISOString();let session=sessions.find(x=>x&&x.id===SESSION_ID);if(!session){session={id:SESSION_ID,date:DATE,workout:WORKOUT,status:'completed',startedAt:'2026-09-04T00:00:00.000Z',completedAt:'2026-09-04T23:59:59.999Z',updatedAt:now,legacy:true};sessions.push(session);}else if(session.workout!==WORKOUT||session.status!=='completed'){session=Object.assign({},session,{workout:WORKOUT,status:'completed',updatedAt:now,legacy:true});const i=sessions.findIndex(x=>x&&x.id===SESSION_ID);if(i>=0)sessions[i]=session;}
const attached=logs.map(x=>{if(!x||String(x.date)!==DATE)return x;const name=String(x.name||'');return EXPECTED.some(([n])=>n===name)?Object.assign({},x,{sessionId:SESSION_ID,workout:WORKOUT}):x;});
s.logs=attached;s.workoutSessions=sessions;s.legacySessionMigrationVersion=VERSION;write(s);return true;}
function run(){if(migrate())location.reload();}
window.addEventListener('fm-cloud-sync-ready',run);window.addEventListener('fm-cloud-data-updated',run);
if(window.FitnessMasterFirebaseSync?.getStatus?.().ready)setTimeout(run,250);
})();
