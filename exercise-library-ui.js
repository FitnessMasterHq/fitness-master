/* Fitness Master — Exercise Library detail UI. */
(function(){
'use strict';
function esc2(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
function libCard(name){
 const e=EXERCISES[name]||{}; const l=e.library||{};
 const videos=(e.videos||[]).map((v,i)=>`<a class="video" target="_blank" rel="noopener" href="${esc2(v[1])}">▶ Teknik video ${i+1}: ${esc2(v[0])}<span>${esc2(v[2]||'')}</span></a>`).join('');
 return `<article class="exercise library-card">
  <div class="exercise-head"><div><h3>${esc2(name)}</h3><div class="muscle-line"><b>${esc2(e.primary||'')}</b>${e.secondary?` · ${esc2(e.secondary)}`:''}</div></div><div class="tags"><span class="tag">${esc2(e.sets||'')}</span><span class="tag">RIR ${esc2(e.rir||'')}</span></div></div>
  <div class="library-muscles"><span>Primer: ${esc2(e.primary||'—')}</span>${e.secondary?`<span>Sekonder: ${esc2(e.secondary)}</span>`:''}</div>
  <p><b>Teknik özeti:</b> ${esc2(e.tech||'')}</p>
  <div class="library-detail"><div><b>Kurulum</b><p>${esc2(l.setup||'Yük ve ekipmanı kişiye göre ayarla; eklem eksenlerini hizala.')}</p></div><div><b>Uygulama</b><p>${esc2(l.execution||'Kontrollü eksantrik → tam kontrollü ROM → kontrollü dönüş.')}</p></div><div><b>Kaçın</b><p>${esc2(l.errors||e.errors||'Momentum, ağrılı ROM ve eklem hizasını bozan pozisyonlar.')}</p></div></div>
  <div class="rest"><b>Set arası:</b> ${esc2(e.setRest||'—')} &nbsp; <b>Hareket arası:</b> ${esc2(e.exerciseRest||'—')}</div>
  <div class="videos">${videos||'<div class="muted small-note">Doğrulanmış kısa teknik video henüz eklenmedi; düşük kaliteli/uzun video eklenmedi.</div>'}</div>
 </article>`;
}
window.renderExerciseLibrary=function(){
 const names=Object.keys(EXERCISES).sort((a,b)=>a.localeCompare(b,'tr'));
 const cats=[...new Set(names.map(n=>EXERCISES[n].category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
 return `<div class="content"><h2>Exercise Library</h2><div class="panel"><div class="log-row"><input id="libSearch" class="input" placeholder="Hareket / kas ara"><select id="libCat" class="input"><option value="">Tüm kategoriler</option>${cats.map(c=>`<option value="${esc2(c)}">${esc2(c)}</option>`).join('')}</select></div><p class="muted">Merkezi egzersiz veritabanı. Programdan çıkarılan hareket burada silinmez; geçmiş loglar korunur. Videolar kısa, teknik odaklı ve uzman kaynağı öncelikli seçilir; yalnızca yüksek like sayısı kriter değildir.</p></div><div id="libraryList" class="exercise-grid">${names.map(libCard).join('')}</div></div>`;
};
const oldLibrary=window.library;
window.library=function(){return window.renderExerciseLibrary();};
const oldBind=window.bind;
window.bind=function(page){oldBind(page);if(page!=='library')return;const q=document.getElementById('libSearch'),cat=document.getElementById('libCat'),list=document.getElementById('libraryList');const filter=()=>{const s=(q.value||'').toLocaleLowerCase('tr-TR'),c=cat.value;list.innerHTML=Object.keys(EXERCISES).sort((a,b)=>a.localeCompare(b,'tr')).filter(n=>{const e=EXERCISES[n];return(!s||(`${n} ${e.primary||''} ${e.secondary||''} ${e.category||''}`).toLocaleLowerCase('tr-TR').includes(s))&&(!c||e.category===c);}).map(libCard).join('');};q.oninput=filter;cat.onchange=filter;};
})();
