import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || searchParams.get("orderNumber");
  if (id) {
    const order = serverStore.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }
  const orders = serverStore.getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const clientName = body.clientName || body.customerName || "Private Client";
    const clientEmail = body.clientEmail || body.email || "client@mahdiamonds.co.uk";
    const clientPhone = body.clientPhone || body.phone || "";
    const deliveryType = body.deliveryType || body.deliveryMethod || "insured-courier";
    const salonLocation = body.salonLocation;
    const shippingAddress = body.shippingAddress;
    const packaging = body.packaging;
    const paymentMethod = body.paymentMethod || "card";
    const items = body.items;
    const total = Number(body.total || body.subtotal || 0);
    const subtotal = Number(body.subtotal || total);

    if (!clientName || !clientEmail || !items || !items.length) {
      return NextResponse.json(
        { error: "Client details and order items are required." },
        { status: 400 }
      );
    }

    const order = serverStore.addOrder({
      clientName,
      clientEmail,
      clientPhone,
      deliveryType,
      salonLocation,
      shippingAddress,
      packaging: {
        signatureBox: packaging?.signatureBox ?? true,
        waxSealedDossier: packaging?.waxSealedDossier ?? true,
        calligraphyGiftCard: packaging?.calligraphyGiftCard || "",
      },
      paymentMethod,
      subtotal,
      vat: 0,
      total,
      items,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully. Thank you for choosing MAH Diamonds.",
        order,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
