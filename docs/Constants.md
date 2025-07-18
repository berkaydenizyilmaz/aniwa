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