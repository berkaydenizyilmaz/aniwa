Editör / Anime Oluşturma Akışı: Detaylı Anlatım

Amaç: Editör, Aniwa'ya yeni bir anime serisi ekleyecek. Önce AnimeSeries oluşturulur, sonra MediaPart'lar ayrı ayrı eklenir. aniwaPublicId sistemi tarafından otomatik olarak atanacak ayrıca aniwa bazlı puanlar da otomatik zamanla hesaplanır, bunlar editör tarafından girilmeyecek.

## 1. Adım: AnimeSeries Oluşturma

Editör Hareketi: editor/anime panelinde "Yeni Anime Ekle" butonuna tıklar.

### AnimeSeries Form Alanları:

**Zorunlu Alanlar:**
- title (String): Ana başlık (Romaji)
- type (AnimeType): Seçenekler: TV, MOVIE, TV_SHORT, SPECIAL, OVA, ONA
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
- trailer (String): Tanıtım videosu URL'si
- coverImageFile (File): Kapak görseli
- bannerImageFile (File): Banner görseli
- genreIds (Int[]): Seçilen türler
- tagIds (Int[]): Seçilen etiketler
- studioIds (Int[]): Seçilen stüdyolar

**Otomatik Hesaplanan Alanlar:**
- episodes: MediaPart'lar eklendikçe otomatik hesaplanır (formda yok)
- duration: MediaPart'lar eklendikçe otomatik hesaplanır (formda yok)
- averageScore: Zamanla kullanıcı puanlarından hesaplanır
- popularity: Zamanla kullanıcı aktivitelerinden hesaplanır
- anilistAverageScore: MediaPart'lardan hesaplanır
- anilistPopularity: MediaPart'lardan hesaplanır

Akış İlerlemesi: Editör formu doldurur ve "Oluştur" butonuna tıklar. AnimeSeries oluşturulur ve anime listesine yönlendirilir.

## 2. Adım: MediaPart Ekleme

Editör Hareketi: Oluşturulan anime'nin tablo satırında "MediaPart Ekle" butonuna tıklar.

### MediaPart Form Alanları:

**Zorunlu Alanlar:**
- title (String): Parça başlığı (örn. "Season 1", "Movie", "OVA 1")
- episodes (Int): Bölüm sayısı
- displayOrder (Int): İzleme sırası (1, 2, 3...)

**Opsiyonel Alanlar:**
- englishTitle (String): İngilizce başlık
- japaneseTitle (String): Japonca başlık
- notes (String): Ek notlar
- releaseDate (DateTime): Yayın tarihi
- anilistId (Int): Anilist üzerindeki ID
- malId (Int): MyAnimeList üzerindeki ID
- anilistAverageScore (Float): Anilist'ten ortalama puan
- anilistPopularity (Int): Anilist'ten popülerlik verisi

**Otomatik Hesaplanan Alanlar:**
- duration: Episode'lardan otomatik hesaplanır (formda yok)
- averageScore: Zamanla kullanıcı puanlarından hesaplanır
- popularity: Zamanla kullanıcı aktivitelerinden hesaplanır

Akış İlerlemesi: Editör MediaPart formunu doldurur ve "Ekle" butonuna tıklar. MediaPart oluşturulur, episode'lar otomatik oluşturulur ve anime detay sayfasına yönlendirilir.

## 3. Adım: Episode Yönetimi

Editör Hareketi: MediaPart detay sayfasında "Episode'ları Düzenle" butonuna tıklar.

### Episode Düzenleme:

**Episode Listesi:**
- Episode numarası
- Episode başlığı (düzenlenebilir)
- Süre (dakika) (düzenlenebilir)
- Filler işaretleme (checkbox)
- Yayın tarihi (düzenlenebilir)
- Streaming linkleri (eklenebilir)

**Episode Ekleme:**
- Yeni episode ekleme (manuel)
- Episode numarası otomatik artırılır

**Episode Silme:**
- Episode silme (onay ile)
- Episode numaraları yeniden düzenlenir

Akış İlerlemesi: Editör episode detaylarını düzenler ve "Kaydet" butonuna tıklar. Episode'lar güncellenir ve MediaPart duration'ı otomatik yeniden hesaplanır.

## 4. Adım: AnimeSeries Güncelleme

Editör Hareketi: Mevcut anime'yi düzenlemek için tablodaki "Düzenle" butonuna tıklar.

Akış İlerlemesi: 
1. AnimeSeries'in mevcut verileri forma yüklenir
2. Editör değişiklikleri yapar ve "Güncelle" butonuna tıklar
3. Güncellenmiş veriler backend'e gönderilir

## 5. Adım: MediaPart Güncelleme

Editör Hareketi: MediaPart listesinde "Düzenle" butonuna tıklar.

Akış İlerlemesi:
1. MediaPart'ın mevcut verileri forma yüklenir
2. Editör değişiklikleri yapar ve "Güncelle" butonuna tıklar
3. Güncellenmiş veriler backend'e gönderilir

## 6. Adım: MediaPart Silme

Editör Hareketi: MediaPart listesinde "Sil" butonuna tıklar.

Akış İlerlemesi: Onay dialogu açılır, editör onaylarsa MediaPart silinir.

## 7. Adım: Episode Silme

Editör Hareketi: MediaPart detay sayfasında "Episode'ları Düzenle" butonuna tıklar.

Akış İlerlemesi: Onay dialogu açılır, editör onaylarsa episode silinir.

## 8. Adım: AnimeSeries Silme

Editör Hareketi: Anime listesinde "Sil" butonuna tıklar.

Akış İlerlemesi: Onay dialogu açılır, editör onaylarsa AnimeSeries ve tüm MediaPart'ları silinir.

## Örnek Kullanım Senaryoları:

### Film Senaryosu:
1. AnimeSeries oluştur: "Demon Slayer: Mugen Train" (type: MOVIE)
2. MediaPart ekle: "Movie" (episodes: 1, duration: 120)

### TV Series Senaryosu:
1. AnimeSeries oluştur: "Demon Slayer" (type: TV)
2. MediaPart ekle: "Season 1" (episodes: 26, duration: 24)
3. MediaPart ekle: "Season 2" (episodes: 11, duration: 24)
4. MediaPart ekle: "Movie" (episodes: 1, duration: 120)

### OVA Senaryosu:
1. AnimeSeries oluştur: "Demon Slayer OVA" (type: OVA)
2. MediaPart ekle: "OVA 1" (episodes: 1, duration: 45)
3. MediaPart ekle: "OVA 2" (episodes: 1, duration: 45)