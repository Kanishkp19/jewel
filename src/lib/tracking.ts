import { db } from "@/lib/db"

export const TRACKING_STEPS = [
  { key: "placed", title: "Order Placed", description: "We've received your order.", icon: "CheckCircle" },
  { key: "confirmed", title: "Order Confirmed", description: "Payment verified, preparing your piece.", icon: "BadgeCheck" },
  { key: "packed", title: "Packed with Care", description: "Polished, packaged & ready to ship.", icon: "Package" },
  { key: "shipped", title: "Shipped", description: "On its way from our Mumbai atelier.", icon: "Truck" },
  { key: "out_for_delivery", title: "Out for Delivery", description: "Arriving today via courier.", icon: "Bike" },
  { key: "delivered", title: "Delivered", description: "Enjoy your Provelaa treasure.", icon: "Gift" },
] as const

export type TrackingStep = (typeof TRACKING_STEPS)[number]

export function getTrackingIndex(status: string) {
  const idx = TRACKING_STEPS.findIndex((s) => s.key === status)
  return idx === -1 ? 0 : idx
}

export async function ensureTrackingEvents(orderId: string, status: string) {
  const existing = await db.trackingEvent.findMany({
    where: { orderId },
    orderBy: { timestamp: "asc" },
  })
  const existingKeys = new Set(existing.map((e) => e.status))
  const statusIdx = getTrackingIndex(status)
  const locations = [
    "Mumbai Atelier",
    "Mumbai Sort Facility",
    "Mumbai Hub",
    "In Transit",
    "Local Courier Hub",
    "Delivered",
  ]
  type CreateInput = {
    orderId: string
    status: string
    title: string
    description: string
    location: string | null
    timestamp: Date
  }
  const toCreate: CreateInput[] = []
  for (let i = 0; i <= statusIdx; i++) {
    const step = TRACKING_STEPS[i]
    if (!existingKeys.has(step.key)) {
      const ts = new Date(Date.now() - (statusIdx - i) * 6 * 60 * 60 * 1000)
      toCreate.push({
        orderId,
        status: step.key,
        title: step.title,
        description: step.description,
        location: locations[i] || null,
        timestamp: ts,
      })
    }
  }
  if (toCreate.length > 0) {
    await db.trackingEvent.createMany({ data: toCreate })
  }
  return db.trackingEvent.findMany({
    where: { orderId },
    orderBy: { timestamp: "asc" },
  })
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase().slice(-6)
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `PRV-${ts}${rand}`
}

export function generateTrackingId() {
  return `TRK${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}IN`
}
