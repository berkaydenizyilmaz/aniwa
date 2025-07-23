Elbette Deniz, belirttiğin noktaları dikkate alarak "Aniwa Projesi: Frontend Standardı (AI Rehberi)" dokümanını güncelleyelim. Özellikle shadcn/ui'nin öncelikli olduğunu, next/link kullanımını ve genel kod stili konularını netleştireceğim.

Aniwa Projesi: Frontend Standardı (AI Rehberi)

Bu doküman, Aniwa projesinin frontend geliştirme süreçlerinde izlenecek temel prensipleri, yapılandırmaları ve kodlama kurallarını belirtir. Amacımız, tutarlı, okunabilir, performanslı ve sürdürülebilir bir frontend kod tabanı oluşturmaktır.

1. Komponent Yapısı ve Yerleşimi

Next.js App Router mimarisinin sağladığı esneklikle, komponentleri sorumluluklarına göre özellik bazlı (feature-based) olarak organize ediyoruz:

    Özellik Bazlı Komponentler (src/components/modules/): Her özellik (feature) kendi klasörü altında organize edilir. Bu yaklaşım, ilgili komponentlerin bir arada tutulmasını ve kodun daha kolay bulunmasını sağlar.

        src/components/modules/auth/: Kimlik doğrulama ile ilgili tüm komponentler (LoginForm.tsx, RegisterForm.tsx, ForgotPasswordForm.tsx, AuthCard.tsx)

        src/components/modules/anime/: Anime ile ilgili komponentler (AnimeCard.tsx, AnimeList.tsx, AnimeFilter.tsx)

        src/components/modules/user/: Kullanıcı profili ile ilgili komponentler (UserProfile.tsx, UserAvatar.tsx, UserSettings.tsx)

        src/components/modules/admin/: Yönetim paneli komponentleri (AdminDashboard.tsx, GenreForm.tsx, UserManagement.tsx)

    Temel UI Komponentler (src/components/ui/): shadcn/ui'dan türetilen veya özel olarak yazılan temel UI elemanları (Button.tsx, Input.tsx, Card.tsx). Bu komponentler, projenin görsel kimliğini oluşturur ve tüm modüller tarafından kullanılır.

    Layout Komponentler (src/components/layout/): Uygulamanın farklı ana düzenleri (Header.tsx, Footer.tsx, Sidebar.tsx, AuthLayout.tsx).

    Provider Komponentler (src/components/providers/): Context provider'ları (ThemeProvider.tsx, QueryProvider.tsx, SessionProvider.tsx).

    Rota Bazlı Komponentler (app/rota_adı/_components/): Sadece belirli bir rotaya özel, başka yerde kullanılmayan komponentler için kullanılır. Mümkün olduğunca modules altına taşınmaya çalışılır.

        Örnek: src/app/admin/genres/_components/GenreForm.tsx → src/components/modules/admin/GenreForm.tsx

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

4. Server Actions ve Form Yönetimi

    Server Actions: Form gönderimleri ve sunucu işlemleri için Server Actions kullanılır. Bu yaklaşım, API endpoint'lerine ihtiyaç duymadan doğrudan sunucu fonksiyonlarını çağırmayı sağlar.

        Özellik Bazlı Organizasyon: Server Actions, özellik bazlı olarak organize edilir (src/lib/actions/).

            src/lib/actions/auth.action.ts: Kimlik doğrulama işlemleri (registerUser, forgotPassword, resetPassword)

            src/lib/actions/anime.action.ts: Anime ile ilgili işlemler (createAnime, updateAnime, deleteAnime)

            src/lib/actions/user.action.ts: Kullanıcı profili işlemleri (updateProfile, changePassword)

        Pattern: Her Server Action dosyası aşağıdaki pattern'i takip eder:

            ```typescript
            'use server';

            import { schema, type Input } from '@/lib/schemas/feature.schema';
            import { businessFunction } from '@/lib/services/business/feature.business';
            import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';

            export async function actionName(data: Input): Promise<ServerActionResponse> {
              try {
                // Zod validation
                const validatedData = schema.parse(data);

                // Business logic
                const result = await businessFunction(validatedData);

                return {
                  success: true,
                  data: result.data
                };

              } catch (error) {
                return handleServerActionError(error);
              }
            }
            ```

    Form Yönetimi ve Validasyon:

        React Hook Form ve Zod: Form verilerini yönetmek ve validasyon yapmak için birlikte kullanılır.

            Zod: Form şemalarını tanımlar ve güçlü, tip güvenli validasyon kuralları sağlar.

            React Hook Form: Form durumunu performanslı bir şekilde yönetir, Zod ile entegre olur (zodResolver).

            Gönderim: Form gönderimleri Server Actions aracılığıyla yapılır. Client Component'teki formdan gelen veri, Server Action içinde doğrulanıp (Zod ile) direkt business katmanına iletilir.

        Error Handling: Server Actions'dan dönen hatalar, form field'larına veya root error olarak gösterilir.

        Loading States: Form gönderimi sırasında loading state'leri yönetilir ve form field'ları disabled edilir.

