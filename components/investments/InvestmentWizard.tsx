'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { FinancingTypeStep } from './steps/FinancingTypeStep';
import { PaymentStructureStep } from './steps/PaymentStructureStep';
import { MetadataStep } from './steps/MetadataStep';
import { SummaryStep } from './steps/SummaryStep';
import { FinancingType, InvestmentCategory } from '@/types/enums';
import { PaymentStructure, Investment } from '@/types/entities';

interface WizardData {
  // Step 1: Basic Info
  name: string;
  description?: string;
  category?: InvestmentCategory;
  company_id?: string;
  total_amount?: number;
  start_date?: Date;
  end_date?: Date;

  // Step 2: Financing Type
  financing_type?: FinancingType;

  // Step 3: Payment Structure
  payment_structure?: PaymentStructure;

  // Step 4: Metadata
  vendor?: string;
  contract_number?: string;
  internal_reference?: string;
}

interface InvestmentWizardProps {
  mode?: 'create' | 'edit';
  existingInvestment?: Investment;
  onCancel?: () => void;
}

const STEPS = [
  { id: 1, name: 'Basis-Informationen', description: 'Name, Kategorie, Betrag' },
  { id: 2, name: 'Finanzierungstyp', description: 'Kauf, Leasing, Ratenzahlung' },
  { id: 3, name: 'Zahlungsstruktur', description: 'Raten und Zahlungspläne' },
  { id: 4, name: 'Metadaten', description: 'Lieferant, Verträge' },
  { id: 5, name: 'Zusammenfassung', description: 'Überprüfen und speichern' },
];

export function InvestmentWizard({
  mode = 'create',
  existingInvestment,
  onCancel
}: InvestmentWizardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const createInvestment = useAppStore((state) => state.createInvestment);
  const updateInvestment = useAppStore((state) => state.updateInvestment);

  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    if (mode === 'edit' && existingInvestment) {
      return {
        name: existingInvestment.name,
        description: existingInvestment.description,
        category: existingInvestment.category,
        company_id: existingInvestment.company_id,
        total_amount: existingInvestment.total_amount,
        start_date: new Date(existingInvestment.start_date),
        end_date: existingInvestment.end_date ? new Date(existingInvestment.end_date) : undefined,
        financing_type: existingInvestment.financing_type,
        payment_structure: existingInvestment.payment_structure,
        vendor: existingInvestment.metadata.vendor,
        contract_number: existingInvestment.metadata.contract_number,
        internal_reference: existingInvestment.metadata.internal_reference,
      };
    }
    return { name: '' };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = (stepData: Partial<WizardData>) => {
    updateWizardData(stepData);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      if (mode === 'edit' && existingInvestment) {
        // Update existing investment (company_id and financing_type cannot be changed)
        await updateInvestment(existingInvestment.id, {
          name: wizardData.name,
          description: wizardData.description,
          category: wizardData.category!,
          total_amount: wizardData.total_amount!,
          start_date: wizardData.start_date!,
          end_date: wizardData.end_date,
          payment_structure: wizardData.payment_structure!,
          metadata: {
            vendor: wizardData.vendor,
            contract_number: wizardData.contract_number,
            internal_reference: wizardData.internal_reference,
          },
        });

        // If submitting for approval, update status
        if (action === 'submit') {
          // TODO: Call submitInvestmentForApproval
          // await submitInvestmentForApproval(existingInvestment.id);
        }

        // Redirect to investment details
        router.push(`/investments/${existingInvestment.id}`);
      } else {
        // Create new investment
        const investment = await createInvestment({
          name: wizardData.name,
          description: wizardData.description,
          category: wizardData.category!,
          company_id: wizardData.company_id!,
          total_amount: wizardData.total_amount!,
          financing_type: wizardData.financing_type!,
          start_date: wizardData.start_date!,
          end_date: wizardData.end_date,
          payment_structure: wizardData.payment_structure!,
          metadata: {
            vendor: wizardData.vendor,
            contract_number: wizardData.contract_number,
            internal_reference: wizardData.internal_reference,
          },
        });

        // If submitting for approval, update status
        if (action === 'submit') {
          // TODO: Call submitInvestmentForApproval
          // await submitInvestmentForApproval(investment.id);
        }

        // Redirect to investment details or list
        router.push('/investments');
      }
    } catch (error) {
      console.error(`Failed to ${mode} investment:`, error);
      alert(`Fehler beim ${mode === 'edit' ? 'Aktualisieren' : 'Erstellen'} der Investition`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={wizardData}
            onNext={handleNext}
            onCancel={onCancel || (() => router.push('/investments'))}
          />
        );
      case 2:
        return (
          <FinancingTypeStep
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PaymentStructureStep
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <MetadataStep
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <SummaryStep
            data={wizardData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Steps */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                      step.id < currentStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="hidden text-xs text-gray-400 md:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </div>
  );
}
