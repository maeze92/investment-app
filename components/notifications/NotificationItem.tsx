'use client';

import { Notification } from '@/types/entities';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  TrendingDown,
  Calendar,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
}

// Icon mapping for notification types
const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'payment_due_soon':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'payment_overdue':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case 'investment_submitted':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'investment_approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'investment_rejected':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'cashflow_needs_confirmation':
      return <DollarSign className="h-4 w-4 text-blue-600" />;
    case 'monthly_report_due':
      return <Calendar className="h-4 w-4 text-orange-600" />;
    case 'monthly_report_overdue':
      return <Calendar className="h-4 w-4 text-red-600" />;
    case 'cashflow_postponed':
      return <Clock className="h-4 w-4 text-gray-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

// Priority badge color
const getPriorityColor = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Priority label
const getPriorityLabel = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'Dringend';
    case 'high':
      return 'Hoch';
    case 'medium':
      return 'Mittel';
    case 'low':
      return 'Niedrig';
    default:
      return 'Mittel';
  }
};

// Get link for related entity
const getRelatedLink = (notification: Notification): string | null => {
  if (!notification.related_type || !notification.related_id) {
    return null;
  }

  if (notification.related_type === 'investment') {
    return `/investments/${notification.related_id}`;
  }

  if (notification.related_type === 'cashflow') {
    // Navigate to cashflows page (could be enhanced to filter by cashflow ID)
    return `/cashflows`;
  }

  return null;
};

export function NotificationItem({
  notification,
  onClick,
  compact = false,
}: NotificationItemProps) {
  const link = getRelatedLink(notification);

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors',
        !notification.read && 'bg-blue-50/50',
        compact && 'p-3'
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                'text-sm font-medium text-gray-900',
                !notification.read && 'font-semibold'
              )}
            >
              {notification.title}
            </p>
            {!compact && (
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            )}
          </div>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-blue-600 rounded-full" />
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">
            {formatDateTime(notification.created_at)}
          </span>

          {!compact && (
            <Badge
              variant="secondary"
              className={cn('text-xs', getPriorityColor(notification.priority))}
            >
              {getPriorityLabel(notification.priority)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  // Wrap in Link if there's a related entity
  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
