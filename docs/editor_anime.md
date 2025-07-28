Editör / Anime Oluşturma Akışı: Detaylı Anlatım

Amaç: Editör, Aniwa'ya yeni bir anime serisi veya filmi ekleyecek. aniwaPublicId sistemi tarafından otomatik olarak atanacak ayrıca aniwa bazlı puanlar da otomatik zamanla hesaplanır, bunlar editör tarafından girilmeyecek. Tüm veriler en son backend'e toplu olarak gönderilecek.

1. Adım: Anime Tipini Belirleme

    Editör Hareketi: editor/animes panelinde "Yeni Anime Ekle" butonuna tıklar.

    Toplanacak Tek Alan:

        type (Anime Tipi): Seçenekler: TV, MOVIE, TV_SHORT, SPECIAL, OVA, ONA, MUSIC. (Zorunlu)

    Akış İlerlemesi: Editör bu alanı seçer ve "Devam Et" butonuna tıklar. Bu seçim, bir sonraki ana formun yapısını belirler.

2. Adım: Ana Anime Detayları Formunun Doldurulması (İkinci ve Ana Form)

    Editör Hareketi: Bir önceki adımda seçilen type'a göre şekillenen daha büyük ve kapsamlı bir form karşılar. Editör bu formdaki bilgileri doldurur. İki form vardır type seçimine göre ikisinden biri çıkar.

    Görünen Alanlar (Dinamik ve Koşullu):

        Her Zaman Görünen Zorunlu Alanlar:

            title (String): Ana başlık (Romaji).

            status (AnimeStatus Enum): Yayının durumu (örn. FINISHED, RELEASING).

            isAdult (Boolean): Yetişkinlere uygun içerik mi?

        Sadece type "MOVIE" İse Görünen Alanlar:

            anilistId (Int): Anilist üzerindeki Film ID'si (Zorunlu).

            malId (Int): MyAnimeList üzerindeki Film ID'si (Opsiyonel).

            (Not: Eğer type "MOVIE" değilse, bu alanlar formda görünmez. Harici ID'ler daha sonra AnimeMediaPart eklerken girilecek.)

        Her Zaman Görünen Opsiyonel Alanlar (Boş bırakılabilirler):

            englishTitle (String): İngilizce başlık.

            japaneseTitle (String): Japonca başlık.

            synonyms (String[]): Alternatif başlıklar (dizi olarak, virgülle ayrılarak girilebilir).

            synopsis (String): Anime'nin genel özeti/açıklaması.

            episodes (Int): Toplam bölüm sayısı (filmse genellikle 1).

            duration (Int): Bölüm veya filmin süresi (dakika).

            season (Season Enum): Yayınlandığı sezon (örn. WINTER).

            seasonYear (Int): Yayınlandığı yıl.

            source (Source Enum): Kaynak materyal (örn. MANGA, ORIGINAL).

            countryOfOrigin (String): Köken ülke.

            anilistAverageScore (Float): Anilist'ten ortalama puan.

            anilistPopularity (Int): Anilist'ten popülerlik verisi.

            coverImage (String): Kapak görseli URL'si.

            bannerImage (String): Banner görseli URL'si.

            trailer (String): Tanıtım videosu URL'si.

            relatedAnimeIds (String[]): İlgili anime serilerinin ID'leri (dizi olarak, daha sonra eklenebilir veya ID'ler girilebilir).

            Genre (Türler): Mevcut türler arasından seçim.

            Tag (Etiketler): Mevcut etiketler arasından seçim.

            Studio (Stüdyolar): Mevcut stüdyolar arasından seçim.

    Veri Toplama: Tüm bu form alanlarındaki veriler, en son submit edilmek üzere tek bir obje olarak toplanır.

    Akış İlerlemesi: Editör formu doldurduktan sonra "Oluştur" butonuna tıklar. Bu tıklama, toplanan tüm veriyi backend'e tek bir istek olarak gönderir.