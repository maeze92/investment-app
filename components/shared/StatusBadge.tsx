import { Badge } from '@/components/ui/badge';
import {
  InvestmentStatus,
  CashflowStatus,
  INVESTMENT_STATUS_NAMES,
  CASHFLOW_STATUS_NAMES,
} from '@/types/enums';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: InvestmentStatus | CashflowStatus;
  type: 'investment' | 'cashflow';
  className?: string;
}

// Color mapping for investment statuses
const investmentStatusColors: Record<InvestmentStatus, string> = {
  entwurf: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  zur_genehmigung: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  genehmigt: 'bg-green-100 text-green-800 hover:bg-green-100',
  abgelehnt: 'bg-red-100 text-red-800 hover:bg-red-100',
  aktiv: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  abgeschlossen: 'bg-gray-300 text-gray-700 hover:bg-gray-300',
};

// Color mapping for cashflow statuses
const cashflowStatusColors: Record<CashflowStatus, string> = {
  geplant: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  ausstehend: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  vorbestaetigt: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  bestaetigt: 'bg-green-100 text-green-800 hover:bg-green-100',
  verschoben: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  storniert: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const getDisplayName = () => {
    if (type === 'investment') {
      return INVESTMENT_STATUS_NAMES[status as InvestmentStatus];
    }
    return CASHFLOW_STATUS_NAMES[status as CashflowStatus];
  };

  const getColorClass = () => {
    if (type === 'investment') {
      return investmentStatusColors[status as InvestmentStatus];
    }
    return cashflowStatusColors[status as CashflowStatus];
  };

  return (
    <Badge className={cn(getColorClass(), className)} variant="secondary">
      {getDisplayName()}
    </Badge>
  );
}

// Helper components for specific status types
export function InvestmentStatusBadge({
  status,
  className,
}: {
  status: InvestmentStatus;
  className?: string;
}) {
  return <StatusBadge status={status} type="investment" className={className} />;
}

export function CashflowStatusBadge({
  status,
  className,
}: {
  status: CashflowStatus;
  className?: string;
}) {
  return <StatusBadge status={status} type="cashflow" className={className} />;
}
