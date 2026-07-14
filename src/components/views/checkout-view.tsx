"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  ChevronDown,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Truck,
  Tag,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { useCart, type CartItem } from "@/lib/cart-store"
import { siteConfig, formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// ============================================================================
// Types
// ============================================================================

type PaymentMethod = "card" | "upi" | "cod"

type CustomerForm = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  pincode: string
  country: string
  notes: string
}

type CardForm = {
  number: string
  expiry: string
  cvv: string
  name: string
}

type OrderResult = {
  orderNumber: string
  trackingId: string
  carrier: string
  total: number
  email: string
}

// ============================================================================
// Constants
// ============================================================================

const PROMO_CODE = "PROVELAA10"
const PROMO_DISCOUNT = 0.1 // 10% off subtotal

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const

const TRUST_BADGES = [
  { Icon: Lock, label: "Secure Checkout" },
  { Icon: ShieldCheck, label: "Encrypted" },
  { Icon: RefreshCw, label: "Easy Returns" },
]

const UPI_APPS = ["GPay", "PhonePe", "Paytm"] as const

// ============================================================================
// Helpers
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\d{10}$/
const PINCODE_RE = /^\d{6}$/

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function formatCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4)
}

// ============================================================================
// Small shared primitives
// ============================================================================

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[11px] uppercase tracking-[0.4em] text-accent font-medium",
        className
      )}
    >
      {children}
    </p>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 text-xs text-destructive flex items-center gap-1">
      <AlertCircle className="size-3" />
      {message}
    </p>
  )
}

// Image with graceful fallback to champagne gradient — same pattern as home-view
function LuxeImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [errored, setErrored] = React.useState(false)
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!errored ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-champagne via-muted to-accent/30" />
      )}
    </div>
  )
}

// ============================================================================
// Trust badges row
// ============================================================================

function TrustBadgesRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-2 text-center",
        className
      )}
    >
      {TRUST_BADGES.map(({ Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-2 py-3"
        >
          <Icon className="size-4 text-accent" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Section shell — animated reveal wrapper
// ============================================================================

function SectionShell({
  eyebrow,
  title,
  step,
  children,
  delay = 0,
}: {
  eyebrow: string
  title: string
  step: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="relative rounded-2xl border border-border/60 bg-card shadow-luxe overflow-hidden"
    >
      <div className="bg-luxe-radial px-5 py-4 sm:px-7 sm:py-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <span
            className="flex size-7 items-center justify-center rounded-full bg-gold-gradient text-xs font-serif font-semibold text-ink shadow-gold"
            aria-hidden
          >
            {step}
          </span>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="font-serif text-xl sm:text-2xl text-ink leading-tight -mt-0.5">
              {title}
            </h2>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
    </motion.section>
  )
}

// ============================================================================
// Contact & Shipping section
// ============================================================================

function ContactShippingSection({
  form,
  setField,
  errors,
  delay,
}: {
  form: CustomerForm
  setField: <K extends keyof CustomerForm>(k: K, v: CustomerForm[K]) => void
  errors: Partial<Record<keyof CustomerForm, string>>
  delay: number
}) {
  return (
    <SectionShell
      step="1"
      eyebrow="Step One"
      title="Contact & Shipping"
      delay={delay}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="ck-email">Email address</Label>
          <Input
            id="ck-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!errors.email}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.email} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="ck-phone">Phone (10-digit)</Label>
          <Input
            id="ck-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            maxLength={10}
            value={form.phone}
            onChange={(e) =>
              setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            aria-invalid={!!errors.phone}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-firstName">First name</Label>
          <Input
            id="ck-firstName"
            autoComplete="given-name"
            placeholder="Ananya"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.firstName} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-lastName">Last name</Label>
          <Input
            id="ck-lastName"
            autoComplete="family-name"
            placeholder="Sharma"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.lastName} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="ck-address">Street address</Label>
          <Input
            id="ck-address"
            autoComplete="address-line1"
            placeholder="Flat, building, street"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
            aria-invalid={!!errors.address}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.address} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="ck-apartment">
            Apartment, suite, etc.{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Input
            id="ck-apartment"
            autoComplete="address-line2"
            placeholder="Apartment 12B"
            value={form.apartment}
            onChange={(e) => setField("apartment", e.target.value)}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-city">City</Label>
          <Input
            id="ck-city"
            autoComplete="address-level2"
            placeholder="Mumbai"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            aria-invalid={!!errors.city}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.city} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-state">State</Label>
          <select
            id="ck-state"
            autoComplete="address-level1"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            aria-invalid={!!errors.state}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
              "focus-visible:border-accent focus-visible:ring-accent/30 focus-visible:ring-[3px]",
              errors.state && "border-destructive"
            )}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.state} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-pincode">PIN code (6-digit)</Label>
          <Input
            id="ck-pincode"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="400050"
            maxLength={6}
            value={form.pincode}
            onChange={(e) =>
              setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            aria-invalid={!!errors.pincode}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
          <FieldError message={errors.pincode} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ck-country">Country</Label>
          <Input
            id="ck-country"
            value={form.country}
            disabled
            className="bg-muted/50 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-[11px] text-muted-foreground">
            We currently ship across India only.
          </p>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="ck-notes">
            Order notes{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="ck-notes"
            rows={3}
            placeholder="Delivery instructions, gift message…"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            className="focus-visible:border-accent focus-visible:ring-accent/30"
          />
        </div>
      </div>
    </SectionShell>
  )
}

// ============================================================================
// Payment method section
// ============================================================================

function PaymentMethodSection({
  method,
  setMethod,
  card,
  setCardField,
  upiId,
  setUpiId,
  codTotal,
  delay,
}: {
  method: PaymentMethod
  setMethod: (m: PaymentMethod) => void
  card: CardForm
  setCardField: <K extends keyof CardForm>(k: K, v: CardForm[K]) => void
  upiId: string
  setUpiId: (v: string) => void
  codTotal: number
  delay: number
}) {
  const options: {
    value: PaymentMethod
    label: string
    description: string
    Icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      value: "card",
      label: "Credit / Debit Card",
      description: "Visa, Mastercard, RuPay, Amex",
      Icon: CreditCard,
    },
    {
      value: "upi",
      label: "UPI",
      description: "GPay, PhonePe, Paytm & more",
      Icon: Smartphone,
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      description: "Pay when your order arrives",
      Icon: Banknote,
    },
  ]

  return (
    <SectionShell
      step="2"
      eyebrow="Step Two"
      title="Payment Method"
      delay={delay}
    >
      <RadioGroup
        value={method}
        onValueChange={(v) => setMethod(v as PaymentMethod)}
        className="grid gap-3"
      >
        {options.map(({ value, label, description, Icon }) => {
          const selected = method === value
          return (
            <label
              key={value}
              htmlFor={`pm-${value}`}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                selected
                  ? "border-accent bg-accent/5 shadow-gold"
                  : "border-border/70 hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              <RadioGroupItem
                id={`pm-${value}`}
                value={value}
                className="mt-1 border-accent text-accent data-[state=checked]:border-accent"
              />
              <Icon
                className={cn(
                  "size-5 mt-0.5",
                  selected ? "text-accent" : "text-muted-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </label>
          )
        })}
      </RadioGroup>

      <AnimatePresence mode="wait">
        {method === "card" && (
          <motion.div
            key="card-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ck-card-number">Card number</Label>
                <Input
                  id="ck-card-number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={card.number}
                  onChange={(e) =>
                    setCardField("number", formatCardNumber(e.target.value))
                  }
                  className="focus-visible:border-accent focus-visible:ring-accent/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ck-card-expiry">Expiry (MM/YY)</Label>
                  <Input
                    id="ck-card-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCardField("expiry", formatExpiry(e.target.value))
                    }
                    className="focus-visible:border-accent focus-visible:ring-accent/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ck-card-cvv">CVV</Label>
                  <Input
                    id="ck-card-cvv"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) =>
                      setCardField("cvv", formatCvv(e.target.value))
                    }
                    className="focus-visible:border-accent focus-visible:ring-accent/30"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-card-name">Name on card</Label>
                <Input
                  id="ck-card-name"
                  autoComplete="cc-name"
                  placeholder="As printed on the card"
                  value={card.name}
                  onChange={(e) => setCardField("name", e.target.value)}
                  className="focus-visible:border-accent focus-visible:ring-accent/30"
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3 text-accent" />
                Demo payment gateway — no real charge.
              </p>
            </div>
          </motion.div>
        )}

        {method === "upi" && (
          <motion.div
            key="upi-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ck-upi-id">UPI ID</Label>
                <Input
                  id="ck-upi-id"
                  inputMode="email"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="focus-visible:border-accent focus-visible:ring-accent/30"
                />
                <p className="text-[11px] text-muted-foreground">
                  Enter the UPI ID linked to your bank account.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Or pay with
                </p>
                <div className="flex flex-wrap gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card px-3 py-2 text-sm font-medium text-ink transition-all hover:border-accent hover:bg-accent/5 hover:shadow-gold"
                    >
                      <Smartphone className="size-3.5 text-accent" />
                      {app}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3 text-accent" />
                Demo payment gateway — no real charge.
              </p>
            </div>
          </motion.div>
        )}

        {method === "cod" && (
          <motion.div
            key="cod-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-sm text-foreground flex items-center gap-2">
                <Banknote className="size-4 text-accent" />
                Pay{" "}
                <span className="font-semibold text-ink">
                  {formatPrice(codTotal)}
                </span>{" "}
                on delivery.
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Please keep exact change ready. A small COD handling fee may
                apply.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  )
}

// ============================================================================
// Review & Place Order section
// ============================================================================

function ReviewSection({
  total,
  agreedToTerms,
  setAgreedToTerms,
  onSubmit,
  loading,
  error,
  canSubmit,
  delay,
}: {
  total: number
  agreedToTerms: boolean
  setAgreedToTerms: (v: boolean) => void
  onSubmit: () => void
  loading: boolean
  error: string | null
  canSubmit: boolean
  delay: number
}) {
  return (
    <SectionShell
      step="3"
      eyebrow="Step Three"
      title="Review & Place Order"
      delay={delay}
    >
      <div className="space-y-5">
        <label
          htmlFor="ck-terms"
          className="flex items-start gap-3 cursor-pointer group"
        >
          <Checkbox
            id="ck-terms"
            checked={agreedToTerms}
            onCheckedChange={(v) => setAgreedToTerms(v === true)}
            className="mt-0.5 border-accent data-[state=checked]:bg-gold-gradient data-[state=checked]:border-accent data-[state=checked]:text-ink"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            I agree to the{" "}
            <span className="text-ink underline-offset-2 underline decoration-accent/50">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-ink underline-offset-2 underline decoration-accent/50">
              Privacy Policy
            </span>
            .
          </span>
        </label>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className="relative h-14 w-full rounded-xl bg-gold-gradient text-base font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Placing your order…
            </>
          ) : (
            <>
              <Lock className="size-4" />
              Place Order — {formatPrice(total)}
            </>
          )}
        </Button>

        <TrustBadgesRow />
      </div>
    </SectionShell>
  )
}

