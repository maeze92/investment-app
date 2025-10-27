'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  kaufPaymentSchema,
  leasingPaymentSchema,
  ratenzahlungPaymentSchema,
} from '@/lib/validation/investmentSchemas';

interface PaymentStructureStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function PaymentStructureStep({ data, onNext, onBack }: PaymentStructureStepProps) {
  const financingType = data.financing_type;

  // Render different forms based on financing type
  const renderPaymentForm = () => {
    switch (financingType) {
      case 'kauf':
        return <KaufPaymentForm data={data} onNext={onNext} onBack={onBack} />;
      case 'leasing':
      case 'miete':
        return <LeasingPaymentForm data={data} onNext={onNext} onBack={onBack} />;
      case 'ratenzahlung':
        return <RatenzahlungPaymentForm data={data} onNext={onNext} onBack={onBack} />;
      default:
        return <div>Ungültiger Finanzierungstyp</div>;
    }
  };

  return renderPaymentForm();
}

// Kauf Payment Form
function KaufPaymentForm({ data, onNext, onBack }: any) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kaufPaymentSchema),
    defaultValues: {
      payment_date: data.payment_structure?.einmalzahlung?.date || new Date(),
      has_custom_due_date: !!data.payment_structure?.einmalzahlung?.custom_due_date,
      custom_due_date: data.payment_structure?.einmalzahlung?.custom_due_date,
    },
  });

  const hasCustomDueDate = watch('has_custom_due_date');

  const onSubmit = (formData: any) => {
    onNext({
      payment_structure: {
        einmalzahlung: {
          date: formData.payment_date,
          amount: data.total_amount,
          custom_due_date: formData.has_custom_due_date
            ? formData.custom_due_date
            : undefined,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Kauf - Zahlungsstruktur</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Einmalige Zahlung für den vollständigen Betrag.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment_date">
            Zahlungsdatum <span className="text-red-500">*</span>
          </Label>
          <Input
            id="payment_date"
            type="date"
            {...register('payment_date', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
          />
          {errors.payment_date && (
            <p className="text-sm text-red-500">{(errors.payment_date as any).message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_custom_due_date"
            checked={hasCustomDueDate}
            onCheckedChange={(checked) => setValue('has_custom_due_date', !!checked)}
          />
          <Label htmlFor="has_custom_due_date" className="cursor-pointer">
            Abweichendes Fälligkeitsdatum
          </Label>
        </div>

        {hasCustomDueDate && (
          <div className="space-y-2">
            <Label htmlFor="custom_due_date">Fälligkeitsdatum</Label>
            <Input
              id="custom_due_date"
              type="date"
              {...register('custom_due_date', {
                setValueAs: (value) => (value ? new Date(value) : undefined),
              })}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit">Weiter</Button>
      </div>
    </form>
  );
}

// Leasing/Miete Payment Form
function LeasingPaymentForm({ data, onNext, onBack }: any) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leasingPaymentSchema),
    defaultValues: {
      anzahlung: data.payment_structure?.leasing?.anzahlung || 0,
      anzahlung_date: data.payment_structure?.leasing?.anzahlung_date,
      monthly_rate: data.payment_structure?.leasing?.monthly_rate,
      duration_months: data.payment_structure?.leasing?.duration_months,
      start_month: data.payment_structure?.leasing?.start_month || new Date(),
      schlussrate: data.payment_structure?.leasing?.schlussrate || 0,
      purchase_option: data.payment_structure?.leasing?.purchase_option || false,
      auto_confirm: data.payment_structure?.leasing?.auto_confirm ?? true,
    },
  });

  const anzahlung = watch('anzahlung');

  const onSubmit = (formData: any) => {
    onNext({
      payment_structure: {
        leasing: formData,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {data.financing_type === 'leasing' ? 'Leasing' : 'Miete'} - Zahlungsstruktur
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Monatliche Raten über den angegebenen Zeitraum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="anzahlung">Anzahlung (EUR) (optional)</Label>
          <Input
            id="anzahlung"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('anzahlung', { valueAsNumber: true })}
          />
          {errors.anzahlung && (
            <p className="text-sm text-red-500">{(errors.anzahlung as any).message}</p>
          )}
        </div>

        {anzahlung > 0 && (
          <div className="space-y-2">
            <Label htmlFor="anzahlung_date">
              Anzahlungsdatum <span className="text-red-500">*</span>
            </Label>
            <Input
              id="anzahlung_date"
              type="date"
              {...register('anzahlung_date', {
                setValueAs: (value) => (value ? new Date(value) : undefined),
              })}
            />
            {errors.anzahlung_date && (
              <p className="text-sm text-red-500">
                {(errors.anzahlung_date as any).message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="monthly_rate">
            Monatliche Rate (EUR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="monthly_rate"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('monthly_rate', { valueAsNumber: true })}
          />
          {errors.monthly_rate && (
            <p className="text-sm text-red-500">{(errors.monthly_rate as any).message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_months">
            Laufzeit (Monate) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration_months"
            type="number"
            placeholder="12"
            {...register('duration_months', { valueAsNumber: true })}
          />
          {errors.duration_months && (
            <p className="text-sm text-red-500">
              {(errors.duration_months as any).message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_month">
            Startmonat <span className="text-red-500">*</span>
          </Label>
          <Input
            id="start_month"
            type="date"
            {...register('start_month', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
          />
          {errors.start_month && (
            <p className="text-sm text-red-500">{(errors.start_month as any).message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schlussrate">Schlussrate (EUR) (optional)</Label>
          <Input
            id="schlussrate"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('schlussrate', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit">Weiter</Button>
      </div>
    </form>
  );
}

// Ratenzahlung Payment Form
function RatenzahlungPaymentForm({ data, onNext, onBack }: any) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ratenzahlungPaymentSchema),
    defaultValues: {
      anzahlung: data.payment_structure?.ratenzahlung?.anzahlung || 0,
      number_of_rates: data.payment_structure?.ratenzahlung?.number_of_rates,
      rate_amount: data.payment_structure?.ratenzahlung?.rate_amount,
      rate_interval: data.payment_structure?.ratenzahlung?.rate_interval || 'monthly',
      first_rate_date:
        data.payment_structure?.ratenzahlung?.first_rate_date || new Date(),
      schlussrate: data.payment_structure?.ratenzahlung?.schlussrate || 0,
    },
  });

  const anzahlung = watch('anzahlung');
  const rateInterval = watch('rate_interval');

  const onSubmit = (formData: any) => {
    onNext({
      payment_structure: {
        ratenzahlung: formData,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Ratenzahlung - Zahlungsstruktur</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Flexible Ratenzahlung mit individuellen Intervallen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="anzahlung">Anzahlung (EUR) (optional)</Label>
          <Input
            id="anzahlung"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('anzahlung', { valueAsNumber: true })}
          />
        </div>

        {anzahlung > 0 && (
          <div className="space-y-2">
            <Label htmlFor="anzahlung_date">Anzahlungsdatum</Label>
            <Input
              id="anzahlung_date"
              type="date"
              {...register('anzahlung_date' as any, {
                setValueAs: (value: any) => (value ? new Date(value) : undefined),
              })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="number_of_rates">
            Anzahl Raten <span className="text-red-500">*</span>
          </Label>
          <Input
            id="number_of_rates"
            type="number"
            placeholder="12"
            {...register('number_of_rates', { valueAsNumber: true })}
          />
          {errors.number_of_rates && (
            <p className="text-sm text-red-500">
              {(errors.number_of_rates as any).message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_amount">
            Ratenbetrag (EUR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rate_amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('rate_amount', { valueAsNumber: true })}
          />
          {errors.rate_amount && (
            <p className="text-sm text-red-500">{(errors.rate_amount as any).message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_interval">
            Intervall <span className="text-red-500">*</span>
          </Label>
          <Select
            value={rateInterval}
            onValueChange={(value) => setValue('rate_interval', value as any)}
          >
            <SelectTrigger id="rate_interval">
              <SelectValue placeholder="Intervall wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monatlich</SelectItem>
              <SelectItem value="quarterly">Quartalsweise</SelectItem>
              <SelectItem value="yearly">Jährlich</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_rate_date">
            Erste Rate <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_rate_date"
            type="date"
            {...register('first_rate_date', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schlussrate">Schlussrate (EUR) (optional)</Label>
          <Input
            id="schlussrate"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('schlussrate', { valueAsNumber: true })}
          />
        </div>

        {watch('schlussrate') > 0 && (
          <div className="space-y-2">
            <Label htmlFor="schlussrate_date">Schlussrate Datum</Label>
            <Input
              id="schlussrate_date"
              type="date"
              {...register('schlussrate_date' as any, {
                setValueAs: (value: any) => (value ? new Date(value) : undefined),
              })}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit">Weiter</Button>
      </div>
    </form>
  );
}
