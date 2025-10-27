'use client';

import { useState } from 'react';
import { Investment, Company } from '@/types/entities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { ApprovalDialog } from './ApprovalDialog';
import { useRouter } from 'next/navigation';

interface ApprovalCardProps {
  investment: Investment;
  company: Company;
  onApprove: (investmentId: string, comment?: string, conditions?: string) => Promise<void>;
  onReject: (investmentId: string, comment: string) => Promise<void>;
}

export function ApprovalCard({
  investment,
  company,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = async (comment?: string, conditions?: string) => {
    await onApprove(investment.id, comment, conditions);
  };

  const handleReject = async (comment: string) => {
    await onReject(investment.id, comment);
  };

  const handleViewDetails = () => {
    router.push(`/investments/${investment.id}`);
  };

  const daysSinceSubmission = investment.submitted_at
    ? Math.floor(
        (Date.now() - new Date(investment.submitted_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{investment.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {company.name} • {CATEGORY_NAMES[investment.category]}
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {FINANCING_TYPE_NAMES[investment.financing_type]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Investment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
                <p className="text-xl font-bold">
                  {formatCurrency(investment.total_amount)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Eingereicht vor</p>
                <p className="text-lg font-semibold">
                  {daysSinceSubmission === 0
                    ? 'Heute'
                    : daysSinceSubmission === 1
                    ? '1 Tag'
                    : `${daysSinceSubmission} Tagen`}
                </p>
              </div>
            </div>

            {investment.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {investment.description}
              </p>
            )}

            {/* Metadata */}
            {investment.metadata.vendor && (
              <div className="text-sm">
                <span className="text-muted-foreground">Lieferant: </span>
                <span>{investment.metadata.vendor}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="flex-1 text-green-700 border-green-300 hover:bg-green-50"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Genehmigen
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="flex-1 text-red-700 border-red-300 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Ablehnen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApprovalDialog
        investment={investment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
