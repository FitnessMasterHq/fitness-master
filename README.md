Fitness Master — Firebase Google Login v4

Bu sürüm özellikle GitHub Pages Service Worker cache sorununu düzeltir.

Değişiklikler:
- Service Worker cache adı v7 yapıldı; eski v6 cache aktivasyon sırasında silinir.
- index.html, app.js ve firebase-auth.js güncel sürüm query parametresiyle yüklenir.
- firebase-auth.js ve app.js için network-first / no-store davranışı uygulanır.
- Harici Firebase/Google kaynakları Service Worker tarafından cache'lenmez.
- Google giriş yöntemi popup olarak kalır.
- Auth state onAuthStateChanged ile arayüze yansıtılır.
- Gerçek Firebase hata kodu ekranda gösterilir.
- Firestore henüz etkin değildir.
- Mevcut localStorage verileri silinmez.

Test:
1. ZIP içindeki dosyaları GitHub repository'deki mevcut dosyaların üzerine yükle.
2. GitHub Pages güncellendikten sonra siteyi tamamen yenile.
3. Google ile Giriş'e bas.
4. Hesabı seç.
5. Düğmede "Ad • Çıkış" görünmelidir.
