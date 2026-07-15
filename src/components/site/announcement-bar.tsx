"use client"

import { Sparkles, Truck, ShieldCheck, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

const messages = [
  { icon: Truck, text: "Free shipping across India on orders above ₹2,999", color: "text-emerald" },
  { icon: ShieldCheck, text: "Lifetime polish warranty · 7-day easy returns", color: "text-sapphire" },
  { icon: Sparkles, text: "New Festive Edit — Champagne Gold Collection live now", color: "text-gold" },
  { icon: Gift, text: "Complimentary gift wrapping on every order", color: "text-ruby" },
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
              <m.icon className={cn("h-3.5 w-3.5", m.color)} />
              <span className="opacity-90">{m.text}</span>
              <span className="text-accent/60 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
