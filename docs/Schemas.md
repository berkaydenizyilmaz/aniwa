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