import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })

    const existing = await db.newsletter.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({
        success: true,
        message: "You're already subscribed!",
      })

    await db.newsletter.create({ data: { email } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[newsletter] error", e)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
