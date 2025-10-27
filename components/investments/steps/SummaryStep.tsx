'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';
import {
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SummaryStepProps {
  data: any;
  onBack: () => void;
  onSubmit: (action: 'draft' | 'submit') => void;
  isSubmitting: boolean;
}

export function SummaryStep({ data, onBack, onSubmit, isSubmitting }: SummaryStepProps) {
  const getCompany = useAppStore((state) => state.getCompany);
  const company = data.company_id ? getCompany(data.company_id) : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Zusammenfassung</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Überprüfen Sie alle Angaben vor dem Speichern.
        </p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basis-Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{data.name}</span>
          </div>
          {data.description && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beschreibung:</span>
              <span className="font-medium">{data.description}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kategorie:</span>
            <Badge variant="default">{CATEGORY_NAMES[data.category as keyof typeof CATEGORY_NAMES]}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unternehmen:</span>
            <span className="font-medium">{company?.name || 'Unbekannt'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gesamtbetrag:</span>
            <span className="font-medium text-lg">
              {formatCurrency(data.total_amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Startdatum:</span>
            <span className="font-medium">{formatDate(data.start_date)}</span>
          </div>
          {data.end_date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enddatum:</span>
              <span className="font-medium">{formatDate(data.end_date)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Finanzierung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Finanzierungstyp:</span>
            <Badge variant="secondary">
              {FINANCING_TYPE_NAMES[data.financing_type as keyof typeof FINANCING_TYPE_NAMES]}
            </Badge>
          </div>

          {/* Payment Structure Details */}
          {data.financing_type === 'kauf' && data.payment_structure?.einmalzahlung && (
            <div className="mt-4 space-y-2 border-t pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zahlungsdatum:</span>
                <span className="font-medium">
                  {formatDate(data.payment_structure.einmalzahlung.date)}
                </span>
              </div>
            </div>
          )}

          {(data.financing_type === 'leasing' || data.financing_type === 'miete') &&
            data.payment_structure?.leasing && (
              <div className="mt-4 space-y-2 border-t pt-2">
                {data.payment_structure.leasing.anzahlung > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anzahlung:</span>
                    <span className="font-medium">
                      {formatCurrency(data.payment_structure.leasing.anzahlung)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monatliche Rate:</span>
                  <span className="font-medium">
                    {formatCurrency(data.payment_structure.leasing.monthly_rate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laufzeit:</span>
                  <span className="font-medium">
                    {data.payment_structure.leasing.duration_months} Monate
                  </span>
                </div>
                {data.payment_structure.leasing.schlussrate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schlussrate:</span>
                    <span className="font-medium">
                      {formatCurrency(data.payment_structure.leasing.schlussrate)}
                    </span>
                  </div>
                )}
              </div>
            )}

          {data.financing_type === 'ratenzahlung' &&
            data.payment_structure?.ratenzahlung && (
              <div className="mt-4 space-y-2 border-t pt-2">
                {data.payment_structure.ratenzahlung.anzahlung > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anzahlung:</span>
                    <span className="font-medium">
                      {formatCurrency(data.payment_structure.ratenzahlung.anzahlung)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anzahl Raten:</span>
                  <span className="font-medium">
                    {data.payment_structure.ratenzahlung.number_of_rates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ratenbetrag:</span>
                  <span className="font-medium">
                    {formatCurrency(data.payment_structure.ratenzahlung.rate_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Intervall:</span>
                  <span className="font-medium">
                    {data.payment_structure.ratenzahlung.rate_interval === 'monthly'
                      ? 'Monatlich'
                      : data.payment_structure.ratenzahlung.rate_interval ===
                        'quarterly'
                      ? 'Quartalsweise'
                      : 'Jährlich'}
                  </span>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Metadata */}
      {(data.vendor || data.contract_number || data.internal_reference) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zusatzinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.vendor && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lieferant:</span>
                <span className="font-medium">{data.vendor}</span>
              </div>
            )}
            {data.contract_number && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vertragsnummer:</span>
                <span className="font-medium">{data.contract_number}</span>
              </div>
            )}
            {data.internal_reference && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interne Referenz:</span>
                <span className="font-medium">{data.internal_reference}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Zurück
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit('draft')}
            disabled={isSubmitting}
          >
            Als Entwurf speichern
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit('submit')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Speichern & Zur Genehmigung einreichen'}
          </Button>
        </div>
      </div>
    </div>
  );
}
