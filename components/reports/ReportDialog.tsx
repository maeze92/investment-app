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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/stores/useAppStore';
import {
  generateMonthlyCashflowReport,
  generateYearlyOverviewReport,
  downloadWorkbook,
} from '@/lib/reports/excelGenerator';
import { generateInvestmentPDF, downloadPDF } from '@/lib/reports/pdfGenerator';
import { generateBookingJournalCSV, downloadCSV } from '@/lib/reports/csvGenerator';
import { toast } from '@/hooks/useToast';

interface ReportDialogProps {
  type: 'investments' | 'cashflows' | 'monthly' | 'yearly';
  onClose: () => void;
}

export function ReportDialog({ type, onClose }: ReportDialogProps) {
  const { investments, cashflows, companies } = useAppStore();
  const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleExport = () => {
    try {
      if (type === 'monthly') {
        const wb = generateMonthlyCashflowReport(
          cashflows,
          investments,
          companies,
          month,
          year
        );
        downloadWorkbook(wb, `Cashflow_${month}_${year}`);
      } else if (type === 'yearly') {
        const wb = generateYearlyOverviewReport(investments, cashflows, companies, year);
        downloadWorkbook(wb, `Investitionen_${year}`);
      } else if (type === 'cashflows' && format === 'csv') {
        const csv = generateBookingJournalCSV(cashflows, investments, companies);
        downloadCSV(csv, 'Buchungsjournal');
      }

      toast({
        title: 'Export erfolgreich',
        description: 'Die Datei wurde heruntergeladen.',
        variant: 'success',
      });

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export fehlgeschlagen',
        description: 'Beim Export ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report exportieren</DialogTitle>
          <DialogDescription>
            Wählen Sie das Format und die Parameter für den Export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v: 'excel' | 'pdf' | 'csv') => setFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(type === 'monthly' || type === 'yearly') && (
            <>
              {type === 'monthly' && (
                <div className="space-y-2">
                  <Label>Monat</Label>
                  <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {new Date(2000, m - 1).toLocaleString('de-DE', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Jahr</Label>
                <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleExport}>Exportieren</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
