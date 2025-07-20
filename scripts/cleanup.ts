#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Veritabanı temizleme işlemi başlatılıyor...\n');

  try {
    // Tüm kullanıcıları sil
    const result = await prisma.user.deleteMany({});
    
    console.log(`✅ ${result.count} kullanıcı başarıyla silindi!`);
    console.log('🎉 Veritabanı temizlendi!');
    
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
main(); 