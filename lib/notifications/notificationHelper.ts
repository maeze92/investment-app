import { Notification, UserRole, Group, User, Investment, Cashflow } from '@/types/entities';
import { storageService } from '@/lib/storage/LocalStorageService';
import { notificationService } from './NotificationService';

/**
 * Helper functions to create and store notifications
 */

// Create rule context from current app state
export function createRuleContext(currentDate: Date = new Date()) {
  const db = storageService.getDatabase();

  return {
    users: db.users,
    userRoles: db.userRoles,
    groups: db.groups,
    currentDate,
  };
}

// Trigger investment rules and save notifications
export async function triggerInvestmentNotifications(
  investment: Investment
): Promise<void> {
  const context = createRuleContext();
  const notifications = notificationService.triggerInvestmentRules(investment, context);

  // Save notifications to storage
  for (const notification of notifications) {
    const notificationData: Omit<Notification, 'id'> = notification;
    await storageService.create<Notification>('notifications', notificationData);
  }
}

// Trigger cashflow rules and save notifications
export async function triggerCashflowNotifications(
  cashflow: Cashflow,
  investment: Investment
): Promise<void> {
  const context = createRuleContext();
  const notifications = notificationService.triggerCashflowRules(
    cashflow,
    investment,
    context
  );

  // Save notifications to storage
  for (const notification of notifications) {
    const notificationData: Omit<Notification, 'id'> = notification;
    await storageService.create<Notification>('notifications', notificationData);
  }
}

// Check daily rules on app initialization
export async function checkDailyNotifications(): Promise<void> {
  const db = storageService.getDatabase();
  const context = createRuleContext();

  const notifications = notificationService.checkDailyRules(
    db.cashflows,
    db.investments,
    context
  );

  // Save notifications (avoid duplicates by checking if similar notification exists)
  for (const notification of notifications) {
    // Simple duplicate check: same type + same related_id + created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDuplicate = db.notifications.some(
      (n) =>
        n.type === notification.type &&
        n.related_id === notification.related_id &&
        new Date(n.created_at) >= today
    );

    if (!isDuplicate) {
      const notificationData: Omit<Notification, 'id'> = notification;
      await storageService.create<Notification>('notifications', notificationData);
    }
  }
}
