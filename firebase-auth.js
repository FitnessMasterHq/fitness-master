/* Fitness Master — Firebase Authentication (Google) */
(function(){
  const firebaseConfig={
    apiKey:"AIzaSyDdg6HVSbQPdfoBhu66Gb_1Z70_qxV1Iac",
    authDomain:"fitness-master-bf1cb.firebaseapp.com",
    projectId:"fitness-master-bf1cb",
    storageBucket:"fitness-master-bf1cb.firebasestorage.app",
    messagingSenderId:"402564407304",
    appId:"1:402564407304:web:1cad321e40c4b6b0c9b1bd"
  };

  if(typeof firebase==="undefined"){
    console.error("Firebase SDK yüklenemedi.");
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const auth=firebase.auth();
  window.FitnessMasterAuth=auth;
  auth.useDeviceLanguage();

  const topbar=document.querySelector(".topbar");
  if(!topbar)return;

  const box=document.createElement("div");
  box.id="authBox";
  box.className="auth-box";
  topbar.appendChild(box);

  const provider=new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});

  function renderSignedOut(){
    box.innerHTML='<button id="googleSignIn" class="btn auth-btn">Google ile Giriş</button>';
    document.getElementById("googleSignIn").onclick=async()=>{
      const b=document.getElementById("googleSignIn");
      b.disabled=true;b.textContent="Giriş yapılıyor…";
      try{await auth.signInWithRedirect(provider)}
      catch(e){console.error(e);b.disabled=false;b.textContent="Google ile Giriş";alert("Google ile giriş yapılamadı: "+(e.message||e.code))}
    };
  }
  auth.getRedirectResult().catch(e=>{
    if(e){console.error(e);alert("Google giriş sonucu alınamadı: "+(e.message||e.code))}
  });
  auth.onAuthStateChanged(user=>{
    if(!user){renderSignedOut();return}
    const name=user.displayName||user.email||"Google hesabı";
    box.innerHTML='<span class="auth-user">'+String(name).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))+'</span><button id="googleSignOut" class="nav-btn auth-out">Çıkış</button>';
    document.getElementById("googleSignOut").onclick=()=>auth.signOut();
  });
})();