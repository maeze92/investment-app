'use client';

import { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';
import { storageService } from '@/lib/storage/LocalStorageService';
import { format } from 'date-fns';

export function DataManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const store = useAppStore();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSeedDatabase = async () => {
    if (
      !confirm(
        'This will add mock data to the database. Existing data will remain. Continue?'
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      // Import mock data generator
      const { mockDataGenerator } = await import('@/lib/utils/mockDataGenerator');
      const data = mockDataGenerator.seedDatabase();

      // Merge with existing data (note: this may create duplicates)
      const db = storageService.getDatabase();
      db.groups = [...db.groups, ...data.groups];
      db.companies = [...db.companies, ...data.companies];
      db.users = [...db.users, ...data.users];
      db.investments = [...db.investments, ...data.investments];
      db.cashflows = [...db.cashflows, ...data.cashflows];

      await storageService.save();

      // Refresh store
      await store.refresh();

      showMessage('success', 'Database seeded successfully!');
    } catch (error) {
      console.error('Failed to seed database:', error);
      showMessage('error', 'Failed to seed database. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (
      !confirm(
        'WARNING: This will delete ALL data including investments, cashflows, and notifications. This action cannot be undone. Are you sure?'
      )
    ) {
      return;
    }

    if (!confirm('Are you REALLY sure? All data will be permanently deleted!')) {
      return;
    }

    try {
      setIsLoading(true);

      // Clear local storage
      localStorage.clear();

      showMessage('success', 'Database reset successfully! Reloading page...');

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to reset database:', error);
      showMessage('error', 'Failed to reset database. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);

      const data = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: {
          groups: store.groups,
          companies: store.companies,
          users: store.users,
          investments: store.investments,
          cashflows: store.cashflows,
          investmentApprovals: store.investmentApprovals,
          notifications: store.notifications,
        },
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `investment-app-backup-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showMessage('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Failed to export data:', error);
      showMessage('error', 'Failed to export data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          setIsLoading(true);

          const text = await file.text();
          const imported = JSON.parse(text);

          if (!imported.data || !imported.version) {
            throw new Error('Invalid backup file format');
          }

          // Ask for confirmation
          if (
            !confirm(
              'This will replace ALL current data with the imported data. Continue?'
            )
          ) {
            setIsLoading(false);
            return;
          }

          // Import data into storage service
          const db = storageService.getDatabase();
          db.groups = imported.data.groups || [];
          db.companies = imported.data.companies || [];
          db.users = imported.data.users || [];
          db.investments = imported.data.investments || [];
          db.cashflows = imported.data.cashflows || [];
          db.investmentApprovals = imported.data.investmentApprovals || [];
          db.notifications = imported.data.notifications || [];

          await storageService.save();

          showMessage('success', 'Data imported successfully! Reloading page...');

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          console.error('Failed to import data:', error);
          showMessage('error', 'Failed to import data. Check console for details.');
          setIsLoading(false);
        }
      };

      input.click();
    } catch (error) {
      console.error('Failed to import data:', error);
      showMessage('error', 'Failed to import data. Check console for details.');
    }
  };

  const getDataStats = () => {
    return {
      totalGroups: store.groups.length,
      totalCompanies: store.companies.length,
      totalUsers: store.users.length,
      totalInvestments: store.investments.length,
      totalCashflows: store.cashflows.length,
      totalApprovals: store.investmentApprovals.length,
      totalNotifications: store.notifications.length,
    };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Seed, reset, export, and import database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Current Data Stats */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium mb-2">Current Data</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Groups:</span>
                <Badge variant="outline">{stats.totalGroups}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Companies:</span>
                <Badge variant="outline">{stats.totalCompanies}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Users:</span>
                <Badge variant="outline">{stats.totalUsers}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Investments:</span>
                <Badge variant="outline">{stats.totalInvestments}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cashflows:</span>
                <Badge variant="outline">{stats.totalCashflows}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Approvals:</span>
                <Badge variant="outline">{stats.totalApprovals}</Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Seed */}
            <Button
              onClick={handleSeedDatabase}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Seed Database with Mock Data
            </Button>

            {/* Export */}
            <Button
              onClick={handleExportData}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data (JSON)
            </Button>

            {/* Import */}
            <Button
              onClick={handleImportData}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data (JSON)
            </Button>

            {/* Reset */}
            <Button
              onClick={handleResetDatabase}
              disabled={isLoading}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Database (Clear All Data)
            </Button>
          </div>

          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Resetting the database will permanently delete all
              data. Always export a backup before resetting.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
