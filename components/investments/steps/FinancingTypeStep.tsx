'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { financingTypeSchema, FinancingTypeFormData } from '@/lib/validation/investmentSchemas';
import { FINANCING_TYPE_NAMES, FinancingType } from '@/types/enums';

interface FinancingTypeStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const FINANCING_TYPE_DESCRIPTIONS: Record<FinancingType, string> = {
  kauf: 'Einmalige Zahlung des vollständigen Betrags',
  leasing: 'Monatliche Raten über einen festgelegten Zeitraum mit optionaler Kaufoption',
  ratenzahlung: 'Flexibl e Ratenzahlung mit individuellen Intervallen und Beträgen',
  miete: 'Monatliche Mietzahlungen ohne Kaufoption',
};

export function FinancingTypeStep({ data, onNext, onBack }: FinancingTypeStepProps) {
  const [selectedType, setSelectedType] = useState<FinancingType | undefined>(
    data.financing_type
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FinancingTypeFormData>({
    resolver: zodResolver(financingTypeSchema),
    defaultValues: {
      financing_type: data.financing_type,
    },
  });

  const handleSelectType = (type: FinancingType) => {
    setSelectedType(type);
    setValue('financing_type', type);
  };

  const onSubmit = (formData: FinancingTypeFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Finanzierungstyp</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Wählen Sie aus, wie die Investition finanziert werden soll.
        </p>
      </div>

      {/* Financing Type Options */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(FINANCING_TYPE_NAMES) as FinancingType[]).map((type) => (
          <Card
            key={type}
            className={`cursor-pointer p-4 transition-all hover:shadow-md ${
              selectedType === type
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'hover:border-gray-400'
            }`}
            onClick={() => handleSelectType(type)}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedType === type
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedType === type && (
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base">
                  {FINANCING_TYPE_NAMES[type]}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {FINANCING_TYPE_DESCRIPTIONS[type]}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {errors.financing_type && (
        <p className="text-sm text-red-500">{errors.financing_type.message}</p>
      )}

      {/* Info Box */}
      {selectedType && (
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Hinweis:</strong> Im nächsten Schritt werden Sie die Details zur{' '}
            {FINANCING_TYPE_NAMES[selectedType]?.toLowerCase()} angeben.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit" disabled={!selectedType}>
          Weiter
        </Button>
      </div>
    </form>
  );
}
