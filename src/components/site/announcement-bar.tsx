"use client"

import { Sparkles, Truck, ShieldCheck, Gift } from "lucide-react"

const messages = [
  { icon: Truck, text: "Free shipping across India on orders above ₹2,999" },
  { icon: ShieldCheck, text: "Lifetime polish warranty · 7-day easy returns" },
  { icon: Sparkles, text: "New Festive Edit — Champagne Gold Collection live now" },
  { icon: Gift, text: "Complimentary gift wrapping on every order" },
]

export function AnnouncementBar() {
  const stream = [...messages, ...messages]
  return (
    <div className="bg-ink text-cream text-[11px] sm:text-xs tracking-wide overflow-hidden border-b border-white/5">
      <div className="relative flex">
        <div className="marquee-track py-2.5">
          {stream.map((m, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-6 uppercase"
            >
              <m.icon className="h-3.5 w-3.5 text-accent" />
              <span className="opacity-90">{m.text}</span>
              <span className="text-accent/60 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
