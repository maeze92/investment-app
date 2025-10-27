'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { metadataSchema, MetadataFormData } from '@/lib/validation/investmentSchemas';

interface MetadataStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function MetadataStep({ data, onNext, onBack }: MetadataStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      vendor: data.vendor || '',
      contract_number: data.contract_number || '',
      internal_reference: data.internal_reference || '',
    },
  });

  const onSubmit = (formData: MetadataFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Metadaten & Zusatzinformationen</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Alle Felder sind optional. Sie können diese Informationen auch später hinzufügen.
        </p>
      </div>

      <div className="space-y-4">
        {/* Vendor */}
        <div className="space-y-2">
          <Label htmlFor="vendor">Lieferant / Anbieter</Label>
          <Input
            id="vendor"
            placeholder="z.B. Mercedes-Benz AG"
            {...register('vendor')}
          />
          {errors.vendor && (
            <p className="text-sm text-red-500">{errors.vendor.message}</p>
          )}
        </div>

        {/* Contract Number */}
        <div className="space-y-2">
          <Label htmlFor="contract_number">Vertragsnummer</Label>
          <Input
            id="contract_number"
            placeholder="z.B. V-2025-12345"
            {...register('contract_number')}
          />
          {errors.contract_number && (
            <p className="text-sm text-red-500">{errors.contract_number.message}</p>
          )}
        </div>

        {/* Internal Reference */}
        <div className="space-y-2">
          <Label htmlFor="internal_reference">Interne Referenz</Label>
          <Input
            id="internal_reference"
            placeholder="z.B. INV-2025-001"
            {...register('internal_reference')}
          />
          {errors.internal_reference && (
            <p className="text-sm text-red-500">{errors.internal_reference.message}</p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-gray-50 p-4 border">
        <p className="text-sm text-gray-700">
          <strong>Tipp:</strong> Diese Informationen helfen Ihnen, Investitionen später
          schneller zu finden und zuzuordnen. Sie können jederzeit bearbeitet werden.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit">Weiter zur Zusammenfassung</Button>
      </div>
    </form>
  );
}
