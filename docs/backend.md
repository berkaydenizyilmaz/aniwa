Aniwa Projesi: API Katmanı (app/api/) Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki API Katmanı'nın (Endpoint Handler'lar) nasıl yapılandırılacağını ve kullanılacağını açıklar.

1. Genel Prensipler ve Amacı

    Giriş Noktası: Uygulamanın dış dünyadan gelen HTTP isteklerini karşılar ve yanıtları döndürür.

    İnce (Thin) Katman: İş mantığı veya veritabanı erişimi içermez. Sadece business/ katmanındaki fonksiyonları çağırır.

    API Sözleşmesi: Frontend ve mobil uygulama gibi tüketiciler için net bir API sözleşmesi (request/response formatları, HTTP durum kodları) sağlar.

    Güvenlik Bariyeri: Gelen isteklerin ilk doğrulama ve yetkilendirme noktasıdır.

2. Klasör Yapısı (src/app/api/ altında)

API rotaları, src/app/api/ klasörü altında, ilgili iş alanlarına ve URL yapılarına göre düzenlenir.

src/
├── app/
│   ├── api/                  # Tüm HTTP API rotaları burada bulunur
│   │   ├── auth/             # Kimlik doğrulama API'leri
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── check-username/route.ts
│   │   │   └── ... (diğer auth endpoint'leri)
│   │   ├── admin/            # Yönetim paneli API'leri (yetkilendirme kontrolü daha katıdır)
│   │   │   ├── users/route.ts
│   │   │   ├── anime/route.ts
│   │   │   └── ...
│   │   ├── anime/            # Anime içeriği (detay çekme, listeleme) ile ilgili API'ler
│   │   │   └── route.ts
│   │   └── ... (diğer mantıksal gruplar ve endpoint'ler)
│   │
│   └── ... (diğer app klasörleri)

3. Fonksiyon Tanımlama Teknikleri ve Kullanımı

    Request ve Response Nesneleri:

        NextRequest (gelen istek) ve NextResponse (dönen yanıt) objeleri kullanılır.

    HTTP Metotları:

        Her route.ts dosyası, desteklediği HTTP metodları için (örn. GET, POST, PUT, DELETE, PATCH) ayrı bir async function export eder.

    Input Validasyon (Zod):

        Gelen her isteğin gövdesi (req.json()) veya URL parametreleri (new URL(req.url).searchParams), ilgili src/lib/schemas/ altındaki Zod şemaları kullanılarak doğrulanır. Bu, API katmanının temel sorumluluğudur.

        Validasyon hatası oluşursa (ZodError), hemen 400 Bad Request yanıtı dönülür.

    İş Mantığına Delege Etme:

        Tüm iş mantığı src/lib/services/business/ katmanına delege edilir. API handler'ları, business/ katmanındaki uygun fonksiyonu çağırır.

        API handler'ları asla doğrudan db/ veya external-api/ katmanlarını çağırmaz.

    Yetkilendirme (Authorization):

        Kimlik doğrulama (kullanıcının oturum açıp açmadığı) ve rol bazlı yetkilendirme (kullanıcının gerekli role sahip olup olmadığı) kontrolleri burada yapılır.

        Gerekirse, Auth.js tarafından sağlanan oturum bilgilerine erişilir.

        Yetkilendirme başarısız olursa, 401 Unauthorized veya 403 Forbidden yanıtı dönülür.

    Hata Yönetimi ve Yanıt Standardizasyonu (Güncellenmiş):

        Ortak Error Handler: Tüm API handler'ları, src/lib/utils/api-error-handler.ts içindeki handleApiError() fonksiyonunu kullanır.

        try-catch blokları kullanarak hatalar yakalanır ve handleApiError() fonksiyonuna iletilir.

        ZodError: Input validasyon hataları yakalanır ve formatZodErrors() fonksiyonu ile frontend-friendly düz formata çevrilir. HTTP 400 Bad Request yanıtı döner.

        BusinessError (ve Alt Sınıfları): business/ katmanından fırlatılan BusinessError (veya alt sınıfları) yakalanır. ERROR_CODES constants'ları kullanılarak uygun HTTP durum kodu belirlenir:
            - 4XX Client Errors: VALIDATION_ERROR (400), UNAUTHORIZED (401), NOT_FOUND (404), CONFLICT (409), RATE_LIMIT_EXCEEDED (429)
            - 5XX Server Errors: EXTERNAL_SERVICE_ERROR (502)
            - Genel: INVALID_TOKEN, USER_BANNED, UNKNOWN_ERROR (400)

        Beklenmedik Diğer Hatalar: API katmanı içinde oluşan ve ZodError veya BusinessError olmayan tüm beklenmedik runtime hataları yakalanır. Bu hatalar console.error() ile loglanır ve genel bir 500 Internal Server Error yanıtı döner.

        Yanıt Formatı: Tüm yanıtlar NextResponse.json() kullanılarak JSON formatında döndürülür ve ApiResponse tipine uygun olur.

        Kullanım Örneği:
        ```typescript
        try {
          const validatedData = schema.parse(body);
          const result = await businessFunction(validatedData);
          return NextResponse.json(result, { status: 201 });
        } catch (error) {
          return handleApiError(error);
        }
        ```


Aniwa Projesi: İş Mantığı Katmanı (lib/services/business/) Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki İş Mantığı Katmanı'nın (BLL) nasıl yapılandırılacağını ve kullanılacağını açıklar.

1. Genel Prensipler ve Amacı

    Uygulama Kalbi: Uygulamanın temel iş kurallarını, süreçlerini ve senaryolarını içerir.

    Orkestrasyon: db/ katmanındaki atomik veritabanı operasyonlarını ve external-api/ katmanındaki dış servis çağrılarını bir araya getirerek daha büyük iş hedeflerine ulaşır.

    İş Kuralı Uygulama: Uygulamanın benzersiz iş kurallarını (örn. "kullanıcı adı zaten kullanımda mı?", "kullanıcı bu işlemi yapmaya yetkili mi?") uygular ve doğrular.

    Transaction Yönetimi: Birden fazla veritabanı operasyonunun atomik (bölünmez) olmasını gerektiren karmaşık iş akışları için Prisma Transaction'larını başlatır ve yönetir.

    Veritabanı/Dış API Bilgisi Yok: Doğrudan HTTP istekleri, yanıtları veya veritabanı bağlantı detayları hakkında bilgi sahibi değildir. Sadece db/ ve external-api/ katmanlarındaki soyutlanmış fonksiyonları kullanır.

2. Klasör Yapısı (src/lib/services/business/ altında)

src/lib/services/business/ klasörü altında, her ana iş alanı veya ilgili fonksiyon grubu için ayrı .ts dosyaları tutulur:

src/
├── lib/
│   └── services/
│       └── business/             # İş Mantığı Katmanı (BLL)
│           ├── auth.business.ts  # Kullanıcı kaydı, girişi, şifre yönetimi gibi kimlik doğrulama iş akışları
│           ├── user.business.ts  # Kullanıcı profili ve ayarlarını güncelleme gibi iş akışları
│           ├── anime.business.ts # Anime serisi oluşturma (nested writes), anime arama/filtreleme gibi iş akışları
│           ├── list.business.ts  # Anime listelerine ekleme, ilerleme güncelleme, özel liste yönetimi gibi iş akışları
│           ├── comment.business.ts # Yorum yapma, yorum beğenme gibi iş akışları
│           ├── social.business.ts # Kullanıcı takibi, anime takibi gibi iş akışları
│           ├── notification.business.ts # Bildirim oluşturma ve gönderme (dahili) iş akışları
│           └── ... (ihtiyaç halinde diğer mantıksal gruplar)
│
│   └── ... (diğer services klasörleri)

3. Fonksiyon Tanımlama Teknikleri ve Kullanımı

    Girdi Standardizasyonu:

        Fonksiyonlar, API katmanından (veya Server Actions'dan) Zod şemaları ile zaten doğrulanmış (validated) veriyi alır. Bu katman, temel format validasyonunu tekrar yapmaz.

        Parametreler için lib/schemas/ altındaki z.infer ile türetilmiş tipler kullanılır.

    Çıktı Standardizasyonu:

        Tüm iş katmanı fonksiyonları, standardize edilmiş ApiResponse<T> tipini döndürmelidir.

        Başarılı durumda: { success: true, data: T }

        Hata durumunda: { success: false, error: string; errorCode?: string; details?: any }

    Veritabanı Erişimi (db/ Katmanı Tüketimi):

        Tüm veritabanı operasyonları için lib/services/db/ katmanındaki fonksiyonlar çağrılır.

        PrismaClientOrTransaction tipi sayesinde, transaction içinde olan fonksiyonlara tx objesi, olmayanlara prisma objesi geçirilir.

    Dış API Erişimi (external-api/ Katmanı Tüketimi):

        Dış servislerle etkileşim gerektiğinde lib/services/external-api/ katmanındaki fonksiyonlar çağrılır.

    İş Kuralı Validasyonu:

        Burada veritabanı sorguları (findUserByEmail, findUserByUsername) veya karmaşık mantık gerektiren iş kuralları doğrulanır.

        İhlal durumunda BusinessError veya alt sınıfları fırlatılır.

    Transaction Yönetimi:

        Bir iş akışı birden fazla db/ katmanı operasyonunu içeriyorsa ve bu operasyonların atomik olması gerekiyorsa, prisma.$transaction() burada başlatılır. tx (transaction client) objesi, transaction kapsamındaki db/ katmanı fonksiyonlarına geçirilir.

    Hata Yönetimi ve Loglama:

        db/ katmanından gelen hataları yakalar ve loglar. Bu hatalar, BusinessError'a (veya alt sınıflarına) dönüştürülerek fırlatılır.

        Kendi iş kurallarını ihlal eden durumlar için BusinessError veya alt sınıflarını (örn. NotFoundError, ConflictError, UnauthorizedError) fırlatır.

        Fırlatılan tüm BusinessError'ları logError ile merkezi log sistemine loglar (bu loglar Adminin göreceği Log modeline gider).

        Başarılı iş akışlarının veya önemli aşamalarının bilgilerini logInfo ile loglar (bu loglar da Log modeline gider).



Aniwa Projesi: Veritabanı Erişim Katmanı (lib/services/db/) Standardı (Saf CRUD Versiyon - AI Rehberi)

Bu doküman, Aniwa projesindeki Veritabanı Erişim Katmanı'nın (DAL) nasıl yapılandırılacağını ve kullanılacağını açıklar. Bu katman, veritabanı etkileşimlerinin en temel seviyesidir ve sadece saf CRUD operasyonları içerir.

1. Genel Prensipler ve Amacı

    Veritabanı Soyutlama: Uygulamanın geri kalanını doğrudan veritabanı etkileşimlerinden soyutlar.

    Tek Sorumluluk: Her dosya, belirli bir modelin veya model grubunun doğrudan veritabanı operasyonlarından (CRUD: Create, Read, Update, Delete) sorumludur.

    İş Mantığı Yok: Kesinlikle hiçbir iş mantığı, iş kuralı validasyonu veya karmaşık çok adımlı işlem akışı içermez. Bu tür mantıklar business/ katmanına aittir.

    "Thin" Katman: Mümkün olduğunca ince ve sadece Prisma sorgularını içerir.

    Hata Yakalama Yok: Bu katman, hiçbir hata yakalama (try-catch) içermez. Hatalar üst katmanlarda (business/ katmanında) yakalanır ve işlenir.

2. Klasör Yapısı (src/lib/services/db/ altında)

src/lib/services/db/ klasörü altında, her ana model veya mantıksal model grubu için ayrı .ts dosyaları tutulur:

src/
├── lib/
│   └── services/
│       └── db/                 # Veritabanı Erişim Katmanı (DAL)
│           ├── user.db.ts      # User modeli için CRUD
│           ├── userProfileSettings.db.ts # UserProfileSettings modeli için CRUD
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

    Hata Yönetimi (Bu Katmanda - Yok):

        Bu katman hiçbir hata yakalama (try-catch) içermez.

        Prisma'dan gelen tüm hatalar (PrismaClientKnownRequestError, PrismaClientUnknownRequestError vb.) doğrudan business/ katmanına iletilir.

        Hataların yakalanması, dönüştürülmesi ve loglanması sorumluluğu tamamen business/ katmanına aittir.

    Model Ayrımı:

        Her model için ayrı dosya tutulur (örn. user.db.ts, userProfileSettings.db.ts).

        İlişkili modeller aynı dosyada tutulabilir ancak her modelin kendi CRUD fonksiyonları olmalıdır.

        update fonksiyonları sadece kendi modelini günceller, ilişkili modelleri include etmez.