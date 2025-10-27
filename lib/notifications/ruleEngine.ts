import {
  BusinessRule,
  RuleContext,
  RuleResult,
  ALL_BUSINESS_RULES,
} from './businessRules';
import { Notification } from '@/types/entities';
import { UUID } from '@/types/enums';
import { generateUUID } from '@/lib/utils';

// Rule Engine for evaluating business rules and generating notifications
export class RuleEngine {
  private rules: BusinessRule[];

  constructor(rules: BusinessRule[] = ALL_BUSINESS_RULES) {
    this.rules = rules;
  }

  /**
   * Evaluate all rules for a given context
   * Returns array of notifications to be created
   */
  evaluateRules(context: RuleContext): Notification[] {
    const notifications: Notification[] = [];

    for (const rule of this.rules) {
      try {
        const result = rule.evaluate(context);

        if (result && result.shouldTrigger) {
          const recipients = rule.getRecipients(context);
          const { title, message } = rule.getMessage(context);

          // Create notification for each recipient
          for (const userId of recipients) {
            const notification: Notification = {
              id: generateUUID(),
              user_id: userId,
              type: rule.type,
              title,
              message,
              priority: rule.priority,
              related_type: result.relatedType,
              related_id: result.relatedId,
              read: false,
              created_at: new Date(),
            };

            notifications.push(notification);
          }
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    return notifications;
  }

  /**
   * Evaluate a single rule
   */
  evaluateRule(ruleId: string, context: RuleContext): Notification[] {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) {
      console.warn(`Rule ${ruleId} not found`);
      return [];
    }

    try {
      const result = rule.evaluate(context);

      if (result && result.shouldTrigger) {
        const recipients = rule.getRecipients(context);
        const { title, message } = rule.getMessage(context);

        return recipients.map((userId) => ({
          id: generateUUID(),
          user_id: userId,
          type: rule.type,
          title,
          message,
          priority: rule.priority,
          related_type: result.relatedType,
          related_id: result.relatedId,
          read: false,
          created_at: new Date(),
        }));
      }
    } catch (error) {
      console.error(`Error evaluating rule ${ruleId}:`, error);
    }

    return [];
  }

  /**
   * Get rules that should run daily (time-based triggers)
   */
  getDailyRules(): BusinessRule[] {
    return this.rules.filter((rule) =>
      ['payment_due_soon', 'payment_overdue', 'monthly_report_due'].includes(rule.id)
    );
  }

  /**
   * Get rules that should run on event triggers
   */
  getEventRules(): BusinessRule[] {
    return this.rules.filter((rule) =>
      [
        'investment_submitted',
        'investment_approved',
        'investment_rejected',
        'cashflow_needs_confirmation',
        'cashflow_postponed',
      ].includes(rule.id)
    );
  }
}

// Singleton instance
export const ruleEngine = new RuleEngine();
