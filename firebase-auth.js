/* Fitness Master — Firebase Authentication (Google), Phase 1 */
(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyDdg6HVSbQPdfoBhu66Gb_1Z70_qxV1Iac",
    authDomain: "fitness-master-bf1cb.firebaseapp.com",
    projectId: "fitness-master-bf1cb",
    storageBucket: "fitness-master-bf1cb.firebasestorage.app",
    messagingSenderId: "402564407304",
    appId: "1:402564407304:web:1cad321e40c4b6b0c9b1bd"
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    window.FitnessMasterAuth = auth;
    auth.useDeviceLanguage();

    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const box = document.createElement('div');
    box.id = 'authBox';
    box.className = 'auth-box';
    topbar.appendChild(box);

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    async function signIn() {
      const button = document.getElementById('googleSignIn');
      if (button) {
        button.disabled = true;
        button.textContent = 'Giriş yapılıyor…';
      }
      try {
        /* Redirect is more reliable on mobile browsers. */
        await auth.signInWithRedirect(provider);
      } catch (error) {
        console.error('Firebase Google sign-in error:', error);
        if (button) {
          button.disabled = false;
          button.textContent = 'Google ile Giriş';
        }
        alert('Google ile giriş yapılamadı: ' + (error.message || error.code));
      }
    }

    function renderAuth(user) {
      if (user) {
        const label = user.displayName || user.email || 'Google hesabı';
        box.innerHTML =
          '<span class="auth-user" title="' + esc(label) + '">' + esc(label) + '</span>' +
          '<button id="googleSignOut" class="nav-btn auth-out">Çıkış</button>';
        document.getElementById('googleSignOut').onclick = () => auth.signOut();
      } else {
        box.innerHTML = '<button id="googleSignIn" class="btn auth-btn">Google ile Giriş</button>';
        document.getElementById('googleSignIn').onclick = signIn;
      }
    }

    auth.getRedirectResult().catch(error => {
      if (!error) return;
      console.error('Firebase redirect result error:', error);
      const message = error.code === 'auth/unauthorized-domain'
        ? 'Bu alan adı Firebase Authentication tarafından yetkilendirilmemiş.'
        : 'Google giriş işlemi tamamlanamadı: ' + (error.message || error.code);
      alert(message);
    });

    auth.onAuthStateChanged(renderAuth);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
})();
