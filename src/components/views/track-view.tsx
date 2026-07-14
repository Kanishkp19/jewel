"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Package,
  PackageSearch,
  MapPin,
  Clock,
  Calendar,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle,
  BadgeCheck,
  Truck,
  Bike,
  Gift,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { formatPrice } from "@/lib/site"
import { TRACKING_STEPS } from "@/lib/tracking"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// ============================================================================
// Types
// ============================================================================

type TrackingStepData = {
  key: string
  title: string
  description: string
  icon: string
  completed: boolean
  current: boolean
  timestamp: string | null
  location: string | null
}

type OrderItem = {
  name: string
  price: number
  quantity: number
  image: string
  metal: string
}

type OrderResult = {
  orderNumber: string
  trackingId: string
  carrier: string
  status: string
  currentStep: number
  totalSteps: number
  eta: string | null
  createdAt: string
  items: OrderItem[]
  shipping: {
    name: string
    city: string
    state: string
    pincode: string
  }
  steps: TrackingStepData[]
  events: {
    status: string
    title: string
    description: string
    location: string | null
    timestamp: string
  }[]
}

// ============================================================================
// Constants & helpers
// ============================================================================

const ICON_MAP: Record<string, LucideIcon> = {
  CheckCircle,
  BadgeCheck,
  Package,
  Truck,
  Bike,
  Gift,
}

const STEP_KEYS: string[] = TRACKING_STEPS.map((s) => s.key)

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusLabel(status: string): string {
  return TRACKING_STEPS.find((s) => s.key === status)?.title || status
}

// Image with graceful fallback — keeps layout intact if a path 404s
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
        <div className="absolute inset-0 bg-gradient-to-br from-champagne via-muted to-accent/30 flex items-center justify-center">
          <Package className="size-5 text-accent/60" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Search state
// ============================================================================

function SearchHero({
  orderNumber,
  email,
  onOrderNumberChange,
  onEmailChange,
  onSubmit,
}: {
  orderNumber: string
  email: string
  onOrderNumberChange: (v: string) => void
  onEmailChange: (v: string) => void
  onSubmit: () => void
}) {
  const { navigate } = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto flex max-w-xl flex-col items-center px-5 pt-28 pb-24 text-center lg:pt-32"
    >
      {/* Icon medallion */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        className="relative mb-8 flex size-24 items-center justify-center rounded-full border border-accent/30 bg-luxe-radial shadow-luxe"
      >
        <div className="absolute inset-0 rounded-full bg-gold-gradient/5" />
        <Package className="size-10 text-accent" strokeWidth={1.25} />
        <motion.span
          className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-ink text-cream shadow-gold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 14 }}
        >
          <Search className="size-3.5" strokeWidth={2.2} />
        </motion.span>
      </motion.div>

      <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-3">
        Order Tracking
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-ink text-balance leading-[1.1]">
        Track Your Order
      </h1>
      <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md">
        Enter your order number to see real-time delivery updates.
      </p>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mt-10 w-full space-y-5 text-left"
      >
        <div className="space-y-2">
          <Label htmlFor="track-order-number" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Order Number
          </Label>
          <Input
            id="track-order-number"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="PRV-XXXXXXX"
            value={orderNumber}
            onChange={(e) => onOrderNumberChange(e.target.value)}
            className="h-12 rounded-lg border-input bg-card text-base tracking-wider font-medium text-ink placeholder:text-muted-foreground/60 placeholder:font-normal placeholder:tracking-wider"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="track-email" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Email <span className="normal-case tracking-normal text-muted-foreground/70">(optional, for verification)</span>
          </Label>
          <Input
            id="track-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 rounded-lg border-input bg-card text-base text-ink placeholder:text-muted-foreground/60"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-gold-gradient text-ink text-xs uppercase tracking-[0.25em] font-semibold shadow-gold hover:opacity-90 transition-opacity"
        >
          Track Order
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground/80">
        Tip: Find your order number in the confirmation email or your account.
      </p>

      <Separator className="my-8 max-w-xs bg-border/60" />

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an order number? Place an order first.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate({ name: "shop" })}
          className="rounded-full border-ink/40 text-ink text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink hover:text-cream h-10 px-6"
        >
          <ShoppingBag className="size-3.5" />
          Shop Now
        </Button>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Loading state
