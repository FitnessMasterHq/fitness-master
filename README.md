# Fitness Master — Firebase Login + Offline v2

Bu paket, mevcut Fitness Master GitHub Pages uygulamasına uygulanmak üzere hazırlanmıştır.

## Bu sürümde düzeltildi

- Firebase App Compat SDK eklendi.
- Firebase Auth Compat SDK eklendi.
- Google ile Giriş butonu `index.html` açılır açılmaz Firebase başlatıldıktan sonra oluşturulur.
- Google girişinde redirect yöntemi kullanılır.
- Omron `save()` sıralama hatası düzeltildi.
- Service Worker ve PWA manifest eklendi.
- Firestore entegrasyonu YOKTUR; mevcut localStorage kayıtları bu aşamada Firebase'e gönderilmez.

## GitHub'a yükleme

Kök dizindeki mevcut dosyaların üzerine:
- index.html
- app.js
- style.css

Yeni olarak:
- firebase-auth.js
- sw.js
- manifest.json

eklenmelidir.

`data/` klasörüne dokunma.

## Test

GitHub Pages yayınlandıktan sonra:
1. Siteyi normal internet bağlantısıyla aç.
2. Sağ üstte `Google ile Giriş` görünmeli.
3. Google ile giriş yap.
4. Başarılı olunca ad/e-posta ve `Çıkış` görünür.
5. Sayfayı yenile; oturum korunmalı.

Google butonu yine görünmüyorsa tarayıcı geliştirici konsolundaki hatayı gönder. Bu durumda özellikle Firebase SDK yükleme sırasını ve Authorized Domains ayarını kontrol ederiz.

## Sonraki aşama

Login doğrulandıktan sonra Firestore'a kontrollü migration yapılacak:
localStorage → yedek → Firestore → doğrulama → iki cihaz senkronizasyonu.
