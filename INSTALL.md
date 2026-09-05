# Fitness Master patch uygulama

1. GitHub'da `FitnessMasterHq/fitness-master` repository'sini aç.
2. ZIP içindeki dosyaları repository'nin köküne kopyala.
3. `data/` klasöründeki mevcut dosyalara dokunma.
4. `assets/omron-2026-08-20.png` mevcutsa aynen bırak.
5. GitHub değişikliklerini commit et.
6. GitHub Pages'in yeniden yayınlanmasını bekle.
7. `https://FitnessMasterHq.github.io/fitness-master/` adresini aç.
8. Sayfayı bir kez normal internet bağlantısıyla yükle.
9. Sağ üstte **Google ile Giriş** görünmeli.
10. Google hesabınla giriş yap.
11. Giriş başarılı olduktan sonra çıkış yapıp tekrar giriş yaparak testi tamamla.

## Eğer eski Service Worker nedeniyle eski ekran görünürse

Safari/Chrome'da siteyi bir kez tamamen kapatıp yeniden aç. Gerekirse site verilerini temizleyip tekrar yükle.

## Sonraki aşama

Google Login çalıştıktan sonra:
- Firebase Authentication kullanıcı kimliği
- Firestore kullanıcı dokümanı
- localStorage → Firestore ilk migration
- iki cihaz arasında senkronizasyon
- offline Firestore cache

sırasıyla eklenecek.
