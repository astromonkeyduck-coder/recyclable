import { NextRequest, NextResponse } from "next/server";

const OFF_API = "https://world.openfoodfacts.org/api/v2/product";
const UPC_DB_API = "https://api.upcitemdb.com/prod/trial/lookup";

export async function GET(req: NextRequest) {
  const upc = req.nextUrl.searchParams.get("upc")?.trim();
  if (!upc) {
    return NextResponse.json(
      { error: "Missing upc parameter", found: false },
      { status: 400 }
    );
  }

  // Try Open Food Facts first
  try {
    const res = await fetch(
      `${OFF_API}/${encodeURIComponent(upc)}.json?fields=product_name,product_name_en,packaging,packaging_tags,brands,categories`,
      {
        headers: {
          "User-Agent": "IsThisRecyclable/1.0 (https://isthisrecyclable.com)",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const product = data?.product;

      if (product && data.status !== 0) {
        const productName =
          product.product_name_en ||
          product.product_name ||
          (product.brands ? `${product.brands} product` : null);

        if (productName) {
          const packaging =
            product.packaging ||
            product.packaging_tags?.join(", ") ||
            null;

          return NextResponse.json({
            found: true,
            productName: String(productName).trim(),
            packaging: packaging?.trim() || null,
            upc,
          });
        }
      }
    }
  } catch {
    // Open Food Facts failed, try fallback
  }

  // Try UPC Item DB as fallback
  try {
    const res = await fetch(`${UPC_DB_API}?upc=${encodeURIComponent(upc)}`, {
      headers: {
        "User-Agent": "IsThisRecyclable/1.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const items = data?.items;
      if (Array.isArray(items) && items.length > 0) {
        const item = items[0];
        const name = item.title || item.brand || null;
        if (name) {
          return NextResponse.json({
            found: true,
            productName: String(name).trim(),
            packaging: item.category?.trim() || null,
            upc,
          });
        }
      }
    }
  } catch {
    // Fallback also failed
  }

  return NextResponse.json({
    found: false,
    error: "Product not found in database",
    upc,
  });
}
