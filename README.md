# Fitness Master — Firebase Login + Offline Patch

Bu paket mevcut `FitnessMasterHq/fitness-master` projesine uygulanmak üzere hazırlanmıştır.

## İçerik

- `index.html` — Firebase Authentication, manifest ve Service Worker bağlantıları eklendi.
- `app.js` — mevcut uygulama korunarak `save()` sıralama hatası düzeltildi.
- `firebase-auth.js` — Google ile giriş / çıkış.
- `style.css` — mevcut stil + giriş alanı stilleri.
- `sw.js` — uygulamanın temel dosyalarını offline cache'e alır.
- `manifest.json` — PWA kurulumu için.
- `INSTALL.md` — GitHub'a uygulama adımları.

## Önemli

Bu aşamada **Firestore senkronizasyonu yoktur**. Telefonundaki Fitness Master localStorage verileri otomatik olarak Firebase'e gönderilmez.

Önce Google Login'i doğrulayacağız. Sonraki aşamada localStorage → Firestore geçişini kontrollü ve yedekli şekilde yapacağız.

YouTube gibi harici bağlantılar internet gerektirir. Uygulamanın kendi ekranları ve localStorage verileri ise Service Worker sayesinde offline çalışmaya devam eder.

Firebase Web API key'in web uygulamalarında istemci tarafında bulunması normaldir; yine de bu dosyayı gereksiz yere paylaşma.
