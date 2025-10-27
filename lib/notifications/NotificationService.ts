import { Notification, Cashflow, Investment } from '@/types/entities';
import { UUID, NotificationType } from '@/types/enums';
import { ruleEngine } from './ruleEngine';
import { RuleContext } from './businessRules';
import { generateUUID } from '@/lib/utils';

/**
 * Notification Service
 * Handles creation, management, and triggering of notifications
 */
export class NotificationService {
  /**
   * Create a notification manually
   */
  createNotification(
    userId: UUID,
    type: NotificationType,
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    relatedType?: 'cashflow' | 'investment',
    relatedId?: UUID
  ): Notification {
    return {
      id: generateUUID(),
      user_id: userId,
      type,
      title,
      message,
      priority,
      related_type: relatedType,
      related_id: relatedId,
      read: false,
      created_at: new Date(),
    };
  }

  /**
   * Trigger business rules for a cashflow event
   */
  triggerCashflowRules(
    cashflow: Cashflow,
    investment: Investment,
    context: Omit<RuleContext, 'cashflow' | 'investment'>
  ): Notification[] {
    const fullContext: RuleContext = {
      ...context,
      cashflow,
      investment,
    };

    return ruleEngine.evaluateRules(fullContext);
  }

  /**
   * Trigger business rules for an investment event
   */
  triggerInvestmentRules(
    investment: Investment,
    context: Omit<RuleContext, 'investment'>
  ): Notification[] {
    const fullContext: RuleContext = {
      ...context,
      investment,
    };

    return ruleEngine.evaluateRules(fullContext);
  }

  /**
   * Check daily rules (payment due, overdue, monthly report)
   * Should be run daily or when user logs in
   */
  checkDailyRules(
    cashflows: Cashflow[],
    investments: Investment[],
    context: Omit<RuleContext, 'cashflow' | 'investment'>
  ): Notification[] {
    const notifications: Notification[] = [];
    const dailyRules = ruleEngine.getDailyRules();

    // Check cashflow-related daily rules
    for (const cashflow of cashflows) {
      const investment = investments.find((inv) => inv.id === cashflow.investment_id);
      if (!investment) continue;

      const fullContext: RuleContext = {
        ...context,
        cashflow,
        investment,
      };

      for (const rule of dailyRules) {
        if (rule.id === 'payment_due_soon' || rule.id === 'payment_overdue') {
          const result = ruleEngine.evaluateRule(rule.id, fullContext);
          notifications.push(...result);
        }
      }
    }

    // Check monthly report rule
    const monthlyReportRule = dailyRules.find((r) => r.id === 'monthly_report_due');
    if (monthlyReportRule) {
      const result = ruleEngine.evaluateRule('monthly_report_due', context as RuleContext);
      notifications.push(...result);
    }

    return notifications;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): Notification {
    return {
      ...notification,
      read: true,
      read_at: new Date(),
    };
  }

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead(notifications: Notification[]): Notification[] {
    return notifications.map((n) => this.markAsRead(n));
  }

  /**
   * Filter notifications by type
   */
  filterByType(notifications: Notification[], type: NotificationType): Notification[] {
    return notifications.filter((n) => n.type === type);
  }

  /**
   * Filter notifications by priority
   */
  filterByPriority(
    notifications: Notification[],
    priority: Notification['priority']
  ): Notification[] {
    return notifications.filter((n) => n.priority === priority);
  }

  /**
   * Get unread notifications
   */
  getUnread(notifications: Notification[]): Notification[] {
    return notifications.filter((n) => !n.read);
  }

  /**
   * Get unread count
   */
  getUnreadCount(notifications: Notification[]): number {
    return this.getUnread(notifications).length;
  }

  /**
   * Sort notifications by date (newest first)
   */
  sortByDate(notifications: Notification[], descending = true): Notification[] {
    return [...notifications].sort((a, b) => {
      const diff = b.created_at.getTime() - a.created_at.getTime();
      return descending ? diff : -diff;
    });
  }

  /**
   * Sort notifications by priority
   */
  sortByPriority(notifications: Notification[]): Notification[] {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...notifications].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  /**
   * Get notifications for a specific user
   */
  getForUser(notifications: Notification[], userId: UUID): Notification[] {
    return notifications.filter((n) => n.user_id === userId);
  }

  /**
   * Delete old read notifications (older than X days)
   */
  deleteOldNotifications(
    notifications: Notification[],
    daysOld: number = 30
  ): Notification[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return notifications.filter((n) => {
      if (!n.read) return true; // Keep unread
      if (!n.read_at) return true; // Keep if no read date
      return n.read_at > cutoffDate; // Keep if read within cutoff
    });
  }
}

// Singleton instance
export const notificationService = new NotificationService();
