"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RefreshCw,
  Leaf,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  PackageSearch,
  Check,
  PenLine,
  Sparkles,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { Link } from "@/components/link"
import { useCart, useWishlist } from "@/lib/cart-store"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  ProductCard,
  type ProductCardData,
} from "@/components/site/product-card"
import { toast } from "sonner"

// ============================================================================
// Types
// ============================================================================

type Props = { slug: string }

type Review = {
  id: string
  author: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

type RelatedProduct = ProductCardData

type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAt?: number | null
  metal: string
  material?: string | null
  gemstone?: string | null
  weight?: string | null
  categoryId: string
  category: { id: string; slug: string; name: string }
  collectionId?: string | null
  collection?: { id: string; slug: string; name: string; tagline?: string | null } | null
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  isBestseller?: boolean
  isNewArrival?: boolean
  tags: string[]
  reviews: Review[]
  related: RelatedProduct[]
}

// ============================================================================
// Constants
// ============================================================================

const STANDARD_METALS = [
  "Gold Plated",
  "Sterling Silver",
  "Rose Gold",
  "Champagne Gold",
] as const

const TRUST_BADGES = [
  { Icon: ShieldCheck, label: "Lifetime Warranty" },
  { Icon: Truck, label: "Free Shipping ₹2999+" },
  { Icon: RefreshCw, label: "7-Day Returns" },
  { Icon: Leaf, label: "Ethically Sourced" },
]

const CARE_TIPS = [
  "Store each piece separately in a soft pouch to prevent scratching.",
  "Avoid contact with perfumes, lotions, and water to preserve the finish.",
  "Clean gently with a microfibre cloth after every wear.",
  "Bring your piece to the Provelaa atelier for a complimentary annual polish.",
]

const SHIPPING_TEXT =
  "Enjoy complimentary shipping on all orders above ₹2,999 — a flat ₹99 applies below that threshold. Every parcel is fully insured and dispatched within 1–2 business days from our Mumbai atelier. Not in love? Return any unworn piece within 7 days of delivery for a full refund. Cash on Delivery is available across India."

// ============================================================================
// Small helpers
// ============================================================================

/** Probe an image src and report load status — lets us gracefully fall back
 *  to a champagne gradient when an image path 404s (e.g. before Task 10 finishes). */
function useImageStatus(src: string | null) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  )
  React.useEffect(() => {
    if (!src) {
      setStatus("error")
      return
    }
    setStatus("loading")
    const img = new window.Image()
    img.onload = () => setStatus("loaded")
    img.onerror = () => setStatus("error")
    img.src = src
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])
  return status
}

