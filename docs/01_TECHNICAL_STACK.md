# Aniwa Projesi: Teknik Yığın (Technical Stack)

Bu doküman, Aniwa projesinin geliştirilmesinde kullanılacak temel teknolojileri, kütüphaneleri ve servisleri detaylandırmaktadır. Seçilen tüm teknolojiler, modern, güncel ve projenin performans, ölçeklenebilirlik, bakım kolaylığı ve geliştirici deneyimi (DX) hedeflerini destekleyecek şekilde tercih edilmiştir.

---

## 1. Ana Mimari ve Temel Çerçeveler

* **Next.js 15 (App Router):**
    * **Rolü:** Projenin ana full-stack geliştirme çerçevesi. Sunucu Bileşenleri (RSC), Sunucu Tarafı Renderlama (SSR) ve Statik Site Üretimi (SSG) gibi özelliklerle performans, SEO ve geliştirici verimliliği sağlar.
    * **Neden:** En güncel Next.js versiyonu olması ve App Router'ın getirdiği esneklik ve performans optimizasyonları için.
    * **Nasıl Kullanılacak:** `app/` dizini ile dosya tabanlı yönlendirme ve rota grupları; performans ve güvenlik için Sunucu Bileşenleri; `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` gibi özel dosyalar ile rota bazlı UI yönetimi.
* **React 19:**
    * **Rolü:** Frontend kullanıcı arayüzünü oluşturmak için temel kütüphane.
    * **Neden:** Next.js'in temelini oluşturur, geniş ekosistem ve topluluk desteği sunar.
    * **Nasıl Kullanılacak:** Fonksiyonel bileşenler ve React Hook'ları ile UI oluşturma. Sunucu Bileşenleri (Server Components) ve İstemci Bileşenleri (Client Components) ayrımına dikkat ederek (`'use client'` direktifi ile).
* **TypeScript:**
    * **Rolü:** Projenin tüm kod tabanında kullanılan programlama dili.
    * **Neden:** Geliştirme sürecinde hataları erken yakalamak, kod kalitesini, okunabilirliği ve sürdürülebilirliği artırmak için katı tip güvenliği sağlar.
    * **Nasıl Kullanılacak:** Kodun tamamında tip tanımlamaları (`interface`, `type`). `any` tipinden kaçınma. Prisma tarafından otomatik üretilen tiplerin kullanımı. Zod ile birlikte uçtan uca tip güvenliği.
* **Tailwind CSS:**
    * **Rolü:** Hızlı ve esnek UI geliştirmesi için CSS framework'ü.
    * **Neden:** Utility-first yaklaşımı sayesinde sadece kullanılan CSS'i paketleyerek dosya boyutunu minimumda tutar ve geliştirme hızını artırır.
    * **Nasıl Kullanılacak:** Doğrudan JSX içinde utility class'lar ile stil uygulama.

---

## 2. Veritabanı ve Veri Yönetimi

* **MongoDB:**
    * **Rolü:** Uygulamanın ana veritabanı.
    * **Neden:** Esnek ve iç içe doküman yapısına uygun olduğu için tercih edilmiştir. Anime serileri, sezonları ve ilgili medyaları tek bir ana başlık altında toplama çözümüne uygunluk.
    * **Nasıl Kullanılacak:** MongoDB Atlas üzerinde yönetilen bir küme aracılığıyla erişim.
* **MongoDB Atlas:**
    * **Rolü:** Bulut tabanlı, yönetilen MongoDB veritabanı hizmeti.
    * **Neden:** Veritabanı yönetim yükünü (kurulum, bakım, yedekleme, ölçeklendirme) üstlenir, yüksek güvenilirlik ve performans sunar. (Proje için 50 dolarlık kredi ile Flex katmanı kullanılacaktır.)
    * **Nasıl Kullanılacak:** `DATABASE_URL` ortam değişkeni ile Prisma üzerinden bağlantı kurulacak. Veritabanı kullanıcısı ve ağ erişim ayarları MongoDB Atlas panelinden yönetilecek.
