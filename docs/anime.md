# Anime Editör Sistemi

## Genel Bakış

Anime editör sistemi, anime serilerinin oluşturulması, düzenlenmesi ve yönetilmesi için kapsamlı bir arayüz sağlar. Sistem, farklı anime türlerine göre esnek bir yapı sunar.

## Anime Türleri ve Yapıları

### 1. TV Series (Televizyon Dizisi)
- **Yapı**: Çok parçalı (seasons) veya tek parçalı
- **Bölümler**: Her parça için birden fazla bölüm
- **Örnek**: Attack on Titan (4 sezon, her sezonda 12-25 bölüm)

### 2. Film
- **Yapı**: Tek parça
- **Bölümler**: Yok (tek parça olarak kaydedilir)
- **Örnek**: Your Name, Akira

### 3. OVA (Original Video Animation)
- **Yapı**: Tek bölüm veya çok bölüm
- **Bölümler**: 1 bölüm (film gibi) veya birden fazla bölüm
- **Örnek**: 
  - Tek bölüm: Death Note: Relight
  - Çok bölüm: Attack on Titan: No Regrets (2 bölüm)

### 4. ONA (Original Net Animation)
- **Yapı**: Tek bölüm veya çok bölüm
- **Bölümler**: 1 bölüm (film gibi) veya birden fazla bölüm
- **Örnek**: 
  - Tek bölüm: Death Note: Rewrite
  - Çok bölüm: FLCL Progressive (6 bölüm)

## Veritabanı Yapısı

### Ana Tablolar
- `AnimeSeries`: Ana anime serisi bilgileri
- `AnimeMediaPart`: Sezon/film/OVA parçaları
- `Episode`: Bölümler
- `AnimeRelation`: Anime'ler arası ilişkiler

### İlişki Tabloları
- `AnimeGenre`: Anime-Genre ilişkisi
- `AnimeTag`: Anime-Tag ilişkisi
- `AnimeStudio`: Anime-Studio ilişkisi

## Form Yapısı

### Temel Bilgiler
- **Başlık (Romaji)**: Ana başlık
- **İngilizce Başlık**: İngilizce başlık (opsiyonel)
- **Japonca Başlık**: Japonca başlık (opsiyonel)
- **Alternatif Başlıklar**: Virgülle ayrılmış alternatif başlıklar
- **AniList ID**: AniList API ID'si (opsiyonel)
- **MAL ID**: MyAnimeList ID'si (opsiyonel)
- **Tür**: TV, Film, OVA, ONA, vb.
- **Durum**: Yayınlanıyor, Tamamlandı, vb.
- **Bölüm Sayısı**: Toplam bölüm sayısı
- **Süre**: Bölüm süresi (dakika)
- **Sezon**: İlkbahar, Yaz, Sonbahar, Kış
- **Yıl**: Yayın yılı
- **Kaynak**: Manga, Light Novel, vb.
- **Ülke**: Köken ülke
- **Yetişkin İçeriği**: Evet/Hayır
- **Çok Parçalı**: Evet/Hayır
- **Açıklama**: Anime açıklaması

### Görsel İçerik
- **Kapak Resmi URL**: Kapak resmi linki
- **Banner Resmi URL**: Banner resmi linki
- **Tanıtım Videosu URL**: Trailer linki

### İlişkiler
- **Türler**: Anime türleri (MultiSelect)
- **Etiketler**: Anime etiketleri (MultiSelect)
- **Stüdyolar**: Yapım stüdyoları (MultiSelect)

## İş Akışları

### 1. Anime Oluşturma
1. **"Yeni Anime Ekle"** butonuna tıkla
2. **Temel bilgileri** doldur
3. **Görsel içerikleri** ekle
4. **İlişkileri** seç (tür, etiket, stüdyo)
5. **Kaydet** → Ana listeye dön

### 2. Anime Düzenleme
1. **Tablo'da "Güncelle"** butonuna tıkla
2. **Form'u düzenle**
3. **Kaydet** → Değişiklikler uygulanır

### 3. Alt Medya Düzenleme (Çok Parçalılar)
1. **Tablo'da "Alt Medya Düzenle"** butonuna tıkla
2. **Sezon/film ekleme sayfasına** git
3. **Sezonlar/filmler** ekle
4. **Her sezon için bölümler** ekle

### 4. İzleme Linkleri
1. **"Link Sayfası"** butonuna tıkla
2. **Anime seç**
3. **Her bölüm için izleme linkleri** ekle
4. **Platform seç** (Netflix, Crunchyroll, vb.)

## Tablo İşlemleri

### Mevcut Butonlar
- **Güncelle**: Anime bilgilerini düzenle
- **Sil**: Anime'yi sil

### Gelecek Butonlar
- **Alt Medya Düzenle**: Sezon/film ekleme sayfasına git (çok parçalılar için)
- **Link Sayfası**: İzleme linkleri ekleme sayfasına git

## Form Validasyonları

### Zorunlu Alanlar
- Başlık (Romaji)
- Tür
- Durum

### Koşullu Alanlar
- **OVA/ONA**: Bölüm sayısı belirtilmeli
- **Film**: Bölüm sayısı otomatik 1 olur
- **Çok parçalı**: Alt medya ekleme gerekli