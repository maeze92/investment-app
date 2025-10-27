import { Skeleton as SkeletonPrimitive } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Table Skeleton
 * Loading state for tables
 */
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonPrimitive key={i} className="h-10 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonPrimitive key={colIndex} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Card Skeleton
 * Loading state for card-based content
 */
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <SkeletonPrimitive className="h-6 w-3/4" />
            <SkeletonPrimitive className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <SkeletonPrimitive className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * List Skeleton
 * Loading state for list items
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <SkeletonPrimitive className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonPrimitive className="h-4 w-3/4" />
            <SkeletonPrimitive className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Form Skeleton
 * Loading state for forms
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonPrimitive className="h-4 w-24" />
          <SkeletonPrimitive className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 mt-6">
        <SkeletonPrimitive className="h-10 w-24" />
        <SkeletonPrimitive className="h-10 w-24" />
      </div>
    </div>
  );
}

/**
 * Dashboard Skeleton
 * Loading state for dashboard pages
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonPrimitive className="h-8 w-64" />
        <SkeletonPrimitive className="h-4 w-96" />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <SkeletonPrimitive className="h-4 w-24" />
              <SkeletonPrimitive className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <SkeletonPrimitive className="h-8 w-32 mb-2" />
              <SkeletonPrimitive className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <SkeletonPrimitive className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <SkeletonPrimitive className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <SkeletonPrimitive className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <SkeletonPrimitive className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Chart Skeleton
 * Loading state for charts
 */
export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <SkeletonPrimitive className="h-4 w-32" />
        <SkeletonPrimitive className="h-4 w-20" />
      </div>
      <SkeletonPrimitive className={`w-full ${height}`} />
      <div className="flex justify-center gap-4">
        <SkeletonPrimitive className="h-3 w-16" />
        <SkeletonPrimitive className="h-3 w-16" />
        <SkeletonPrimitive className="h-3 w-16" />
      </div>
    </div>
  );
}
