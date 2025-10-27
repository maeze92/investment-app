'use client';

import { useState } from 'react';
import { Group } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GroupFormProps {
  group?: Group;
  onSubmit: (data: Omit<Group, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

export function GroupForm({ group, onSubmit, onCancel }: GroupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: group?.name || '',
    fiscalYearStart: group?.settings.fiscal_year_start || 1,
    currency: group?.settings.currency || 'EUR',
    emailEnabled: group?.settings.notification_settings.email_enabled ?? true,
    inAppEnabled: group?.settings.notification_settings.in_app_enabled ?? true,
    paymentReminderDays: group?.settings.notification_settings.payment_reminder_days || 7,
    monthlyReportDeadline: group?.settings.notification_settings.monthly_report_deadline_day || 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name: formData.name,
        settings: {
          fiscal_year_start: formData.fiscalYearStart,
          currency: formData.currency,
          notification_settings: {
            email_enabled: formData.emailEnabled,
            in_app_enabled: formData.inAppEnabled,
            payment_reminder_days: formData.paymentReminderDays,
            monthly_report_deadline_day: formData.monthlyReportDeadline,
          },
        },
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'März' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Dezember' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Grundinformationen</h3>

        <div>
          <Label htmlFor="name">Gruppenname *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="z.B. Mustergruppe Holding"
          />
        </div>

        <div>
          <Label htmlFor="fiscalYear">Geschäftsjahrbeginn</Label>
          <Select
            value={formData.fiscalYearStart.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, fiscalYearStart: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currency">Währung</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="CHF">CHF (Fr.)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Benachrichtigungseinstellungen</h3>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="emailEnabled"
            checked={formData.emailEnabled}
            onChange={(e) => setFormData({ ...formData, emailEnabled: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="emailEnabled">E-Mail-Benachrichtigungen aktivieren</Label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inAppEnabled"
            checked={formData.inAppEnabled}
            onChange={(e) => setFormData({ ...formData, inAppEnabled: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="inAppEnabled">In-App-Benachrichtigungen aktivieren</Label>
        </div>

        <div>
          <Label htmlFor="paymentReminder">Zahlungserinnerung (Tage im Voraus)</Label>
          <Input
            id="paymentReminder"
            type="number"
            min="1"
            max="30"
            value={formData.paymentReminderDays}
            onChange={(e) =>
              setFormData({ ...formData, paymentReminderDays: parseInt(e.target.value) })
            }
          />
        </div>

        <div>
          <Label htmlFor="reportDeadline">Monatsbericht-Deadline (Tag im Monat)</Label>
          <Input
            id="reportDeadline"
            type="number"
            min="1"
            max="28"
            value={formData.monthlyReportDeadline}
            onChange={(e) =>
              setFormData({ ...formData, monthlyReportDeadline: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Wird gespeichert...' : group ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
