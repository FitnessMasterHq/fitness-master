Fitness Master — Firebase Google Login v3

Bu sürümde Google giriş yöntemi redirect yerine popup olarak güncellendi.
Amaç: GitHub Pages üzerinde Google hesabı seçildikten sonra Firebase oturumunun
Fitness Master arayüzüne düzgün yansımasını sağlamak.

Test:
1. GitHub Pages'i aç.
2. Google ile Giriş'e bas.
3. Google hesabını seç.
4. Popup kapandıktan sonra düğmede ad/e-posta ve "Çıkış" görünmeli.
5. Sayfayı yenile; oturum devam etmeli.

Bu sürüm Firestore senkronizasyonunu henüz açmaz. Mevcut localStorage verilerini
silmez veya otomatik olarak buluta taşımaz.
