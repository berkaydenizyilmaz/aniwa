Aniwa Projesi: Frontend Standardı (AI Rehberi)

Bu doküman, Aniwa projesinin frontend geliştirme süreçlerinde izlenecek temel prensipleri, yapılandırmaları ve kodlama kurallarını belirtir. Amacımız, tutarlı, okunabilir, performanslı ve sürdürülebilir bir frontend kod tabanı oluşturmaktır.

1. Komponent Yapısı ve Yerleşimi

Next.js App Router mimarisinin sağladığı esneklikle, komponentleri sorumluluklarına göre iki ana kategoriye ayırıyoruz:

    Global/Paylaşımlı Komponentler (src/components/): Uygulama genelinde, farklı bölümlerde tekrar kullanılan, genel amaçlı ve yeniden kullanılabilir (reusable) bileşenler buraya yerleşir.

        src/components/ui/: shadcn/ui'dan türetilen veya özel olarak yazdığınız temel UI elemanları (örn. Button.tsx, Input.tsx, Card.tsx).

        src/components/shared/: Proje genelinde kullanılan daha spesifik ama jenerik bileşenler (örn. AnimeCard.tsx, UserAvatar.tsx, Pagination.tsx).

        src/components/layouts/: Uygulamanın farklı ana düzenleri (örn. MainLayout.tsx, AdminLayout.tsx).

    Rota Bazlı/Özel Komponentler (app/rota_adı/_components/): Belirli bir rotaya veya özelliğe sıkı sıkıya bağlı olan, başka bir yerde doğrudan yeniden kullanılması beklenmeyen bileşenler, ilgili rotanın altında _components klasöründe tutulur.

        Örnek: src/app/admin/genres/_components/GenreForm.tsx, src/app/profil/[username]/_components/ProfileHeader.tsx.

2. Server Components ve Client Components Kullanımı

Next.js App Router'ın ana gücü olan bu ayrımı bilinçli kullanıyoruz:

    Server Components (Varsayılan):

        Dosyanın en üstünde "use client"; direktifi içermezler.

        Sunucuda çalışırlar, doğrudan src/lib/services/business/ katmanındaki fonksiyonları çağırabilirler (DB erişimi dolaylı yoldan).

        Veri çekme, statik içerik render etme ve SEO gerektiren sayfalar için idealdir. Sayfalarınızın çoğu (page.tsx) Server Component olacaktır.

    Client Components ("use client";):

        Dosyanın en üstünde "use client"; direktifi ile başlarlar.

        Tarayıcıda çalışırlar, interaktif özellikler (useState, useEffect, onClick gibi hook'lar ve event listener'lar) sağlarlar.

        Sunucuya veri çekmek veya göndermek için API endpoint'lerine (/api/...) veya Server Actions'a ihtiyaç duyarlar.

        Ne Zaman Kullanılır: Kullanıcı etkileşimi (formlar, dinamik filtreler, butonlar, anlık state yönetimi) gerektiren her yer.

3. Veri Çekme (Data Fetching) ve Durum Yönetimi

    React Query (TanStack Query):

        API'lerden çekilen asenkron verilerin (sunucu durumu) yönetimi için kullanılır. Veri cache'leme, arka planda güncelleme, loading/error durumları için idealdir.

        Client Components içinde: useQuery ve useMutation hook'ları ile app/api/... endpoint'lerine istek atılır.

        Server Components içinde: React Query'ye gerek yoktur, doğrudan business katmanı fonksiyonları çağrılır.

    Zustand:

        Basit, hafif ve global uygulama durumlarının (örn. kullanıcı oturum bilgileri, tema ayarları, global bildirimler) yönetimi için kullanılır. React Query'nin yönetmediği, uygulamanın farklı yerlerinde erişilmesi gereken durumlar için uygundur.

4. Form Yönetimi ve Validasyon

    React Hook Form ve Zod: Form verilerini yönetmek ve validasyon yapmak için birlikte kullanılır.

        Zod: Form şemalarını tanımlar ve güçlü, tip güvenli validasyon kuralları sağlar.

        React Hook Form: Form durumunu performanslı bir şekilde yönetir, Zod ile entegre olur (zodResolver).

        Gönderim: Form gönderimleri genellikle Server Actions aracılığıyla yapılır. Bu sayede, Client Component'teki formdan gelen veri, Server Action içinde doğrulanıp (Zod ile) direkt business katmanına iletilir.

5. Tip, Sabit ve Şema Kullanımı

    Mevcut Backend Yapılarını Yeniden Kullanma: Backend için tanımladığınız tüm tip, sabit ve şemalar (örn. src/lib/types/, src/lib/schemas/, src/lib/constants/) frontend'de de (özellikle Client Components ve Server Actions'da) doğrudan import edilerek kullanılabilir. Bu, uçtan uca tip güvenliği ve tutarlılık sağlar.

        Örnek: src/lib/schemas/genre.schema.ts'teki Zod şemasını hem API handler'ında hem de frontend form validasyonunda kullanmak.

6. Kod Stili ve Performans Kuralları

    TypeScript Odaklılık: Uçtan uca tip güvenliği için her zaman TypeScript kullanılır. any tipi kullanımı kesinlikle yasaktır.

    Fonksiyonel Komponentler: Tüm React bileşenleri fonksiyonel olarak yazılır.

    Hooks Kullanımı: useEffect, useState, useCallback, useMemo gibi hook'lar bilinçli ve gerektiği yerde kullanılır. Performans optimizasyonları için useCallback ve useMemo tercih edilebilir.

    Modüler İçe Aktarımlar: Sadece ihtiyaç duyulan fonksiyonlar veya bileşenler içe aktarılır, tüm kütüphane değil.

    Tailwind CSS: Stillendirme için ana araçtır. Komponentlere doğrudan className ile uygulanır. Aşırı derin nesting'den kaçınılır.

    Görüntü Optimizasyonu: next/image bileşeni, görüntülerin otomatik optimizasyonu (boyutlandırma, formatlama, lazy loading) için her zaman kullanılır.

    Kod Bölümleme (Code Splitting): Next.js App Router ve dinamik importlar sayesinde otomatik kod bölümleme avantajlarından yararlanılır.

    Erişilebilirlik (Accessibility - A11y): Semantik HTML etiketleri kullanılır, klavye navigasyonu ve ekran okuyucuları için uygun aria- nitelikleri eklenir. shadcn/ui bu konuda iyi bir başlangıç noktasıdır.