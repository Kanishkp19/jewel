"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Send,
  MessageCircle,
} from "lucide-react"
import { siteConfig } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ContactView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success("Message sent! We'll be in touch within 24 hours.")
        setForm({ name: "", email: "", subject: "General", message: "" })
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-luxe py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-12 lg:mb-16"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">
          We're Here to Help
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-tight">
          Let's talk jewellery
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Questions about a piece, your order, or a custom request? Our team
          responds within 24 hours, Monday to Saturday.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-ink text-cream rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-luxe-radial opacity-30" />
            <div className="relative">
              <h2 className="font-serif text-2xl mb-6">Reach us directly</h2>
              <ul className="space-y-5">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-ink transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-cream/60">
                        Email
                      </p>
                      <p className="text-sm">{siteConfig.email}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-ink transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-cream/60">
                        Phone / WhatsApp
                      </p>
                      <p className="text-sm">{siteConfig.phone}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cream/60">
                      Atelier
                    </p>
                    <p className="text-sm leading-relaxed">{siteConfig.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cream/60">
                      Hours
                    </p>
                    <p className="text-sm">Mon–Sat · 11am – 8pm IST</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-cream/60 mb-3">
                  Follow our journey
                </p>
                <div className="flex items-center gap-3">
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
            </div>
          </div>

          <div className="bg-champagne/50 border border-border rounded-2xl p-6">
            <MessageCircle className="h-6 w-6 text-accent mb-3" />
            <h3 className="font-serif text-lg text-ink">Quick questions?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              For order tracking, use our{" "}
              <a
                href="#/track"
                className="text-accent-foreground underline underline-offset-2"
              >
                Track Order
              </a>{" "}
              page. For everything else, drop us a note — we love hearing from
              you.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <form
            onSubmit={submit}
            className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-luxe space-y-5"
          >
            <h2 className="font-serif text-2xl text-ink">Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg h-11"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg h-11"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs uppercase tracking-widest">
                Subject
              </Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-lg h-11"
                placeholder="What's this about?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs uppercase tracking-widest">
                Message *
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-lg min-h-[160px] resize-none"
                placeholder="Tell us how we can help…"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gold-gradient text-ink hover:opacity-90 rounded-full h-12 px-8"
            >
              {loading ? (
                "Sending…"
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
