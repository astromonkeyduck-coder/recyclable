import { NextResponse } from "next/server";

/**
 * Returns the VAPID public key so the client can create a push subscription.
 * Safe to expose; the private key must stay server-only.
 */
export function GET() {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "VAPID public key not configured" },
      { status: 503 }
    );
  }
  return NextResponse.json({ publicKey: key });
}