* **Prisma:**
    * **Rolü:** Veritabanı ORM (Object-Relational Mapping).
    * **Neden:** Tip güvenliği sağlar (TypeScript ile mükemmel uyum), veritabanı sorgularını kolaylaştırır ve veri modellemesini düzenler. MongoDB desteği ile tercih edilmiştir.
    * **Nasıl Kullanılacak:** `prisma/schema.prisma` dosyasında veri modelleri tanımlanacak. `npx prisma generate` ile otomatik olarak `@prisma/client` oluşturulacak. Veritabanı işlemleri (CRUD) `lib/services/db/` klasöründeki servisler aracılığıyla yapılacak.
* **React Query (TanStack Query):**
    * **Rolü:** İstemci tarafı sunucu durumu yönetimi ve veri çekme kütüphanesi.
    * **Neden:** API'lerden çekilen verileri akıllıca önbelleğe alır, arka plan güncellemeleri, yeniden denemeler ve iyimser güncellemeler gibi sofistike özellikler sunarak istemci tarafı performansı ve geliştirici deneyimini (DX) iyileştirir.
    * **Nasıl Kullanılacak:** İstemci bileşenlerinde dinamik veri çekme ve mutasyonlar için `useQuery` ve `useMutation` hook'ları kullanılacak. Sunucu tarafında önceden çekilen verilerin istemci tarafında hidrasyonu sağlanacak.
* **Zustand:**
    * **Rolü:** Hafif ve hızlı global istemci durumu (state) yönetimi kütüphanesi.
    * **Neden:** Küçük boyutu ve basit API'si ile global UI state'lerini etkili bir şekilde yönetmek için tercih edilmiştir.
    * **Nasıl Kullanılacak:** Hafif, uygulama genelinde paylaşılan veya bileşenler arası basit durumlar için `zustand` store'ları oluşturulacak.

---

## 3. Kullanıcı Etkileşimi ve Yönetimi

* **Auth.js (NextAuth.js):**
    * **Rolü:** Kullanıcı kimlik doğrulama ve oturum yönetimi kütüphanesi.
    * **Neden:** Kayıt olma, giriş yapma (e-posta/şifre ve Google OAuth ile), şifre yönetimi gibi tüm kimlik doğrulama süreçlerini güvenli ve kolay bir şekilde yönetir.
    * **Nasıl Kullanılacak:** `app/api/auth/[...nextauth]/route.ts` API rotası aracılığıyla yapılandırılacak. Kullanıcı kimlik bilgileri `lib/services/auth/` servisleri aracılığıyla Prisma ile doğrulanacak. Google API Console'dan `CLIENT_ID` ve `CLIENT_SECRET` alınacak.
* **React Hook Form:**
    * **Rolü:** React'te form yönetimi için kütüphane.
    * **Neden:** Performanslı, esnek ve kolay kullanılabilir form oluşturmayı sağlar.
    * **Nasıl Kullanılacak:** Form bileşenlerinde `useForm` hook'u ile form durumu, validasyon ve gönderim yönetimi yapılacak.
* **Zod:**
    * **Rolü:** Şema tabanlı veri doğrulama kütüphanesi.
    * **Neden:** React Hook Form ile birlikte input validasyonu yapmak ve API katmanında gelen verileri tip güvenli bir şekilde doğrulamak için kullanılır.
    * **Nasıl Kullanılacak:** `lib/schemas/` klasöründe Zod şemaları tanımlanacak ve React Hook Form ile `@hookform/resolvers` aracılığıyla entegre edilecek. Backend'de de API rotalarında (Route Handlers) gelen verileri doğrulamak için kullanılacak.
* **@hookform/resolvers:**
    * **Rolü:** React Hook Form'u Zod gibi doğrulama kütüphaneleriyle entegre etmek için bir köprü görevi görür.
    * **Neden:** Form doğrulama şemalarını Zod ile tanımlayıp React Hook Form'a bağlamak için.
    * **Nasıl Kullanılacak:** `useForm` hook'u ile `resolver` seçeneği olarak kullanılacak.
