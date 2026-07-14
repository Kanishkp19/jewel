import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !message)
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      )

    await db.contactMessage.create({
      data: { name, email, subject: subject || "General", message },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[contact] error", e)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
