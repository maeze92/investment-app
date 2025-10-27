'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { UUID } from '@/types/enums';
import { Cashflow } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvestmentCashflowsProps {
  investmentId: UUID;
}

export function InvestmentCashflows({ investmentId }: InvestmentCashflowsProps) {
  const cashflows = useAppStore((state) => state.cashflows);
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const confirmCashflowCM = useAppStore((state) => state.confirmCashflowCM);
  const confirmCashflowGF = useAppStore((state) => state.confirmCashflowGF);
  const [confirmingId, setConfirmingId] = useState<UUID | null>(null);

  // Filter cashflows for this investment
  const investmentCashflows = useMemo(() => {
    return cashflows
      .filter((cf) => cf.investment_id === investmentId)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [cashflows, investmentId]);

  // Calculate totals
  const totalAmount = useMemo(() => {
    return investmentCashflows.reduce((sum, cf) => sum + cf.amount, 0);
  }, [investmentCashflows]);

  const paidAmount = useMemo(() => {
    return investmentCashflows
      .filter((cf) => cf.status === 'bestaetigt')
      .reduce((sum, cf) => sum + cf.amount, 0);
  }, [investmentCashflows]);

  const getStatusColor = (status: Cashflow['status']) => {
    switch (status) {
      case 'geplant':
        return 'default';
      case 'ausstehend':
        return 'secondary';
      case 'vorbestaetigt':
        return 'secondary';
      case 'bestaetigt':
        return 'default';
      case 'verschoben':
        return 'secondary';
      case 'storniert':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Cashflow['status']) => {
    switch (status) {
      case 'geplant':
        return 'Geplant';
      case 'ausstehend':
        return 'Ausstehend';
      case 'vorbestaetigt':
        return 'Vorbestätigt';
      case 'bestaetigt':
        return 'Bestätigt';
      case 'verschoben':
        return 'Verschoben';
      case 'storniert':
        return 'Storniert';
      default:
        return status;
    }
  };

  const canConfirmCM = selectedRole?.role === 'cashflow_manager';
  const canConfirmGF =
    selectedRole?.role === 'geschaeftsfuehrer' || selectedRole?.role === 'cfo';

  const handleConfirmCM = async (cashflowId: UUID) => {
    if (!canConfirmCM || !user) return;

    if (!confirm('Möchten Sie diese Zahlung vorbestätigen?')) {
      return;
    }

    setConfirmingId(cashflowId);
    try {
      await confirmCashflowCM(cashflowId, user.id);
    } catch (error) {
      console.error('Failed to confirm cashflow (CM):', error);
      alert('Fehler beim Vorbestätigen der Zahlung');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmGF = async (cashflowId: UUID) => {
    if (!canConfirmGF || !user) return;

    if (!confirm('Möchten Sie diese Zahlung endgültig bestätigen?')) {
      return;
    }

    setConfirmingId(cashflowId);
    try {
      await confirmCashflowGF(cashflowId, user.id);
    } catch (error) {
      console.error('Failed to confirm cashflow (GF):', error);
      alert('Fehler beim Bestätigen der Zahlung');
    } finally {
      setConfirmingId(null);
    }
  };

  if (investmentCashflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Zahlungsströme</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keine Zahlungsströme für diese Investition vorhanden.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Zahlungsströme</CardTitle>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Gesamt: </span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Bezahlt: </span>
              <span className="font-semibold">{formatCurrency(paidAmount)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Offen: </span>
              <span className="font-semibold">{formatCurrency(totalAmount - paidAmount)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fälligkeitsdatum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Monat</TableHead>
                <TableHead>Jahr</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referenz</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentCashflows.map((cashflow) => (
                <TableRow key={cashflow.id}>
                  <TableCell>{formatDate(cashflow.due_date)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(cashflow.amount)}
                  </TableCell>
                  <TableCell>{cashflow.month}</TableCell>
                  <TableCell>{cashflow.year}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(cashflow.status)}>
                      {getStatusLabel(cashflow.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cashflow.accounting_reference || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {canConfirmCM &&
                      (cashflow.status === 'geplant' || cashflow.status === 'ausstehend') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmCM(cashflow.id)}
                          disabled={confirmingId === cashflow.id}
                        >
                          {confirmingId === cashflow.id
                            ? 'Wird vorbestätigt...'
                            : 'Vorbestätigen'}
                        </Button>
                      )}
                    {canConfirmGF && cashflow.status === 'vorbestaetigt' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfirmGF(cashflow.id)}
                        disabled={confirmingId === cashflow.id}
                      >
                        {confirmingId === cashflow.id
                          ? 'Wird bestätigt...'
                          : 'Endgültig bestätigen'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
