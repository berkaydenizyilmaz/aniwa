Editör / Anime Oluşturma Akışı: Detaylı Anlatım

Amaç: Editör, Aniwa'ya yeni bir anime serisi veya filmi ekleyecek. aniwaPublicId sistemi tarafından otomatik olarak atanacak ayrıca aniwa bazlı puanlar da otomatik zamanla hesaplanır, bunlar editör tarafından girilmeyecek. Tüm veriler en son backend'e toplu olarak gönderilecek.

## 1. Adım: Anime Tipini Belirleme

Editör Hareketi: editor/anime panelinde "Yeni Anime Ekle" butonuna tıklar.

Toplanacak Tek Alan:
- type (AnimeType): Seçenekler: TV, MOVIE, TV_SHORT, SPECIAL, OVA, ONA. (Zorunlu)

Akış İlerlemesi: Editör bu alanı seçer ve "Devam Et" butonuna tıklar. Bu seçim, bir sonraki adımı belirler.

## 2. Adım: Çok Parçalı Seçimi (Sadece Belirli Tipler İçin)

Editör Hareketi: Eğer seçilen type OVA, ONA, SPECIAL, TV_SHORT ise, editör çok parçalı mı tek parçalı mı olduğunu seçer.

Toplanacak Tek Alan:
- isMultiPart (Boolean): Tek parçalı mı çok parçalı mı? (Zorunlu)

Akış İlerlemesi: Editör seçimini yapar ve "Devam Et" butonuna tıklar.

## 3. Adım: Ana Anime Detayları Formunun Doldurulması

Editör Hareketi: Önceki adımlardaki seçimlere göre şekillenen form karşısında editör detayları doldurur.

### Form Türleri:

#### A) Tek Parçalı Form (Single-Part Form)
**Kullanım Durumları:**
- type = MOVIE
- type = OVA/ONA/SPECIAL/TV_SHORT VE isMultiPart = false

**Görünen Alanlar:**

**Zorunlu Alanlar:**
- title (String): Ana başlık (Romaji)
- status (AnimeStatus): Yayının durumu (örn. FINISHED, RELEASING)
- isAdult (Boolean): Yetişkinlere uygun içerik mi?
- duration (Int): Süre (dakika)
- anilistId (Int): Anilist üzerindeki Film ID'si (Zorunlu)

**Opsiyonel Alanlar:**
- englishTitle (String): İngilizce başlık
- japaneseTitle (String): Japonca başlık
- synonyms (String[]): Alternatif başlıklar (array olarak)
- synopsis (String): Anime'nin genel özeti/açıklaması
- season (Season): Yayınlandığı sezon (örn. WINTER)
- seasonYear (Int): Yayınlandığı yıl
- releaseDate (String): Tam tarih
- source (Source): Kaynak materyal (örn. MANGA, ORIGINAL)
- countryOfOrigin (CountryOfOrigin): Köken ülke (JAPAN, SOUTH_KOREA, CHINA)
- anilistAverageScore (Float): Anilist'ten ortalama puan
- anilistPopularity (Int): Anilist'ten popülerlik verisi
- trailer (String): Tanıtım videosu URL'si
- malId (Int): MyAnimeList üzerindeki Film ID'si
- coverImageFile (File): Kapak görseli
- bannerImageFile (File): Banner görseli
- genreIds (Int[]): Seçilen türler
- tagIds (Int[]): Seçilen etiketler
- studioIds (Int[]): Seçilen stüdyolar

**Otomatik Hesaplanan Alanlar:**
- episodes: 1 (sabit)
- isMultiPart: false (sabit)

#### B) Çok Parçalı Form (Multi-Part Form)
**Kullanım Durumları:**
- type = TV
- type = OVA/ONA/SPECIAL/TV_SHORT VE isMultiPart = true

**Görünen Alanlar:**

**Zorunlu Alanlar:**
- title (String): Ana başlık (Romaji)
- status (AnimeStatus): Yayının durumu (örn. FINISHED, RELEASING)
- isAdult (Boolean): Yetişkinlere uygun içerik mi?

**Opsiyonel Alanlar:**
- englishTitle (String): İngilizce başlık
- japaneseTitle (String): Japonca başlık
- synonyms (String[]): Alternatif başlıklar (array olarak)
- synopsis (String): Anime'nin genel özeti/açıklaması
- season (Season): Yayınlandığı sezon (örn. WINTER)
- seasonYear (Int): Yayınlandığı yıl
- releaseDate (String): Tam tarih
- source (Source): Kaynak materyal (örn. MANGA, ORIGINAL)
- countryOfOrigin (CountryOfOrigin): Köken ülke (JAPAN, SOUTH_KOREA, CHINA)
- anilistAverageScore (Float): Anilist'ten ortalama puan
- anilistPopularity (Int): Anilist'ten popülerlik verisi
- trailer (String): Tanıtım videosu URL'si
- coverImageFile (File): Kapak görseli
- bannerImageFile (File): Banner görseli
- genreIds (Int[]): Seçilen türler
- tagIds (Int[]): Seçilen etiketler
- studioIds (Int[]): Seçilen stüdyolar

**Otomatik Hesaplanan Alanlar:**
- episodes: MediaPart'lar eklendikçe otomatik hesaplanır (burada girilmez)
- duration: MediaPart'lar eklendikçe otomatik hesaplanır (burada girilmez)
- isMultiPart: true (sabit)

## 4. Adım: Veri Gönderimi

Editör Hareketi: Formu doldurduktan sonra "Oluştur" butonuna tıklar.

Akış İlerlemesi: Tüm veriler backend'e tek bir istek olarak gönderilir ve anime serisi oluşturulur.

## Güncelleme Akışı

Editör Hareketi: Mevcut anime'yi düzenlemek için tablodaki "Düzenle" butonuna tıklar.

Akış İlerlemesi: 
1. Anime'nin mevcut verileri forma yüklenir
2. Form türü anime'nin type ve isMultiPart değerlerine göre belirlenir
3. Editör değişiklikleri yapar ve "Güncelle" butonuna tıklar
4. Güncellenmiş veriler backend'e gönderilir

## Silme Akışı

Editör Hareketi: Mevcut anime'yi silmek için tablodaki "Sil" butonuna tıklar.

Akış İlerlemesi: Onay dialogu açılır, editör onaylarsa anime serisi ve tüm ilişkili verileri silinir.