function Stars({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  const rounded = Math.round(value)
  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(
            i < rounded
              ? "fill-accent text-accent"
              : "fill-transparent text-accent/40"
          )}
        />
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

function truncate(text: string, max = 160) {
  if (!text) return ""
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text
}

function buildMetalOptions(productMetal: string): string[] {
  // Always include the product's actual metal first; then the four standard
  // options, de-duplicated so the list never has repeats.
  const seen = new Set<string>()
  const out: string[] = []
  for (const m of [productMetal, ...STANDARD_METALS]) {
    if (!seen.has(m)) {
      seen.add(m)
      out.push(m)
    }
  }
  return out
}

// ============================================================================
// Main component
// ============================================================================

export default function ProductView({ slug }: Props) {
  const { navigate } = useRouter()
  const cart = useCart()
  const wishlist = useWishlist()

  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<"not-found" | "fetch" | null>(null)
  const [refreshNonce, setRefreshNonce] = React.useState(0)

  const [selectedImage, setSelectedImage] = React.useState(0)
  const [selectedMetal, setSelectedMetal] = React.useState<string>("")
  const [quantity, setQuantity] = React.useState(1)

  // Hover-zoom state (desktop only)
  const [canZoom, setCanZoom] = React.useState(false)
  const [zoomOrigin, setZoomOrigin] = React.useState<{ x: number; y: number } | null>(null)
  const mainImageWrapRef = React.useRef<HTMLDivElement>(null)

  const reviewsRef = React.useRef<HTMLDivElement>(null)

  // ---------------------------------------------------------------------------
  // Fetch product when slug changes
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setProduct(null)

    fetch(`/api/products/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (cancelled) return
        if (res.status === 404) {
          setError("not-found")
          setLoading(false)
          return
        }
        if (!res.ok) {
          setError("fetch")
          setLoading(false)
          return
        }
        const data = (await res.json()) as { product: Product }
        if (cancelled) return
        setProduct(data.product)
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled || controller.signal.aborted) return
        console.error("[product-view] fetch error", e)
        setError("fetch")
        setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [slug, refreshNonce])

  // Reset per-product UI state when the product changes
  React.useEffect(() => {
    setSelectedImage(0)
    setQuantity(1)
    setZoomOrigin(null)
  }, [product?.id])

  React.useEffect(() => {
    if (product) {
      setSelectedMetal(product.metal)
    }
  }, [product?.id, product?.metal])

  // ---------------------------------------------------------------------------
  // Hover-zoom capability detection (hover-capable + lg breakpoint)
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: hover) and (min-width: 1024px)")
    const update = () => setCanZoom(mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  const images = product?.images?.filter(Boolean) ?? []
  const mainSrc = images[selectedImage] || images[0] || null
  const mainStatus = useImageStatus(mainSrc)

  const discount = React.useMemo(() => {
    if (!product?.compareAt || product.compareAt <= product.price) return 0
    return Math.round(
      ((product.compareAt - product.price) / product.compareAt) * 100
    )
  }, [product])

  const metalOptions = React.useMemo(
    () => (product ? buildMetalOptions(product.metal) : []),
    [product]
  )

  const maxQty = React.useMemo(() => {
    if (!product) return 99
    if (!product.stock || product.stock <= 0) return 0
    return product.stock
  }, [product])

  const inStock = maxQty > 0
  const wished = product ? wishlist.has(product.id) : false
  const unitTotal = product ? product.price * quantity : 0

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canZoom) return
    const rect = mainImageWrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const handleMouseEnter = () => {
    if (!canZoom) return
    setZoomOrigin((o) => o ?? { x: 50, y: 50 })
  }

  const handleMouseLeave = () => {
    setZoomOrigin(null)
  }

  const addToCart = () => {
    if (!product) return
    cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: images[0] || "/placeholder.jpg",
        metal: selectedMetal,
      },
      quantity
    )
    toast.success("Added to cart", {
      description: `${quantity} × ${product.name} (${selectedMetal})`,
    })
  }

  const buyNow = () => {
    if (!product) return
    cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: images[0] || "/placeholder.jpg",
        metal: selectedMetal,
      },
      quantity
    )
    cart.close()
    navigate({ name: "checkout" })
  }

  const toggleWishlist = () => {
    if (!product) return
    wishlist.toggle(product.id)
    if (!wished) {
      toast.success("Saved to wishlist", {
        description: product.name,
      })
    }
  }

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const decQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incQty = () => setQuantity((q) => Math.min(maxQty, q + 1))

  // ---------------------------------------------------------------------------
  // Render: loading
  // ---------------------------------------------------------------------------
  if (loading) {
    return <ProductSkeleton />
  }

  // ---------------------------------------------------------------------------
  // Render: not found
  // ---------------------------------------------------------------------------
  if (error === "not-found") {
    return (
      <NotFoundState
        title="Piece not found"
        body="The piece you're looking for may have been retired or moved. Let's get you back to the collection."
        onShop={() => navigate({ name: "shop" })}
      />
    )
  }

  // ---------------------------------------------------------------------------
  // Render: fetch error
  // ---------------------------------------------------------------------------
  if (error === "fetch" || !product) {
    return (
      <NotFoundState
        title="Something went wrong"
        body="We couldn't load this piece. Please check your connection and try again."
        onShop={() => setRefreshNonce((n) => n + 1)}
        ctaLabel="Try again"
        icon={AlertCircle}
      />
    )
  }

  // ---------------------------------------------------------------------------
  // Render: product
  // ---------------------------------------------------------------------------
  return (
    <main className="container-luxe py-6 lg:py-10">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-6"
      >
        <Link to={{ name: "home" }} className="hover:text-accent transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <Link
          to={{ name: "shop", category: product.category?.slug }}
          className="hover:text-accent transition-colors"
        >
          {product.category?.name || "Shop"}
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-ink font-medium line-clamp-1" aria-current="page">
          {product.name}
        </span>
      </motion.nav>

      {/* ===== 2-column gallery + info ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
        {/* ---------- Gallery (left) ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-label="Product gallery"
          className="flex flex-col-reverse lg:flex-row gap-4"
        >
          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden scrollbar-luxe lg:w-[84px] shrink-0 pb-1 lg:pb-0 lg:max-h-[640px]"
              role="listbox"
              aria-label="Product image thumbnails"
            >
              {images.map((src, i) => (
                <ThumbnailButton
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${product.name} — view ${i + 1}`}
                  active={i === selectedImage}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative flex-1">
            <div
              ref={mainImageWrapRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-luxe cursor-zoom-in"
              aria-label={`${product.name} main image`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {mainStatus === "error" ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-champagne via-muted to-accent/40" />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-200 ease-out"
                      style={{
                        backgroundImage: `url(${mainSrc})`,
                        transform: zoomOrigin ? "scale(2)" : "scale(1)",
                        transformOrigin: zoomOrigin
                          ? `${zoomOrigin.x}% ${zoomOrigin.y}%`
                          : "center",
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isNewArrival && (
                  <span className="bg-sapphire text-ink text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shadow-sm">
                    New
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-emerald text-ink text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shadow-sm">
                    Bestseller
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-ruby text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Hover hint */}
              {canZoom && mainStatus !== "error" && (
                <div className="pointer-events-none absolute bottom-3 right-3 z-10 glass text-[10px] uppercase tracking-widest text-ink px-2.5 py-1 rounded-full opacity-80">
                  Hover to zoom
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ---------- Info (right, sticky) ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
          aria-label="Product information"
        >
          {/* Collection eyebrow */}
          {product.collection?.name && (
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent font-medium mb-2">
              {product.collection.name}
            </p>
          )}

          {/* Name */}
          <h1 className="font-serif text-3xl lg:text-4xl text-ink leading-[1.1] text-balance">
            {product.name}
          </h1>

          {/* Rating row */}
          <button
            type="button"
            onClick={scrollToReviews}
            className="mt-3 flex items-center gap-2 group"
            aria-label={`Rated ${product.rating.toFixed(1)} out of 5 — see ${product.reviewCount} reviews`}
          >
            <Stars value={product.rating} size={15} />
            <span className="text-sm text-ink font-medium">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
              ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </button>

          {/* Price row */}
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="font-serif text-2xl lg:text-3xl text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-destructive/10 text-destructive text-xs font-medium px-2 py-0.5 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {truncate(product.description, 220)}
          </p>

          <Separator className="my-6" />

          {/* Metal selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Metal
              </span>
              <span className="text-xs text-ink font-medium">{selectedMetal}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {metalOptions.map((m) => {
                const active = m === selectedMetal
                const isProductMetal = m === product.metal
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMetal(m)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded-full border px-4 py-2 text-xs font-medium transition-all",
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-border text-ink hover:border-accent hover:text-accent"
                    )}
                  >
                    {m}
                    {isProductMetal && (
                      <span
                        className={cn(
                          "absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border border-background",
                          m === "Rose Gold" && "bg-accent",
                          m === "Sterling Silver" && "bg-platinum",
                          m === "Gold Plated" && "bg-gold",
                          m === "Champagne Gold" && "bg-secondary",
                          !["Rose Gold", "Sterling Silver", "Gold Plated", "Champagne Gold"].includes(m) && "bg-gold-gradient"
                        )}
                        title="Default metal"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Quantity */}
            <div className="flex items-center justify-between sm:justify-start border border-border rounded-full sm:rounded-md h-12 sm:h-auto sm:py-0">
              <button
                type="button"
                onClick={decQty}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center text-ink hover:text-accent disabled:opacity-40 disabled:hover:text-ink transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span
                className="min-w-[2ch] text-center font-medium text-ink"
                aria-live="polite"
                aria-label={`Quantity ${quantity}`}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={incQty}
                disabled={quantity >= maxQty}
                aria-label="Increase quantity"
                className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center text-ink hover:text-accent disabled:opacity-40 disabled:hover:text-ink transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add to cart */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="flex-1"
            >
              <Button
                type="button"
                onClick={addToCart}
                disabled={!inStock}
                className="w-full h-12 bg-gold-gradient text-ink hover:opacity-90 rounded-md font-medium tracking-wide shadow-gold disabled:opacity-60 disabled:shadow-none"
              >
                <ShoppingBag className="h-4 w-4" />
                {inStock
                  ? `Add to Cart — ${formatPrice(unitTotal)}`
                  : "Out of Stock"}
              </Button>
            </motion.div>
          </div>

          {/* Buy now + Wishlist */}
          <div className="mt-3 flex gap-3">
            <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
              <Button
                type="button"
                onClick={buyNow}
                disabled={!inStock}
                variant="outline"
                className="w-full h-11 border-ink/30 text-ink hover:bg-ink hover:text-cream rounded-md font-medium tracking-wide disabled:opacity-60"
              >
                Buy Now
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                type="button"
                onClick={toggleWishlist}
                variant="outline"
                aria-pressed={wished}
                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                className={cn(
                  "h-11 px-4 border-ink/30 rounded-md font-medium tracking-wide transition-colors",
                  wished
                    ? "text-destructive border-destructive/40 hover:bg-destructive hover:text-white"
                    : "text-ink hover:bg-ink hover:text-cream"
                )}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
                <span className="hidden sm:inline">{wished ? "Saved" : "Save"}</span>
              </Button>
            </motion.div>
          </div>

          {/* Stock hint */}
          {inStock && maxQty <= 5 && (
            <p className="mt-3 text-xs text-destructive font-medium flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Only {maxQty} left — selling fast
            </p>
          )}

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUST_BADGES.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-1.5 rounded-lg bg-secondary/40 px-2 py-3"
              >
                <Icon className="h-4 w-4 text-accent" />
                <span className="text-[10px] uppercase tracking-wider text-ink font-medium leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Accordion */}
          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-serif text-base text-ink hover:no-underline">
                Product Details
              </AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  <DetailRow label="Material" value={product.material} />
                  <DetailRow label="Gemstone" value={product.gemstone} />
                  <DetailRow label="Metal" value={product.metal} />
                  <DetailRow label="Weight" value={product.weight} />
                  <DetailRow
                    label="Category"
                    value={product.category?.name}
                  />
                  <DetailRow
                    label="Collection"
                    value={product.collection?.name}
                  />
                  <DetailRow
                    label="Availability"
                    value={
                      inStock
                        ? `In stock (${maxQty} available)`
                        : "Out of stock"
                    }
                  />
                  {product.tags?.length > 0 && (
                    <DetailRow
                      label="Tags"
                      value={product.tags.join(", ")}
                    />
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm font-serif text-base text-ink hover:no-underline">
                Shipping &amp; Returns
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {SHIPPING_TEXT}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care">
              <AccordionTrigger className="text-sm font-serif text-base text-ink hover:no-underline">
                Jewellery Care
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {CARE_TIPS.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>
      </div>

      {/* ===== Description block — "The Story" ===== */}
      <section className="mt-20 lg:mt-28 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-3">
            The Story
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl text-ink mb-4 text-balance leading-snug">
            {product.name}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty">
            {product.description}
          </p>
          {product.collection?.tagline && (
            <p className="mt-6 font-display text-lg italic text-ink/70">
              “{product.collection.tagline}”
            </p>
          )}
        </motion.div>
      </section>

      {/* ===== Reviews section ===== */}
      <section
        ref={reviewsRef}
        className="mt-20 lg:mt-28 scroll-mt-28"
        aria-label="Customer reviews"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-2">
                Voices
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-ink">
                Customer Reviews
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast("Reviews coming soon", {
                description: "We're rolling out verified reviews shortly.",
              })}
              className="border-ink/30 text-ink hover:bg-ink hover:text-cream rounded-md"
            >
              <PenLine className="h-4 w-4" />
              Write a review
            </Button>
          </div>

          {/* Rating summary */}
          <div className="rounded-2xl bg-luxe-radial border border-border p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 mb-10">
            <div className="text-center shrink-0">
              <div className="font-serif text-5xl text-ink leading-none">
                {product.rating.toFixed(1)}
              </div>
              <Stars value={product.rating} size={16} className="mt-2 justify-center" />
              <div className="mt-1.5 text-xs text-muted-foreground">
                {product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"}
              </div>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-20" />
            <Separator className="sm:hidden" />
            <p className="text-sm text-muted-foreground leading-relaxed text-center sm:text-left">
              {product.reviews.length > 0
                ? "Real reviews from verified Provelaa customers. We never edit or remove reviews based on rating."
                : "This piece is brand new — be the first to share your experience with the Provelaa community."}
            </p>
          </div>

          {/* Review list */}
          {product.reviews.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {product.reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center">
              <p className="font-serif text-xl text-ink mb-2">
                Be the first to review
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Share your thoughts and help others discover this piece.
              </p>
              <Button
                type="button"
                onClick={() =>
                  toast("Reviews coming soon", {
                    description: "We're rolling out verified reviews shortly.",
                  })
                }
                className="bg-gold-gradient text-ink hover:opacity-90 rounded-md shadow-gold"
              >
                <PenLine className="h-4 w-4" />
                Write the first review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== You may also love ===== */}
      {product.related.length > 0 && (
        <section className="mt-20 lg:mt-28" aria-label="Related products">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-2">
              Curated for you
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink">
              You may also love
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {product.related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({ name: "shop", category: product.category?.slug })
              }
              className="border-ink/30 text-ink hover:bg-ink hover:text-cream rounded-md"
            >
              View all {product.category?.name || "jewellery"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}
    </main>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

function ThumbnailButton({
  src,
  alt,
  active,
  onClick,
}: {
  src: string
  alt: string
  active: boolean
  onClick: () => void
}) {
  const [errored, setErrored] = React.useState(false)
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={alt}
      aria-current={active}
      role="option"
      aria-selected={active}
      className={cn(
        "relative shrink-0 h-20 w-20 lg:h-[76px] lg:w-[76px] overflow-hidden rounded-lg border-2 transition-colors",
        active
          ? "border-accent shadow-gold"
          : "border-border hover:border-accent/50"
      )}
    >
      {!errored ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-champagne via-muted to-accent/40" />
      )}
    </motion.button>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  if (!value) return null
  return (
    <div className="flex flex-col">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-ink font-medium">{value}</dd>
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const initial = (review.author || "A").charAt(0).toUpperCase()
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-2xl border border-border bg-card/60 p-5 lg:p-6 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gold-gradient flex items-center justify-center font-serif text-ink text-lg shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-ink text-sm">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-wider text-accent font-medium">
                <Check className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Stars value={review.rating} size={12} />
            {review.createdAt && (
              <span className="text-[11px] text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
      {review.title && (
        <h4 className="font-serif text-base text-ink leading-snug">
          {review.title}
        </h4>
      )}
      {review.body && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.body}
        </p>
      )}
    </motion.article>
  )
}

// ============================================================================
// States: loading, not-found, error
// ============================================================================

function ProductSkeleton() {
  return (
    <main className="container-luxe py-6 lg:py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-12 bg-accent/30 rounded shimmer" />
        <div className="h-3 w-3 bg-accent/30 rounded shimmer" />
        <div className="h-3 w-20 bg-accent/30 rounded shimmer" />
        <div className="h-3 w-3 bg-accent/30 rounded shimmer" />
        <div className="h-3 w-32 bg-accent/30 rounded shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-2.5 lg:w-[84px] shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-20 lg:h-[76px] lg:w-[76px] rounded-lg bg-muted shimmer shrink-0"
              />
            ))}
          </div>
          <div className="flex-1">
            <div className="relative aspect-[4/5] w-full rounded-2xl bg-muted overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-24 bg-accent/30 rounded shimmer" />
          <div className="h-9 w-3/4 bg-muted rounded shimmer" />
          <div className="h-4 w-32 bg-muted rounded shimmer" />
          <div className="h-7 w-40 bg-muted rounded shimmer mt-4" />
          <div className="h-3 w-full bg-muted rounded shimmer" />
          <div className="h-3 w-5/6 bg-muted rounded shimmer" />
          <div className="h-px w-full bg-border my-4" />
          <div className="h-3 w-16 bg-accent/30 rounded shimmer" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-muted shimmer"
              />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <div className="h-12 w-28 rounded-md bg-muted shimmer" />
            <div className="h-12 flex-1 rounded-md bg-muted shimmer" />
          </div>
          <div className="h-11 w-full rounded-md bg-muted shimmer" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-muted shimmer"
              />
            ))}
          </div>
          <div className="h-px w-full bg-border my-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-5 w-40 bg-muted rounded shimmer" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function NotFoundState({
  title,
  body,
  onShop,
  ctaLabel = "Shop all jewellery",
  icon: Icon = PackageSearch,
}: {
  title: string
  body: string
  onShop: () => void
  ctaLabel?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <main className="container-luxe py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl mx-auto text-center"
      >
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-luxe-radial border border-border flex items-center justify-center">
          <Icon className="h-8 w-8 text-accent" />
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-ink mb-3">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {body}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={onShop}
            className="bg-gold-gradient text-ink hover:opacity-90 rounded-md shadow-gold"
          >
            <RotateCcw className="h-4 w-4" />
            {ctaLabel}
          </Button>
          <Link
            to={{ name: "home" }}
            className="text-sm text-ink underline-offset-4 hover:underline hover:text-accent transition-colors"
          >
            Back home
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
