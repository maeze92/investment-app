#!/usr/bin/env tsx

/**
 * Seed Script - Populate database with mock data
 * Run with: npm run dev:seed
 */

import { storageService } from '../lib/storage/LocalStorageService';
import { mockDataGenerator } from '../lib/utils/mockDataGenerator';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Initialize storage service
    await storageService.initialize();

    // Create backup of existing data (if any)
    await storageService.backup();

    // Generate and restore mock data
    const mockData = mockDataGenerator.seedDatabase();
    await storageService.restore(mockData);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Groups: ${mockData.groups.length}`);
    console.log(`   Companies: ${mockData.companies.length}`);
    console.log(`   Users: ${mockData.users.length}`);
    console.log(`   Investments: ${mockData.investments.length}`);
    console.log(`   Cashflows: ${mockData.cashflows.length}`);
    console.log('\n🔑 Demo Login Credentials:');
    console.log('   Email: admin@demo.de, vr@demo.de, cfo@demo.de, gf@demo.de, cm@demo.de, buchhaltung@demo.de');
    console.log('   Password: demo');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seed();
