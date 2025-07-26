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

## İş Akışları

### 1. TV Series Oluşturma
1. **Ana anime bilgileri** girilir
2. **"Çok parçalı"** seçeneği aktif edilir
3. **Kaydet** → Alt medya sayfasına yönlendir
4. **Sezonlar** eklenir
5. **Her sezon için bölümler** eklenir

### 2. Film Oluşturma
1. **Ana anime bilgileri** girilir
2. **Tür: Film** seçilir
3. **Kaydet** → Ana listeye dön

### 3. OVA/ONA Oluşturma
1. **Ana anime bilgileri** girilir
2. **Tür: OVA/ONA** seçilir
3. **Bölüm sayısı** belirlenir:
   - **Tek bölüm** → Direkt kaydet
   - **Çok bölüm** → Bölüm ekleme sayfasına git

### 4. Tek Parçalı TV Series Oluşturma
1. **Ana anime bilgileri** girilir
2. **"Çok parçalı"** seçeneği aktif edilmez
3. **Kaydet** → Bölüm ekleme sayfasına yönlendir

## Form Validasyonları

### Zorunlu Alanlar
- Başlık (Türkçe)
- Tür
- Durum
- Sezon (Film hariç)
- Yıl (Film hariç)

### Koşullu Alanlar
- **OVA/ONA**: Bölüm sayısı belirtilmeli
- **Çok parçalı**: En az bir media part eklenmeli
- **Tek parçalı**: En az bir bölüm eklenmeli