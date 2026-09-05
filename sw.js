const CACHE="fitness-master-v6";
const CORE=[
  "./","./index.html","./style.css","./app.js",
  "./firebase-auth.js","./data/training.js","./data/nutrition.js","./manifest.json",
  "./assets/omron-2026-08-20.png"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(r=>{
      if(r.ok && new URL(e.request.url).origin===self.location.origin){
        const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
      }
      return r;
    }).catch(()=>caches.match("./index.html"));
  }));
});