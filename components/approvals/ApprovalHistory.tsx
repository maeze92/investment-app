'use client';

import { InvestmentApproval, User } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ApprovalHistoryProps {
  approvals: InvestmentApproval[];
  users: User[];
}

export function ApprovalHistory({ approvals, users }: ApprovalHistoryProps) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genehmigungshistorie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Noch keine Genehmigungsentscheidungen vorhanden
          </p>
        </CardContent>
      </Card>
    );
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Unbekannter Benutzer';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genehmigungshistorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval, index) => (
            <div
              key={approval.id}
              className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {approval.decision === 'genehmigt' ? (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-700" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {getUserName(approval.approved_by)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          approval.decision === 'genehmigt'
                            ? 'default'
                            : 'destructive'
                        }
                        className={
                          approval.decision === 'genehmigt'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : ''
                        }
                      >
                        {approval.decision === 'genehmigt'
                          ? 'Genehmigt'
                          : 'Abgelehnt'}
                      </Badge>

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(approval.decided_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                {approval.comment && (
                  <div className="mt-2 bg-muted p-2 rounded text-sm">
                    <p className="text-muted-foreground font-medium text-xs mb-1">
                      Kommentar:
                    </p>
                    <p>{approval.comment}</p>
                  </div>
                )}

                {/* Conditions */}
                {approval.conditions && (
                  <div className="mt-2 bg-blue-50 p-2 rounded text-sm">
                    <p className="text-blue-700 font-medium text-xs mb-1">
                      Bedingungen:
                    </p>
                    <p className="text-blue-900">{approval.conditions}</p>
                  </div>
                )}

                {/* Valid Until */}
                {approval.valid_until && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Gültig bis:{' '}
                    {new Date(approval.valid_until).toLocaleDateString('de-DE')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
