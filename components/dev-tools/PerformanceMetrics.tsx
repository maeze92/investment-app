'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap, HardDrive, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PerformanceData {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  componentCount: number;
  storageSize: number;
  apiCallCount: number;
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceData | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    calculateMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateMetrics = () => {
    try {
      // Calculate storage size
      let storageSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          storageSize += localStorage[key].length + key.length;
        }
      }

      // Get performance data
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      // Memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1048576 : 0; // MB

      setMetrics({
        renderTime: perfData ? perfData.domContentLoadedEventEnd - perfData.fetchStart : 0,
        memoryUsage: memoryUsage,
        bundleSize: 0, // Calculated during build
        componentCount: estimateComponentCount(),
        storageSize: storageSize / 1024, // KB
        apiCallCount: 0, // Mock API calls
      });
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
    }
  };

  const estimateComponentCount = () => {
    // Estimate based on DOM nodes
    return document.querySelectorAll('*').length;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes.toFixed(2) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return ms.toFixed(0) + ' ms';
    return (ms / 1000).toFixed(2) + ' s';
  };

  const getPerformanceRating = (metric: string, value: number): 'good' | 'ok' | 'poor' => {
    const thresholds: Record<string, { good: number; ok: number }> = {
      renderTime: { good: 1500, ok: 3000 },
      memoryUsage: { good: 50, ok: 100 },
      storageSize: { good: 1000, ok: 3000 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'ok';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.ok) return 'ok';
    return 'poor';
  };

  const getRatingColor = (rating: 'good' | 'ok' | 'poor') => {
    const colors = {
      good: 'bg-green-500 text-white',
      ok: 'bg-yellow-500 text-black',
      poor: 'bg-red-500 text-white',
    };
    return colors[rating];
  };

  const handleRefresh = () => {
    calculateMetrics();
  };

  const handleStartProfiling = () => {
    setIsRecording(true);
    console.log('Performance profiling started. Open React DevTools Profiler to record.');
    setTimeout(() => setIsRecording(false), 10000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Monitor app performance and resource usage
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics ? (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Render Time */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Render Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {formatTime(metrics.renderTime)}
                        </span>
                        <Badge
                          className={getRatingColor(
                            getPerformanceRating('renderTime', metrics.renderTime)
                          )}
                        >
                          {getPerformanceRating('renderTime', metrics.renderTime)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Time to interactive
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Usage */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {metrics.memoryUsage.toFixed(2)} MB
                        </span>
                        <Badge
                          className={getRatingColor(
                            getPerformanceRating('memoryUsage', metrics.memoryUsage)
                          )}
                        >
                          {getPerformanceRating('memoryUsage', metrics.memoryUsage)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JS Heap Size
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Storage Size */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Storage Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {formatBytes(metrics.storageSize * 1024)}
                        </span>
                        <Badge
                          className={getRatingColor(
                            getPerformanceRating('storageSize', metrics.storageSize)
                          )}
                        >
                          {getPerformanceRating('storageSize', metrics.storageSize)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Local Storage
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Component Count */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      DOM Nodes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {metrics.componentCount.toLocaleString()}
                        </span>
                        <Badge variant="secondary">count</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total elements
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Tips */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Performance Tips:
                </p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Render time under 1.5s is good, under 3s is acceptable</li>
                  <li>Memory usage under 50MB is good, under 100MB is acceptable</li>
                  <li>Storage size under 1MB is good, under 3MB is acceptable</li>
                  <li>Use React DevTools Profiler for detailed component analysis</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleStartProfiling}
                  disabled={isRecording}
                  variant="outline"
                  className="w-full"
                >
                  {isRecording ? 'Recording...' : 'Start React Profiler'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Open React DevTools and start recording to profile components
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Loading metrics...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Browser Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Browser Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">User Agent</p>
              <p className="text-xs text-muted-foreground truncate">
                {navigator.userAgent}
              </p>
            </div>
            <div>
              <p className="font-medium">Viewport</p>
              <p className="text-xs text-muted-foreground">
                {window.innerWidth} x {window.innerHeight}
              </p>
            </div>
            <div>
              <p className="font-medium">Device Pixel Ratio</p>
              <p className="text-xs text-muted-foreground">
                {window.devicePixelRatio}x
              </p>
            </div>
            <div>
              <p className="font-medium">Online Status</p>
              <Badge variant={navigator.onLine ? 'default' : 'destructive'}>
                {navigator.onLine ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
