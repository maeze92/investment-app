'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <FileQuestion className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <CardTitle>404 - Page Not Found</CardTitle>
              <CardDescription>
                The page you&apos;re looking for doesn&apos;t exist or has been moved
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Helpful Message */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              What you can do:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
              <li>Check the URL for typos</li>
              <li>Go back to the previous page</li>
              <li>Visit the homepage or dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="default">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Popular Pages:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/investments">
                <Button variant="outline" size="sm">
                  Investments
                </Button>
              </Link>
              <Link href="/cashflows">
                <Button variant="outline" size="sm">
                  Cashflows
                </Button>
              </Link>
              <Link href="/approvals">
                <Button variant="outline" size="sm">
                  Approvals
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
