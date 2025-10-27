'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { ROLE_NAMES } from '@/types/enums';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const logout = useAuthStore((state) => state.logout);

  if (!user || !selectedRole) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/investments', label: 'Investitionen' },
    // Only show Approvals for VR with approval rights
    ...(selectedRole.role === 'vr_approval'
      ? [{ href: '/approvals', label: 'Genehmigungen' }]
      : []),
    // Show Cashflows for CM, GF, CFO, Buchhaltung
    ...(['cashflow_manager', 'geschaeftsfuehrer', 'cfo', 'buchhaltung'].includes(
      selectedRole.role
    )
      ? [{ href: '/cashflows', label: 'Cashflows' }]
      : []),
    // Show Admin for system admins
    ...(isAdmin() ? [{ href: '/dashboard/admin', label: 'Administration' }] : []),
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold">Investitionsplanung</h1>
            <p className="text-sm text-muted-foreground">
              {user.name} - {ROLE_NAMES[selectedRole.role]}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={cn(
                    'font-medium',
                    pathname === item.href && 'pointer-events-none'
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <Button variant="outline" onClick={handleLogout}>
            Abmelden
          </Button>
        </div>
      </div>
    </header>
  );
}
