import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { getSiteUrl } from "@/lib/utils/site-url";
import { getAllSubscriptions } from "@/lib/push/store";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webPush.setVapidDetails(
    "mailto:support@isthisrecyclable.com",
    publicKey,
    privateKey
  );
}

/**
 * Send a push notification to all subscribed clients.
 * Protect with PUSH_SEND_SECRET or use from a cron job (e.g. Vercel Cron with CRON_SECRET).
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.nextUrl.searchParams.get("secret") ??
    "";
  const sendSecret = process.env.PUSH_SEND_SECRET ?? process.env.CRON_SECRET;
  if (sendSecret && secret !== sendSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 503 }
    );
  }

  let title = "Is this recyclable?";
  let body = "Tap to check how to dispose of something.";
  try {
    const json = await request.json().catch(() => ({}));
    if (typeof json.title === "string") title = json.title;
    if (typeof json.body === "string") body = json.body;
  } catch {
    // use defaults
  }

  const payload = JSON.stringify({
    title,
    body,
    url: getSiteUrl(),
  });

  const subs = getAllSubscriptions();
  const results = await Promise.allSettled(
    subs.map((sub) =>
      webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        },
        payload,
        { TTL: 86400 }
      )
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  return NextResponse.json({
    ok: true,
    sent: subs.length - failed,
    failed,
    total: subs.length,
  });
}
