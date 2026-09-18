import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverStore } from "@/lib/server-store";

function verifyStripeSignature(payload: string, header: string, secret: string, toleranceSeconds = 300): boolean {
  try {
    const parts = header.split(",");
    let timestamp = "";
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signatures.push(value);
    }

    if (!timestamp || signatures.length === 0) return false;

    // Replay attack prevention
    const currentTime = Math.floor(Date.now() / 1000);
    const eventTime = parseInt(timestamp, 10);
    if (isNaN(eventTime) || Math.abs(currentTime - eventTime) > toleranceSeconds) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload, "utf8")
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    // Constant-time comparison
    for (const sig of signatures) {
      const sigBuffer = Buffer.from(sig, "utf8");
      if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // 1. Cryptographic Signature Validation
    if (webhookSecret) {
      if (!sig) {
        return NextResponse.json(
          { error: "Missing stripe-signature header." },
          { status: 400 }
        );
      }

      const isValid = verifyStripeSignature(payload, sig, webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid Stripe webhook signature or expired timestamp." },
          { status: 400 }
        );
      }
    }

    // 2. Strict JSON parsing
    let event: any;
    try {
      event = JSON.parse(payload);
    } catch {
      return NextResponse.json(
        { error: "Malformed webhook payload. Expected valid JSON." },
        { status: 400 }
      );
    }

    if (!event || !event.type) {
      return NextResponse.json(
        { error: "Invalid event object. Event 'type' is required." },
        { status: 400 }
      );
    }

    const eventId = event.id || `evt_${Date.now()}`;

    // 3. Idempotency Check
    if (serverStore.hasProcessedWebhook(eventId)) {
      return NextResponse.json({
        received: true,
        idempotent: true,
        message: `Event ${eventId} has already been processed.`,
      });
    }

    serverStore.recordWebhookEvent(eventId);

    // 4. Handle Event Types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const orderId = event.data?.object?.metadata?.orderId;
        const diamondId = event.data?.object?.metadata?.diamondId;
        if (orderId) {
          serverStore.updateOrderStatus(orderId, "in-atelier");
        }
        if (diamondId) {
          serverStore.markDiamondSold(diamondId, orderId);
        }
        break;
      }

      case "checkout.session.completed": {
        const orderId = event.data?.object?.metadata?.orderId || event.data?.object?.client_reference_id;
        if (orderId) {
          serverStore.updateOrderStatus(orderId, "in-atelier");
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const diamondId = event.data?.object?.metadata?.diamondId;
        if (diamondId) {
          serverStore.releaseDiamond(diamondId);
        }
        break;
      }

      default:
        // Acknowledge receipt of other event types
        break;
    }

    return NextResponse.json({
      received: true,
      eventId,
      eventType: event.type,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Webhook handler failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/checkout/webhook",
    methods: ["POST"],
    description: "Cryptographically verified Stripe webhook listener with HMAC-SHA256 signature verification and event idempotency.",
    signatureVerificationActive: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  });
}
