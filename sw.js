const CACHE="fitness-master-v14";
const CORE=[
  "./","./index.html","./style.css?v=3","./app.js?v=11","./program-page.js?v=1","./progress-recovery.js?v=2","./firebase-auth.js?v=8","./firebase-sync.js?v=6","./omron-upload.js?v=2","./progress-ui.js?v=3","./data/training.js","./data/nutrition.js","./manifest.json","./assets/omron-2026-08-20.png"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);if(url.origin!==self.location.origin)return;
  const p=url.pathname;
  if(p.endsWith("/firebase-auth.js")||p.endsWith("/firebase-sync.js")||p.endsWith("/app.js")||p.endsWith("/index.html")||p.endsWith("/progress-recovery.js")||p.endsWith("/progress-ui.js")||p.endsWith("/omron-upload.js")||p.endsWith("/style.css")||p.endsWith("/program-page.js")){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match("./index.html"))));
});
