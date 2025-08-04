// Log sabitleri

export const LOG = {
  // Log level etiketleri
  LEVEL_LABELS: {
    INFO: 'Bilgi',
    WARNING: 'Uyarı',
    ERROR: 'Hata',
    DEBUG: 'Hata Ayıklama',
  } as const,
  
  // Log level renkleri (UI için)
  LEVEL_COLORS: {
    INFO: 'text-blue-600',
    WARNING: 'text-yellow-600',
    ERROR: 'text-red-600',
    DEBUG: 'text-gray-600',
  } as const,
} as const; 