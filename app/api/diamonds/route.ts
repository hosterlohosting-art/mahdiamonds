import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const shape = searchParams.get("shape") || undefined;
  const minCarat = searchParams.get("minCarat") ? parseFloat(searchParams.get("minCarat")!) : undefined;
  const maxCarat = searchParams.get("maxCarat") ? parseFloat(searchParams.get("maxCarat")!) : undefined;

  const results = serverStore.getDiamonds({
    type,
    shape,
    minCarat,
    maxCarat,
  });

  return NextResponse.json({
    total: results.length,
    diamonds: results,
  });
}
