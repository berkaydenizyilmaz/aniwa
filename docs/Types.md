Elbette Deniz, işte sana bu tip standartını kısaca anlatan ve herhangi bir AI'ın kolayca anlayıp uygulayabileceği bir doküman:

Aniwa Projesi: TypeScript Tip Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki TypeScript tip tanımlamalarının nasıl organize edileceği ve kullanılacağına dair standartları belirtir. Amacımız, kod tabanında tutarlılığı, okunabilirliği, tip güvenliğini sağlamak ve gelecekteki geliştirmeleri (özellikle AI işbirliğini) kolaylaştırmaktır.

1. Genel Prensipler

    Tek Kaynak (Single Source of Truth): Bir tip birden fazla yerde tanımlanmamalıdır.

    Modülerlik: Tipler, mantıksal sorumluluklarına göre gruplandırılmalıdır.

    Okunabilirlik: Tiplerin amacı ve içeriği isminden ve konumundan anlaşılmalıdır.

    Gerektiği Kadar (Just Enough): Aşırı karmaşıklık yaratmaktan kaçınılmalı, ancak any tipi kullanılmamalıdır.

    Uçtan Uca Tip Güvenliği: Mümkün olan her yerde tip güvenliği sağlanmalıdır.

2. Klasör Yapısı (src/lib/types/ altında)

Tüm özel tip tanımlamaları src/lib/types/ ana klasörü altında, belirli kategorilere göre alt klasör ve dosyalara ayrılır:

src/
├── lib/
│   ├── types/
│   │   ├── index.d.ts          # GLOBAL: Proje genelinde kullanılan çok temel/yardımcı tipler. Diğer tüm tip dosyalarını buradan dışarıya aktarır (export * from './api/auth.api'; gibi).
│   │   │
│   │   ├── api/                # API İSTEK/YANITLARI: Tüm API endpoint'lerinin istek gövdesi ve yanıt objelerinin tipleri için bir klasör.
│   │   │   ├── auth.api.d.ts   # Kimlik doğrulama API'leri (login, register vb.)
│   │   │   ├── user.api.d.ts   # Kullanıcı yönetimi API'leri (profil güncelleme vb.)
│   │   │   ├── anime.api.d.ts  # Anime içeriği API'leri (detay çekme, listeleme vb.)
│   │   │   └── ... (diğer API kategorileri: list.api.d.ts, comment.api.d.ts vb.)
│   │   │
│   │   ├── db/                 # VERİTABANI MODELLERİ: Prisma'nın ürettiği tiplerin özel genişletmeleri ve kompozisyonları (ilişkileri dahil edilmiş modeller).
│   │   │   ├── user.d.ts       # Kullanıcı modeline ait DB tipleri (örn. UserWithSettings)
│   │   │   ├── anime.d.ts      # Anime içeriği modellerine ait DB tipleri (örn. AnimeSeriesWithDetails)
│   │   │   ├── list.d.ts       # Liste modellerine ait DB tipleri (örn. UserAnimeListWithProgress)
│   │   │   ├── social.d.ts     # Sosyal etkileşim modellerine ait DB tipleri (örn. UserFollowDetails)
│   │   │   ├── system.d.ts     # Sistem modellerine ait DB tipleri (örn. LogDetails, NotificationWithUser)
│   │   │   └── ... (diğer DB kategorileri)
│   │   │
│   │   ├── auth.d.ts           # KİMLİK DOĞRULAMA: Auth.js (NextAuth.js) session genişletmeleri ve auth ile ilgili temel tipler.
│   │   └── ... (İhtiyaç halinde yeni ana kategoriler)
│   │
│   └── ... (diğer lib klasörleri)

3. Tip Tanımlama Teknikleri ve Kullanım Sırası

    Prisma Tarafından Üretilen Tipler (En Temel):

        @prisma/client'tan gelen User, AnimeSeries, Prisma.UserCreateInput gibi temel model tipleri doğrudan import edilerek kullanılmalıdır. Bu tipler manuel olarak yazılmaz.

    Zod Şemalarından Türetilen Tipler (z.infer):

        src/lib/schemas/ altında tanımlanan Zod validasyon şemalarından, z.infer<typeof mySchema> kullanılarak tipler çıkarılır.

        Bu tipler, API isteği gövdeleri veya form verileri gibi yerlerde kullanılır ve ilgili api/ altındaki .d.ts dosyalarına yerleştirilir.

    Özel Genişletilmiş Tipler (Composition/Extension):

        Prisma'dan gelen tipleri veya diğer temel tipleri genişleterek veya birleştirerek daha kompleks tipler oluşturulur.

        Örnek: UserWithSettings = User & { userSettings: UserProfileSettings | null }; (Bu tip db/user.d.ts içinde yer alır.)

        Bu tipler, ilgili model grubunun .d.ts dosyasına (örn. db/user.d.ts, db/anime.d.ts) yerleştirilir.

    interface ve type Kullanımı:

        Genel kural olarak, objelerin yapısını tanımlarken interface kullanın.

        Daha karmaşık tipler (birleşim, kesişim tipleri veya basit tip alias'ları) için type kullanın.

4. Önemli Notlar

    any Tipi kullanımı tamamen YASAK!

    Dosya Boyutu Yönetimi: Başlangıçtan itibaren mantıksal bölümlendirme yapıldığı için, dosyaların aşırı şişmesi engellenir. Ancak bir alt dosya bile aşırı büyürse (örn. 300 satırı geçerse), kendi içinde daha mantıksal alt bölümlere ayrılması değerlendirilebilir.

    Tutarlı İsimlendirme: Tip isimleri, neyi temsil ettiklerini açıkça belirtmelidir (örn. Request veya Response sonekleri API tiplerinde).