import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const collections = await db.collection.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ collections })
  } catch (e) {
    console.error("[collections] error", e)
    return NextResponse.json({ collections: [] })
  }
}
