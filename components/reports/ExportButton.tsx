'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ReportDialog } from './ReportDialog';

interface ExportButtonProps {
  type: 'investments' | 'cashflows' | 'monthly' | 'yearly';
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton({
  type,
  label = 'Exportieren',
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        {label}
      </Button>

      {isOpen && <ReportDialog type={type} onClose={() => setIsOpen(false)} />}
    </>
  );
}
