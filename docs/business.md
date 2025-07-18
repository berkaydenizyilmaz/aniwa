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
│           ├── masterData.business.ts # Genre, Tag, Studio gibi master data yönetimi (varsa kompleks logic)
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