5. Tip, Sabit ve Şema Kullanımı

    Mevcut Backend Yapılarını Yeniden Kullanma: Backend için tanımladığınız tüm tip, sabit ve şemalar (örn. src/lib/types/, src/lib/schemas/, src/lib/constants/) frontend'de de (özellikle Client Components ve Server Actions'da) doğrudan import edilerek kullanılabilir. Bu, uçtan uca tip güvenliği ve tutarlılık sağlar.

        Örnek: src/lib/schemas/auth.schema.ts'teki Zod şemasını hem API handler'ında hem de frontend form validasyonunda kullanmak.

6. Kod Stili ve Performans Kuralları

    TypeScript Odaklılık: Uçtan uca tip güvenliği için her zaman TypeScript kullanılır. any tipi kullanımı kesinlikle yasaktır.

    Fonksiyonel Komponentler: Tüm React bileşenleri fonksiyonel olarak yazılır.

    Component Naming: PascalCase + descriptive (LoginForm, AnimeCardList, UserProfileModal)
    
    File Naming: kebab-case (login-form.tsx, anime-card-list.tsx)
    
    Props Interface: Component name + Props suffix (LoginFormProps, AnimeCardProps)
    
    Hook Naming: use prefix + descriptive (useAuthForm, useAnimeList, useDebounce)
    
    Import Organization: React → External → Internal → Relative
    
    Component Structure: Hooks → Handlers → Effects → Render

    Performans Optimizasyonu - Pragmatik Yaklaşım:
        ✅ Her Zaman Gerekli: Key prop'ları, gereksiz re-render engelleme, bundle size kontrolü, image optimization
        🔍 Gerektiğinde: React.memo(), useCallback/useMemo, code splitting, virtualization
        📊 Ölçüm Önce: Chrome DevTools, React DevTools Profiler, Lighthouse ile performans sorunlarını tespit et
        🎯 Kural: Önce çalışır kod yaz, sonra gerektiğinde optimize et

    Hooks Kullanımı: 
        useCallback: Sadece gerçekten gerekli olan yerlerde (form submit, API call, async handler)
        useMemo: Heavy calculations ve expensive operations için
        useEffect: Bilinçli ve gerektiği yerde kullanılır
        Over-optimization'dan kaçınılır

    Modüler İçe Aktarımlar: Sadece ihtiyaç duyulan fonksiyonlar veya bileşenler içe aktarılır, tüm kütüphane değil.

    Tailwind CSS: Stillendirme için ana araçtır. Komponentlere doğrudan className ile uygulanır. Aşırı derin nesting'den kaçınılır.

    Görüntü Optimizasyonu: next/image bileşeni, görüntülerin otomatik optimizasyonu (boyutlandırma, formatlama, lazy loading) için her zaman kullanılır.

    Link Navigasyonu: İç linkler için daima next/link komponenti kullanılır. <a> etiketi yalnızca harici linkler veya next/link'in uygun olmadığı özel durumlarda (örneğin Server Actions ile form submit eden bir form içinde buton kullanırken) tercih edilir.

    Kod Bölümleme (Code Splitting): Next.js App Router ve dinamik importlar sayesinde otomatik kod bölümleme avantajlarından yararlanılır.

    Erişilebilirlik (Accessibility - A11y): Semantik HTML etiketleri kullanılır, klavye navigasyonu ve ekran okuyucuları için uygun aria- nitelikleri eklenir. shadcn/ui'nin komponentleri, bu konuda iyi bir başlangıç noktası ve A11y standartlarına uygun yapıdadır.

