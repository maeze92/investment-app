'use client';

import { useState } from 'react';
import { Cashflow, Investment, Company } from '@/types/entities';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CashflowStatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CashflowTableProps {
  cashflows: Cashflow[];
  investments: Investment[];
  companies: Company[];
  onConfirmCM?: (cashflowId: string) => void;
  onConfirmGF?: (cashflowId: string) => void;
  onPostpone?: (cashflowId: string) => void;
  showActions?: boolean;
  userRole?: string;
}

type SortField = 'date' | 'amount' | 'status' | 'company' | 'investment';
type SortDirection = 'asc' | 'desc';

export function CashflowTable({
  cashflows,
  investments,
  companies,
  onConfirmCM,
  onConfirmGF,
  onPostpone,
  showActions = true,
  userRole,
}: CashflowTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCashflows = [...cashflows].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'date':
        const dateA = a.custom_due_date || a.due_date;
        const dateB = b.custom_due_date || b.due_date;
        comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'company':
        const invA = investments.find((i) => i.id === a.investment_id);
        const invB = investments.find((i) => i.id === b.investment_id);
        const compA = companies.find((c) => c.id === invA?.company_id)?.name || '';
        const compB = companies.find((c) => c.id === invB?.company_id)?.name || '';
        comparison = compA.localeCompare(compB);
        break;
      case 'investment':
        const investmentA = investments.find((i) => i.id === a.investment_id)?.name || '';
        const investmentB = investments.find((i) => i.id === b.investment_id)?.name || '';
        comparison = investmentA.localeCompare(investmentB);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getInvestment = (cashflow: Cashflow) => {
    return investments.find((inv) => inv.id === cashflow.investment_id);
  };

  const getCompany = (investment?: Investment) => {
    if (!investment) return undefined;
    return companies.find((c) => c.id === investment.company_id);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const canConfirmCM = (cashflow: Cashflow) => {
    return (
      userRole === 'cashflow_manager' &&
      cashflow.status === 'ausstehend' &&
      !cashflow.auto_confirmed
    );
  };

  const canConfirmGF = (cashflow: Cashflow) => {
    return userRole === 'geschaeftsfuehrer' && cashflow.status === 'vorbestaetigt';
  };

  const canPostpone = (cashflow: Cashflow) => {
    return (
      (userRole === 'cashflow_manager' || userRole === 'geschaeftsfuehrer') &&
      cashflow.status === 'ausstehend'
    );
  };

  if (cashflows.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Keine Cashflows gefunden</h3>
        <p className="text-muted-foreground">
          Es gibt keine Zahlungen, die diesen Kriterien entsprechen
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('date')}
            >
              Fälligkeitsdatum <SortIcon field="date" />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('investment')}
            >
              Investition <SortIcon field="investment" />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('company')}
            >
              Unternehmen <SortIcon field="company" />
            </TableHead>
            <TableHead>Typ</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort('amount')}
            >
              Betrag <SortIcon field="amount" />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Status <SortIcon field="status" />
            </TableHead>
            {showActions && <TableHead className="text-right">Aktionen</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCashflows.map((cashflow) => {
            const investment = getInvestment(cashflow);
            const company = getCompany(investment);
            const dueDate = cashflow.custom_due_date || cashflow.due_date;
            const isOverdue =
              new Date(dueDate) < new Date() && cashflow.status === 'ausstehend';

            return (
              <TableRow key={cashflow.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isOverdue && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{formatDate(dueDate)}</div>
                      {cashflow.custom_due_date && (
                        <div className="text-xs text-muted-foreground">
                          Verschoben von {formatDate(cashflow.original_due_date!)}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{investment?.name}</div>
                    {cashflow.period_number && cashflow.total_periods && (
                      <div className="text-xs text-muted-foreground">
                        Rate {cashflow.period_number}/{cashflow.total_periods}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{company?.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {cashflow.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-bold">{formatCurrency(cashflow.amount)}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <CashflowStatusBadge status={cashflow.status} />
                    {cashflow.auto_confirmed && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 ml-2"
                      >
                        Auto
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {canConfirmCM(cashflow) && onConfirmCM && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onConfirmCM(cashflow.id)}
                          className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Vorbestätigen
                        </Button>
                      )}
                      {canConfirmGF(cashflow) && onConfirmGF && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onConfirmGF(cashflow.id)}
                          className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Freigeben
                        </Button>
                      )}
                      {canPostpone(cashflow) && onPostpone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPostpone(cashflow.id)}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Verschieben
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Summary */}
      <div className="bg-muted/50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {sortedCashflows.length} Zahlung(en)
          </div>
          <div className="text-lg font-bold">
            Gesamt: {formatCurrency(sortedCashflows.reduce((sum, cf) => sum + cf.amount, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}
