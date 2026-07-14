import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import {
  generateOrderNumber,
  generateTrackingId,
  ensureTrackingEvents,
} from "@/lib/tracking"
import { siteConfig } from "@/lib/site"

type CartItemInput = {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  metal?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      customer,
      payment,
    }: {
      items: CartItemInput[]
      customer: {
        email: string
        phone: string
        firstName: string
        lastName: string
        address: string
        apartment?: string
        city: string
        state: string
        pincode: string
        country?: string
        notes?: string
      }
      payment: { method: string; status?: string }
    } = body

    if (!items || items.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping =
      subtotal >= siteConfig.shipping.freeOver ? 0 : siteConfig.shipping.flatRate
    const total = subtotal + shipping

    const orderNumber = generateOrderNumber()
    const trackingId = generateTrackingId()
    const carrier = "Bluedart"

    const order = await db.order.create({
      data: {
        orderNumber,
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        apartment: customer.apartment || null,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        country: customer.country || "India",
        subtotal,
        shipping,
        total,
        paymentMethod: payment.method,
        paymentStatus: payment.status || "paid",
        status: "placed",
        trackingId,
        carrier,
        notes: customer.notes || null,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            metal: i.metal || null,
          })),
        },
      },
      include: { items: true },
    })

    await ensureTrackingEvents(order.id, "placed")

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        trackingId: order.trackingId,
        carrier: order.carrier,
        total: order.total,
        email: order.email,
      },
    })
  } catch (e) {
    console.error("[checkout] error", e)
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    )
  }
}
