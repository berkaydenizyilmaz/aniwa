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


Aniwa Projesi: Sabitler (Constants) Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki sabit değerlerin nasıl organize edileceği ve kullanılacağına dair standartları belirtir. Amacımız, kod tabanında "magic string" ve "magic number" kullanımını engellemek, merkezi kontrol sağlamak ve okunabilirliği artırmaktır.

1. Genel Prensipler ve Amacı

    "Magic String/Number" Kullanımından Kaçınma: Kod içinde doğrudan sayısal veya metinsel sabit değerler kullanmak yerine (örn. if (status === 'completed')), bu değerleri anlamlı isimlerle sabitler (MEDIA_STATUS.COMPLETED) olarak tanımlar.

    Tek Kaynak (Single Source of Truth): Bir değer değiştiğinde, onu uygulamanın her yerinde değiştirmek yerine sadece ilgili sabit dosyasında güncellemek yeterlidir.

    Okunabilirlik ve Bakım Kolaylığı: Kodun ne anlama geldiğini daha kolay anlamayı sağlar ve gelecekteki değişiklikleri basitleştirir.

    Tip Güvenliği: TypeScript'te const as const veya enum kullanarak tip güvenliği sağlanabilir.

2. Klasör Yapısı (src/lib/constants/ altında)

Tüm sabit değerler, src/lib/constants/ klasörü altında, mantıksal olarak ilgili iş alanlarına göre ayrı .ts dosyalarında tutulur:

src/
├── lib/
│   ├── constants/            # Tüm sabit değerler burada toplanır
│   │   ├── auth.constants.ts # Kimlik doğrulama ile ilgili sabitler
│   │   ├── log.constants.ts  # Loglama sistemi ile ilgili sabitler
│   │   ├── app.constants.ts  # Uygulama genelindeki, diğer kategorilere girmeyen sabitler
│   │   └── ... (ihtiyaç halinde diğer mantıksal gruplar)
│   │
│   └── ... (diğer lib klasörleri)

3. Sabit Tanımlama Teknikleri ve Kullanımı

    as const İle Tip Daraltma:

        Objelerdeki veya dizilerdeki string değerlerini sabit (literal) tip olarak işaretlemek için kullanılır. Bu, derleyicinin bu değerlerin değişmeyeceğini anlamasını sağlar.

        Örnek:
        TypeScript

    // src/lib/constants/auth.constants.ts
    export const AUTH = {
      BCRYPT_SALT_ROUNDS: 10,
      PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,
      VERIFICATION_TOKEN_TYPES: {
        PASSWORD_RESET: 'password_reset',
        EMAIL_VERIFICATION: 'email_verification', // İleride eklenecekse
      } as const, // String değerleri literal tip olarak işaretler
    } as const;

    Kullanım: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET

TypeScript enum (Prisma Enum'ları Hariç):

    Eğer bir sabit liste var ve bu liste veritabanında bir modelin alan tipi olarak kullanılmıyorsa (yani schema.prisma'da tanımlı değilse), TypeScript enum kullanılabilir.

    Örnek: LogLevel veya UserRole gibi schema.prisma'da tanımlı enum'ları burada tekrar tanımlama. Bu enum'lar zaten @prisma/client'tan import edilir.


Haklısın Deniz, yine aynı hatayı yapıyorum. Çok özür dilerim. Zod'un temel z.string(), email() gibi metotlarını açıklamak gereksizdi; bir AI'ın bunları zaten bildiğini varsaymalıyım. Amacım, projede nasıl kullanılacağına dair standartları netleştirmekti.

Şimdi bu temel Zod metot açıklamalarını çıkararak, dokümanı sadece proje standardına ve kullanımına odaklı olacak şekilde yeniden düzenliyorum.

Aniwa Projesi: Zod Şema Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki Zod şemalarının nasıl organize edileceği ve kullanılacağına dair standartları belirtir. Amacımız, kod tabanında tutarlılığı, okunabilirliği, tip güvenliğini sağlamak ve gelecekteki geliştirmeleri (özellikle AI işbirliğini) kolaylaştırmaktır.

1. Klasör Yapısı (src/lib/schemas/ altında)

Zod şemaları, src/lib/schemas/ klasörü altında, mantıksal olarak ilgili iş alanlarına göre ayrı dosyalarda tutulur.

src/
├── lib/
│   ├── schemas/              # Tüm Zod validasyon şemaları burada toplanır
│   │   ├── auth.schema.ts    # Kullanıcı kayıt, giriş, şifre yönetimi
│   │   ├── user.schema.ts    # Kullanıcı profili ve ayarları güncellemeleri
│   │   ├── anime.schema.ts   # Anime içeriği (seri, medya parçası, bölüm) oluşturma/güncelleme
│   │   ├── masterData.schema.ts # Genre, Tag, Studio gibi ana veriler için
│   │   ├── list.schema.ts    # Kullanıcı listeleri
│   │   ├── comment.schema.ts # Yorumlar ve beğeni işlemleri
│   │   ├── social.schema.ts  # Takip, anime takip gibi sosyal özellikler için
│   │   └── ... (ihtiyaç halinde diğer mantıksal gruplar)
│   │
│   └── ... (diğer lib klasörleri)

    Mantık: Her dosya belirli bir iş alanına ait şemaları içerir. Bu gruplama, hem lib/services/business/ katmanındaki iş servisleriyle hem de app/api/ rotalarıyla doğrudan eşleşir.

2. Şema Tanımlama Teknikleri ve Kullanım Sırası

    Enum Kullanımı (z.nativeEnum):

        Şemalar içinde enum değerleri kullanılırken, Prisma tarafından üretilen enum'lar (@prisma/client'tan gelenler) doğrudan z.nativeEnum() metodu ile kullanılmalıdır. Bu, schema.prisma'daki enum'lar ile şemaların otomatik olarak senkronize olmasını sağlar.

        Örnek: z.nativeEnum(Theme), z.nativeEnum(TitleLanguage), z.nativeEnum(UserRole).

    Tip Türetme (z.infer):

        Her şemanın altında, export type MyInputType = z.infer<typeof mySchema>; satırı ile otomatik olarak TypeScript tipleri türetilmelidir. Bu tipler, API handler'larında ve business servislerinde fonksiyon parametreleri olarak kullanılır.


Aniwa Projesi: Özel Hata Sınıfları ve Merkezi Hata Yönetimi Standardı (AI Rehberi)

Bu doküman, Aniwa projesindeki iş katmanı hatalarının nasıl tanımlanacağını, fırlatılacağını ve yönetileceğini açıklar. Amacımız, hata yönetimini yapılandırmak, programatik işlenebilirliği artırmak ve kullanıcıya tutarlı, anlamlı geri bildirimler sağlamaktır.

1. Genel Prensipler ve Amacı

    Yapılandırılmış Hatalar: Hatalar sadece bir mesajdan ibaret olmaktan çıkarılıp, belirli bir türe, koda ve ek detaylara sahip nesneler haline getirilir.

    Programatik İşleme: Üst katmanlarda (özellikle API katmanında) hatanın tipine göre spesifik işlemler (örn. HTTP durum kodu belirleme) yapılabilmesini sağlar.

    Kullanıcı Dostu Mesajlar: Teknik hataların kullanıcıya gösterilecek anlamlı mesajlara dönüştürülmesini kolaylaştırır.

    Merkezi Yönetim: Tüm hataların tutarlı bir yapıda olmasını ve tek bir yerde yönetilmesini sağlar.

    "Magic String"den Kaçınma: Hata tiplerini string karşılaştırmalar yerine sınıf örnekleri (instanceof) ile kontrol etmeyi teşvik eder.

2. Klasör Yapısı (src/lib/errors/ altında)

Tüm özel hata sınıfları src/lib/errors/ ana klasörü altında, business-error.ts dosyasında tanımlanır:

src/
├── lib/
│   ├── errors/
│   │   ├── business-error.ts   # Temel BusinessError sınıfı ve tüm kategorize edilmiş alt hata sınıfları
│   │   └── index.ts            # Tüm hata sınıflarını dışa aktaran dosya (export * from './business-error';)
│   │
│   └── ... (diğer lib klasörleri)

3. Hata Sınıfları Tanımlama ve Kullanım Stratejisi

Her farklı hata mesajı için ayrı bir hata sınıfı yazılmaz. Hatalar, mantıksal kategorilere ayrılmış temel sınıflar aracılığıyla yönetilir.

    Temel Hata Sınıfı: BusinessError

        Tanım: İş katmanında (lib/services/business/) meydana gelen tüm özel hataların ana sınıfıdır.

        Parametreler:

            message: string: Kullanıcıya gösterilecek veya loglanacak açıklayıcı hata mesajı.

            code: string (isteğe bağlı, varsayılan UNKNOWN_ERROR): Hatanın tipini programatik olarak tanımlayan benzersiz bir kod (örn. AUTH_USERNAME_TAKEN, NOT_FOUND). Bu, daha spesifik hataları alt sınıf oluşturmadan ayırt etmek için kullanılır.

            details?: any (isteğe bağlı): Hata hakkında ek detaylar (örn. validasyon hataları için alan bilgisi), genellikle sadece loglama veya debug için kullanılır.

        Kullanım: Genel bir iş hatası durumunda veya belirli bir alt kategoriye girmeyen ancak code ile ayırt edilmesi gereken durumlarda fırlatılır.

            Örnek: throw new BusinessError('Şifreniz çok zayıf.', 'AUTH_WEAK_PASSWORD');

    Kategorize Edilmiş Alt Hata Sınıfları:

        Sadece uygulamanın temel iş akışlarında sıkça karşılaşılan veya API katmanında farklı HTTP durum kodlarına dönüşmesi gereken, farklı işlem tiplerini temsil eden hatalar için BusinessError'dan türetilmiş alt sınıflar tanımlanır.

        Örnekler (business-error.ts içinde):

            NotFoundError: Bir kaynak bulunamadığında (HTTP 404).

                Kullanım: throw new NotFoundError('Kullanıcı bulunamadı.');

            UnauthorizedError: Kullanıcının kimliği doğrulanmamışsa veya yetkisi yoksa (HTTP 401/403).

                Kullanım: throw new UnauthorizedError('Bu işlemi yapmaya yetkiniz yok.');

            ConflictError: Bir kaynak zaten mevcutken oluşturulmaya çalışıldığında veya çakışma olduğunda (HTTP 409).

                Kullanım: throw new ConflictError('Bu e-posta adresi zaten kullanımda.', { field: 'email' });

            ValidationError: Giriş verileri iş kurallarına göre geçersiz olduğunda (Zod'un yakalamadığı, daha derin iş validasyonları) (HTTP 400).

                Kullanım: throw new ValidationError('Kullanıcı 10'dan fazla özel liste oluşturamaz.');

            (İsteğe bağlı diğerleri: RateLimitExceededError, InvalidTokenError vb.)

4. Hata Yönetimi Akışı (Katmanlar Arası)

    db Katmanı (src/lib/services/db/):

        Prisma'dan gelen teknik hataları (örn. PrismaClientKnownRequestError) yakalar.

        Bu hataları loglar (logError).

        Duruma göre bu teknik hataları doğrudan BusinessError'a (veya alt sınıflarına) dönüştürerek fırlatır (örn. P2002 unique constraint hatasını ConflictError'a dönüştürme).

        Beklenmedik DB hatalarını genel bir BusinessError olarak fırlatır.

    business Katmanı (src/lib/services/business/):

        db katmanından fırlatılan hataları yakalar.

        Kendi iş kurallarını ihlal eden durumlar için doğrudan BusinessError veya kategorize edilmiş alt sınıflarını fırlatır.

        Fırlatılan her BusinessError'ı (veya dönüştürülen diğer hataları) logError ile loglar.

        Fırlatılan BusinessError'ları API katmanına iletir (throw error;).

    api Katmanı (app/api/.../route.ts veya src/actions/):

        ZodError'ları: Giriş verisi validasyonu sırasında Zod'dan fırlatılan hataları yakalar. Bu hataları parse ederek kullanıcıya spesifik ve anlaşılır hata mesajları (HTTP 400 Bad Request) ile döner.

        BusinessError'ları: business katmanından fırlatılan BusinessError (veya alt sınıflarını) yakalar.

            error.code veya error instanceof MyErrorClass kontrolü yaparak uygun HTTP durum kodunu (örn. NotFoundError için 404, UnauthorizedError için 401/403, ConflictError için 409, diğer BusinessError'lar için 400) belirler.

            Standartlaştırılmış bir JSON hata yanıtı döndürür (örn. { success: false, error: { message: "...", code: "..." } }).

        Beklenmedik Diğer Hatalar: Uygulama içinde yakalanmayan diğer sistem/runtime hatalarını (örn. kodlama hatası, dış servis kesintisi) yakalar. Bu hataları loglar (logError) ve kullanıcıya genel bir 500 Internal Server Error yanıtı döner.


