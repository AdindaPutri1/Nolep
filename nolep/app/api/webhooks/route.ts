// app/api/webhooks/route.ts
import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    // sekarang req punya semua properti yang dibutuhkan RequestLike
    const evt = await verifyWebhook(req);

    // contoh logging payload
    console.log("Received webhook:", evt.type, evt.data);

    return Response.json({ received: true });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
