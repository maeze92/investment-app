import { Notification } from '@/types/entities';

/**
 * Notification Queue
 * Manages pending notifications and batch processing
 */
export class NotificationQueue {
  private queue: Notification[] = [];
  private processing = false;

  /**
   * Add notification to queue
   */
  enqueue(notification: Notification): void {
    this.queue.push(notification);
  }

  /**
   * Add multiple notifications to queue
   */
  enqueueMultiple(notifications: Notification[]): void {
    this.queue.push(...notifications);
  }

  /**
   * Get all pending notifications
   */
  getPending(): Notification[] {
    return [...this.queue];
  }

  /**
   * Get count of pending notifications
   */
  getPendingCount(): number {
    return this.queue.length;
  }

  /**
   * Process all pending notifications
   * Returns the notifications that were processed
   */
  async process(
    handler: (notifications: Notification[]) => Promise<void>
  ): Promise<Notification[]> {
    if (this.processing || this.queue.length === 0) {
      return [];
    }

    this.processing = true;
    const toProcess = [...this.queue];
    this.queue = [];

    try {
      await handler(toProcess);
      return toProcess;
    } catch (error) {
      console.error('Error processing notification queue:', error);
      // Re-queue failed notifications
      this.queue.push(...toProcess);
      return [];
    } finally {
      this.processing = false;
    }
  }

  /**
   * Clear all pending notifications
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Check if queue is processing
   */
  isProcessing(): boolean {
    return this.processing;
  }
}

// Singleton instance
export const notificationQueue = new NotificationQueue();
