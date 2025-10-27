import { UUID } from '@/types/enums';
import {
  User,
  Investment,
  Cashflow,
  Company,
  Group,
  UserRole,
  InvestmentApproval,
  Notification,
  AuditLog,
} from '@/types/entities';

/**
 * Data Adapter Interface
 * Abstract layer for data operations - supports both Local Storage and future Supabase
 */
export interface DataAdapter {
  // Authentication
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;

  // Generic CRUD Operations
  create<T extends { id: string }>(table: string, data: Partial<T>): Promise<T>;
  read<T extends { id: string }>(table: string, id: UUID): Promise<T | null>;
  update<T extends { id: string }>(table: string, id: UUID, data: Partial<T>): Promise<T | null>;
  delete(table: string, id: UUID): Promise<boolean>;
  query<T extends { id: string }>(table: string, filters?: QueryFilters): Promise<T[]>;

  // Real-time subscriptions (for future use)
  subscribe<T>(table: string, callback: (data: T) => void): () => void;
}

/**
 * Query Filters Interface
 */
export interface QueryFilters {
  [key: string]: any;
  where?: Array<{
    field: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'like';
    value: any;
  }>;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

/**
 * Local Data Adapter Implementation
 * Uses LocalStorageService for data persistence
 */
import { storageService } from './LocalStorageService';
import { generateUUID } from '@/lib/utils';

export class LocalDataAdapter implements DataAdapter {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Ensure storage is initialized before attempting login
    try {
      await storageService.initialize();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error('Storage initialization failed. Please refresh the page.');
    }

    const db = storageService.getDatabase();

    // Check if database has been seeded
    if (!db.users || db.users.length === 0) {
      throw new Error('NO_DATA_FOUND');
    }

    // Find user by email
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // In a real app, we would verify password hash
    // For mock purposes, we just accept any password
    if (password !== 'demo' && user.password_hash !== password) {
      // Allow 'demo' as universal password for testing
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate mock JWT token
    const token = `mock_token_${generateUUID()}`;

    // Update last login
    await storageService.updateDatabase((db) => {
      const u = db.users.find((u) => u.id === user.id);
      if (u) {
        u.last_login = new Date();
      }
      db.currentUser = user;
      db.authToken = token;
    });

    return { user, token };
  }

  async logout(): Promise<void> {
    await storageService.updateDatabase((db) => {
      db.currentUser = null;
      db.authToken = null;
    });
  }

  async getCurrentUser(): Promise<User | null> {
    const db = storageService.getDatabase();
    return db.currentUser;
  }

  async create<T extends { id: string }>(table: string, data: Partial<T>): Promise<T> {
    return await storageService.create(table as any, data as any) as T;
  }

  async read<T extends { id: string }>(table: string, id: UUID): Promise<T | null> {
    return await storageService.read<T>(table as any, id);
  }

  async update<T extends { id: string }>(table: string, id: UUID, data: Partial<T>): Promise<T | null> {
    return await storageService.update<T>(table as any, id, data);
  }

  async delete(table: string, id: UUID): Promise<boolean> {
    return await storageService.delete(table as any, id);
  }

  async query<T extends { id: string }>(table: string, filters?: QueryFilters): Promise<T[]> {
    let items = await storageService.query<T>(table as any);

    if (!filters) return items;

    // Apply where filters
    if (filters.where) {
      items = items.filter((item: any) => {
        return filters.where!.every((condition) => {
          const value = item[condition.field];

          switch (condition.operator) {
            case '=':
              return value === condition.value;
            case '!=':
              return value !== condition.value;
            case '>':
              return value > condition.value;
            case '<':
              return value < condition.value;
            case '>=':
              return value >= condition.value;
            case '<=':
              return value <= condition.value;
            case 'in':
              return Array.isArray(condition.value) && condition.value.includes(value);
            case 'like':
              return typeof value === 'string' && value.includes(condition.value);
            default:
              return true;
          }
        });
      });
    }

    // Apply orderBy
    if (filters.orderBy) {
      items.sort((a: any, b: any) => {
        const aVal = a[filters.orderBy!.field];
        const bVal = b[filters.orderBy!.field];

        if (aVal < bVal) return filters.orderBy!.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return filters.orderBy!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit and offset
    if (filters.limit || filters.offset) {
      const start = filters.offset || 0;
      const end = filters.limit ? start + filters.limit : undefined;
      items = items.slice(start, end);
    }

    return items;
  }

  subscribe<T>(table: string, callback: (data: T) => void): () => void {
    // For local storage, we can use storage events
    // This is a simplified implementation
    const handler = (e: StorageEvent) => {
      if (e.key === 'investment_app_data') {
        // Notify callback of change
        // In a real implementation, we'd parse and filter the data
        callback({} as T);
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }
}

/**
 * Supabase Data Adapter Implementation (Placeholder for future)
 */
export class SupabaseDataAdapter implements DataAdapter {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    throw new Error('Supabase not implemented yet');
  }

  async logout(): Promise<void> {
    throw new Error('Supabase not implemented yet');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('Supabase not implemented yet');
  }

  async create<T extends { id: string }>(table: string, data: Partial<T>): Promise<T> {
    throw new Error('Supabase not implemented yet');
  }

  async read<T extends { id: string }>(table: string, id: UUID): Promise<T | null> {
    throw new Error('Supabase not implemented yet');
  }

  async update<T extends { id: string }>(table: string, id: UUID, data: Partial<T>): Promise<T | null> {
    throw new Error('Supabase not implemented yet');
  }

  async delete(table: string, id: UUID): Promise<boolean> {
    throw new Error('Supabase not implemented yet');
  }

  async query<T extends { id: string }>(table: string, filters?: QueryFilters): Promise<T[]> {
    throw new Error('Supabase not implemented yet');
  }

  subscribe<T>(table: string, callback: (data: T) => void): () => void {
    throw new Error('Supabase not implemented yet');
  }
}

/**
 * Factory function to get the appropriate adapter
 */
export function getDataAdapter(): DataAdapter {
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

  if (useSupabase) {
    return new SupabaseDataAdapter();
  }

  return new LocalDataAdapter();
}

// Export default adapter instance
export const dataAdapter = getDataAdapter();
