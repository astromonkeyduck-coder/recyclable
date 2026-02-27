import { NextRequest, NextResponse } from "next/server";

const OFF_API = "https://world.openfoodfacts.org/api/v2/product";

export async function GET(req: NextRequest) {
  const upc = req.nextUrl.searchParams.get("upc")?.trim();
  if (!upc) {
    return NextResponse.json(
      { error: "Missing upc parameter", found: false },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${OFF_API}/${upc}.json?fields=product_name,product_name_en,packaging,packaging_tags,brands`,
      {
        headers: { "User-Agent": "IsThisRecyclable/1.0 (https://isthisrecyclable.com)" },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Product not found", found: false },
        { status: 404 }
      );
    }

    const data = (await res.json()) as {
      product?: {
        product_name?: string;
        product_name_en?: string;
        packaging?: string;
        packaging_tags?: string[];
        brands?: string;
      };
      status?: number;
    };

    const product = data.product;
    if (!product || data.status === 0) {
      return NextResponse.json(
        { error: "Product not found", found: false },
        { status: 404 }
      );
    }

    const productName =
      product.product_name_en ||
      product.product_name ||
      product.brands ||
      "Unknown product";
    const packaging = product.packaging || product.packaging_tags?.join(", ") || null;

    return NextResponse.json({
      found: true,
      productName: String(productName).trim(),
      packaging: packaging?.trim() || null,
      upc,
    });
  } catch (err) {
    console.error("Barcode lookup error:", err);
    return NextResponse.json(
      { error: "Lookup failed", found: false },
      { status: 500 }
    );
  }
}
