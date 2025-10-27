import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <Card
      className={`${onClick ? 'cursor-pointer hover:bg-accent transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
          </div>
          {Icon && (
            <div className={`p-3 rounded-full bg-opacity-10 ${iconColor}`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
