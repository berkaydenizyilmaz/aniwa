// Türkçe karakterleri İngilizce karşılıklarına çeviren mapping
const turkishToEnglish: Record<string, string> = {
  'ç': 'c', 'Ç': 'C',
  'ğ': 'g', 'Ğ': 'G',
  'ı': 'i', 'I': 'I',
  'ö': 'o', 'Ö': 'O',
  'ş': 's', 'Ş': 'S',
  'ü': 'u', 'Ü': 'U',
  'İ': 'I'
};

// Slug oluşturur (Türkçe karakter desteği ile)
export function createSlug(text: string): string {
  return text
    // Türkçe karakterleri İngilizce karşılıklarına çevir
    .split('').map(char => turkishToEnglish[char] || char).join('')
    // Küçük harfe çevir
    .toLowerCase()
    // Sadece harf, rakam ve tire bırak, diğerlerini tire ile değiştir
    .replace(/[^a-z0-9]+/g, '-')
    // Baştaki ve sondaki tireleri kaldır
    .replace(/^-+|-+$/g, '')
    // Birden fazla tireyi tek tireye çevir
    .replace(/-+/g, '-');
} 