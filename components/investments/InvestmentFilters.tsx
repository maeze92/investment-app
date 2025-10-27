'use client';

import { Company } from '@/types/entities';
import {
  InvestmentStatus,
  InvestmentCategory,
  FinancingType,
  INVESTMENT_STATUS_NAMES,
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterState {
  status: InvestmentStatus | 'all';
  category: InvestmentCategory | 'all';
  financingType: FinancingType | 'all';
  companyId: string | 'all';
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface InvestmentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  companies: Company[];
}

export function InvestmentFilters({
  filters,
  onFiltersChange,
  companies,
}: InvestmentFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Suche</Label>
        <Input
          id="search"
          placeholder="Name oder Beschreibung..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Status wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {Object.entries(INVESTMENT_STATUS_NAMES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Kategorie</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => updateFilter('category', value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Financing Type Filter */}
      <div className="space-y-2">
        <Label htmlFor="financingType">Finanzierungstyp</Label>
        <Select
          value={filters.financingType}
          onValueChange={(value) => updateFilter('financingType', value)}
        >
          <SelectTrigger id="financingType">
            <SelectValue placeholder="Typ wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            {Object.entries(FINANCING_TYPE_NAMES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company Filter */}
      <div className="space-y-2">
        <Label htmlFor="company">Unternehmen</Label>
        <Select
          value={filters.companyId}
          onValueChange={(value) => updateFilter('companyId', value)}
        >
          <SelectTrigger id="company">
            <SelectValue placeholder="Unternehmen wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Unternehmen</SelectItem>
            {companies
              .filter((c) => c.is_active)
              .map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name} ({company.company_code})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date From */}
      <div className="space-y-2">
        <Label htmlFor="dateFrom">Von Datum</Label>
        <Input
          id="dateFrom"
          type="date"
          value={
            filters.dateFrom
              ? new Date(filters.dateFrom).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            updateFilter('dateFrom', e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>

      {/* Date To */}
      <div className="space-y-2">
        <Label htmlFor="dateTo">Bis Datum</Label>
        <Input
          id="dateTo"
          type="date"
          value={
            filters.dateTo
              ? new Date(filters.dateTo).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            updateFilter('dateTo', e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>
    </div>
  );
}
