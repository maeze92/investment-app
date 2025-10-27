'use client';

import { useState } from 'react';
import { Investment, Company } from '@/types/entities';
import {
  INVESTMENT_STATUS_NAMES,
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
  InvestmentStatus,
} from '@/types/enums';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvestmentTableProps {
  investments: Investment[];
  companies: Company[];
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

type SortField = 'name' | 'total_amount' | 'start_date' | 'status' | 'category' | 'company';
type SortDirection = 'asc' | 'desc';

export function InvestmentTable({
  investments,
  companies,
  onViewDetails,
  onEdit,
}: InvestmentTableProps) {
  const [sortField, setSortField] = useState<SortField>('start_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Get company name helper
  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || 'Unbekannt';
  };

  // Status badge color
  const getStatusColor = (status: InvestmentStatus) => {
    switch (status) {
      case 'entwurf':
        return 'default';
      case 'zur_genehmigung':
        return 'secondary';
      case 'genehmigt':
        return 'default';
      case 'abgelehnt':
        return 'destructive';
      case 'aktiv':
        return 'default';
      case 'abgeschlossen':
        return 'default';
      default:
        return 'default';
    }
  };

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvestments = [...investments].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'total_amount':
        aValue = a.total_amount;
        bValue = b.total_amount;
        break;
      case 'start_date':
        aValue = new Date(a.start_date).getTime();
        bValue = new Date(b.start_date).getTime();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'company':
        aValue = getCompanyName(a.company_id);
        bValue = getCompanyName(b.company_id);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInvestments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvestments = sortedInvestments.slice(startIndex, endIndex);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (investments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">Keine Investitionen gefunden</p>
        <p className="text-sm text-muted-foreground">
          Erstellen Sie Ihre erste Investition oder passen Sie die Filter an.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('company')}
              >
                Unternehmen <SortIcon field="company" />
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('category')}
              >
                Kategorie <SortIcon field="category" />
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('total_amount')}
              >
                Betrag <SortIcon field="total_amount" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Finanzierung</th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('start_date')}
              >
                Startdatum <SortIcon field="start_date" />
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvestments.map((investment) => (
              <tr
                key={investment.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{investment.name}</div>
                  {investment.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {investment.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{getCompanyName(investment.company_id)}</td>
                <td className="px-4 py-3 text-sm">{CATEGORY_NAMES[investment.category]}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatCurrency(investment.total_amount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {FINANCING_TYPE_NAMES[investment.financing_type]}
                </td>
                <td className="px-4 py-3 text-sm">{formatDate(investment.start_date)}</td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusColor(investment.status)}>
                    {INVESTMENT_STATUS_NAMES[investment.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(investment.id)}
                    >
                      Details
                    </Button>
                    {investment.status === 'entwurf' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(investment.id)}
                      >
                        Bearbeiten
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Seite {currentPage} von {totalPages} ({sortedInvestments.length} Einträge)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
