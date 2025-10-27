'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Cashflow, Investment } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CashflowStatusBadge } from '@/components/shared/StatusBadge';

interface CashflowConfirmationDialogProps {
  cashflow: Cashflow;
  investment: Investment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment?: string) => Promise<void>;
  userRole: 'cashflow_manager' | 'geschaeftsfuehrer';
}

export function CashflowConfirmationDialog({
  cashflow,
  investment,
  open,
  onOpenChange,
  onConfirm,
  userRole,
}: CashflowConfirmationDialogProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(comment || undefined);
      setComment('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error confirming cashflow:', error);
      alert('Fehler beim Bestätigen der Zahlung');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    onOpenChange(false);
  };

  const currentDueDate = cashflow.custom_due_date || cashflow.due_date;

  const getDialogTitle = () => {
    if (userRole === 'cashflow_manager') {
      return 'Zahlung vorbestätigen';
    }
    return 'Zahlung final freigeben';
  };

  const getDialogDescription = () => {
    if (userRole === 'cashflow_manager') {
      return 'Bestätigen Sie, dass diese Zahlung für die finale Freigabe vorbereitet ist';
    }
    return 'Geben Sie diese Zahlung final frei. Nach der Freigabe kann die Zahlung nicht mehr geändert werden.';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cashflow Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Investment:
              </span>
              <span className="text-sm font-bold">{investment.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Betrag:
              </span>
              <span className="text-lg font-bold">
                {formatCurrency(cashflow.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Fälligkeitsdatum:
              </span>
              <span className="text-sm font-medium">
                {formatDate(currentDueDate)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
              </span>
              <CashflowStatusBadge status={cashflow.status} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Zahlungstyp:
              </span>
              <span className="text-sm font-medium capitalize">
                {cashflow.type}
              </span>
            </div>

            {cashflow.period_number && cashflow.total_periods && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Rate:
                </span>
                <span className="text-sm font-medium">
                  {cashflow.period_number} von {cashflow.total_periods}
                </span>
              </div>
            )}
          </div>

          {/* Previous Confirmation Info */}
          {userRole === 'geschaeftsfuehrer' && cashflow.confirmed_by_cm && (
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Vorbestätigt vom Cashflow Manager
              </p>
              <p className="text-xs text-blue-700">
                {formatDate(cashflow.confirmed_at_cm!)}
              </p>
              {cashflow.cm_comment && (
                <p className="text-sm text-blue-800 mt-2">
                  Kommentar: {cashflow.cm_comment}
                </p>
              )}
            </div>
          )}

          {/* Comment Input */}
          <div className="space-y-2">
            <Label htmlFor="comment">Kommentar (optional)</Label>
            <Input
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional einen Kommentar hinzufügen..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting
              ? 'Wird bestätigt...'
              : userRole === 'cashflow_manager'
              ? 'Vorbestätigen'
              : 'Final freigeben'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
