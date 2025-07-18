Aniwa Projesi: Kapsamlı Genel Bakış (Güncel Teknik Yığın ve Odaklı Mimari)

Proje Adı: Aniwa

1. Projenin Temel Fikri ve Amacı

    Problem Tanımı: Mevcut popüler anime takip siteleri (MyAnimeList, Anilist vb.), bir animenin her sezonunu, filmini veya özel bölümünü ayrı birer girdi olarak listelemektedir. Bu durum, bir seriyi hikayesel bir bütün olarak takip etmeyi ve genel bir değerlendirme yapmayı zorlaştırmaktadır. Kullanıcılar, tek bir serinin farklı parçalarını ayrı ayrı yönetmek zorunda kalmaktadır.

    Aniwa'nın Çözümü: Aniwa, bu problemi çözmek için animeleri tek bir ana başlık altında toplayacaktır. Bir serinin tüm sezonları ve ana hikayenin devamı niteliğindeki (canon) filmler/özel bölümler bu ana başlığın altında, kronolojik izleme sırasına göre (AnimeMediaPart.displayOrder ile) düzenli bir şekilde sunulacaktır. Kullanıcılar, serinin tüm canon parçalarını kolayca görebilecek, yönetebilecek ve doğru izleme akışını takip edebilecektir.

        Kullanıcılar, serinin geneline ayrı bir puan verebileceklerdir.

        Her bir sezona veya ana hikayenin parçası olan filme/özel bölüme ayrı ayrı puan verilebilecek ve izleme ilerlemesi takip edilebilecektir.

        Bu yaklaşım, kullanıcıların karmaşık anime serilerini daha kolay takip etmesini, yönetmesini ve değerlendirmesini sağlar. Spin-off'lar veya ana hikayeye doğrudan dahil olmayan ancak bağlantılı içerikler ise "ilişkili seriler" (AnimeSeries.relatedTo) olarak ayrıca belirtilecektir.

2. Ana Özellikler

Aniwa, temel takip işlevselliğinin yanı sıra zengin bir topluluk ve etkileşim platformu olmayı hedeflemektedir:

    Anime Takip ve Listeleme:

        Kişisel anime listeleri (AniwaList): İzleniyor, Planlandı, Tamamlandı vb. durum takibi.

        Anime serisinin geneline ve her bir medya parçasına (sezon, ana hikaye filmi) ayrı ayrı puanlama ve izleme ilerlemesi takibi.

        Favori anime listesi (kişisel sıralama ve gizlilik ayarları ile).

        Kullanıcının kendi oluşturabileceği özel listeler (public/private ayarları ve liste içi sıralama ile).

        Bölümlere özel filler (dolgu) bölüm işaretlemesi ve notları.

    Kullanıcı Yönetimi:

        Kayıt, giriş.

        Kişisel profil sayfası (biyografi, profil resmi, banner).

        Detaylı kullanıcı ayarları: Tema, dil, başlık dili, yetişkin içerik gösterimi, puanlama formatı.

        Gelişmiş gizlilik ayarları (profil görünürlüğü, liste paylaşımları).

        Site içi bildirim tercihleri.

    İçerik Zenginleştirme:

        Anime serileri, medya parçaları ve bölümler için izleme platformu yönlendirme linkleri.

        Yorum sistemi (anime serisi ve medya parçası bazında, beğeni özelliği ile).

        Anime serileri için tür (Genre), etiket (Tag) ve stüdyo (Studio) bilgileri (ayrı modellerle yönetilen).

    Sosyal Etkileşim:

        Kullanıcı takip sistemi (bir yönlü takip).

        Basit anime takip sistemi (bildirim almak için).

        Site içi bildirimler (yeni takipçi, yeni bölüm yayını vb.).

3. Marka Kimliği

    Resmi Marka Adı: Aniwa

    Logo Konsepti: aniwa yazısında mor, mavi, turkuaz gradient geçişi; "i" harfinin noktasında stilize minimalist bir sakura yaprağı.

    Genel Site Teması: Hafif süt beyazı (#FDFDFD) gibi açık ve ferah bir arka plan.

    Alan Adları: aniwa.tr (ana), aniwa.com.tr (yönlendirme).

4. Teknik Yığın (Technical Stack)

Aniwa, modern, güncel ve projenin performans, ölçeklenebilirlik, bakım kolaylığı hedeflerini destekleyecek teknolojilerle geliştirilmektedir:

    Ana Mimari: Full-Stack Next.js 15 (App Router).

    Frontend: React 19, Tailwind CSS, shadcn/ui, Lucide React, Motion (Framer Motion).

    Dil: TypeScript (uçtan uca tip güvenliği).

    Veritabanı: MongoDB (MongoDB Atlas üzerinde yönetilen hizmet).

    ORM: Prisma (MongoDB desteği ile).

    Kimlik Doğrulama: Auth.js (NextAuth.js) - Sadece E-posta/Şifre.

    Veri Çekme/Durum Yönetimi (Frontend): React Query (TanStack Query), Zustand.

    Form Yönetimi/Validasyon: React Hook Form, Zod.

    Dosya Yükleme/Depolama: Cloudinary (next-cloudinary SDK'sı ile).

    Performans & Güvenlik:
        Rate Limiting (Vercel Edge Middleware + @upstash/ratelimit + Vercel KV).

        Web Font Optimizasyonu (next/font).

        Dahili MongoDB Hibrit Log Sistemi.

    Diğer Servisler: Resend (işlemsel e-postalar), Axios (HTTP istemci).

5. Mimari Prensipler

    Sunucu Öncelikli (Server-First) Yaklaşım: Veri çekme ve ilk sayfa oluşturma işlemleri sunucu tarafında yapılır.

    Endişelerin Net Ayrımı (Separation of Concerns): Uygulama mantığı, veri erişimi ve UI bileşenleri arasında net sınırlar.

    Uçtan Uca Tip Güvenliği: TypeScript ve Zod entegrasyonu.

    Modülerlik ve Yeniden Kullanılabilirlik: Kodun tekrarını azaltma.

    Performans Odaklılık: Yüksek performans hedeflenir.

    Mobil Uygulama Hazırlığı: Backend API'leri mobil uygulamalar tarafından da tüketilebilecek şekilde tasarlanır.

6. Geliştirme Aşamaları (Kısa Bakış)

Proje 3 ana aşamada geliştirilecektir ve site, 2. Aşama tamamlandıktan sonra yayınlanacaktır.

    Aşama 1 (Temel Sistem ve MVP): Kullanıcı hesapları, anime veritabanı ve arayüzü, kişisel anime listeleri, izleme takibi ve puanlama.

    Aşama 2 (Topluluk, Kişiselleştirme ve Yayın): Forum entegrasyonu, yapay zeka öneri sistemi, bildirim altyapısı, projenin canlıya alınması.

    Aşama 3 (Genişleme ve Sürdürülebilirlik): Premium üyelik, mobil uygulama geliştirilmesi, Haberler Bölümü.