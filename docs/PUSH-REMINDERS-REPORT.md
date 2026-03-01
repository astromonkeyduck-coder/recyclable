# Report: Web Push Reminders for Home-Screen Installations

**Document purpose:** Technical report of implementation work, for handoff to an AI researcher or other developer.  
**Project:** isthisrecyclable.com  
**Feature:** Lock-screen / notification-tray reminders for users who add the site to their home screen (similar to Duolingo’s reminder prompts).

---

## 1. Context and goal

The site is a PWA (Progressive Web App) with an existing “Add to Home Screen” flow. The request was to add **special options for the home screen**—in particular, **reminders that appear on the lock screen** to nudge users back to the site.

This is implemented using the **Web Push API**: users opt in to notifications; the server stores push subscriptions and can later send a payload; the **service worker** receives the push and displays a **notification** (which appears on the lock screen and in the system notification tray). Tapping the notification opens the site.

---

## 2. What was implemented (summary)

| Area | What was done |
|------|----------------|
| **Service worker** | Added `push` and `notificationclick` listeners so the app can show notifications and open the site when the user taps one. |
| **Backend APIs** | Three routes: one to expose the VAPID public key, one to accept and store push subscriptions, one to send a notification to all stored subscriptions. |
| **Subscription storage** | In-memory store (single process). Documented that production should use a persistent store (e.g. DB/KV). |
| **Client UI** | “Reminders” opt-in in the footer (request permission, subscribe, send subscription to backend). |
| **Docs and env** | Setup instructions, env variable notes, and a short guide for sending reminders (manual and cron). |

No changes were made to the existing PWA manifest or install prompt; the new feature is additive.

---

## 3. Files created or modified

### Created

- **`src/lib/push/store.ts`**  
  In-memory store for push subscriptions: `addSubscription`, `removeSubscription`, `getAllSubscriptions`. Intended to be replaced by a DB in production.

- **`src/app/api/push/vapid-public/route.ts`**  
  `GET /api/push/vapid-public` — returns the VAPID public key (from env) so the client can create a push subscription.

- **`src/app/api/push/subscribe/route.ts`**  
  `POST /api/push/subscribe` — accepts a Web Push subscription object (JSON), validates with Zod, and stores it via the store above.

- **`src/app/api/push/send/route.ts`**  
  `POST /api/push/send` — sends one notification to all stored subscriptions using the `web-push` library. Optional JSON body: `{ "title", "body" }`. Can be protected with `PUSH_SEND_SECRET` or `CRON_SECRET` (Bearer token or `?secret=`).

- **`src/components/common/push-reminder-opt-in.tsx`**  
  Client component: “Reminders” control in the footer. Requests notification permission, fetches VAPID public key, subscribes via the service worker’s `PushManager`, POSTs the subscription to `/api/push/subscribe`, and reflects state (idle / loading / subscribed / denied / error).

- **`docs/push-reminders.md`**  
  User-facing guide: how the feature works, env setup, how to send reminders (manual and cron), production notes (persistent store, iOS, unsubscribe).

- **`docs/PUSH-REMINDERS-REPORT.md`**  
  This report.

### Modified

- **`public/sw.js`**  
  Appended:
  - `push` listener: parses JSON payload (`title`, `body`, `url`, `tag`), shows a system notification with icon/badge, stores `url` in `data` for click handling.
  - `notificationclick` listener: closes notification, opens/focuses a window to the URL from `data`, or opens a new window if none.

- **`src/components/layout/footer.tsx`**  
  Imported `PushReminderOptIn` and rendered it in the “App” column of the footer (next to Share).

- **`.env.example`**  
  Added commented placeholders and one-line explanation for: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `PUSH_SEND_SECRET`.

### Dependency added

- **`web-push`** (npm) — used in `/api/push/send` to encrypt and send payloads to the browser’s push service (VAPID).

---

## 4. Technical details (for researchers / auditors)

- **Standards:** Web Push API, Notifications API, VAPID (RFC 8292). No proprietary or non-standard APIs.
- **Security:** VAPID private key is server-only. Public key is exposed via `/api/push/vapid-public`. Sending is optionally protected by a shared secret (`PUSH_SEND_SECRET` / `CRON_SECRET`). No user identity or PII is required for subscription storage in the current design.
- **Privacy:** Subscriptions are endpoint + keys only. No analytics or tracking was added. The site’s existing privacy policy and data practices apply.
- **Browser/OS support:** Works in supported browsers (e.g. Chrome, Firefox, Edge, Safari 16+). On iOS, push is supported for home-screen–installed PWAs (iOS 16.4+).
- **Limitation:** Subscriptions are stored in memory only; they are lost on server restart. Production use requires a persistent store and, if desired, unsubscribe and subscription lifecycle (e.g. remove on 4xx from push service).

---

## 5. What the product owner needs to do (exact steps)

### Step 1: Generate VAPID keys (one time)

In the project directory, run:

```bash
npx web-push generate-vapid-keys
```

You will get two keys (e.g. a long base64 string for “Public Key” and one for “Private Key”).

### Step 2: Add environment variables

In your real environment (e.g. `.env` for local, Vercel/host env for production), set:

- **`VAPID_PUBLIC_KEY`** = the *public* key from step 1  
- **`VAPID_PRIVATE_KEY`** = the *private* key from step 1  
- **`NEXT_PUBLIC_VAPID_PUBLIC_KEY`** = same value as `VAPID_PUBLIC_KEY`  

Optional but recommended for production:

- **`PUSH_SEND_SECRET`** = a long random string you invent (e.g. from a password generator). This will be used to authorize calls to “send” reminders.

Do not commit `.env` or real keys to version control.

### Step 3: Deploy

Deploy the app as usual (e.g. `git push` if you use Vercel). Ensure the env vars from step 2 are set in the deployment environment.

### Step 4: (Optional) Schedule reminders

To send reminders on a schedule (e.g. daily):

- **Option A – Vercel Cron**  
  In `vercel.json`, add a cron job that runs on the desired schedule and does an HTTP request to `POST https://your-domain.com/api/push/send` with:
  - Header: `Authorization: Bearer YOUR_PUSH_SEND_SECRET`  
  - Body (optional): `{ "title": "Is this recyclable?", "body": "Tap to check how to dispose of something." }`

- **Option B – Manual or external cron**  
  Use the same `POST /api/push/send` request (with the same secret and optional body) from a script, cron server, or GitHub Action when you want to send a reminder.

If you did not set `PUSH_SEND_SECRET`, anyone who can reach your site can call `/api/push/send`; setting it is recommended for production.

### Step 5: (Production) Persist subscriptions

The current code keeps subscriptions only in memory. After a restart or on serverless cold starts, subscriptions are lost. For production:

- Add a persistent store (e.g. Postgres, Redis, Vercel KV).
- In `src/lib/push/store.ts`, replace the in-memory array with calls to that store (add on subscribe, remove on unsubscribe or when the push service returns 4xx, list for send).

Details and unsubscribe considerations are in `docs/push-reminders.md`.

---

## 6. Quick reference

- **User flow:** Footer → “Reminders” → allow notifications → subscription stored → later, server calls send API → user sees notification on lock screen / tray → tap opens site.
- **Send a reminder once (e.g. for testing):**  
  `curl -X POST https://your-domain.com/api/push/send -H "Authorization: Bearer YOUR_PUSH_SEND_SECRET" -H "Content-Type: application/json" -d '{"title":"Is this recyclable?","body":"Tap to check how to dispose of something."}'`
- **Docs:** `docs/push-reminders.md` (setup, sending, production notes).

---

*End of report.*
