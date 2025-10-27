'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '@/stores/useAppStore';
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
import { basicInfoSchema, BasicInfoFormData } from '@/lib/validation/investmentSchemas';
import { CATEGORY_NAMES, InvestmentCategory } from '@/types/enums';

interface BasicInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onCancel: () => void;
}

export function BasicInfoStep({ data, onNext, onCancel }: BasicInfoStepProps) {
  const companies = useAppStore((state) => state.companies);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: data.name || '',
      description: data.description || '',
      category: data.category,
      company_id: data.company_id || '',
      total_amount: data.total_amount,
      start_date: data.start_date || new Date(),
      end_date: data.end_date,
    },
  });

  const selectedCategory = watch('category');
  const selectedCompany = watch('company_id');

  const onSubmit = (formData: BasicInfoFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basis-Informationen</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Geben Sie die grundlegenden Informationen zur Investition ein.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">
            Name der Investition <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="z.B. Mercedes Actros LKW"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Beschreibung (optional)</Label>
          <textarea
            id="description"
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Zusätzliche Informationen zur Investition..."
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Kategorie <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setValue('category', value as InvestmentCategory)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">
            Unternehmen <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCompany}
            onValueChange={(value) => setValue('company_id', value)}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Unternehmen wählen" />
            </SelectTrigger>
            <SelectContent>
              {companies
                .filter((c) => c.is_active)
                .map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name} ({company.company_code})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.company_id && (
            <p className="text-sm text-red-500">{errors.company_id.message}</p>
          )}
        </div>

        {/* Total Amount */}
        <div className="space-y-2">
          <Label htmlFor="total_amount">
            Gesamtbetrag (EUR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="total_amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('total_amount', { valueAsNumber: true })}
          />
          {errors.total_amount && (
            <p className="text-sm text-red-500">{errors.total_amount.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start_date">
            Startdatum <span className="text-red-500">*</span>
          </Label>
          <Input
            id="start_date"
            type="date"
            {...register('start_date', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
            defaultValue={
              data.start_date
                ? new Date(data.start_date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
            }
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date.message}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="end_date">Enddatum (optional)</Label>
          <Input
            id="end_date"
            type="date"
            {...register('end_date', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
            defaultValue={
              data.end_date
                ? new Date(data.end_date).toISOString().split('T')[0]
                : ''
            }
          />
          {errors.end_date && (
            <p className="text-sm text-red-500">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">Weiter</Button>
      </div>
    </form>
  );
}
