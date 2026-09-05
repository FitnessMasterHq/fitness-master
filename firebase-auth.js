/* Fitness Master — Firebase Google Authentication v4
   Privacy rule: personal app data is never displayed while signed out.
*/
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDdg6HVSbQPdfoBhu66Gb_1Z70_qxV1Iac",
    authDomain: "fitness-master-bf1cb.firebaseapp.com",
    projectId: "fitness-master-bf1cb",
    storageBucket: "fitness-master-bf1cb.firebasestorage.app",
    messagingSenderId: "402564407304",
    appId: "1:402564407304:web:1cad321e40c4b6b0c9b1bd"
  };
  function showAuthError(err) {
    console.error("Firebase Auth:", err);
    const old = document.getElementById("fm-auth-error"); if (old) old.remove();
    const el = document.createElement("div"); el.id = "fm-auth-error";
    el.style.cssText = "position:fixed;top:70px;right:20px;z-index:9999;max-width:420px;padding:12px 14px;border:1px solid #c00;border-radius:10px;background:#fff;color:#111;box-shadow:0 4px 20px rgba(0,0,0,.15);font-size:14px;";
    el.innerHTML = "<strong>Google girişi başarısız.</strong><br>" + (err && err.message ? err.message : "Bilinmeyen Firebase hatası.");
    document.body.appendChild(el);
  }
  function start() {
    if (!window.firebase || !firebase.apps) { showAuthError({message:"Firebase SDK yüklenemedi."}); return; }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth(); auth.useDeviceLanguage();
    const topbar = document.querySelector(".topbar") || document.body;
    let btn = document.getElementById("fm-google-login");
    function render(user) {
      document.body.classList.toggle("fm-authenticated", !!user);
      document.body.classList.add("fm-auth-ready");
      if (!btn) return;
      if (user) { const name = user.displayName || user.email || "Google hesabı"; btn.textContent = name + "  •  Çıkış"; btn.title = user.email || ""; btn.dataset.signedIn = "1"; }
      else { btn.textContent = "Google ile Giriş"; btn.title = ""; btn.dataset.signedIn = "0"; }
    }
    if (!btn) {
      btn = document.createElement("button"); btn.id = "fm-google-login"; btn.type = "button";
      btn.style.cssText = "margin-left:10px;padding:8px 12px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font:inherit;";
      topbar.appendChild(btn);
    }
    btn.addEventListener("click", async function () {
      if (auth.currentUser) { await auth.signOut(); render(null); return; }
      btn.disabled = true; btn.textContent = "Google açılıyor…";
      try { const provider = new firebase.auth.GoogleAuthProvider(); provider.setCustomParameters({prompt:"select_account"}); await auth.signInWithPopup(provider); }
      catch (err) { showAuthError(err); render(auth.currentUser); }
      finally { btn.disabled = false; }
    });
    auth.onAuthStateChanged(function (user) {
      console.log("Fitness Master auth state:", user ? user.email : "signed out");
      render(user);
      window.FitnessMasterAuth = {user, auth};
      window.FitnessMasterAuthReady = {user, auth};
      window.dispatchEvent(new CustomEvent("fm-auth-state-changed", {detail:{signedIn:!!user}}));
    });
    render(auth.currentUser);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();