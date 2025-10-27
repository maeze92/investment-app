'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCheck, Trash2 } from 'lucide-react';
import { Notification } from '@/types/entities';
import { NotificationType, NotificationPriority } from '@/types/enums';
import { Navigation } from '@/components/layout/Navigation';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useAppStore();
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  if (!user) {
    return <div>Bitte einloggen</div>;
  }

  // Get user notifications
  const userNotifications = notifications.filter((n) => n.user_id === user.id);

  // Apply filters
  let filteredNotifications = userNotifications;

  if (filterType !== 'all') {
    filteredNotifications = filteredNotifications.filter((n) => n.type === filterType);
  }

  if (filterPriority !== 'all') {
    filteredNotifications = filteredNotifications.filter((n) => n.priority === filterPriority);
  }

  if (filterRead === 'read') {
    filteredNotifications = filteredNotifications.filter((n) => n.read);
  } else if (filterRead === 'unread') {
    filteredNotifications = filteredNotifications.filter((n) => !n.read);
  }

  // Sort by date (newest first)
  filteredNotifications.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = userNotifications.filter((n) => !n.read);
    for (const notification of unread) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleClearAll = async () => {
    if (confirm('Möchten Sie wirklich alle Benachrichtigungen löschen?')) {
      await clearAllNotifications();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Benachrichtigungen</CardTitle>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {unreadCount} ungelesen
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Alle als gelesen markieren
                  </Button>
                )}

                {userNotifications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Alle löschen
                  </Button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mt-4">
              <Select value={filterRead} onValueChange={(v: 'all' | 'read' | 'unread') => setFilterRead(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="unread">Ungelesen</SelectItem>
                  <SelectItem value="read">Gelesen</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={(v: NotificationPriority | 'all') => setFilterPriority(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priorität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="urgent">Dringend</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="low">Niedrig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>Keine Benachrichtigungen gefunden</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
