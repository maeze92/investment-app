'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationDropdown } from './NotificationDropdown';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useAppStore();
  const { user } = useAuthStore();

  if (!user) return null;

  // Get unread count for current user
  const userNotifications = notifications.filter((n) => n.user_id === user.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <NotificationDropdown
          notifications={userNotifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
