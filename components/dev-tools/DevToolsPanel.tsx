'use client';

import { useState, useEffect } from 'react';
import { X, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorageInfo } from './StorageInfo';
import { RoleSwitcher } from './RoleSwitcher';
import { TimeSimulator } from './TimeSimulator';
import { DataManager } from './DataManager';
import { PerformanceMetrics } from './PerformanceMetrics';

export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('storage');

  // Toggle with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg z-50"
        variant="outline"
        title="Open Dev Tools (Ctrl+Shift+D)"
      >
        <Wrench className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              <CardTitle>Dev Tools Panel</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              title="Close (Ctrl+Shift+D)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Shift+D</kbd> to toggle
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="storage" className="mt-4">
              <StorageInfo />
            </TabsContent>

            <TabsContent value="roles" className="mt-4">
              <RoleSwitcher />
            </TabsContent>

            <TabsContent value="time" className="mt-4">
              <TimeSimulator />
            </TabsContent>

            <TabsContent value="data" className="mt-4">
              <DataManager />
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <PerformanceMetrics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
