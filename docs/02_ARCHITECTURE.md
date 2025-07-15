# Aniwa Projesi: Mimari (Architecture)

Bu doküman, Aniwa projesinin genel mimarisini, veri akış prensiplerini ve Next.js 15 App Router'ın temel yaklaşımlarını detaylandırmaktadır. Amaç, uygulamanın modüler, performanslı, sürdürülebilir ve ölçeklenebilir bir yapıya sahip olmasını sağlamaktır.

## 1. Mimariye Genel Bakış

Aniwa, Next.js 15 (App Router), TypeScript ve React Query (TanStack Query) ile oluşturulmuş bir **Full-Stack Uygulama**dır. Veritabanı katmanı MongoDB (MongoDB Atlas üzerinde yönetilen hizmet) ve Prisma ORM ile yönetilmektedir.

### 1.1 Temel Mimari Prensipler

* **Sunucu Öncelikli (Server-First) Yaklaşım:** Mümkün olduğunca veri çekme ve ilk sayfa oluşturma işlemleri sunucu tarafında gerçekleştirilir. Bu, daha küçük JavaScript paketleri, daha hızlı ilk yüklemeler (LCP) ve gelişmiş SEO sağlar.
* **Endişelerin Net Ayrımı (Separation of Concerns):** Uygulama mantığı, veri erişimi ve kullanıcı arayüzü bileşenleri arasında net sınırlar tanımlanmıştır.  Bu, kodun modülerliğini ve bakım kolaylığını artırır.
*  **Uçtan Uca Tip Güvenliği:** TypeScript'in projenin tamamında kullanılması ve Zod gibi şema doğrulama kütüphanelerinin entegrasyonu, geliştirme sırasında hataları erken yakalamayı ve kod tabanının sürdürülebilirliğini sağlamayı amaçlar.
* **Modülerlik ve Yeniden Kullanılabilirlik:** Kodun tekrarını azaltmak ve farklı bileşenler/katmanlar arasında paylaşımı kolaylaştırmak temel hedeftir.
* **Performans Odaklılık:** Web Font optimizasyonu, görsel optimizasyonu, akıllı veri çekme ve önbellekleme mekanizmaları ile yüksek performans hedeflenir.
*  **Mobil Uygulama Hazırlığı:** Backend API'leri (Route Handlers) mobil uygulamalar tarafından da tüketilebilecek şekilde tasarlanır.

## 2. Klasör Yapısı Stratejisi

Aniwa için **Hibrit Klasör Yapısı** benimsenmiştir.  Bu yaklaşım, Next.js App Router'ın colocation prensiplerini (özelliğe ait kodun ilgili rotanın yanında tutulması) katman bazlı global dizinlerle (paylaşılan bileşenler, kancalar, yardımcılar) birleştirir.

* **`src/` Dizini:** Tüm uygulama kaynak kodu bu dizinin içine yerleştirilmiştir. Proje kök dizinini temizler ve genel tutarlılığı artırır.
* **`app/` Klasörü:** Next.js App Router'ın ana dizinidir. Rota bazlı colocation prensibinin uygulandığı yerdir.
    * **Rota Grupları (`(folderName)`):** `(main)`, `(community)`, `(auth)`, `(admin)`, `(marketing)` gibi gruplar kullanılır. Bunlar URL yolunu etkilemez ancak kod organizasyonunu sağlar ve farklı bölümler için özel düzenler tanımlamaya olanak tanır.
    * **Rota Özel Dosyaları:** Her rota dizini içinde `page.tsx` (sayfa içeriği), `layout.tsx` (rotaya özel düzen), `loading.tsx` (yükleme ekranı), `error.tsx` (hata ekranı) gibi özel dosyalar kullanılır.
    * **Rota Özel Colocation:** Rotaya özgü bileşenler, mantık ve Sunucu Eylemleri (`route.ts` veya `server-actions.ts` yerine genellikle `_components`, `_lib`, `_actions` gibi alt dizinlerde) ilgili rotanın yanına yerleştirilir.
* **`components/` Klasörü:** Uygulama genelinde yeniden kullanılabilen UI bileşenlerini barındırır.
    * `ui/`: Temel, jenerik UI bileşenleri (Button, Input).
    * `layout/`: Uygulamanın genel yapısını oluşturan bileşenler (Header, Footer).
    * `features/`: Belirli bir iş özelliğine ait, ancak birden fazla sayfada kullanılabilen daha karmaşık bileşenler.
