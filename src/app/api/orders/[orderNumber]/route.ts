import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ensureTrackingEvents, TRACKING_STEPS } from "@/lib/tracking"

// Demo: advance order status (useful for the tracking page demo)
export async function POST(req: NextRequest) {
  try {
    const { orderNumber, status } = await req.json()
    if (!orderNumber || !status)
      return NextResponse.json(
        { error: "orderNumber and status required" },
        { status: 400 }
      )

    const valid = TRACKING_STEPS.find((s) => s.key === status)
    if (!valid)
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const order = await db.order.update({
      where: { orderNumber },
      data: { status },
    })
    await ensureTrackingEvents(order.id, status)
    return NextResponse.json({ success: true, status: order.status })
  } catch (e) {
    console.error("[advance status] error", e)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
