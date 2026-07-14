import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        reviews: { orderBy: { createdAt: "desc" } },
      },
    })
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 })

    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      orderBy: { isBestseller: "desc" },
    })

    const data = {
      ...product,
      images: JSON.parse(product.images) as string[],
      tags: JSON.parse(product.tags) as string[],
      related: related.map((p) => ({
        ...p,
        images: JSON.parse(p.images) as string[],
        tags: JSON.parse(p.tags) as string[],
      })),
    }
    return NextResponse.json({ product: data })
  } catch (e) {
    console.error("[product] error", e)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
