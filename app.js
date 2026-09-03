const app=document.getElementById("app");
const state=JSON.parse(localStorage.getItem("fitnessMaster")||'{"weight":85,"waist":"","logs":[],"checks":{}}');
const save=()=>localStorage.setItem("fitnessMaster",JSON.stringify(state));
function shell(title,body){return `<div class="content"><h2>${title}</h2>${body}</div>`}
function exerciseCard(e){
  return `<div class="exercise"><h3>${e[0]}</h3><div class="tags"><span class="tag">${e[1]}</span><span class="tag">${e[2]}</span><span class="tag">${e[3]}</span></div><a class="video" target="_blank" rel="noopener" href="${e[4]}">▶ Teknik videosunu aç</a><div class="log-row"><input class="input" placeholder="kg" data-name="${e[0]}" data-k="kg"><input class="input" placeholder="tekrar" data-name="${e[0]}" data-k="reps"><input class="input" placeholder="RIR" data-name="${e[0]}" data-k="rir"><button class="btn log" data-name="${e[0]}">Kaydet</button></div></div>`
}
function dashboard(){
 const logs=state.logs.length, latest=state.logs[logs-1];
 return shell("Dashboard",`<div class="hero"><div class="panel"><div class="eyebrow">TODAY</div><h2>${todayWorkout()}</h2><div class="muted">Programını Training bölümünden aç. Setleri burada değil, hareket kartlarının içinden kaydet.</div></div><div class="panel"><div class="label">Profil</div><div class="two-col"><div><div class="label">Kilo</div><strong>${state.weight||"—"} kg</strong></div><div><div class="label">Boy</div><strong>1.84 m</strong></div><div><div class="label">Yaş</div><strong>47</strong></div><div><div class="label">Log</div><strong>${logs}</strong></div></div></div></div>
 <div class="grid"><div class="panel metric"><div class="label">Hedef</div><strong>Hipertrofi</strong><span class="muted">+ sağlık</span></div><div class="panel metric"><div class="label">Protein</div><strong>140–185 g</strong><span class="muted">günlük aralık</span></div><div class="panel metric"><div class="label">Kilo</div><strong>${state.weight} kg</strong><span class="muted">son kayıt</span></div><div class="panel metric"><div class="label">Son log</div><strong>${latest?latest.name:"—"}</strong><span class="muted">${latest?latest.date:"henüz yok"}</span></div></div>
 <h3 class="section-title">Hızlı kayıt</h3><div class="panel"><div class="log-row"><input id="weight" class="input" type="number" step=".1" placeholder="Kilo (kg)" value="${state.weight}"><input id="waist" class="input" placeholder="Bel (cm)" value="${state.waist}"><button class="btn" id="saveProfile">Kaydet</button></div></div>`)
}
function todayWorkout(){const d=new Date().getDay();return ["REST / RECOVERY","PUSH","PULL","LEGS","PUSH","PULL","LEGS"][d]}
function training(){
 return shell("Training",Object.entries(TRAINING).map(([day,x])=>`<section><h3 class="section-title">${day} <span class="muted">— ${x.focus}</span></h3>${x.exercises.map(exerciseCard).join("")}</section>`).join(""))
}
function glutes(){const names=["Back Squat","Romanian Deadlift","Booty Builder"];return shell("Glutes",`<div class="notice">Glute gelişimi için squat + hip-hinge + doğrudan hip-extension kombinasyonu; yükü kademeli artır ve tekniği önceliklendir.</div>${names.map(n=>exerciseCard(EXERCISES[n])).join("")}`)}
function progress(){
 const rows=state.logs.slice(-20).reverse().map(x=>`<tr><td>${x.date}</td><td>${x.name}</td><td>${x.kg||"—"}</td><td>${x.reps||"—"}</td><td>${x.rir||"—"}</td></tr>`).join("");
 return shell("Progress",`<div class="grid-2"><div class="panel"><div class="label">Vücut ağırlığı</div><div class="log-row"><input id="pweight" class="input" type="number" step=".1" value="${state.weight}"><button class="btn" id="pSave">Güncelle</button></div></div><div class="panel"><div class="label">Bel çevresi</div><strong>${state.waist||"—"} cm</strong></div></div><h3 class="section-title">Son antrenman kayıtları</h3><div class="panel"><table class="table"><thead><tr><th>Tarih</th><th>Hareket</th><th>kg</th><th>rep</th><th>RIR</th></tr></thead><tbody>${rows||"<tr><td colspan=5>Henüz kayıt yok.</td></tr>"}</tbody></table></div>`)
}
function nutrition(){return shell("Nutrition",`<div class="grid-2"><div class="panel"><div class="label">Protein hedefi</div><strong>${NUTRITION.proteinTarget}</strong><p class="muted">Kesin hedef, toplam enerji ve mevcut vücut kompozisyonuna göre sonraki aşamada ayarlanabilir.</p></div><div class="panel"><div class="label">Master Bar</div><strong>Bulk • Energy • Protein-dense</strong><p class="muted">Barları günlük toplam makro hesabına dahil et.</p></div></div><h3 class="section-title">Temel prensipler</h3><div class="panel">${NUTRITION.principles.map(x=>`<div class="notice">${x}</div>`).join("")}</div>`)}
function recovery(){const keys=["7+ saat uyku","Günlük adım","Zone 2","Mobilite","Hidrasyon"];return shell("Recovery",`<div class="panel"><div class="label">Günlük checklist</div>${keys.map((x,i)=>`<label class="check"><input type="checkbox" data-check="${i}" ${state.checks[i]?"checked":""}> ${x}</label>`).join("")}</div><div class="notice">Recovery verileri birkaç haftalık trend olarak değerlendirilmelidir.</div>`)}
function library(){return shell("Exercise Library",Object.values(EXERCISES).map(e=>`<div class="exercise"><h3>${e[0]}</h3><span class="tag">${e[1]}</span> <span class="tag">${e[2]}</span><p class="muted">Ana teknik kontrolü için video bağlantısı:</p><a class="video" target="_blank" rel="noopener" href="${e[4]}">▶ Video</a></div>`).join(""))}
function render(page="dashboard"){document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));app.innerHTML={dashboard,training,glutes,progress,nutrition,recovery,library}[page]();bind(page)}
function bind(page){
 document.querySelectorAll(".log").forEach(btn=>btn.onclick=()=>{const name=btn.dataset.name, box=btn.parentElement;const get=k=>box.querySelector(`[data-k="${k}"]`).value;state.logs.push({date:new Date().toLocaleDateString("tr-TR"),name,kg:get("kg"),reps:get("reps"),rir:get("rir")});save();btn.textContent="Kaydedildi";setTimeout(()=>btn.textContent="Kaydet",800)});
 const s=document.getElementById("saveProfile");if(s)s.onclick=()=>{state.weight=document.getElementById("weight").value||85;state.waist=document.getElementById("waist").value;save();render("dashboard")};
 const p=document.getElementById("pSave");if(p)p.onclick=()=>{state.weight=document.getElementById("pweight").value;save();render("progress")};
 document.querySelectorAll("[data-check]").forEach(x=>x.onchange=()=>{state.checks[x.dataset.check]=x.checked;save()});
}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>render(b.dataset.page));
document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("dark");
render();
