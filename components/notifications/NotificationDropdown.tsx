'use client';

import { useEffect, useRef } from 'react';
import { Notification } from '@/types/entities';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { CheckCheck } from 'lucide-react';
import Link from 'next/link';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { markNotificationAsRead } = useAppStore();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    onClose();
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    for (const notification of unreadNotifications) {
      await markNotificationAsRead(notification.id);
    }
  };

  // Get latest 10 notifications, sorted by date
  const latestNotifications = [...notifications]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 10);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Benachrichtigungen
          </h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {unreadCount} ungelesen
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Alle gelesen
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {latestNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Keine Benachrichtigungen</p>
          </div>
        ) : (
          latestNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              compact
            />
          ))
        )}
      </div>

      {/* Footer */}
      {latestNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <Link href="/notifications" onClick={onClose}>
            <Button variant="ghost" className="w-full text-sm" size="sm">
              Alle anzeigen
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
