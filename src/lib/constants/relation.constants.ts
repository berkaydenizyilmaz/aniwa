// Relation sabitleri

export const RELATION = {
  // Relation type etiketleri
  TYPE_LABELS: {
    SIDE_STORY: 'Yan Hikaye',
    SPIN_OFF: 'Spin-off',
    SPECIAL: 'Özel Bölüm',
    REMAKE: 'Yeniden Yapım',
    SEQUEL: 'Devamı',
    PREQUEL: 'Öncesi',
    SUMMARY: 'Özet',
    PARALLEL: 'Paralel Hikaye',
  } as const,
  
  // Relation type renkleri (UI için)
  TYPE_COLORS: {
    SIDE_STORY: 'text-blue-600',
    SPIN_OFF: 'text-purple-600',
    SPECIAL: 'text-green-600',
    REMAKE: 'text-orange-600',
    SEQUEL: 'text-red-600',
    PREQUEL: 'text-yellow-600',
    SUMMARY: 'text-gray-600',
    PARALLEL: 'text-indigo-600',
  } as const,
} as const; 