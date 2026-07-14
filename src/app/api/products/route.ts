import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const collection = searchParams.get("collection")
    const q = searchParams.get("q")
    const metal = searchParams.get("metal")
    const sort = searchParams.get("sort") || "featured"
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const limit = searchParams.get("limit")
    const bestseller = searchParams.get("bestseller")
    const newArrival = searchParams.get("newArrival")

     
    const where: any = {}
    if (category) where.category = { slug: { equals: category } }
    if (collection) where.collection = { slug: { equals: collection } }
    if (metal) where.metal = { equals: metal }
    if (q)
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ]
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }
    if (bestseller === "true") where.isBestseller = true
    if (newArrival === "true") where.isNewArrival = true

     
    let orderBy: any = { createdAt: "desc" }
    if (sort === "price-asc") orderBy = { price: "asc" }
    if (sort === "price-desc") orderBy = { price: "desc" }
    if (sort === "rating") orderBy = { rating: "desc" }
    if (sort === "featured")
      orderBy = [{ isBestseller: "desc" }, { rating: "desc" }]

    const products = await db.product.findMany({
      where,
      orderBy,
      include: { category: true, collection: true },
      take: limit ? Number(limit) : undefined,
    })

    const data = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images) as string[],
      tags: JSON.parse(p.tags) as string[],
    }))

    return NextResponse.json({ products: data })
  } catch (e) {
    console.error("[products] error", e)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
