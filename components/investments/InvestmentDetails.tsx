'use client';

import { Investment } from '@/types/entities';
import { InvestmentHeader } from './InvestmentHeader';
import { InvestmentCashflows } from './InvestmentCashflows';
import { InvestmentTimeline } from './InvestmentTimeline';
import { ApprovalHistory } from '@/components/approvals/ApprovalHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/useAppStore';
import {
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvestmentDetailsProps {
  investment: Investment;
}

export function InvestmentDetails({ investment }: InvestmentDetailsProps) {
  const getCompany = useAppStore((state) => state.getCompany);
  const investmentApprovals = useAppStore((state) => state.investmentApprovals);
  const users = useAppStore((state) => state.users);
  const company = getCompany(investment.company_id);

  // Get approvals for this investment
  const approvals = investmentApprovals.filter(
    (a) => a.investment_id === investment.id
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <InvestmentHeader investment={investment} />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basis-Informationen</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-base font-semibold">{investment.name}</p>
          </div>

          {investment.description && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Beschreibung
              </label>
              <p className="text-base">{investment.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Kategorie</label>
            <p className="text-base">{CATEGORY_NAMES[investment.category]}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Unternehmen</label>
            <p className="text-base">
              {company?.name} ({company?.company_code})
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Gesamtbetrag
            </label>
            <p className="text-xl font-bold">{formatCurrency(investment.total_amount)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Finanzierungstyp
            </label>
            <p className="text-base">
              {FINANCING_TYPE_NAMES[investment.financing_type]}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Startdatum</label>
            <p className="text-base">{formatDate(investment.start_date)}</p>
          </div>

          {investment.end_date && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Enddatum</label>
              <p className="text-base">{formatDate(investment.end_date)}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Erstellt am</label>
            <p className="text-base">{formatDate(investment.created_at)}</p>
          </div>

          {investment.submitted_at && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Eingereicht am
              </label>
              <p className="text-base">{formatDate(investment.submitted_at)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Zahlungsstruktur</CardTitle>
        </CardHeader>
        <CardContent>
          {investment.financing_type === 'kauf' &&
            investment.payment_structure.einmalzahlung && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zahlungsdatum:</span>
                  <span className="font-medium">
                    {formatDate(investment.payment_structure.einmalzahlung.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Betrag:</span>
                  <span className="font-medium">
                    {formatCurrency(investment.payment_structure.einmalzahlung.amount)}
                  </span>
                </div>
                {investment.payment_structure.einmalzahlung.custom_due_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fälligkeitsdatum:</span>
                    <span className="font-medium">
                      {formatDate(
                        investment.payment_structure.einmalzahlung.custom_due_date
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}

          {(investment.financing_type === 'leasing' ||
            investment.financing_type === 'miete') &&
            investment.payment_structure.leasing && (
              <div className="space-y-2">
                {investment.payment_structure.leasing.anzahlung && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Anzahlung:</span>
                      <span className="font-medium">
                        {formatCurrency(investment.payment_structure.leasing.anzahlung)}
                      </span>
                    </div>
                    {investment.payment_structure.leasing.anzahlung_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Anzahlungsdatum:</span>
                        <span className="font-medium">
                          {formatDate(
                            investment.payment_structure.leasing.anzahlung_date
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monatliche Rate:</span>
                  <span className="font-medium">
                    {formatCurrency(investment.payment_structure.leasing.monthly_rate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laufzeit:</span>
                  <span className="font-medium">
                    {investment.payment_structure.leasing.duration_months} Monate
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Startmonat:</span>
                  <span className="font-medium">
                    {formatDate(investment.payment_structure.leasing.start_month)}
                  </span>
                </div>
                {investment.payment_structure.leasing.schlussrate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schlussrate:</span>
                    <span className="font-medium">
                      {formatCurrency(investment.payment_structure.leasing.schlussrate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Automatisch bestätigen:</span>
                  <span className="font-medium">
                    {investment.payment_structure.leasing.auto_confirm ? 'Ja' : 'Nein'}
                  </span>
                </div>
              </div>
            )}

          {investment.financing_type === 'ratenzahlung' &&
            investment.payment_structure.ratenzahlung && (
              <div className="space-y-2">
                {investment.payment_structure.ratenzahlung.anzahlung && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Anzahlung:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          investment.payment_structure.ratenzahlung.anzahlung
                        )}
                      </span>
                    </div>
                    {investment.payment_structure.ratenzahlung.anzahlung_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Anzahlungsdatum:</span>
                        <span className="font-medium">
                          {formatDate(
                            investment.payment_structure.ratenzahlung.anzahlung_date
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anzahl Raten:</span>
                  <span className="font-medium">
                    {investment.payment_structure.ratenzahlung.number_of_rates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ratenbetrag:</span>
                  <span className="font-medium">
                    {formatCurrency(investment.payment_structure.ratenzahlung.rate_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Intervall:</span>
                  <span className="font-medium">
                    {investment.payment_structure.ratenzahlung.rate_interval ===
                    'monthly'
                      ? 'Monatlich'
                      : investment.payment_structure.ratenzahlung.rate_interval ===
                        'quarterly'
                      ? 'Quartalsweise'
                      : 'Jährlich'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Erste Rate:</span>
                  <span className="font-medium">
                    {formatDate(
                      investment.payment_structure.ratenzahlung.first_rate_date
                    )}
                  </span>
                </div>
                {investment.payment_structure.ratenzahlung.schlussrate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Schlussrate:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          investment.payment_structure.ratenzahlung.schlussrate
                        )}
                      </span>
                    </div>
                    {investment.payment_structure.ratenzahlung.schlussrate_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Schlussrate Datum:</span>
                        <span className="font-medium">
                          {formatDate(
                            investment.payment_structure.ratenzahlung.schlussrate_date
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Metadata */}
      {(investment.metadata.vendor ||
        investment.metadata.contract_number ||
        investment.metadata.internal_reference) && (
        <Card>
          <CardHeader>
            <CardTitle>Zusatzinformationen</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {investment.metadata.vendor && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Lieferant
                </label>
                <p className="text-base">{investment.metadata.vendor}</p>
              </div>
            )}
            {investment.metadata.contract_number && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Vertragsnummer
                </label>
                <p className="text-base">{investment.metadata.contract_number}</p>
              </div>
            )}
            {investment.metadata.internal_reference && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Interne Referenz
                </label>
                <p className="text-base">{investment.metadata.internal_reference}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approval History */}
      {investment.status !== 'entwurf' && (
        <ApprovalHistory approvals={approvals} users={users} />
      )}

      {/* Cashflows */}
      <InvestmentCashflows investmentId={investment.id} />

      {/* Timeline/History */}
      <InvestmentTimeline investment={investment} />
    </div>
  );
}
