import { useEffect, useState } from 'react';
import { storageService } from '@/lib/storage/LocalStorageService';

interface StorageStatus {
  hasData: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  userCount: number;
  companyCount: number;
  investmentCount: number;
  error: string | null;
}

/**
 * Hook to check if Local Storage has been seeded with data
 */
export function useStorageStatus(): StorageStatus {
  const [status, setStatus] = useState<StorageStatus>({
    hasData: false,
    isEmpty: true,
    isLoading: true,
    userCount: 0,
    companyCount: 0,
    investmentCount: 0,
    error: null,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Initialize storage if not already done
        await storageService.initialize();

        // Get database
        const db = storageService.getDatabase();

        const userCount = db.users?.length || 0;
        const companyCount = db.companies?.length || 0;
        const investmentCount = db.investments?.length || 0;

        const hasData = userCount > 0;
        const isEmpty = !hasData;

        setStatus({
          hasData,
          isEmpty,
          isLoading: false,
          userCount,
          companyCount,
          investmentCount,
          error: null,
        });
      } catch (error) {
        console.error('Failed to check storage status:', error);
        setStatus({
          hasData: false,
          isEmpty: true,
          isLoading: false,
          userCount: 0,
          companyCount: 0,
          investmentCount: 0,
          error: error instanceof Error ? error.message : 'Failed to check storage',
        });
      }
    };

    checkStatus();
  }, []);

  return status;
}
