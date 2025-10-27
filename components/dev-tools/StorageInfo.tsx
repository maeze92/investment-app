'use client';

import { useEffect, useState } from 'react';
import { Database, HardDrive, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore } from '@/stores/useAppStore';

interface StorageStats {
  used: number;
  available: number;
  percentage: number;
  totalSize: string;
  usedSize: string;
  availableSize: string;
}

export function StorageInfo() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const store = useAppStore();

  useEffect(() => {
    calculateStorageStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateStorageStats = () => {
    try {
      // Calculate Local Storage size
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      // Convert to KB
      const usedKB = totalSize / 1024;
      const totalKB = 5 * 1024; // Typical 5MB limit
      const availableKB = totalKB - usedKB;
      const percentage = (usedKB / totalKB) * 100;

      setStats({
        used: usedKB,
        available: availableKB,
        percentage: percentage,
        totalSize: formatBytes(totalKB * 1024),
        usedSize: formatBytes(usedKB * 1024),
        availableSize: formatBytes(availableKB * 1024),
      });
    } catch (error) {
      console.error('Failed to calculate storage stats:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes.toFixed(2) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getEntityCounts = () => {
    return {
      groups: store.groups.length,
      companies: store.companies.length,
      users: store.users.length,
      investments: store.investments.length,
      cashflows: store.cashflows.length,
      notifications: store.notifications.length,
      approvals: store.investmentApprovals.length,
    };
  };

  const counts = getEntityCounts();

  return (
    <div className="space-y-4">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Local Storage Usage
              </CardTitle>
              <CardDescription>Current storage consumption</CardDescription>
            </div>
            {stats && (
              <Badge variant={stats.percentage > 80 ? 'destructive' : 'secondary'}>
                {stats.percentage.toFixed(1)}% Used
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {stats.usedSize}</span>
                  <span>Available: {stats.availableSize}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stats.percentage > 80
                        ? 'bg-red-500'
                        : stats.percentage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Total: {stats.totalSize}
                </p>
              </div>

              {/* Warning */}
              {stats.percentage > 80 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Storage is running low! Consider exporting data and resetting the database.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entity Counts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Entity Counts
          </CardTitle>
          <CardDescription>Number of records in each collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(counts).map(([entity, count]) => (
              <div
                key={entity}
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <span className="text-sm font-medium capitalize">{entity}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
