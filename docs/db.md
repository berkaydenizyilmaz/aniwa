Aniwa Projesi: Veritabanı Erişim Katmanı (lib/services/db/) Standardı (Loglamasız Versiyon - AI Rehberi)

Bu doküman, Aniwa projesindeki Veritabanı Erişim Katmanı'nın (DAL) nasıl yapılandırılacağını ve kullanılacağını açıklar. Bu katman, veritabanı etkileşimlerinin en temel seviyesidir ve kendi içinde loglama yapmaz.

1. Genel Prensipler ve Amacı

    Veritabanı Soyutlama: Uygulamanın geri kalanını doğrudan veritabanı etkileşimlerinden soyutlar.

    Tek Sorumluluk: Her dosya, belirli bir modelin veya model grubunun doğrudan veritabanı operasyonlarından (CRUD: Create, Read, Update, Delete) sorumludur.

    İş Mantığı Yok: Kesinlikle hiçbir iş mantığı, iş kuralı validasyonu veya karmaşık çok adımlı işlem akışı içermez. Bu tür mantıklar business/ katmanına aittir.

    "Thin" Katman: Mümkün olduğunca ince ve sadece Prisma sorgularını içerir.

    Loglama Yok: Bu katman, kendi içinde logError gibi bir loglama fonksiyonu çağırmaz. Hatalar üst katmanlarda loglanır.

2. Klasör Yapısı (src/lib/services/db/ altında)

src/lib/services/db/ klasörü altında, her ana model veya mantıksal model grubu için ayrı .ts dosyaları tutulur:

src/
├── lib/
│   └── services/
│       └── db/                 # Veritabanı Erişim Katmanı (DAL)
│           ├── user.db.ts      # User ve UserProfileSettings modelleri için CRUD
│           ├── anime.db.ts     # AnimeSeries, AnimeMediaPart, Episode modelleri için CRUD
│           ├── list.db.ts      # UserAnimeList, UserAnimePartProgress, FavouriteAnimeSeries, CustomList, CustomListItem modelleri için CRUD
│           ├── comment.db.ts   # Comment ve CommentLike modelleri için CRUD
│           ├── masterData.db.ts # Genre, Tag, Studio, StreamingPlatform modelleri için CRUD
│           ├── social.db.ts    # UserFollow ve UserAnimeTracking modelleri için CRUD
│           ├── system.db.ts    # Log ve Notification modelleri için CRUD
│           └── verificationToken.db.ts # VerificationToken modeli için CRUD
│
│   └── ... (diğer services klasörleri)

3. Fonksiyon Tanımlama Teknikleri ve Kullanımı

    Prisma Client Kullanımı:

        Tüm fonksiyonlar, lib/prisma.ts içinde tanımlanmış tekil PrismaClient instance'ını kullanır.

        prisma.modelName.method() şeklinde doğrudan Prisma Client metotları çağrılır.

    Transaction Uyumluluğu:

        Tüm db/ katmanı fonksiyonları, opsiyonel bir client: PrismaClientOrTransaction parametresi kabul etmelidir.

        Bu, fonksiyonların business/ katmanında başlatılan prisma.$transaction() içinden (tx objesi ile) veya transaction dışında (prisma objesi ile) güvenle çağrılmasını sağlar.

    Tip Güvenliği:

        Fonksiyon parametreleri ve dönüş tipleri için Prisma tarafından üretilen tipler (Prisma.ModelNameCreateInput, Prisma.ModelNameUpdateInput, ModelName) kullanılmalıdır.

    Temel CRUD Operasyonları:

        create(data): Tek bir kayıt oluşturur.

        findUnique(where): Belirli bir kritere göre tek bir kayıt bulur. include veya select ile ilişkili verileri dahil edebilir.

        findMany(where?, take?, skip?, orderBy?, include?): Birden fazla kayıt listeler, filtreler, sayfalar, sıralar.

        update(where, data): Belirli bir kaydı günceller.

        delete(where): Belirli bir kaydı siler.

        count(where?): Kayıt sayısını hesaplar.

    Hata Yönetimi (Bu Katmanda - Loglamasız):

        Bu katman, PrismaClientKnownRequestError gibi düşük seviyeli Prisma hatalarını yakalamalıdır.

        Yakalanan hataları, business/ katmanının işleyebileceği ve anlayabileceği yapılandırılmış Error objeleri (örn. BusinessError veya ConflictError) olarak yeniden fırlatmalıdır.

        Bu katmanda hiçbir logError çağrısı yapılmaz. Hatanın loglanması sorumluluğu tamamen business/ katmanına aittir.