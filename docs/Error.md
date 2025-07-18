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