// ============================================================================

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl px-5 pt-28 pb-20 lg:px-8 lg:pt-32"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-luxe lg:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="space-y-3 sm:text-right">
            <Skeleton className="h-3 w-20 sm:ml-auto" />
            <Skeleton className="h-4 w-40 sm:ml-auto" />
            <Skeleton className="h-4 w-36 sm:ml-auto" />
          </div>
        </div>
        <Skeleton className="mt-6 h-2 w-full rounded-full" />
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-luxe lg:p-8">
        <Skeleton className="h-5 w-44 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Error state
// ============================================================================

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex max-w-md flex-col items-center px-5 pt-28 pb-24 text-center lg:pt-32"
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-8 flex size-24 items-center justify-center rounded-full border border-destructive/20 bg-luxe-radial shadow-luxe">
        <PackageSearch className="size-10 text-destructive/70" strokeWidth={1.25} />
      </div>
      <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-3">
        Nothing here
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink">Order not found</h1>
      <p className="mt-4 text-sm text-muted-foreground max-w-sm">
        {message || "We couldn't find an order with that number. Please check and try again."}
      </p>
      <Button
        onClick={onRetry}
        className="mt-8 h-11 rounded-full bg-gold-gradient text-ink text-xs uppercase tracking-[0.25em] font-semibold shadow-gold hover:opacity-90 px-7"
      >
        Try Again
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  )
}

// ============================================================================
// Result: Header card
// ============================================================================