// ============================================================================
// Order summary section
// ============================================================================

function SummaryItemRow({ item }: { item: CartItem }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
        <LuxeImage src={item.image} alt={item.name} className="size-10" />
        <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-cream shadow-luxe">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-ink">{item.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {item.metal} · Qty {item.quantity}
        </p>
      </div>
      <p className="text-sm font-semibold text-ink">
        {formatPrice(item.price * item.quantity)}
      </p>
    </li>
  )
}

function OrderSummaryCard({
  items,
  subtotal,
  shipping,
  discount,
  total,
  promoCode,
  setPromoCode,
  appliedPromo,
  applyPromo,
  removePromo,
}: {
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  promoCode: string
  setPromoCode: (v: string) => void
  appliedPromo: boolean
  applyPromo: () => void
  removePromo: () => void
}) {
  const freeShipping = shipping === 0
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-luxe overflow-hidden">
      <div className="bg-luxe-radial px-5 py-4 sm:px-6 sm:py-5 border-b border-border/60">
        <h2 className="font-serif text-xl sm:text-2xl text-ink">
          Order Summary
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {items.length} {items.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="px-5 sm:px-6 pt-2">
        {items.length > 0 && (
          <ul
            className={cn(
              "divide-y divide-border/50",
              items.length > 4 && "max-h-72 overflow-y-auto scrollbar-luxe pr-1 -mr-1"
            )}
          >
            {items.map((item) => (
              <SummaryItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>

      <div className="px-5 sm:px-6 py-4 space-y-4">
        {/* Promo code */}
        <div className="space-y-2">
          <Label
            htmlFor="ck-promo"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Promo code
          </Label>
          {appliedPromo ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-accent/40 bg-accent/5 px-3 py-2">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Tag className="size-3.5 text-accent" />
                {PROMO_CODE}
              </span>
              <Badge className="bg-gold-gradient text-ink hover:bg-gold-gradient">
                Applied!
              </Badge>
              <button
                type="button"
                onClick={removePromo}
                aria-label={`Remove ${PROMO_CODE} promo code`}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id="ck-promo"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    applyPromo()
                  }
                }}
                className="focus-visible:border-accent focus-visible:ring-accent/30"
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyPromo}
                disabled={!promoCode.trim()}
                className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent"
              >
                Apply
              </Button>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            Try{" "}
            <button
              type="button"
              onClick={() => setPromoCode(PROMO_CODE)}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              {PROMO_CODE}
            </button>{" "}
            for 10% off.
          </p>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-ink">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            {freeShipping ? (
              <span className="font-medium text-green-700 dark:text-green-500">
                Free
              </span>
            ) : (
              <span className="text-ink">{formatPrice(shipping)}</span>
            )}
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount (10%)</span>
              <span className="font-medium text-green-700 dark:text-green-500">
                −{formatPrice(discount)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="font-serif text-2xl text-ink mt-0.5">
              {formatPrice(total)}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Incl. all taxes
          </p>
        </div>

        {subtotal < siteConfig.shipping.freeOver && (
          <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-ink">
            <Truck className="size-3.5 text-accent shrink-0" />
            <span>
              Add{" "}
              <span className="font-semibold">
                {formatPrice(siteConfig.shipping.freeOver - subtotal)}
              </span>{" "}
              more for free shipping.
            </span>
          </div>
        )}

        <TrustBadgesRow />
      </div>
    </div>
  )
}

// ============================================================================
// Animated success checkmark
// ============================================================================

function SuccessCheckmark() {
  return (
    <div className="relative mx-auto mb-6 size-24">
      {/* Soft gold sparkles around the check */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-accent"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos((i / 6) * Math.PI * 2) * 48,
            y: Math.sin((i / 6) * Math.PI * 2) * 48,
          }}
          transition={{
            duration: 1.2,
            delay: 0.5 + i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          delay: 0.1,
        }}
        className="flex size-24 items-center justify-center rounded-full bg-gold-gradient shadow-gold"
      >
        <motion.svg
          viewBox="0 0 52 52"
          className="size-12"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--ink)" }}
        >
          <motion.path
            d="M14 27 L22 35 L38 17"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.span>
    </div>
  )
}

