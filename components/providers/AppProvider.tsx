'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';

/**
 * App Provider
 * Initializes stores and provides loading state
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeApp = useAppStore((state) => state.initialize);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
        await initializeApp();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true); // Still show the app even if initialization fails
      }
    };

    init();
  }, [initializeAuth, initializeApp]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Lade Anwendung...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
