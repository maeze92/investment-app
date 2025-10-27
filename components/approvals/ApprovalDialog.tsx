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
import { Investment } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_NAMES, FINANCING_TYPE_NAMES } from '@/types/enums';

interface ApprovalDialogProps {
  investment: Investment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (comment?: string, conditions?: string) => Promise<void>;
  onReject: (comment: string) => Promise<void>;
}

export function ApprovalDialog({
  investment,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalDialogProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [conditions, setConditions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (decision === 'reject' && !comment.trim()) {
      alert('Bitte geben Sie einen Ablehnungsgrund an');
      return;
    }

    setIsSubmitting(true);
    try {
      if (decision === 'approve') {
        await onApprove(comment || undefined, conditions || undefined);
      } else if (decision === 'reject') {
        await onReject(comment);
      }

      // Reset state
      setDecision(null);
      setComment('');
      setConditions('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('Fehler beim Speichern der Entscheidung');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDecision(null);
    setComment('');
    setConditions('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Investition genehmigen</DialogTitle>
          <DialogDescription>
            Prüfen Sie die Details der Investition und treffen Sie eine Entscheidung
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Investment Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">{investment.name}</h3>

            {investment.description && (
              <p className="text-sm text-muted-foreground">
                {investment.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gesamtbetrag
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(investment.total_amount)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Kategorie
                </p>
                <p className="text-lg">
                  {CATEGORY_NAMES[investment.category]}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Finanzierung
                </p>
                <p className="text-lg">
                  {FINANCING_TYPE_NAMES[investment.financing_type]}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Start-Datum
                </p>
                <p className="text-lg">
                  {new Date(investment.start_date).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>

            {/* Metadata */}
            {(investment.metadata.vendor ||
              investment.metadata.contract_number ||
              investment.metadata.internal_reference) && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Zusätzliche Informationen</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {investment.metadata.vendor && (
                    <div>
                      <span className="text-muted-foreground">Lieferant: </span>
                      <span>{investment.metadata.vendor}</span>
                    </div>
                  )}
                  {investment.metadata.contract_number && (
                    <div>
                      <span className="text-muted-foreground">Vertragsnr.: </span>
                      <span>{investment.metadata.contract_number}</span>
                    </div>
                  )}
                  {investment.metadata.internal_reference && (
                    <div>
                      <span className="text-muted-foreground">Referenz: </span>
                      <span>{investment.metadata.internal_reference}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Decision Buttons */}
          {!decision && (
            <div className="flex gap-4">
              <Button
                onClick={() => setDecision('approve')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Genehmigen
              </Button>
              <Button
                onClick={() => setDecision('reject')}
                variant="destructive"
                className="flex-1"
              >
                Ablehnen
              </Button>
            </div>
          )}

          {/* Approval Form */}
          {decision === 'approve' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-green-700">Genehmigung</h4>

              <div className="space-y-2">
                <Label htmlFor="comment">
                  Kommentar (optional)
                </Label>
                <Input
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optionaler Kommentar zur Genehmigung..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">
                  Bedingungen (optional)
                </Label>
                <Input
                  id="conditions"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Optionale Bedingungen..."
                />
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {decision === 'reject' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-red-700">Ablehnung</h4>

              <div className="space-y-2">
                <Label htmlFor="reject-comment">
                  Ablehnungsgrund <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="reject-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bitte geben Sie einen Grund für die Ablehnung an..."
                  required
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {decision && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setDecision(null);
                  setComment('');
                  setConditions('');
                }}
                disabled={isSubmitting}
              >
                Zurück
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (decision === 'reject' && !comment.trim())}
                className={
                  decision === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }
              >
                {isSubmitting
                  ? 'Wird gespeichert...'
                  : decision === 'approve'
                  ? 'Genehmigung bestätigen'
                  : 'Ablehnung bestätigen'}
              </Button>
            </>
          )}
          {!decision && (
            <Button variant="outline" onClick={handleCancel}>
              Abbrechen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
