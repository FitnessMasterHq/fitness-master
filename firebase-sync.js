/* Fitness Master — Firestore sync v2: local-first cloud backup + visible status */
(function(){
  'use strict';
  const KEY='fitnessMaster';
  const DEFAULTS={weight:85,waist:'',lastWorkout:'Legs 1',version:5,omronSeeded:false};
  let db=null, uid=null, busy=false, last='', initialUid=null;

  function status(text,kind){
    let el=document.getElementById('fm-sync-status');
    if(!el){
      el=document.createElement('div'); el.id='fm-sync-status';
      el.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9999;padding:8px 12px;border:1px solid rgba(127,127,127,.35);border-radius:999px;background:var(--panel,#fff);box-shadow:0 2px 10px rgba(0,0,0,.12);font:600 12px/1.2 system-ui,sans-serif;';
      document.body.appendChild(el);
    }
    el.textContent=text;
    el.title='Fitness Master cloud synchronization';
    el.dataset.kind=kind||'';
  }
  function local(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}');}
    catch(e){console.error('Fitness Master local data:',e);return {};}
  }
  function sig(x){try{return JSON.stringify(x);}catch(e){return String(x);}}
  function mergeArray(a,b){
    const out=[], seen=new Set();
    [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])].forEach(x=>{
      const k=sig(x); if(!seen.has(k)){seen.add(k);out.push(x);}
    });
    return out;
  }
  function merge(l,c){
    const x=Object.assign({},c||{},l||{});
    x.logs=mergeArray(l&&l.logs,c&&c.logs);
    x.bodyLogs=mergeArray(l&&l.bodyLogs,c&&c.bodyLogs);
    x.activities=mergeArray(l&&l.activities,c&&c.activities);
    x.checks=Object.assign({},(c&&c.checks)||{},(l&&l.checks)||{});
    ['weight','waist','lastWorkout','version'].forEach(k=>{
      const lv=l&&l[k], cv=c&&c[k];
      if(lv!==undefined&&lv!==null&&lv!==''&&lv!==DEFAULTS[k])x[k]=lv;
      else if(cv!==undefined)x[k]=cv;
    });
    const lm=!!(l&&l.omronSeeded), cm=!!(c&&c.omronSeeded);
    x.omronSeeded=lm||cm;
    return x;
  }
  function ref(){return db.collection('users').doc(uid).collection('appData').doc('state');}
  async function push(){
    if(!uid||!db||busy)return;
    const s=local(), text=sig(s); if(text===last)return; busy=true; status('Buluta kaydediliyor…','saving');
    try{
      await ref().set({state:s,schemaVersion:1,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      last=text; status('Buluta kaydedildi ✓','ok'); console.log('Fitness Master: cloud saved');
    }catch(e){status('Bulut senkronizasyon hatası','error');console.error('Fitness Master Firestore write:',e);}
    finally{busy=false;}
  }
  async function firstSync(user){
    if(!user||initialUid===user.uid)return;
    initialUid=user.uid; uid=user.uid; status('Bulutla senkronize ediliyor…','syncing');
    try{
      const snap=await ref().get(), l=local();
      if(snap.exists&&snap.data().state){
        const m=merge(l,snap.data().state);
        localStorage.setItem(KEY,JSON.stringify(m));
        last=sig(m);
        await ref().set({state:m,schemaVersion:1,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        if(typeof window.render==='function')window.render('dashboard');
        console.log('Fitness Master: local + cloud merged');
      }else await push();
      status('Bulut bağlantısı aktif ✓','ok');
      window.dispatchEvent(new CustomEvent('fm-cloud-sync-ready',{detail:{uid:uid}}));
    }catch(e){initialUid=null;status('Bulut bağlantısı başarısız','error');console.error('Fitness Master Firestore initial sync:',e);}
  }
  function init(){
    if(!window.firebase||!firebase.apps||!firebase.apps.length||!firebase.firestore)return;
    db=firebase.firestore();
    status('Firebase hazırlanıyor…','syncing');
    db.enablePersistence({synchronizeTabs:true}).catch(e=>console.warn('Fitness Master Firestore persistence:',e.code||e));
    const wait=()=>{
      if(!window.FitnessMasterAuth||!window.FitnessMasterAuth.auth){setTimeout(wait,250);return;}
      window.FitnessMasterAuth.auth.onAuthStateChanged(u=>{
        if(u)firstSync(u);
        else{uid=null;initialUid=null;last='';status('Google hesabı bekleniyor','idle');}
      });
      if(window.FitnessMasterAuth.auth.currentUser)firstSync(window.FitnessMasterAuth.auth.currentUser);
    };
    wait();
    setInterval(()=>{if(uid)push();},2000);
  }
  window.FitnessMasterFirebaseSync={connected:true,version:2,pushNow:push,getStatus:()=>({uid:uid,ready:!!uid&&!!db})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
