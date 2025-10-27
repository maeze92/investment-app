import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number; // percentage change
    direction: 'up' | 'down' | 'neutral';
    label?: string; // e.g., "vs. last month"
  };
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ title, value, subtitle, trend, icon, className }: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4" />;
      case 'down':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        <div className="flex items-center gap-2 mt-1">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}

          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-muted-foreground ml-1">{trend.label}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