function HeaderCard({
  order,
  copied,
  onCopy,
}: {
  order: OrderResult
  copied: boolean
  onCopy: () => void
}) {
  const isDelivered = order.status === "delivered"
  const pct = Math.round(((order.currentStep + 1) / order.totalSteps) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-luxe lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-luxe-radial" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
            Order Number
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-none">
            Order <span className="text-gold-gradient">#{order.orderNumber}</span>
          </h1>
          <span
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold",
              isDelivered ? "bg-gold-gradient text-ink" : "bg-ink text-cream"
            )}
          >
            {isDelivered && <Check className="size-3" strokeWidth={2.5} />}
            {statusLabel(order.status)}
          </span>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8 lg:flex-col lg:items-end lg:gap-3 lg:text-right">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-0.5">
              Carrier
            </p>
            <p className="text-sm font-medium text-ink">{order.carrier}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-0.5">
              Tracking ID
            </p>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent transition-colors lg:flex-row-reverse"
              aria-label={`Copy tracking ID ${order.trackingId}`}
            >
              <span className="tracking-wider">{order.trackingId}</span>
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Check className="size-3.5 text-accent" strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          {order.eta && !isDelivered && (
            <div className="flex items-center gap-2 rounded-lg bg-champagne/50 px-3 py-2 lg:flex-row-reverse">
              <Calendar className="size-4 text-accent shrink-0" />
              <div className="lg:text-right">
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  Estimated delivery
                </p>
                <p className="text-sm font-medium text-ink">{formatDate(order.eta)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mt-7">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Step {order.currentStep + 1} of {order.totalSteps}
          </span>
          <span className="font-medium text-ink">{pct}% complete</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full bg-gold-gradient"
          />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Result: Items in order
// ============================================================================

function ItemsCard({ items }: { items: OrderItem[] }) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
      className="rounded-2xl border bg-card p-6 shadow-luxe lg:p-8"
    >
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Items in this order</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <LuxeImage
              src={item.image}
              alt={item.name}
              className="size-12 shrink-0 rounded-lg border border-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{item.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                {item.metal} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-ink tabular-nums">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
          Order total
        </span>
        <span className="font-serif text-xl text-ink tabular-nums">
          {formatPrice(subtotal)}
        </span>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Result: Shipping to
// ============================================================================

function ShippingCard({ shipping }: { shipping: OrderResult["shipping"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
      className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-luxe"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-champagne/60">
        <MapPin className="size-5 text-accent" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
          Shipping to
        </p>
        <p className="truncate text-sm font-medium text-ink">
          {shipping.name}, {shipping.city}, {shipping.state} {shipping.pincode}
        </p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Result: Timeline step
// ============================================================================

function TimelineStep({
  step,
  index,
  nextStep,
}: {
  step: TrackingStepData
  index: number
  nextStep?: TrackingStepData
}) {
  const Icon = ICON_MAP[step.icon] || Package
  const showConnector = !!nextStep
  const connectorIsGold = step.completed && !!nextStep?.completed
  const isFuture = !step.completed && !step.current

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 + index * 0.1 }}
      className={cn(
        "relative flex gap-5 pb-10 last:pb-0",
        step.current && "rounded-2xl"
      )}
    >
      {/* Current-step highlight backdrop */}
      {step.current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
          className="absolute -inset-x-2 inset-y-0 -z-10 rounded-2xl bg-champagne/40"
        />
      )}

      {/* Connector line (between this node and the next) */}
      {showConnector && (
        <div className="absolute left-6 top-12 bottom-0 -translate-x-1/2 w-px">
          {connectorIsGold ? (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 + index * 0.1 }}
              className="h-full w-full origin-top bg-gold-gradient"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="h-full w-full border-l border-dashed border-muted-foreground/30"
            />
          )}
        </div>
      )}

      {/* Node */}
      <div className="relative z-10 shrink-0">
        {step.completed && !step.current ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
            <Check className="size-5 text-ink" strokeWidth={2.5} />
          </div>
        ) : step.current ? (
          <div className="relative flex size-12 items-center justify-center">
            {/* Pulsing ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-accent/40"
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-accent"
              animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex size-12 items-center justify-center rounded-full bg-ink">
              <Icon className="size-5 text-cream" strokeWidth={1.75} />
            </div>
          </div>
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full border-2 border-muted-foreground/25 bg-card">
            <Icon className="size-5 text-muted-foreground/70" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pt-1.5", step.current && "px-1")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3
            className={cn(
              "font-serif text-lg leading-tight",
              isFuture ? "text-muted-foreground" : "text-ink"
            )}
          >
            {step.title}
          </h3>
          {step.current && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold text-cream">
              <motion.span
                className="size-1.5 rounded-full bg-gold-gradient"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
              In progress
            </span>
          )}
          {step.completed && !step.current && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-medium text-accent">
              <Check className="size-3" strokeWidth={2.5} />
              Done
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-1 text-sm",
            isFuture ? "text-muted-foreground/70" : "text-muted-foreground"
          )}
        >
          {step.description}
        </p>

        {step.timestamp && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3 text-accent/80" />
              {formatDate(step.timestamp)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3 text-accent/80" />
              {formatTime(step.timestamp)}
            </span>
            {step.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 text-accent/80" />
                {step.location}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// Result: Timeline card + demo controls
// ============================================================================

function TimelineCard({
  order,
  advancing,
  onAdvance,
}: {
  order: OrderResult
  advancing: boolean
  onAdvance: () => void
}) {
  const currentIdx = STEP_KEYS.indexOf(order.status)
  const isDelivered = order.status === "delivered"
  const nextIdx = currentIdx + 1
  const nextLabel =
    nextIdx < STEP_KEYS.length ? TRACKING_STEPS[nextIdx].title : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
      className="rounded-2xl border bg-card p-6 shadow-luxe lg:p-8"
    >
      <div className="mb-7 flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Delivery Timeline</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {order.events.length} updates
        </span>
      </div>

      <div className="relative">
        {order.steps.map((step, i) => (
          <TimelineStep
            key={step.key}
            step={step}
            index={i}
            nextStep={order.steps[i + 1]}
          />
        ))}
      </div>

      {/* Demo control */}
      <div className="mt-8 flex flex-col items-start gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          Demo control
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdvance}
          disabled={isDelivered || advancing}
          className="h-8 gap-1.5 rounded-full text-xs text-muted-foreground hover:text-accent hover:bg-champagne/40 disabled:opacity-50"
        >
          {advancing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : isDelivered ? (
            <Check className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          {isDelivered
            ? "Order delivered"
            : `Demo: Advance to ${nextLabel || "next status"}`}
        </Button>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Result state
// ============================================================================

function ResultState({
  order,
  copied,
  onCopy,
  advancing,
  onAdvance,
  onNewSearch,
}: {
  order: OrderResult
  copied: boolean
  onCopy: () => void
  advancing: boolean
  onAdvance: () => void
  onNewSearch: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-5 pt-28 pb-20 lg:px-8 lg:pt-32"
    >
      <HeaderCard order={order} copied={copied} onCopy={onCopy} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ItemsCard items={order.items} />
        <div className="flex flex-col gap-6">
          <ShippingCard shipping={order.shipping} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
            className="rounded-2xl border bg-card p-5 shadow-luxe"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-1">
              Order placed on
            </p>
            <p className="text-sm font-medium text-ink">
              {formatDate(order.createdAt)}
            </p>
            <Button
              variant="link"
              onClick={onNewSearch}
              className="mt-3 h-auto p-0 text-xs uppercase tracking-[0.2em] text-accent hover:text-ink"
            >
              Track another order
              <ArrowRight className="size-3" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="mt-6">
        <TimelineCard order={order} advancing={advancing} onAdvance={onAdvance} />
      </div>
    </motion.div>
  )
}

// ============================================================================
// Main component
// ============================================================================

export default function TrackView({
  initialOrderNumber,
}: {
  initialOrderNumber?: string
}) {
  const [orderNumber, setOrderNumber] = React.useState(initialOrderNumber || "")
  const [email, setEmail] = React.useState("")
  const [order, setOrder] = React.useState<OrderResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [advancing, setAdvancing] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const fetchOrder = React.useCallback(async (num: string, em: string) => {
    const clean = num.trim()
    if (!clean) {
      toast.error("Please enter an order number")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ orderNumber: clean })
      if (em.trim()) params.set("email", em.trim())
      const res = await fetch(`/api/orders/track?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Order not found")
      }
      const data = await res.json()
      setOrder(data.order as OrderResult)
    } catch (e) {
      setOrder(null)
      setError(e instanceof Error ? e.message : "Order not found")
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-submit when an initialOrderNumber is provided (e.g. from ?order=)
  React.useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber, "")
    }
  }, [initialOrderNumber, fetchOrder])

  const handleSubmit = () => fetchOrder(orderNumber, email)

  const handleReset = () => {
    setOrder(null)
    setError(null)
    setOrderNumber("")
    setEmail("")
  }

  const handleCopy = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.trackingId)
      setCopied(true)
      toast.success("Tracking ID copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy tracking ID")
    }
  }

  const handleAdvance = async () => {
    if (!order) return
    const currentIdx = STEP_KEYS.indexOf(order.status)
    if (currentIdx === -1 || currentIdx >= STEP_KEYS.length - 1) return
    const nextStatus = STEP_KEYS[currentIdx + 1]
    const nextLabel = TRACKING_STEPS[currentIdx + 1].title

    setAdvancing(true)
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          status: nextStatus,
        }),
      })
      if (!res.ok) throw new Error("Failed to advance status")
      toast.success(`Status advanced to ${nextLabel}`)
      await fetchOrder(order.orderNumber, email)
    } catch {
      toast.error("Failed to advance status")
    } finally {
      setAdvancing(false)
    }
  }

  return (
    <div
      className="min-h-[80vh] bg-background"
      aria-busy={loading}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingSkeleton key="loading" />
        ) : error ? (
          <ErrorCard key="error" message={error} onRetry={handleReset} />
        ) : order ? (
          <ResultState
            key="result"
            order={order}
            copied={copied}
            onCopy={handleCopy}
            advancing={advancing}
            onAdvance={handleAdvance}
            onNewSearch={handleReset}
          />
        ) : (
          <SearchHero
            key="search"
            orderNumber={orderNumber}
            email={email}
            onOrderNumberChange={setOrderNumber}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
