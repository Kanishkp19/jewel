"use client"

import { motion } from "framer-motion"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { useRouter } from "@/lib/router"
import { siteConfig } from "@/lib/site"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const { navigate } = useRouter()
  const [email, setEmail] = useState("")

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast.success("Welcome to Provelaa! Check your inbox for 10% off.")
        setEmail("")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Something went wrong.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
  }

  return (
    <footer className="mt-auto bg-ink text-cream/90">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-luxe py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">
              The Provelaa Circle
            </p>
            <h3 className="font-serif text-3xl lg:text-4xl text-cream">
              Join for early access & <span className="text-gold-gradient">10% off</span> your first order
            </h3>
            <p className="mt-3 text-cream/60 max-w-md">
              Be the first to know about new collections, atelier stories and members-only offers.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md lg:ml-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-white/15 rounded-l-full px-5 py-3.5 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-gold-gradient text-ink rounded-r-full px-6 py-3.5 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Join
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container-luxe py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <button
            onClick={() => navigate({ name: "home" })}
            className="flex flex-col items-start"
          >
            <span className="font-serif text-3xl tracking-[0.18em] uppercase text-cream">
              Provelaa
            </span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-cream/50 mt-1">
              Fine Jewellery · Est. 2019
            </span>
          </button>
          <p className="mt-4 text-sm text-cream/60 max-w-sm">
            Handcrafted in our Mumbai atelier with ethically sourced materials.
            Each piece is designed to be worn, layered and loved for a lifetime.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[
              { Icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
              { Icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
              { Icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-accent hover:text-ink hover:border-accent transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { label: "Rings", onClick: () => navigate({ name: "shop", category: "rings" }) },
            { label: "Necklaces", onClick: () => navigate({ name: "shop", category: "necklaces" }) },
            { label: "Earrings", onClick: () => navigate({ name: "shop", category: "earrings" }) },
            { label: "Mangalsutra", onClick: () => navigate({ name: "shop", category: "mangalsutra" }) },
            { label: "Bracelets", onClick: () => navigate({ name: "shop", category: "bracelets" }) },
          ]}
        />
        <FooterCol
          title="Care"
          links={[
            { label: "Track Order", onClick: () => navigate({ name: "track" }) },
            { label: "Shipping & Returns", onClick: () => navigate({ name: "contact" }) },
            { label: "Jewellery Care", onClick: () => navigate({ name: "about" }) },
            { label: "Warranty", onClick: () => navigate({ name: "about" }) },
            { label: "Contact Us", onClick: () => navigate({ name: "contact" }) },
          ]}
        />
        <FooterCol
          title="Brand"
          links={[
            { label: "Our Story", onClick: () => navigate({ name: "about" }) },
            { label: "Craftsmanship", onClick: () => navigate({ name: "about" }) },
            { label: "Sustainability", onClick: () => navigate({ name: "about" }) },
            { label: "Press", onClick: () => navigate({ name: "about" }) },
          ]}
        />
      </div>

      {/* Contact strip */}
      <div className="border-t border-white/10">
        <div className="container-luxe py-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs text-cream/60">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 hover:text-accent">
              <Mail className="h-3.5 w-3.5" /> {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2 hover:text-accent">
              <Phone className="h-3.5 w-3.5" /> {siteConfig.phone}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Mumbai, India
            </span>
          </div>
          <p>© {new Date().getFullYear()} Provelaa Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; onClick: () => void }[]
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <button
              onClick={l.onClick}
              className="text-sm text-cream/70 hover:text-cream hover:translate-x-1 inline-block transition-all"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
