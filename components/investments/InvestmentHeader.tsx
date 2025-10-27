'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Investment } from '@/types/entities';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { INVESTMENT_STATUS_NAMES } from '@/types/enums';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvestmentHeaderProps {
  investment: Investment;
}

export function InvestmentHeader({ investment }: InvestmentHeaderProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const deleteInvestment = useAppStore((state) => state.deleteInvestment);
  const submitInvestmentForApproval = useAppStore(
    (state) => state.submitInvestmentForApproval
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit =
    investment.status === 'entwurf' &&
    (selectedRole?.role === 'geschaeftsfuehrer' || selectedRole?.role === 'cfo');

  const canDelete =
    investment.status === 'entwurf' &&
    (selectedRole?.role === 'geschaeftsfuehrer' || selectedRole?.role === 'cfo');

  const canSubmit =
    investment.status === 'entwurf' &&
    (selectedRole?.role === 'geschaeftsfuehrer' || selectedRole?.role === 'cfo');

  const handleEdit = () => {
    router.push(`/investments/${investment.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Möchten Sie diese Investition wirklich löschen?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteInvestment(investment.id);
      router.push('/investments');
    } catch (error) {
      console.error('Failed to delete investment:', error);
      alert('Fehler beim Löschen der Investition');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (
      !confirm(
        'Möchten Sie diese Investition zur Genehmigung einreichen? Sie können sie danach nicht mehr bearbeiten.'
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInvestmentForApproval(investment.id);
      // Refresh page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Failed to submit investment:', error);
      alert('Fehler beim Einreichen der Investition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch (investment.status) {
      case 'entwurf':
        return 'default';
      case 'zur_genehmigung':
        return 'secondary';
      case 'genehmigt':
        return 'default';
      case 'abgelehnt':
        return 'destructive';
      case 'aktiv':
        return 'default';
      case 'abgeschlossen':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{investment.name}</h1>
              <Badge variant={getStatusColor()}>
                {INVESTMENT_STATUS_NAMES[investment.status]}
              </Badge>
            </div>
            {investment.description && (
              <p className="text-muted-foreground">{investment.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <Button variant="outline" onClick={handleEdit}>
                Bearbeiten
              </Button>
            )}

            {canSubmit && (
              <Button onClick={handleSubmitForApproval} disabled={isSubmitting}>
                {isSubmitting ? 'Wird eingereicht...' : 'Zur Genehmigung einreichen'}
              </Button>
            )}

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Mehr Aktionen</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/investments/${investment.id}`)}>
                  Duplizieren
                </DropdownMenuItem>
                <DropdownMenuItem>Als PDF exportieren</DropdownMenuItem>
                {canDelete && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600"
                  >
                    {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
