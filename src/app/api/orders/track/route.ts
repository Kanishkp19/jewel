import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ensureTrackingEvents, TRACKING_STEPS, getTrackingIndex } from "@/lib/tracking"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get("orderNumber")
    const email = searchParams.get("email")

    if (!orderNumber)
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      )

    const order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        trackingEvents: { orderBy: { timestamp: "asc" } },
      },
    })

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // Optional email verification
    if (email && order.email.toLowerCase() !== email.toLowerCase())
      return NextResponse.json(
        { error: "Email does not match this order" },
        { status: 403 }
      )

    // Ensure tracking events exist
    let events = order.trackingEvents
    if (events.length === 0) {
      events = await ensureTrackingEvents(order.id, order.status)
    }

    const currentStep = getTrackingIndex(order.status)
    const steps = TRACKING_STEPS.map((s, i) => ({
      ...s,
      completed: i <= currentStep,
      current: i === currentStep,
      timestamp: events.find((e) => e.status === s.key)?.timestamp || null,
      location: events.find((e) => e.status === s.key)?.location || null,
    }))

    // ETA: 2-3 days from order if not delivered
    const eta =
      order.status === "delivered"
        ? null
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        trackingId: order.trackingId,
        carrier: order.carrier,
        status: order.status,
        currentStep,
        totalSteps: TRACKING_STEPS.length,
        eta,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          metal: i.metal,
        })),
        shipping: {
          name: `${order.firstName} ${order.lastName}`,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
        },
        steps,
        events: events.map((e) => ({
          status: e.status,
          title: e.title,
          description: e.description,
          location: e.location,
          timestamp: e.timestamp,
        })),
      },
    })
  } catch (e) {
    console.error("[track] error", e)
    return NextResponse.json(
      { error: "Failed to fetch tracking" },
      { status: 500 }
    )
  }
}
