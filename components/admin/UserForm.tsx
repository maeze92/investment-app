'use client';

import { useState } from 'react';
import { User } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserFormProps {
  user?: User;
  onSubmit: (data: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Only for new users
    avatar: user?.avatar || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        password_hash: formData.password || 'demo', // Default password
        avatar: formData.avatar || undefined,
        last_login: user?.last_login,
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Benutzerinformationen</h3>

        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="z.B. Max Mustermann"
          />
        </div>

        <div>
          <Label htmlFor="email">E-Mail-Adresse *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="z.B. max.mustermann@example.com"
          />
          {user && (
            <p className="text-xs text-muted-foreground mt-1">
              Die E-Mail-Adresse wird als Benutzername verwendet
            </p>
          )}
        </div>

        {!user && (
          <div>
            <Label htmlFor="password">Passwort *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Passwort eingeben"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leer lassen für Standard-Passwort: &quot;demo&quot;
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="avatar">Avatar URL (optional)</Label>
          <Input
            id="avatar"
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>

      {user && (
        <div className="rounded-lg border p-4 bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Zusätzliche Informationen</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Erstellt am:{' '}
              {new Date(user.created_at).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
            {user.last_login && (
              <p>
                Letzter Login:{' '}
                {new Date(user.last_login).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Wird gespeichert...' : user ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