* **Axios:**
    * **Rolü:** HTTP istemci kütüphanesi.
    * **Neden:** İstek/yanıt `interceptor`'ları, otomatik JSON dönüşümü ve daha iyi hata yönetimi gibi gelişmiş özellikler sunarak API isteklerini kolaylaştırır. Özellikle istemci bileşenlerinden ve kendi API rotaları içinden harici servislere yapılan çağrılarda kullanılır.
    * **Nasıl Kullanılacak:** `lib/services/api/` klasöründe merkezi API istemcisi ve dış servislere (Resend, Stripe vb.) istek atan fonksiyonlar için kullanılacak. Interceptor'lar aracılığıyla kimlik doğrulama jetonları otomatik eklenebilir.

---

## 4. Kullanıcı Arayüzü ve Görsel Optimizasyon

* **shadcn/ui:**
    * **Rolü:** Tailwind CSS üzerine kurulu, özelleştirilebilir UI bileşen kütüphanesi.
    * **Neden:** Hızlı UI geliştirme, projenin marka kimliğine göre kolay özelleştirme ve erişilebilir bileşenler sunar.
    * **Nasıl Kullanılacak:** `npx shadcn@latest add <component>` komutuyla bileşenler projeye eklenecek ve `components/ui/` klasöründe tutulacak. Tasarım prensiplerine göre özelleştirilecek.
* **Lucide React:**
    * **Rolü:** Uygulamada kullanılacak ikon seti.
    * **Neden:** Modern, temiz ve kolay kullanılabilen SVG ikonlar sunar.
    * **Nasıl Kullanılacak:** İhtiyaç duyulan yerlerde doğrudan `Lucide` ikon bileşenleri import edilip kullanılacak.
* **Motion (eski adıyla Framer Motion):**
    * **Rolü:** React için animasyon kütüphanesi.
    * **Neden:** Akıcı ve estetik arayüz animasyonları ekleyerek kullanıcı deneyimini zenginleştirir. Performanslı (GPU hızlandırmalı) animasyonlar yapma yeteneği.
    * **Nasıl Kullanılacak:** `<motion.div>` gibi Motion bileşenleri ile UI elementlerine hareket (hover efektleri, giriş/çıkış animasyonları) eklenecek. Performans odaklı (`transform`, `opacity`) animasyonlar tercih edilecek.
