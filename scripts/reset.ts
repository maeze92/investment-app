#!/usr/bin/env tsx

/**
 * Reset Script - Clear all data from database
 * Run with: npm run dev:reset
 */

import { storageService } from '../lib/storage/LocalStorageService';

async function reset() {
  console.log('🗑️  Resetting database...');

  try {
    await storageService.initialize();
    await storageService.clear();

    console.log('✅ Database reset successfully!');
    console.log('   All data has been cleared.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run reset function
reset();
