/* Fitness Master — Omron screenshot import */
(function(){
  'use strict';
  const LOCAL_DB='FitnessMasterMedia';
  const STORE='omronScreens';
  let busy=false;
  function openLocal(){return new Promise((resolve,reject)=>{const r=indexedDB.open(LOCAL_DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  async function localPut(item){const db=await openLocal();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(item);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
  async function localAll(){const db=await openLocal();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);});}
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function compress(file){return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.62));};img.onerror=reject;img.src=fr.result;};fr.onerror=reject;fr.readAsDataURL(file);});}
  function panel(){return `<div id="omronUploadPanel" class="panel omron-upload-panel"><h3 style="margin-top:0">Yeni Omron ekran görüntüsü</h3><p class="muted">Omron uygulamasından ekran görüntüsünü buraya ekle. Görsel cihazda saklanır ve giriş yaptıysan buluta da yüklenir.</p><div class="log-row omron-upload-row"><input id="omronFile" class="input omron-file" type="file" accept="image/*"><button id="omronSaveImage" class="btn" disabled>Ekran görüntüsünü kaydet</button></div><div id="omronPreview" class="omron-preview"></div><div id="omronImageStatus" class="muted small-note" aria-live="polite"></div><div id="omronGallery" class="omron-gallery"></div></div>`;}
  async function renderGallery(){
    const box=document.getElementById('omronGallery');if(!box)return;
    let items=[];
    try{items=await localAll();}catch(e){}
    try{const u=window.FitnessMasterAuth?.auth?.currentUser;if(u&&window.firebase){const snap=await firebase.firestore().collection('users').doc(u.uid).collection('appData').doc('state').collection('omronImages').get();snap.forEach(d=>items.push(d.data()));}}catch(e){console.warn('Omron cloud images:',e);}
    const seen=new Set();items=items.filter(x=>x&&x.id&&!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    box.innerHTML=items.length?`<div class="label">Eklenen ekran görüntüleri</div><div class="omron-gallery-grid">${items.slice(0,8).map(x=>`<div class="omron-image-card"><img src="${x.dataUrl}" alt="Omron ekran görüntüsü" loading="lazy"><div class="muted small-note">${esc(x.date||'')}</div></div>`).join('')}</div>`:'<div class="muted small-note">Henüz yeni Omron ekran görüntüsü eklenmedi.</div>';
  }
  async function inject(){
    if(document.getElementById('omronUploadPanel'))return;
    const headings=[...document.querySelectorAll('.section-title')];
    const h=headings.find(x=>x.textContent.trim()==='Omron / Body Composition');if(!h)return;
    const current=h.nextElementSibling;if(!current)return;
    current.insertAdjacentHTML('afterend',panel());
    const file=document.getElementById('omronFile'),btn=document.getElementById('omronSaveImage'),preview=document.getElementById('omronPreview'),status=document.getElementById('omronImageStatus');
    let dataUrl='',name='';
    file.onchange=async()=>{const f=file.files?.[0];if(!f)return;name=f.name;status.textContent='Görsel hazırlanıyor…';try{dataUrl=await compress(f);preview.innerHTML=`<img src="${dataUrl}" alt="Önizleme">`;btn.disabled=false;status.textContent='Hazır. Kaydetmeye basabilirsin.';}catch(e){status.textContent='Görsel okunamadı.';btn.disabled=true;}};
    btn.onclick=async()=>{if(!dataUrl||busy)return;busy=true;btn.disabled=true;status.textContent='Kaydediliyor…';const item={id:'omron-'+Date.now(),date:new Date().toLocaleString('tr-TR'),name,dataUrl,createdAt:Date.now()};try{await localPut(item);let cloud=false;const u=window.FitnessMasterAuth?.auth?.currentUser;if(u&&window.firebase){await firebase.firestore().collection('users').doc(u.uid).collection('appData').doc('state').collection('omronImages').doc(item.id).set(item);cloud=true;}status.textContent=cloud?'Ekran görüntüsü kaydedildi ve buluta yüklendi ✓':'Ekran görüntüsü cihazda kaydedildi ✓';file.value='';preview.innerHTML='';dataUrl='';await renderGallery();}catch(e){console.error(e);status.textContent='Kayıt başarısız: '+(e?.message||'bilinmeyen hata');}finally{busy=false;btn.disabled=true;}};
    await renderGallery();
  }
  const obs=new MutationObserver(()=>inject());function start(){const app=document.getElementById('app');if(!app)return;obs.observe(app,{childList:true,subtree:false});inject();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
