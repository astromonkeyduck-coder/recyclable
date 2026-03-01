/**
 * In-memory store for push subscriptions.
 * For production, replace with a database (e.g. Redis, Postgres, Vercel KV).
 */

export interface StoredPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: number | null;
  createdAt: number;
}

const subscriptions: StoredPushSubscription[] = [];

export function addSubscription(sub: StoredPushSubscription): void {
  const exists = subscriptions.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subscriptions.push({ ...sub, createdAt: Date.now() });
  }
}

export function removeSubscription(endpoint: string): void {
  const i = subscriptions.findIndex((s) => s.endpoint === endpoint);
  if (i !== -1) subscriptions.splice(i, 1);
}

export function getAllSubscriptions(): StoredPushSubscription[] {
  return [...subscriptions];
}
