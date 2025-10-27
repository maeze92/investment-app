'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error('Application Error:', error);

    // In production, log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Application Error</CardTitle>
              <CardDescription>
                Something went wrong while processing your request
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-semibold text-red-900 mb-2">Error Details:</p>
              <pre className="text-xs overflow-auto p-2 bg-white rounded text-red-900">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-red-700 mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}

          {/* User-Friendly Message */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              What you can do:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
              <li>Try refreshing the page</li>
              <li>Go back to the homepage</li>
              <li>If the problem persists, contact support</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={reset} variant="default">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = '/dashboard')} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