// ============================================================================
// Success state
// ============================================================================

function SuccessState({
  result,
  onTrack,
  onContinue,
}: {
  result: OrderResult
  onTrack: () => void
  onContinue: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-luxe">
        <div className="bg-luxe-radial px-6 py-10 sm:px-12 sm:py-14 text-center">
          <SuccessCheckmark />

          <Eyebrow className="mb-3">Order Confirmed</Eyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink text-balance leading-tight">
            Thank you for your order!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            We&apos;ve received your order and our atelier is already preparing
            it with care.
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-2xl border border-border/60 bg-background/60 p-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Order number
                </p>
                <p className="font-serif text-lg text-ink mt-0.5 break-all">
                  {result.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Tracking ID
                </p>
                <p className="font-serif text-lg text-ink mt-0.5 break-all">
                  {result.trackingId}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Carrier
                </p>
                <p className="text-sm text-ink mt-0.5">{result.carrier}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Order total
                </p>
                <p className="text-sm text-ink mt-0.5">
                  {formatPrice(result.total)}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="flex items-center gap-2 text-sm text-ink">
              <Sparkles className="size-4 text-accent" />
              Confirmation sent to{" "}
              <span className="font-medium">{result.email}</span>
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 text-accent" />
              Estimated delivery: 3–5 business days
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="button"
              onClick={onTrack}
              className="h-12 rounded-xl bg-gold-gradient text-ink shadow-gold hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              Track Your Order
              <ArrowRight className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onContinue}
              className="h-12 rounded-xl border-ink/30 text-ink hover:bg-ink hover:text-cream"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Empty cart state
// ============================================================================

function EmptyCartState({ onExplore }: { onExplore: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-xl text-center py-16 sm:py-24"
    >
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-luxe-radial border border-border/60">
        <ShoppingBag className="size-8 text-accent" />
      </div>
      <Eyebrow className="mb-3">Your cart</Eyebrow>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink">
        Your cart is empty
      </h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
        Discover handcrafted jewellery made to be treasured for a lifetime.
      </p>
      <Button
        type="button"
        onClick={onExplore}
        className="mt-7 h-12 rounded-xl bg-gold-gradient text-ink shadow-gold hover:scale-[1.01] active:scale-[0.99] transition-transform"
      >
        Explore Collection
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  )
}

// ============================================================================
// Mobile summary collapsible
// ============================================================================

function MobileSummaryCollapsible({
  items,
  subtotal,
  shipping,
  discount,
  total,
  promoCode,
  setPromoCode,
  appliedPromo,
  applyPromo,
  removePromo,
  itemCount,
}: {
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  promoCode: string
  setPromoCode: (v: string) => void
  appliedPromo: boolean
  applyPromo: () => void
  removePromo: () => void
  itemCount: number
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="lg:hidden rounded-2xl border border-border/60 bg-card shadow-luxe overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
            {appliedPromo ? "incl. 10% off" : "no discount"}
          </p>
          <p className="font-serif text-xl text-ink">
            {formatPrice(total)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {open ? "Hide" : "Show"} details
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="size-4" />
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                appliedPromo={appliedPromo}
                applyPromo={applyPromo}
                removePromo={removePromo}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Main CheckoutView
// ============================================================================

export default function CheckoutView() {
  const { navigate } = useRouter()
  const cart = useCart()
  const [mounted, setMounted] = React.useState(false)

  // Customer + payment + UI state
  const [form, setForm] = React.useState<CustomerForm>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    notes: "",
  })
  const [method, setMethod] = React.useState<PaymentMethod>("card")
  const [card, setCard] = React.useState<CardForm>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [upiId, setUpiId] = React.useState("")

  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [orderResult, setOrderResult] = React.useState<OrderResult | null>(null)

  const [promoCode, setPromoCode] = React.useState("")
  const [appliedPromo, setAppliedPromo] = React.useState(false)
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CustomerForm, string>>
  >({})

  // Hydration guard
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const setField = React.useCallback(
    <K extends keyof CustomerForm>(k: K, v: CustomerForm[K]) => {
      setForm((prev) => ({ ...prev, [k]: v }))
      setErrors((prev) => ({ ...prev, [k]: undefined }))
    },
    []
  )

  const setCardField = React.useCallback(
    <K extends keyof CardForm>(k: K, v: CardForm[K]) => {
      setCard((prev) => ({ ...prev, [k]: v }))
    },
    []
  )

  // Derived cart values
  const items = cart.items
  const itemCount = cart.count()
  const subtotal = cart.subtotal()
  const freeShipping = subtotal >= siteConfig.shipping.freeOver
  const shipping = items.length === 0 || freeShipping ? 0 : siteConfig.shipping.flatRate
  const discount = appliedPromo ? Math.round(subtotal * PROMO_DISCOUNT) : 0
  const total = Math.max(0, subtotal - discount + shipping)

  // Promo handling
  const applyPromo = React.useCallback(() => {
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setAppliedPromo(true)
      toast.success("Promo applied!", {
        description: "10% off your subtotal.",
      })
    } else {
      setAppliedPromo(false)
      toast.error("Invalid promo code", {
        description: `Try ${PROMO_CODE} for 10% off.`,
      })
    }
  }, [promoCode])

  const removePromo = React.useCallback(() => {
    setAppliedPromo(false)
    setPromoCode("")
    toast("Promo removed", { description: "Discount cleared." })
  }, [])

  // Validation
  const validate = React.useCallback((): boolean => {
    const next: Partial<Record<keyof CustomerForm, string>> = {}
    if (!form.email.trim()) next.email = "Email is required"
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email"
    if (!form.phone.trim()) next.phone = "Phone is required"
    else if (!PHONE_RE.test(form.phone))
      next.phone = "Enter a 10-digit mobile number"
    if (!form.firstName.trim()) next.firstName = "First name is required"
    if (!form.lastName.trim()) next.lastName = "Last name is required"
    if (!form.address.trim()) next.address = "Address is required"
    if (!form.city.trim()) next.city = "City is required"
    if (!form.state.trim()) next.state = "State is required"
    if (!form.pincode.trim()) next.pincode = "PIN code is required"
    else if (!PINCODE_RE.test(form.pincode))
      next.pincode = "Enter a 6-digit PIN"
    setErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const requiredFieldsFilled =
    !!form.email.trim() &&
    !!form.phone.trim() &&
    !!form.firstName.trim() &&
    !!form.lastName.trim() &&
    !!form.address.trim() &&
    !!form.city.trim() &&
    !!form.state.trim() &&
    !!form.pincode.trim()

  const canSubmit = requiredFieldsFilled && agreedToTerms && items.length > 0

  // Submit
  const onSubmit = React.useCallback(async () => {
    if (loading) return
    setError(null)
    if (!validate()) {
      toast.error("Please complete required fields", {
        description: "Highlighted fields need your attention.",
      })
      return
    }
    if (!agreedToTerms) {
      setError("Please accept the Terms & Privacy Policy to continue.")
      return
    }
    setLoading(true)
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          metal: i.metal,
        })),
        customer: {
          email: form.email.trim(),
          phone: form.phone.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address: form.address.trim(),
          apartment: form.apartment.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          country: form.country,
          notes: form.notes.trim() || undefined,
        },
        payment: {
          method,
          status: method === "cod" ? "pending" : "paid",
        },
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Checkout failed. Please try again.")
      }
      const result = data.order as OrderResult
      setOrderResult(result)
      cart.clear()
      toast.success("Order placed!", {
        description: `Order ${result.orderNumber} confirmed.`,
      })
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Checkout failed. Please try again."
      setError(msg)
      toast.error("Checkout failed", { description: msg })
    } finally {
      setLoading(false)
    }
  }, [loading, validate, agreedToTerms, items, form, method, cart])

  // ---- Render branches ----

  // Pre-hydration: render a minimal skeleton to avoid layout flash
  if (!mounted) {
    return (
      <div className="container-luxe py-12 sm:py-16">
        <div className="mx-auto max-w-md space-y-3">
          <div className="h-8 w-1/2 rounded bg-muted shimmer" />
          <div className="h-4 w-3/4 rounded bg-muted shimmer" />
          <div className="h-64 rounded-2xl bg-muted shimmer" />
        </div>
      </div>
    )
  }

  // Success state — replaces the entire form
  if (orderResult) {
    return (
      <div className="bg-background">
        <div className="container-luxe py-12 sm:py-16 lg:py-20">
          <SuccessState
            result={orderResult}
            onTrack={() =>
              navigate({ name: "track", orderNumber: orderResult.orderNumber })
            }
            onContinue={() => navigate({ name: "shop" })}
          />
        </div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="bg-background">
        <div className="container-luxe py-12 sm:py-16 lg:py-20">
          <EmptyCartState onExplore={() => navigate({ name: "shop" })} />
        </div>
      </div>
    )
  }

  // Main checkout layout
  return (
    <div className="bg-background">
      <div className="container-luxe py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 sm:mb-8 text-center"
        >
          <Eyebrow className="mb-2">Secure Checkout</Eyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink text-balance">
            Complete Your Order
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A few details and your handcrafted piece is on its way.
          </p>
        </motion.header>

        {/* Mobile collapsible summary on top */}
        <div className="lg:hidden mb-6">
          <MobileSummaryCollapsible
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            appliedPromo={appliedPromo}
            applyPromo={applyPromo}
            removePromo={removePromo}
            itemCount={itemCount}
          />
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Left: form sections */}
          <div className="space-y-6 lg:space-y-8">
            <ContactShippingSection
              form={form}
              setField={setField}
              errors={errors}
              delay={0.05}
            />
            <PaymentMethodSection
              method={method}
              setMethod={setMethod}
              card={card}
              setCardField={setCardField}
              upiId={upiId}
              setUpiId={setUpiId}
              codTotal={total}
              delay={0.12}
            />
            <ReviewSection
              total={total}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              onSubmit={onSubmit}
              loading={loading}
              error={error}
              canSubmit={canSubmit}
              delay={0.19}
            />
          </div>

          {/* Right: sticky summary */}
          <aside className="lg:sticky lg:top-28">
            <OrderSummaryCard
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              appliedPromo={appliedPromo}
              applyPromo={applyPromo}
              removePromo={removePromo}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
