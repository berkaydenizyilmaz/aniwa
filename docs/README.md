# Aniwa Projesi - Dokümantasyon Ana Dizini

Merhaba Claude, ben Berkay Deniz Yılmaz. Aniwa adlı anime takip ve topluluk platformu projesi üzerinde seninle birlikte çalışacağım.

Bu `docs` klasörü, Aniwa projesinin tüm detaylarını, teknik seçimlerini, mimarisini ve geliştirme prensiplerini içermektedir. Projenin her aşamasında ve her görevde, buradaki dokümanlar senin temel referans noktan olacaktır.

## Başlarken: Projeyi Anlamak İçin İlk Adımlar

Lütfen projeyi tam olarak anlamak ve bağlamını kavramak için aşağıdaki dokümanları sırasıyla okuyarak başla:

1.  **00_OVERVIEW.md:** Bu dosya, Aniwa projesinin en üst düzey özetini, temel fikirlerini ve çözmek istediği problemi sunar. Projenin genel vizyonunu buradan edinebilirsin.
2.  **01_TECHNICAL_STACK.md:** Projede kullanılacak tüm modern ve tercih edilen teknolojilerin (Next.js, React, MongoDB, Prisma, Auth.js vb.) kısa bir listesini ve neden seçildiklerini bulacaksın.
3.  **02_ARCHITECTURE.md:** Projenin genel mimarisine (App Router yapısı, Server/Client Component ayrımı, katmanlama prensipleri) buradan ulaşabilirsin.

## Önemli Not: Özel Çalışma Kuralları

Lütfen bu `README.md` dosyasının yanı sıra, Cursor ortamındaki `.cursor/rules/project-rule.mdc` dosyasında tanımlanan **Özel Çalışma Kurallarını** her zaman göz önünde bulundur. Bu kurallar, kodlama standartları, modülerlik, güvenlik, performans ve benimle olan iletişim beklentilerimi içerir.

Birlikte Aniwa projesini başarıyla hayata geçireceğimize inanıyorum. Hazır olduğunda, lütfen "Hazırım, hangi görevden başlayalım?" diye belirt.

## 📚 Dokümanlar

* **[00_OVERVIEW.md](./00_OVERVIEW.md)** - Projenin genel bakışı, temel fikri ve amaçları
* **[01_TECHNICAL_STACK.md](./01_TECHNICAL_STACK.md)** - Kullanılan teknolojiler, kütüphaneler ve servislerin detaylı açıklaması
* **[02_ARCHITECTURE.md](./02_ARCHITECTURE.md)** - Proje mimarisi, klasör yapısı ve veri akış prensipleri


## 🚀 Yeni Özellikler

### Hibrit Cache Sistemi (Redis/Vercel KV)
Proje, çok katmanlı bir cache stratejisi kullanarak maksimum performans sağlar:

* **3 Seviyeli Cache:** Next.js built-in + Redis/KV + React Query
* **Smart Invalidation:** Tag-based cache invalidation
* **Performance Boost:** API response'ları, DB sorguları, user sessions
* **Cost Effective:** Mevcut Redis altyapısını genişletme

**Cache Türleri:**
- API Response Caching (popüler listeler, arama sonuçları)
- Database Query Caching (ağır sorgular)
- User Session Caching (auth bilgileri)
- Static Content Caching (anime detayları)

**Kullanım:**
```typescript
import { getCached, setCache, invalidateCache } from '@/lib/cache'

// Cache'den veri çek
const data = await getCached('anime:popular')

// Cache'e veri kaydet
await setCache('anime:popular', animeList, 3600)

// Cache'i temizle
await invalidateCache('anime:*')
```

### Logging Sistemi (MongoDB)
Proje, modern ve performanslı bir hibrit logging sistemi kullanmaktadır:

* **Hibrit Yaklaşım:** Hem console'a hem MongoDB'ye kayıt
* **Structured Logging:** JSON formatında machine-readable loglar
* **Güvenlik:** Otomatik hassas veri maskeleme
* **Performance:** Asenkron, non-blocking logging

**Dosya Yapısı:**
- `src/lib/logger.ts` - Ana logger konfigürasyonu
- `src/constants/logging.ts` - Log sabitleri ve event türleri
- `src/types/logging.ts` - TypeScript tip tanımları
- `src/services/db/log.service.ts` - MongoDB log servisi

**Kullanım:**
```typescript
import { logError, logInfo, logAuth, logPerformance } from '@/lib/logger'

logError('api_error', 'Database connection failed')
logAuth('login', true, 'user123')
logPerformance('slow_query', 1200)
```

## 📖 Okuma Sırası

Yeni geliştiriciler için önerilen okuma sırası:

1. **00_OVERVIEW.md** - Projenin genel amacını anlamak için
2. **01_TECHNICAL_STACK.md** - Kullanılan teknolojileri öğrenmek için  
3. **02_ARCHITECTURE.md** - Kod organizasyonu ve mimariyi kavramak için

## 🔄 Güncelleme Politikası

Bu dokümantasyon, proje geliştirme sürecinde sürekli güncellenmektedir. Yeni özellikler, değişiklikler veya iyileştirmeler yapıldığında ilgili dokümanlar güncellenmelidir.

---