* **`lib/` Klasörü:** Yardımcı fonksiyonlar ve kütüphaneler.
    * `src/lib/`: Daha karmaşık iş mantığı, dış hizmetlerle etkileşim kuran fonksiyonlar, üçüncü taraf kütüphane entegrasyonları, kimlik doğrulama mantığı, Zod şemaları (`lib/schemas/`) gibi daha geniş kapsamlı modüller.
        * `lib/logger.ts`: Hibrit logging sistemi (console + MongoDB)
        * `lib/constants/`: Kategorize edilmiş sabitler (logging, API endpoints vb.)
        * `lib/env.ts`: Environment variables validation (Zod ile)
* **`services/` Klasörü (Stratejik Katman):** İş mantığı ve veri erişim işlevleri için merkezi depodur. Modülerliği, DRY prensibini ve bakım kolaylığını sağlar.
    * `services/db/`: Doğrudan veritabanı etkileşimlerini (Prisma aracılığıyla) kapsar. Sunucu Bileşenleri ve Rota İşleyicileri tarafından kullanılır. `log.service.ts` dosyası burada yer alır ve MongoDB log sistemi için CRUD işlemlerini yönetir.
    * `services/api/`: Harici servislere (Resend, Stripe vb.) yapılan çağrıları merkezileştirir. Axios tabanlı HTTP istemci fonksiyonları içerir.
    * `services/auth/`: Kimlik doğrulama ve yetkilendirme ile ilgili mantığı içerir.
* **`hooks/`:** Projeye özel custom React hook'ları.
* **`types/`:** Tüm özel TypeScript tip tanımlamaları ve arayüzleri. Kapsamlarına göre alt dizinlere ayrılmıştır (`api/`, `models.d.ts`, `common.d.ts`, `logging.ts` vb.).
* **`docs/`:** Proje dokümantasyonu.

## 3. Veri Akışı ve API Etkileşimleri

Aniwa projesindeki veri akışı, performans ve modülerlik hedefleri doğrultusunda dikkatlice tasarlanmıştır.

### 3.1 Logging Sistemi Mimarisi

Aniwa projesi, modern ve performanslı bir MongoDB hibrit logging sistemi** kullanmaktadır:

* **MongoDB Log Storage:**
    * `Log` Prisma modeli ile veritabanında kalıcı log kayıtları
    * Filtreleme, arama ve istatistik özellikleri
    * Admin panelinde görüntüleme ve yönetim
    * Otomatik log temizleme ve arşivleme

* **Hibrit Yaklaşım:**
    * **Console Logging:** Geliştirme sırasında anında görüntüleme
    * **Database Logging:** Kalıcı kayıt, analiz ve raporlama
    * **Çift Güvenlik:** Bir sistem çökse diğeri çalışmaya devam eder

* **Log Event Türleri:**
    * `HTTP_REQUEST`: API istekleri ve yanıtları
    * `AUTH`: Kimlik doğrulama olayları
    * `DATABASE`: Veritabanı işlemleri
    * `EXCEPTION`: Hatalar ve istisnalar
    * `PERFORMANCE`: Yavaş operasyonlar ve performans metrikleri
    * `USER_ACTION`: Kullanıcı etkileşimleri

* **Kullanım Örnekleri:**
    ```typescript
    import { logError, logInfo, logAuth, logPerformance } from '@/lib/logger'
    
    // Hata kaydı
    logError('database_error', 'Connection failed', { table: 'users' })
    
    // Kimlik doğrulama
    logAuth('login', true, 'user123', { ip: '192.168.1.1' })
    
    // Performans izleme
    logPerformance('api_call', 1200, { endpoint: '/api/anime' })
    ```

### 3.2 Veri Çekme Yaklaşımları

* **Sunucu Bileşenleri (`app/page.tsx`, `app/dashboard/page.tsx` vb.):**
    * **Kullanım:** İlk veri gösterimi ve SEO açısından kritik, statik veya sık güncellenmeyen içerikler için kullanılır.
    * **Nasıl:** `fetch` API'si veya `lib/services/db/` altındaki Prisma tabanlı fonksiyonlar aracılığıyla **doğrudan veritabanından** veri çeker. `fetch` çağrıları Next.js tarafından otomatik olarak önbelleğe alınır ve tekilleştirilir.
* **Sunucu Eylemleri (`'use server'` ile işaretli fonksiyonlar):**
    * **Kullanım:** Veri mutasyonları (oluşturma, güncelleme, silme) ve form gönderimleri için tasarlanmıştır. Kullanıcı etkileşimleriyle tetiklenirler.
    * **Nasıl:** `lib/services/db/` altındaki Prisma tabanlı mutasyon fonksiyonlarını çağırır. `revalidatePath` veya `revalidateTag` kullanarak Next.js önbelleğini yeniden doğrularlar.
