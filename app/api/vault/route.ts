import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || undefined;
  const shareId = searchParams.get("shareId");

  if (shareId) {
    const item = serverStore.getVaultItemByShareId(shareId);
    if (!item) {
      return NextResponse.json({ error: "Saved configuration not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  const items = serverStore.getVaultItems(email);
  return NextResponse.json({
    total: items.length,
    items,
    vault: items,
  });
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const clientEmail = body.clientEmail || body.email || "amelia.cavendish@example.com";
    const title = body.title || body.name || "Bespoke Creation";
    const product = body.product || {
      id: body.settingId || "ER-001",
      name: body.name || "Bespoke Ring Setting",
      price: body.settingPrice || 1650,
    };
    const selectedMetal = body.selectedMetal || body.metal || "Platinum";
    const selectedSize = body.selectedSize || body.size || "M";
    const diamond = body.diamond || (body.diamondId ? {
      id: body.diamondId,
      carat: body.diamondCarat || 1.5,
      shape: body.diamondShape || "Round",
      price: body.diamondPrice || 9400,
    } : undefined);
    const totalPrice = Number(body.totalPrice || (product.price + (diamond?.price || 0)));
    const notes = body.notes;

    const item = serverStore.addVaultItem({
      clientEmail,
      title: title || `${product.name} in ${selectedMetal}`,
      product,
      selectedMetal,
      selectedSize,
      diamond,
      totalPrice,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Configuration saved to your private MAH Vault.",
        item,
        vaultItem: item,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to save configuration." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }
  serverStore.removeVaultItem(id);
  return NextResponse.json({ success: true });
}
