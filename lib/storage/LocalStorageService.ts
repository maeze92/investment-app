import { LocalDatabase } from '@/types/entities';
import { generateUUID } from '@/lib/utils';

/**
 * LocalStorageService
 * Singleton pattern for managing local storage with in-memory cache
 */
export class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly STORAGE_KEY = 'investment_app_data';
  private readonly BACKUP_KEY = 'investment_app_backup';
  private cache: LocalDatabase | null = null;
  private initialized = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  /**
   * Initialize the service and load data from localStorage
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await this.load();
      this.cache = data;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize LocalStorageService:', error);
      // Initialize with empty data
      this.cache = this.getEmptyDatabase();
      await this.save();
      this.initialized = true;
    }
  }

  /**
   * Get empty database structure
   */
  private getEmptyDatabase(): LocalDatabase {
    return {
      version: '1.0.0',
      lastUpdated: new Date(),
      currentUser: null,
      authToken: null,
      groups: [],
      companies: [],
      users: [],
      userRoles: [],
      investments: [],
      cashflows: [],
      investmentApprovals: [],
      notifications: [],
      auditLogs: [],
    };
  }

  /**
   * Load data from localStorage
   */
  public async load(): Promise<LocalDatabase> {
    if (typeof window === 'undefined') {
      return this.getEmptyDatabase();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.getEmptyDatabase();
      }

      const data = JSON.parse(stored);

      // Convert date strings back to Date objects
      data.lastUpdated = new Date(data.lastUpdated);

      return data as LocalDatabase;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return this.getEmptyDatabase();
    }
  }

  /**
   * Save data to localStorage
   */
  public async save(): Promise<void> {
    if (!this.cache || typeof window === 'undefined') return;

    try {
      this.cache.lastUpdated = new Date();
      const serialized = JSON.stringify(this.cache);
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);

      // Check if quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some data or export to file.');
      }

      throw error;
    }
  }

  /**
   * Create a backup of current data
   */
  public async backup(): Promise<void> {
    if (!this.cache || typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(this.cache);
      localStorage.setItem(this.BACKUP_KEY, serialized);
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  /**
   * Restore data from backup
   */
  public async restore(data?: LocalDatabase): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      if (data) {
        // Restore from provided data
        this.cache = data;
      } else {
        // Restore from backup
        const backup = localStorage.getItem(this.BACKUP_KEY);
        if (!backup) {
          throw new Error('No backup found');
        }
        this.cache = JSON.parse(backup);
      }

      await this.save();
    } catch (error) {
      console.error('Failed to restore data:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  public async clear(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.cache = this.getEmptyDatabase();
      await this.save();
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Get current database (from cache)
   */
  public getDatabase(): LocalDatabase {
    if (!this.cache) {
      throw new Error('LocalStorageService not initialized. Call initialize() first.');
    }
    return this.cache;
  }

  /**
   * Update database (in cache and storage)
   */
  public async updateDatabase(updater: (db: LocalDatabase) => void): Promise<void> {
    if (!this.cache) {
      throw new Error('LocalStorageService not initialized. Call initialize() first.');
    }

    updater(this.cache);
    await this.save();
  }

  /**
   * Generic CRUD operations
   */

  public async create<T extends { id: string }>(
    collection: keyof Omit<LocalDatabase, 'version' | 'lastUpdated' | 'currentUser' | 'authToken'>,
    item: Omit<T, 'id'>
  ): Promise<T> {
    const newItem = { ...item, id: generateUUID() } as T;

    await this.updateDatabase((db) => {
      (db[collection] as unknown as T[]).push(newItem);
    });

    return newItem;
  }

  public async read<T extends { id: string }>(
    collection: keyof Omit<LocalDatabase, 'version' | 'lastUpdated' | 'currentUser' | 'authToken'>,
    id: string
  ): Promise<T | null> {
    if (!this.cache) return null;

    const items = this.cache[collection] as unknown as T[];
    return items.find((item) => item.id === id) || null;
  }

  public async update<T extends { id: string }>(
    collection: keyof Omit<LocalDatabase, 'version' | 'lastUpdated' | 'currentUser' | 'authToken'>,
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    if (!this.cache) return null;

    const items = this.cache[collection] as unknown as T[];
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const updated = { ...items[index], ...data };

    await this.updateDatabase((db) => {
      (db[collection] as unknown as T[])[index] = updated;
    });

    return updated;
  }

  public async delete(
    collection: keyof Omit<LocalDatabase, 'version' | 'lastUpdated' | 'currentUser' | 'authToken'>,
    id: string
  ): Promise<boolean> {
    if (!this.cache) return false;

    const items = this.cache[collection] as unknown as Array<{ id: string }>;
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return false;

    await this.updateDatabase((db) => {
      (db[collection] as unknown as Array<{ id: string }>).splice(index, 1);
    });

    return true;
  }

  public async query<T extends { id: string }>(
    collection: keyof Omit<LocalDatabase, 'version' | 'lastUpdated' | 'currentUser' | 'authToken'>,
    filter?: (item: T) => boolean
  ): Promise<T[]> {
    if (!this.cache) return [];

    const items = this.cache[collection] as unknown as T[];

    if (!filter) return items;

    return items.filter(filter);
  }

  /**
   * Export data as JSON
   */
  public async exportToJSON(): Promise<string> {
    if (!this.cache) return '{}';
    return JSON.stringify(this.cache, null, 2);
  }

  /**
   * Import data from JSON
   */
  public async importFromJSON(json: string): Promise<void> {
    try {
      const data = JSON.parse(json) as LocalDatabase;
      await this.restore(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid JSON data');
    }
  }

  /**
   * Get storage usage info
   */
  public getStorageInfo(): { used: number; available: number; percentage: number } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || '';
      const used = new Blob([data]).size;
      const available = 5 * 1024 * 1024; // Assume 5MB limit
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const storageService = LocalStorageService.getInstance();