* **Rota İşleyicileri (`app/api/.../route.ts`):**
    * **Kullanım:** Tüm HTTP yöntemlerini (GET, POST, PUT, DELETE vb.) destekleyen RESTful API'ler oluşturmak içindir. Mobil uygulamalar veya üçüncü taraf hizmetler gibi harici tüketiciler tarafından erişilmesi gereken genel API yüzeyini sunar.
    * **Nasıl:** Gelen isteği alır ve iş mantığını yürütmek, veritabanıyla etkileşime geçmek için **`lib/services/db/`** klasöründeki fonksiyonları çağırır. Harici servislere istek atmak için **`lib/services/external-api/`** fonksiyonlarını kullanır.
* **İstemci Bileşenleri (`'use client'` ile işaretli bileşenler):**
    * **Kullanım:** Dinamik UI etkileşimleri, kullanıcıya özel veriler, arama/filtreleme gibi işlemler için kullanılır.
    * **Nasıl:** React Query kancalarını kullanarak `lib/services/api/` altındaki **Axios tabanlı** fonksiyonlar aracılığıyla kendi `/api` rotalarına istek atar. React Query önbellekleme, arka plan güncellemeleri ve iyimser güncellemeler sağlar.

### 3.3 Hibrit Cache Stratejisi

Aniwa projesi, performans optimizasyonu için çok katmanlı bir cache stratejisi benimser:

* **Next.js Built-in Cache (Seviye 1):**
    * **fetch** çağrıları otomatik olarak önbelleğe alınır
    * **unstable_cache** ile server-side fonksiyonlar cache'lenir
    * **revalidateTag** ve **revalidatePath** ile cache invalidation

* **Redis/Vercel KV Cache (Seviye 2):**
    * **API Response Caching:** Popüler anime listeleri, arama sonuçları
    * **Database Query Caching:** Ağır database sorguları
    * **User Session Caching:** Kimlik doğrulama bilgileri
    * **Static Content Caching:** Anime detayları, genre listeleri

* **React Query Cache (Seviye 3 - İstemci):**
    * **Client-side caching:** Kullanıcı etkileşimleri
    * **Background updates:** Otomatik veri güncellemeleri
    * **Optimistic updates:** Anında UI güncellemeleri

**Cache Key Stratejisi:**
```typescript
// Örnek cache key yapısı
cache:anime:popular:page:1        // Popüler anime listesi
cache:user:123:preferences        // Kullanıcı tercihleri
cache:search:naruto:results       // Arama sonuçları
cache:genre:action:list           // Genre bazlı listeler
```

### 3.4 HTTP İstemcisi Stratejisi (`fetch` vs. Axios)

Aniwa projesi, her iki HTTP istemcisinin güçlü yönlerinden faydalanan hibrit bir strateji izler:

* **`fetch` API:** Next.js'in sunucu tarafı önbellekleme ve yeniden doğrulama mekanizmalarından tam olarak yararlanmak için Sunucu Bileşenlerinde ve Rota İşleyicilerinde (özellikle GET istekleri için) tercih edilir.
* **Axios:** İstemci Bileşenlerinde (React Query ile birlikte) veri gönderme (POST, PUT, DELETE) ve karmaşık API etkileşimleri için kullanılır. Ayrıca, Rota İşleyicileri içinde dış servis sağlayıcılara (Resend, Stripe vb.) istek atmak için `lib/services/external-api/` altında Axios tabanlı fonksiyonlar tercih edilir. Axios'un `interceptor`'ları ve gelişmiş hata yönetimi bu senaryolarda geliştirici deneyimini artırır.

---

## 4. Ölçeklenebilirlik ve Mobil Uygulama Hazırlığı

Önerilen mimari, Aniwa'nın gelecekte mobil uygulamaya dönüşme hedefini doğrudan desteklemektedir.

* **API'lerin Platformdan Bağımsızlığı:** `app/api/` altındaki Rota İşleyicileri, standart HTTP yöntemleriyle web uygulamasının kullanıcı arayüzünden bağımsız olarak tanımlanmış temiz ve tutarlı bir API yüzeyi oluşturur. Bu sayede mobil uygulamalar bu API'leri doğrudan tüketebilir.
* **`services` Katmanının Rolü:** `lib/services/` dizinindeki merkezi iş mantığı ve veri erişim fonksiyonları, kullanıcı arayüzü veya platformdan bağımsız olarak tasarlanmıştır. Bu, hem web hem de mobil platformlarda kodun yeniden kullanılabilirliğini ve sürdürülebilirliğini en üst düzeye çıkarır.
* **Performans Optimizasyonu:** Sunucu öncelikli veri çekme ve Next.js'in yerleşik önbellekleme mekanizmaları, mobil cihazlar için de daha hızlı yükleme süreleri ve akıcı bir deneyim sağlar.

---