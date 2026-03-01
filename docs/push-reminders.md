# Lock-screen reminders (Web Push)

When users add your site to their home screen, they can opt in to **reminder notifications** that appear on the lock screen and in the notification tray—similar to Duolingo’s “Time for your lesson!” prompts.

## How it works

1. User adds the site to the home screen (existing PWA install prompt).
2. User taps **Reminders** in the footer and allows notifications.
3. Your server stores the push subscription.
4. You send a reminder (e.g. daily) by calling the send API; the browser shows the notification and opening it opens your site.

## Setup

### 1. Generate VAPID keys

```bash
npx web-push generate-vapid-keys
```

Add both keys to your environment (e.g. `.env`):

- `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = same value as `VAPID_PUBLIC_KEY` (so the client can subscribe)

### 2. Optional: protect the send endpoint

To avoid anyone triggering reminders, set `PUSH_SEND_SECRET` and send it when calling the send API (header or query):

- Header: `Authorization: Bearer YOUR_PUSH_SEND_SECRET`
- Or query: `?secret=YOUR_PUSH_SEND_SECRET`

## Sending reminders

**Manual (e.g. curl):**

```bash
curl -X POST https://your-site.com/api/push/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PUSH_SEND_SECRET" \
  -d '{"title":"Is this recyclable?","body":"Tap to check how to dispose of something."}'
```

**Scheduled (e.g. daily):**

- **Vercel Cron**: add to `vercel.json` a cron that hits `POST /api/push/send` with your secret.
- **GitHub Actions / external cron**: run the `curl` above on a schedule.

## Production notes

- **Subscription storage**: The default in-memory store in `src/lib/push/store.ts` is lost on restart. For production, replace it with a database (e.g. Postgres, Redis, Vercel KV) and implement `addSubscription`, `removeSubscription`, and `getAllSubscriptions` against that store.
- **iOS**: Push works for home-screen installs on iOS 16.4+.
- **Unsubscribe**: You can add an “Unsubscribe” flow that calls `removeSubscription(subscription.endpoint)` and, on the client, `registration.pushManager.getSubscription()` then `subscription.unsubscribe()`.
