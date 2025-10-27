'use client';

import { useState } from 'react';
import { Company, Group } from '@/types/entities';
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

interface CompanyFormProps {
  company?: Company;
  groups: Group[];
  onSubmit: (data: Omit<Company, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

export function CompanyForm({ company, groups, onSubmit, onCancel }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    companyCode: company?.company_code || '',
    groupId: company?.group_id || (groups[0]?.id || ''),
    isActive: company?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name: formData.name,
        company_code: formData.companyCode,
        group_id: formData.groupId,
        is_active: formData.isActive,
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCompanyCode = () => {
    // Generate a random 4-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, companyCode: code });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Unternehmensinformationen</h3>

        <div>
          <Label htmlFor="name">Unternehmensname *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="z.B. Muster GmbH"
          />
        </div>

        <div>
          <Label htmlFor="companyCode">Firmencode * (4 Zeichen)</Label>
          <div className="flex gap-2">
            <Input
              id="companyCode"
              value={formData.companyCode}
              onChange={(e) =>
                setFormData({ ...formData, companyCode: e.target.value.toUpperCase() })
              }
              required
              maxLength={4}
              placeholder="z.B. MSTR"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={generateCompanyCode}>
              Generieren
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Eindeutiger 4-stelliger Code zur Identifikation des Unternehmens
          </p>
        </div>

        <div>
          <Label htmlFor="group">Zugehörige Gruppe *</Label>
          <Select
            value={formData.groupId}
            onValueChange={(value) => setFormData({ ...formData, groupId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Gruppe auswählen" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="isActive">Aktiv</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Wird gespeichert...' : company ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
