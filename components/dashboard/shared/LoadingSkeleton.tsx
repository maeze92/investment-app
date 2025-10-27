import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function ChartLoadingSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div
          className="bg-gray-100 rounded animate-pulse"
          style={{ height: `${height}px` }}
        />
      </CardContent>
    </Card>
  );
}

export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 flex-1 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
