/* Fitness Master — Firestore sync v4: real-time 1:1 device sync */
(function(){
  'use strict';
  const KEY='fitnessMaster';
  const RESET=3;
  let db=null,uid=null,busy=false,last='',initialUid=null,unsubscribe=null;
  function status(text,kind){let el=document.getElementById('fm-sync-status');if(!el){el=document.createElement('div');el.id='fm-sync-status';el.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9999;padding:8px 12px;border:1px solid rgba(127,127,127,.35);border-radius:999px;background:var(--panel,#fff);box-shadow:0 2px 10px rgba(0,0,0,.12);font:600 12px/1.2 system-ui,sans-serif;';document.body.appendChild(el);}el.textContent=text;el.title='Fitness Master cloud synchronization';el.dataset.kind=kind||'';}
  function local(){try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){return {};}}
  function sig(x){try{return JSON.stringify(x);}catch(e){return String(x);}}
  function ref(){return db.collection('users').doc(uid).collection('appData').doc('state');}
  async function write(s){if(!uid||!db||busy)return false;busy=true;status('Buluta kaydediliyor…','saving');try{await ref().set({state:s,schemaVersion:1,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});last=sig(s);status('Bulut bağlantısı aktif ✓','ok');return true;}catch(e){status('Bulut senkronizasyon hatası','error');console.error('Fitness Master Firestore write:',e);return false;}finally{busy=false;}}
  async function push(){const s=local();if(sig(s)!==last)await write(s);}
  function renderCurrent(){const active=document.querySelector('.nav-btn.active');const page=active&&active.dataset.page;if(typeof window.render==='function'&&page)window.render(page);}
  function subscribe(){if(unsubscribe)unsubscribe();unsubscribe=ref().onSnapshot(snap=>{if(!snap.exists)return;const remote=snap.data().state;if(!remote)return;const current=local();if(sig(remote)===sig(current))return;localStorage.setItem(KEY,JSON.stringify(remote));last=sig(remote);status('Buluttan güncellendi ✓','ok');renderCurrent();window.dispatchEvent(new CustomEvent('fm-cloud-data-updated',{detail:{uid:uid}}));},e=>{status('Bulut dinleme hatası','error');console.error('Fitness Master Firestore listener:',e);});}
  async function firstSync(user){if(!user||initialUid===user.uid)return;initialUid=user.uid;uid=user.uid;status('Bulutla senkronize ediliyor…','syncing');try{const snap=await ref().get(),l=local(),c=snap.exists&&snap.data().state?snap.data().state:null;let m;
    /* The current local reset is authoritative over any pre-reset cloud data. */
    if((Number(l.dataResetVersion||0)>=RESET||Number(l.progressResetVersion||0)>=RESET)&&Number(c&&(c.dataResetVersion||c.progressResetVersion)||0)<RESET){m=Object.assign({},l,{dataResetVersion:RESET,progressResetVersion:RESET});await write(m);}
    else if(c){m=c;localStorage.setItem(KEY,JSON.stringify(m));last=sig(m);}
    else{m=l;await write(m);}
    localStorage.setItem(KEY,JSON.stringify(m));last=sig(m);subscribe();renderCurrent();status('Bulut bağlantısı aktif ✓','ok');window.dispatchEvent(new CustomEvent('fm-cloud-sync-ready',{detail:{uid:uid}}));
  }catch(e){initialUid=null;status('Bulut bağlantısı başarısız','error');console.error('Fitness Master Firestore initial sync:',e);}}
  function init(){if(!window.firebase||!firebase.apps||!firebase.apps.length||!firebase.firestore)return;db=firebase.firestore();status('Firebase hazırlanıyor…','syncing');db.enablePersistence({synchronizeTabs:true}).catch(e=>console.warn('Fitness Master Firestore persistence:',e.code||e));const wait=()=>{if(!window.FitnessMasterAuth||!window.FitnessMasterAuth.auth){setTimeout(wait,250);return;}window.FitnessMasterAuth.auth.onAuthStateChanged(u=>{if(u)firstSync(u);else{if(unsubscribe)unsubscribe();unsubscribe=null;uid=null;initialUid=null;last='';status('Google hesabı bekleniyor','idle');}});if(window.FitnessMasterAuth.auth.currentUser)firstSync(window.FitnessMasterAuth.auth.currentUser);};wait();setInterval(()=>{if(uid)push();},1500);}
  window.FitnessMasterFirebaseSync={connected:true,version:4,pushNow:push,getStatus:()=>({uid:uid,ready:!!uid&&!!db})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();