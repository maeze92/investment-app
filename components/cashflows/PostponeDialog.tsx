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
import { Cashflow } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PostponeDialogProps {
  cashflow: Cashflow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostpone: (newDate: Date, reason: string) => Promise<void>;
}

export function PostponeDialog({
  cashflow,
  open,
  onOpenChange,
  onPostpone,
}: PostponeDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newDate || !reason.trim()) {
      alert('Bitte füllen Sie alle Felder aus');
      return;
    }

    const selectedDate = new Date(newDate);
    if (selectedDate <= new Date()) {
      alert('Das neue Datum muss in der Zukunft liegen');
      return;
    }

    setIsSubmitting(true);
    try {
      await onPostpone(selectedDate, reason);
      setNewDate('');
      setReason('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error postponing cashflow:', error);
      alert('Fehler beim Verschieben der Zahlung');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewDate('');
    setReason('');
    onOpenChange(false);
  };

  const currentDueDate = cashflow.custom_due_date || cashflow.due_date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Zahlung verschieben</DialogTitle>
          <DialogDescription>
            Verschieben Sie die Fälligkeit dieser Zahlung auf ein neues Datum
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cashflow Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Betrag:
              </span>
              <span className="text-sm font-bold">
                {formatCurrency(cashflow.amount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Aktuelles Fälligkeitsdatum:
              </span>
              <span className="text-sm font-medium">
                {formatDate(currentDueDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Zahlungstyp:
              </span>
              <span className="text-sm font-medium capitalize">
                {cashflow.type}
              </span>
            </div>

            {cashflow.period_number && cashflow.total_periods && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Rate:
                </span>
                <span className="text-sm font-medium">
                  {cashflow.period_number} von {cashflow.total_periods}
                </span>
              </div>
            )}
          </div>

          {/* New Date Input */}
          <div className="space-y-2">
            <Label htmlFor="new-date">
              Neues Fälligkeitsdatum <span className="text-red-600">*</span>
            </Label>
            <Input
              id="new-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-muted-foreground">
              Das Datum muss in der Zukunft liegen
            </p>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Grund für Verschiebung <span className="text-red-600">*</span>
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="z.B. Liquiditätsengpass, Verzögerung beim Lieferanten..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Geben Sie einen Grund für die Verschiebung an
            </p>
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
            disabled={isSubmitting || !newDate || !reason.trim()}
          >
            {isSubmitting ? 'Wird verschoben...' : 'Verschieben bestätigen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