7. Okunabilir Kod Yazma Kuralları

    Çoklu Return Pattern: Koşullu render işlemlerinde, karmaşık ternary operatörler yerine çoklu return ifadeleri kullanılır. Bu yaklaşım kodun okunabilirliğini artırır ve bakımını kolaylaştırır.

        Örnek Kullanım:
        ```tsx
        // ❌ Karmaşık ternary operatör
        return (
          <div>
            {status === 'loading' ? (
              <LoadingSpinner />
            ) : session ? (
              <UserProfile user={session.user} />
            ) : (
              <LoginForm />
            )}
          </div>
        );

        // ✅ Çoklu return pattern
        if (status === 'loading') {
          return <LoadingSpinner />;
        }

        if (!session) {
          return <LoginForm />;
        }

        return <UserProfile user={session.user} />;
        ```

        Avantajları:
        - Daha net durum yönetimi
        - Daha kolay debug etme
        - Daha iyi performans (gereksiz re-render'ları önler)
        - Daha temiz kod yapısı
        - Daha kolay test edilebilirlik

    Erken Return (Early Return): Fonksiyonların başında edge case'leri kontrol edip erken return yapılır. Bu, nested if bloklarını azaltır ve kod akışını basitleştirir.

    Açıklayıcı Yorumlar: Her durum için kısa ve açıklayıcı yorumlar eklenir (örn. "Loading durumu", "Giriş yapmamış kullanıcı", "Giriş yapmış kullanıcı").

    Tutarlılık: Aynı pattern'i proje genelinde tutarlı bir şekilde uygulanır.

8. Performans ve Okunabilirlik Optimizasyonları

    Performans Optimizasyonu Stratejisi:
        📊 Ölçüm Tabanlı: Önce performans sorununu tespit et (DevTools, Profiler)
        🎯 Hedefli Optimizasyon: Sadece gerçek sorunları çöz
        ⚡ Temel Optimizasyonlar: Her zaman uygula (key props, image optimization)
        🚀 İleri Optimizasyonlar: Gerektiğinde uygula (memo, callback, virtualization)

    React.memo: Expensive components için kullanılır
    useCallback: Form handlers, API calls, async operations için
    useMemo: Heavy calculations ve complex data transformations için
    Function Separation: Karmaşık render logic'i ayrı function'lara bölünür
    Error Handling: Try-catch + console.error + double submission prevention
    Loading State: isLoading ile form field'ları disabled edilir
    CSS Classes: Ortak class'lar globals.css'te tanımlanır
    TypeScript: any tipi yasak, proper type definitions kullanılır
    Component Structure: Import → Hooks → Handlers → Render → Return

    Performans Kuralı: "Premature optimization is the root of all evil" - Önce çalışır kod, sonra optimize et!

Bu optimizasyonlar proje genelinde tutarlı şekilde uygulanır ve over-optimization'dan kaçınılır.

9. Tasarım Sistemi ve UI/UX Standartları

    shadcn/ui: Tüm temel UI bileşenleri shadcn/ui'dan türetilir
    Glassmorphism: Backdrop blur + yarı şeffaf arka planlar + smooth geçişler
    Renk Paleti: Primary (mavi), Secondary, Destructive (kırmızı), Muted, Border
    Responsive: Mobile-first + breakpoint'ler (sm, md, lg, xl) + flexible grid
    Animasyon: 
        CSS: Basit animasyonlar (fade, scale, pulse) ve background elementler
        Framer Motion: Kompleks animasyonlar, page transitions, micro-interactions
        Performans: CSS tercih edilir, gerektiğinde Motion kullanılır
    Form: Clean layout + inline validation + disabled state'ler
    Card: Consistent padding + subtle shadow + hover elevation
    Icon: Lucide React + consistent boyutlar + icon+text kombinasyonu
    Loading: Skeleton loading + consistent pattern'ler
    Error: User-friendly mesajlar + retry mekanizmaları
    A11y: Semantic HTML + ARIA + keyboard navigation + color contrast

Bu tasarım standartları tutarlı UX sağlar.

10. Proje Yapısı Örneği

    Özellik Bazlı Organizasyon Örneği:

    ```
    src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── giris/
    │   │   │   └── page.tsx                    # Sadece import
    │   │   └── kayit/
    │   │       └── page.tsx                    # Sadece import
    │   └── (main)/
    │       └── page.tsx
    ├── components/
    │   ├── modules/
    │   │   ├── auth/
    │   │   │   ├── auth-card.tsx               # Auth wrapper
    │   │   │   ├── login-form.tsx              # Login form
    │   │   │   ├── register-form.tsx           # Register form
    │   │   │   └── forgot-password-form.tsx    # Forgot password form
    │   │   ├── anime/
    │   │   │   ├── anime-card.tsx              # Anime card
    │   │   │   ├── anime-list.tsx              # Anime list
    │   │   │   └── anime-filter.tsx            # Anime filter
    │   │   └── user/
    │   │       ├── user-profile.tsx            # User profile
    │   │       └── user-avatar.tsx             # User avatar
    │   ├── ui/
    │   │   ├── button.tsx                      # shadcn/ui
    │   │   ├── input.tsx                       # shadcn/ui
    │   │   └── card.tsx                        # shadcn/ui
    │   ├── layout/
    │   │   ├── header.tsx                      # Header
    │   │   └── footer.tsx                      # Footer
    │   └── providers/
    │       ├── theme-provider.tsx              # Theme provider
    │       └── query-provider.tsx              # Query provider
    └── lib/
        ├── actions/
        │   ├── auth.action.ts                  # Auth actions
        │   ├── anime.action.ts                 # Anime actions
        │   └── user.action.ts                  # User actions
        ├── schemas/
        │   ├── auth.schema.ts                  # Auth schemas
        │   └── anime.schema.ts                 # Anime schemas
        └── services/
            └── business/
                ├── auth.business.ts            # Auth business logic
                └── anime.business.ts           # Anime business logic
    ```

    Bu yapı, kodun kolay bulunmasını, bakımını ve yeniden kullanılabilirliğini sağlar.