* **Cloudinary (next-cloudinary SDK'sı ile):**
    * **Rolü:** Dosya yükleme, depolama, görsel işleme ve dağıtım hizmeti.
    * **Neden:** Otomatik görsel optimizasyonu (boyutlandırma, format dönüştürme - WebP/AVIF), CDN üzerinden hızlı görsel teslimatı ve dosya yükleme sürecini basitleştirmesi için.
    * **Nasıl Kullanılacak:** `next-cloudinary` paketi ile frontend'den kolayca dosya yüklemesi yapılacak. Yüklenen görseller `CldImage` bileşeni ile optimize edilerek sunulacak. `next.config.js` ve `.env` ayarları Cloudinary belgelerine göre yapılacak.
* **Next.js `next/font` bileşeni:**
    * **Rolü:** Web fontlarının optimizasyonu için Next.js'in yerleşik özelliği.
    * **Neden:** Fontların hızlı yüklenmesini sağlar, CLS (Cumulative Layout Shift) gibi performans sorunlarını önler ve sayfa yükleme hızını iyileştirir.
    * **Nasıl Kullanılacak:** `_app.tsx` veya `layout.tsx` gibi global dosyalarda Google Fontları veya yerel fontlar optimize edilerek yüklenecek.

---

## 5. Güvenlik, Performans ve İzleme

* **Rate Limiting & Caching (Vercel Edge Middleware + @upstash/ratelimit + Upstash Redis/Vercel KV):**
    * **Rolü:** Oran sınırlama mekanizması ve performans odaklı cache sistemi.
    * **Neden:** DDoS ve kaba kuvvet saldırılarını "edge"de (sunucuya ulaşmadan) engelleyerek sunucu performansını, maliyetini korur ve güvenliği artırır. Aynı Redis altyapısı API response'ları, database sorgularını ve user session'larını cache'leyerek performansı önemli ölçüde artırır.
    * **Nasıl Kullanılacak:** 
        - **Rate Limiting:** Projenin ana dizinindeki `middleware.ts` dosyası içinde `@upstash/ratelimit` kütüphanesi ve Vercel KV (veya Upstash Redis) kullanılarak IP bazlı veya kullanıcı bazlı oran sınırlama mantığı uygulanacak.
        - **Caching:** Aynı Redis instance'ı kullanılarak API yanıtları, database sorgu sonuçları, user session'ları ve static content cache'lenecek. Hibrit cache stratejisi ile Next.js built-in cache ile birlikte kullanılacak.
* **Vercel Web Analytics (@vercel/analytics/next):**
    * **Rolü:** Web sitesi kullanım metriklerini ve temel kullanıcı davranışlarını izleme.
    * **Neden:** Hafif, kolay entegre olan ve performans dostu bir analiz çözümü sunar.
    * **Nasıl Kullanılacak:** `app/layout.tsx` dosyasına `<Analytics />` bileşeni eklenerek entegre edilecek.
* **Vercel Speed Insights (@vercel/speed-insights/next):**
    * **Rolü:** Uygulamanın gerçek kullanıcı deneyimi metriklerini (Core Web Vitals gibi) izleme.
    * **Neden:** Detaylı performans analizi sağlar, kullanıcı deneyimi üzerindeki etkileri anlamaya yardımcı olur.
    * **Nasıl Kullanılacak:** `app/layout.tsx` dosyasına `<SpeedInsights />` bileşeni eklenerek entegre edilecek.
* **Sentry:**
    * **Rolü:** Hata izleme ve Uygulama Performans Yönetimi (APM).
    * **Neden:** Canlı ortamda oluşabilecek hataları gerçek zamanlı olarak yakalar, detaylı bilgi sunar ve performans darboğazlarını izlemeye yardımcı olur.
    * **Nasıl Kullanılacak:** `sentry.client.config.js`, `sentry.server.config.js`, `sentry.edge.config.js` gibi Next.js'e özel konfigürasyon dosyaları ile entegre edilecek. Hata yakalama ve performans izleme için SDK'sı kullanılacak. (Canlıya geçerken entegre edilecek.)
* **Resend & React Email:**
    * **Rolü:** İşlemsel e-posta gönderimi (kayıt onayı, şifre sıfırlama vb.) ve e-posta şablonlarının React ile tasarımı.
    * **Neden:** Geliştirici dostu API, yüksek teslimat oranı ve React ile şablon tasarlama kolaylığı sunar.
    * **Nasıl Kullanılacak:** Resend API anahtarı `.env`'de saklanacak. Next.js API Routes içinde Resend SDK'sı kullanılarak e-posta gönderilecek. React Email bileşenleri ile şablonlar tasarlanacak ve `npx react-email@latest` CLI ile önizlenecek.

---

## 6. Diğer Önemli Alanlar ve Kullanım Amaçları

* **Hibrit Cache Sistemi (Redis/Vercel KV):**
    * **Amacı:** Çok katmanlı cache stratejisi ile maksimum performans sağlamak ve veritabanı yükünü azaltmak.
    * **3 Seviyeli Cache Mimarisi:**
        - **Seviye 1 (Next.js Built-in):** `fetch` otomatik cache, `unstable_cache`, `revalidateTag`
        - **Seviye 2 (Redis/KV):** API responses, database queries, user sessions
        - **Seviye 3 (React Query):** Client-side caching, background updates
    * **Nasıl Kullanılacak:**
        - `src/lib/cache/` klasöründe merkezi cache yönetimi
        - `src/constants/cache.ts` dosyasında cache key patterns ve TTL değerleri
        - `src/types/cache.ts` dosyasında TypeScript tip tanımları
        - Smart invalidation ile tag-based cache temizleme
        - Performance monitoring ile cache hit/miss oranları takibi
    * **Cache Key Stratejisi:** `cache:entity:identifier:params` formatında hierarşik key yapısı
* **Loglama (MongoDB Hibrit Sistemi):**
    * **Amacı:** Uygulama olaylarını (kullanıcı kaydı, anime ekleme, hatalar, önemli işlemler) kaydetmek ve takip etmek.
    * **Hibrit Yaklaşım:** Hem console'a hem de MongoDB'ye kayıt yapan ikili sistem.
    * **Nasıl Kullanılacak:** 
        - `src/lib/logger.ts` dosyasında merkezi logger konfigürasyonu
        - `src/lib/constants/logging.ts` dosyasında log sabitleri (seviyeler, event türleri, performance eşikleri)
        - `src/types/logging.ts` dosyasında TypeScript tip tanımları
        - Dahili MongoDB log tablosu (`Log` modeli) ile database kayıtları korunuyor
        - API Routes, Server Actions ve middleware'lerde `logError`, `logInfo`, `logAuth`, `logPerformance` gibi özel fonksiyonlar kullanılacak
        - Admin panelinde hem console logları hem de database logları görüntülenebilecek
* **Kullanıcı Geri Bildirim Sistemi:**
    * **Amacı:** Kullanıcıların sitede karşılaştıkları sorunları veya isteklerini kolayca raporlayabilmesi.
    * **Nasıl Kullanılacak:** İleride Sentry'nin kendi geri bildirim özellikleri veya özel bir form entegrasyonu ile (örn. bir `Feedback` modeli) sağlanabilir.
* **Ödeme Sistemleri (Stripe):**
    * **Amacı:** Premium Üyelik modeli için online ödeme altyapısı sağlamak.
    * **Nasıl Kullanılacak:** İleride Stripe SDK'sı ve API'leri kullanılarak ödeme akışları ve abonelik yönetimi entegre edilecek.
* **Arka Plan Görevleri (Vercel Cron Jobs):**
    * **Amacı:** Periyodik görevleri (örn. Anilist API'den veri güncelleme, haftalık bildirim e-postaları gönderme, eski verileri temizleme) otomatize etmek.
    * **Nasıl Kullanılacak:** Vercel paneli üzerinden belirli API Routes veya Server Actions'lar düzenli aralıklarla tetiklenecek.
* **Yapay Zeka (AI):**
    * **Kişiselleştirilmiş Öneri Sistemi:** AWS Personalize. Kullanıcı etkileşimleri ve anime/kullanıcı verileri Personalize'a gönderilecek, o da kişiselleştirilmiş anime öneri ID'leri döndürecek.
    * **Doğal Dil Arama:** Gemini API. Kullanıcıların doğal dil sorgularını anlayıp ilgili filtreleri çıkararak veritabanında arama yapmak için (ileride).
* **Arama ve Filtreleme Optimizasyonu:**
    * **Amacı:** Kullanıcıların anime veritabanında hızlı ve esnek arama yapmasını sağlamak.
    * **Nasıl Kullanılacak:** Başlangıçta MongoDB'nin kendi yetenekleri kullanılacak. Proje büyüdüğünde Algolia gibi bir "Search-as-a-Service" entegre edilebilir.
* **SEO Optimizasyonu:**
    * **Amacı:** Arama motorlarında daha iyi görünürlük ve organik trafik çekmek.
    * **Nasıl Kullanılacak:** Next.js `metadata` API (App Router) ile sayfa başlıkları, açıklamalar ve Open Graph etiketleri yönetilecek. SSG/SSR kullanılarak arama motoru botlarının içeriği kolayca indekslemesi sağlanacak. Sitemap oluşturma ve JSON-LD yapılandırılmış veri ekleme (ileride) değerlendirilecek.

---