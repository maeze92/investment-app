'use client';

import { useState } from 'react';
import { Users, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Role } from '@/types/enums';
import { useRouter } from 'next/navigation';

const DEMO_USERS = [
  {
    email: 'admin@demo.de',
    password: 'demo',
    role: 'system_admin' as Role,
    name: 'Admin Demo',
    description: 'System Administrator',
  },
  {
    email: 'vr@demo.de',
    password: 'demo',
    role: 'vr_approval' as Role,
    name: 'VR Demo',
    description: 'Verwaltungsrat mit Genehmigungsrecht',
  },
  {
    email: 'cfo@demo.de',
    password: 'demo',
    role: 'cfo' as Role,
    name: 'CFO Demo',
    description: 'Chief Financial Officer',
  },
  {
    email: 'gf@demo.de',
    password: 'demo',
    role: 'geschaeftsfuehrer' as Role,
    name: 'GF Demo',
    description: 'Geschäftsführer',
  },
  {
    email: 'cm@demo.de',
    password: 'demo',
    role: 'cashflow_manager' as Role,
    name: 'CM Demo',
    description: 'Cashflow Manager',
  },
  {
    email: 'buchhaltung@demo.de',
    password: 'demo',
    role: 'buchhaltung' as Role,
    name: 'Buchhaltung Demo',
    description: 'Finanzbuchhaltung',
  },
];

export function RoleSwitcher() {
  const { login, user: currentUser, selectedRole } = useAuthStore();
  const users = useAppStore((state) => state.users);
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleSwitch = async (email: string, password: string, targetRole: Role) => {
    try {
      setLoading(email);

      // Find the demo user
      const user = users.find((u) => u.email === email);

      if (!user) {
        console.error('User not found:', email);
        alert('Demo user not found. Please seed the database first.');
        setLoading(null);
        return;
      }

      // Login (role will be automatically selected from user's roles)
      await login(email, password);

      // Redirect to role-specific dashboard
      const dashboardRoutes: Record<Role, string> = {
        system_admin: '/dashboard/admin',
        vr_approval: '/dashboard/vr',
        vr_viewer: '/dashboard/vr',
        cfo: '/dashboard/cfo',
        geschaeftsfuehrer: '/dashboard/gf',
        cashflow_manager: '/dashboard/cm',
        buchhaltung: '/dashboard/buchhaltung',
      };

      const route = dashboardRoutes[targetRole] || '/dashboard';
      router.push(route);

      // Reload page to ensure state is updated
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Failed to switch role:', error);
      alert('Failed to switch role. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    const colors: Record<Role, string> = {
      system_admin: 'bg-red-500 text-white',
      vr_approval: 'bg-purple-500 text-white',
      vr_viewer: 'bg-purple-300 text-black',
      cfo: 'bg-blue-500 text-white',
      geschaeftsfuehrer: 'bg-green-500 text-white',
      cashflow_manager: 'bg-yellow-500 text-black',
      buchhaltung: 'bg-gray-500 text-white',
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Role Switcher
          </CardTitle>
          <CardDescription>
            Switch between different user roles without re-logging in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current User */}
          {currentUser && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current User</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                {selectedRole && (
                  <Badge className={getRoleBadgeColor(selectedRole.role)}>
                    {selectedRole.role}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Demo Users */}
          <div className="space-y-2">
            {DEMO_USERS.map((user) => {
              const isActive = currentUser?.email === user.email;

              return (
                <Button
                  key={user.email}
                  onClick={() => handleRoleSwitch(user.email, user.password, user.role)}
                  disabled={isActive || loading !== null}
                  variant={isActive ? 'default' : 'outline'}
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge
                          variant="secondary"
                          className={getRoleBadgeColor(user.role)}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {isActive && <Check className="h-5 w-5" />}
                    {loading === user.email && (
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Switching roles will reload the page and navigate you to the
              role-specific dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
