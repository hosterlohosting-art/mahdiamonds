import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const items = body?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required for revalidation.", valid: false },
        { status: 400 }
      );
    }

    const result = serverStore.revalidateSelection(items);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          errors: result.errors,
          message: "One or more selections in your bag are no longer available or require review.",
          items: result.items,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      valid: true,
      authoritativeSubtotal: result.authoritativeSubtotal,
      authoritativeVat: result.authoritativeVat,
      authoritativeTotal: result.authoritativeTotal,
      items: result.items,
      revalidatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Revalidation service encountered an error.", details: err.message, valid: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/checkout/revalidate",
    methods: ["POST"],
    description: "Revalidates cart items, verifies diamond availability against live inventory, and calculates authoritative server-side pricing.",
  });
}
