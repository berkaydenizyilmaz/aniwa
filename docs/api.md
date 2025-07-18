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

    Hata Yönetimi ve Yanıt Standardizasyonu (Son Güncelleme):

        try-catch blokları kullanarak hatalar yakalanır.

        ZodError: Input validasyon hataları yakalanır ve kullanıcıya spesifik mesajlarla (HTTP 400 Bad Request) döner. (Bu aşamada loglanmaz, loglama sorumluluğu Business katmanındadır.)

        BusinessError (ve Alt Sınıfları): business/ katmanından fırlatılan BusinessError (veya alt sınıfları) yakalanır. Bu hatalar business katmanında zaten loglandığı için, API katmanında tekrar loglanmaz. Hatanın code'una bakılarak uygun HTTP durum kodu (404, 409, 401/403, 400) belirlenir ve standardized JSON yanıtı (ApiResponse formatında) döner.

        Beklenmedik Diğer Hatalar: API katmanı içinde oluşan ve ZodError veya BusinessError olmayan tüm beklenmedik runtime hataları yakalanır. Bu hatalar bu aşamada API katmanında loglanmaz. Genel bir 500 Internal Server Error yanıtı döner.
        Yanıt Formatı: Tüm yanıtlar NextResponse.json() kullanılarak JSON formatında döndürülür ve ApiResponse tipine uygun olur.