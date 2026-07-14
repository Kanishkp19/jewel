"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  Leaf,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Quote,
  Instagram,
  Sparkles,
  Mail,
  Loader2,
} from "lucide-react"
import { useRouter, type Route } from "@/lib/router"
import {
  ProductCard,
  type ProductCardData,
} from "@/components/site/product-card"
import { siteConfig } from "@/lib/site"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ============================================================================
// Static content
// ============================================================================

type HeroSlide = {
  id: number
  layout: "wide" | "split"
  image: string
  eyebrow: string
  title: string
  subtitle: string
  primary: { label: string; to: Route }
  secondary?: { label: string; to: Route }
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    layout: "wide",
    image: "/images/hero/hero-1.jpg",
    eyebrow: "Handcrafted in Mumbai",
    title: "Timeless Jewellery, Handcrafted in Mumbai",
    subtitle:
      "Champagne gold, ethically sourced gemstones, made to be loved for a lifetime.",
    primary: { label: "Shop Bestsellers", to: { name: "shop" } },
    secondary: { label: "Explore Collections", to: { name: "shop" } },
  },
  {
    id: 1,
    layout: "split",
    image: "/images/hero/hero-2.jpg",
    eyebrow: "Just Landed",
    title: "The Festive Edit",
    subtitle:
      "Layered necklaces, jhumkas & mangalsutras for the season of celebration.",
    primary: {
      label: "Shop Festive",
      to: { name: "shop", collection: "festive-edit" },
    },
  },
  {
    id: 2,
    layout: "wide",
    image: "/images/hero/hero-3.jpg",
    eyebrow: "The Atelier",
    title: "Crafted to be Treasured",
    subtitle:
      "Every Provelaa piece is shaped by hand in our Mumbai atelier — patiently, lovingly, and built to last a lifetime.",
    primary: { label: "Our Story", to: { name: "about" } },
  },
]

const CATEGORIES = [
  { slug: "rings", name: "Rings", image: "/images/categories/rings.jpg" },
  {
    slug: "necklaces",
    name: "Necklaces",
    image: "/images/categories/necklaces.jpg",
  },
  {
    slug: "earrings",
    name: "Earrings",
    image: "/images/categories/earrings.jpg",
  },
  {
    slug: "mangalsutra",
    name: "Mangalsutra",
    image: "/images/categories/mangalsutra.jpg",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    image: "/images/categories/bracelets.jpg",
  },
]

const COLLECTIONS = [
  {
    slug: "champagne-gold",
    name: "The Champagne Gold Edit",
    tagline: "Warm-toned gold with a soft, vintage glow.",
    image: "/images/collections/champagne-gold.jpg",
  },
  {
    slug: "festive-edit",
    name: "The Festive Edit",
    tagline: "Layered necklaces, jhumkas & mangalsutras.",
    image: "/images/collections/festive-edit.jpg",
  },
  {
    slug: "minimalist",
    name: "Everyday Minimalist",
    tagline: "Quiet luxury for everyday wear.",
    image: "/images/collections/minimalist.jpg",
  },
]

const USPS = [
  { Icon: ShieldCheck, label: "Lifetime Warranty" },
  { Icon: Truck, label: "Free Shipping ₹2999+" },
  { Icon: RefreshCw, label: "7-Day Returns" },
  { Icon: Leaf, label: "Ethically Sourced" },
]

const STATS = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "100%", label: "Ethically Sourced" },
  { value: "Lifetime", label: "Warranty" },
]

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    location: "Mumbai, IN",
    rating: 5,
    quote:
      "The champagne gold finish is unlike anything I've seen. My engagement ring from Provelaa is a daily reminder of artistry and love.",
  },
  {
    name: "Riya Kapoor",
    location: "Delhi, IN",
    rating: 5,
    quote:
      "I ordered the Festive Edit jhumkas for my wedding reception. The craftsmanship was breathtaking — compliments all night long.",
  },
  {
    name: "Meera Iyer",
    location: "Bengaluru, IN",
    rating: 5,
    quote:
      "Lightweight, elegant and genuinely handcrafted. The lifetime warranty gave me total peace of mind on my mangalsutra purchase.",
  },
]

const INSTAGRAM_IMAGES = [
  { src: "/images/lifestyle/atelier.jpg", alt: "Provelaa atelier craftsmanship" },
  { src: "/images/lifestyle/model-1.jpg", alt: "Model wearing Provelaa jewellery" },
  { src: "/images/lifestyle/model-2.jpg", alt: "Model wearing Provelaa earrings" },
  { src: "/images/hero/hero-1.jpg", alt: "Provelaa hero jewellery shot" },
]

// ============================================================================
// Small shared primitives
// ============================================================================

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-3">
      {children}
    </p>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string
  title: string
  subtitle?: string
  align?: "center" | "left"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink text-balance leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground text-sm lg:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] rounded-xl bg-muted overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded bg-muted overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-4 w-3/4 rounded bg-muted overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-4 w-1/4 rounded bg-muted overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  )
}

// Image with graceful fallback — keeps layout intact if a path 404s
function LuxeImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
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
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-champagne via-muted to-accent/30" />
      )}
    </div>
  )
}

// ============================================================================
// 1. Hero Carousel
// ============================================================================

function HeroCarousel() {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = React.useCallback((i: number) => {
    setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  const next = React.useCallback(() => goTo(index + 1), [goTo, index])
  const prev = React.useCallback(() => goTo(index - 1), [goTo, index])

  React.useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused])

  const slide = HERO_SLIDES[index]

  return (
    <section
      aria-label="Featured highlights"
      aria-roledescription="carousel"
      className="relative w-full overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[70vh] min-h-[480px] w-full lg:h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {slide.layout === "wide" ? (
              <WideSlide slide={slide} />
            ) : (
              <SplitSlide slide={slide} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center text-ink hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next slide"
          onClick={next}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center text-ink hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-8 bg-accent"
                  : "w-1.5 bg-cream/60 hover:bg-cream/90"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function WideSlide({ slide }: { slide: HeroSlide }) {
  const { navigate } = useRouter()
  return (
    <div className="relative h-full w-full">
      <LuxeImage
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      <div className="relative h-full container-luxe flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl text-cream"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent mb-4">
            {slide.eyebrow}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            {slide.title}
          </h1>
          <p className="mt-5 text-base lg:text-lg text-cream/85 max-w-lg">
            {slide.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(slide.primary.to)}
              className="bg-gold-gradient text-ink rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {slide.primary.label}
              <ArrowRight className="h-4 w-4" />
            </button>
            {slide.secondary && (
              <button
                onClick={() => navigate(slide.secondary!.to)}
                className="border border-cream/70 text-cream rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-cream hover:text-ink transition-colors"
              >
                {slide.secondary.label}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SplitSlide({ slide }: { slide: HeroSlide }) {
  const { navigate } = useRouter()
  return (
    <div className="grid h-full w-full lg:grid-cols-2">
      {/* Text side */}
      <div className="relative flex items-center bg-ink text-cream order-2 lg:order-1">
        <div className="absolute inset-0 bg-luxe-radial opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative container-luxe lg:px-12 py-10"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent mb-4">
            {slide.eyebrow}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            {slide.title}
          </h1>
          <p className="mt-5 text-base lg:text-lg text-cream/85 max-w-md">
            {slide.subtitle}
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate(slide.primary.to)}
              className="bg-gold-gradient text-ink rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {slide.primary.label}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
      {/* Image side */}
      <div className="relative order-1 lg:order-2 h-[40vh] lg:h-full">
        <LuxeImage
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>
    </div>
  )
}

// ============================================================================
// 2. USP / Trust Marquee strip
// ============================================================================

function UspStrip() {
  return (
    <section
      aria-label="Why shop with Provelaa"
      className="border-y border-border bg-card/60"
    >
      <div className="container-luxe py-5">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6">
          {USPS.map(({ Icon, label }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: "easeOut",
              }}
              className="flex items-center justify-center gap-2.5 text-ink"
            >
              <Icon className="h-5 w-5 text-accent shrink-0" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                {label}
              </span>
              {i < USPS.length - 1 && (
                <span className="hidden lg:inline-block ml-6 h-4 w-px bg-accent/40" />
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ============================================================================
// 3. Shop by Category
// ============================================================================

function ShopByCategory() {
  const { navigate } = useRouter()
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Find your perfect piece"
          title="Shop by Category"
          subtitle="From everyday studs to bridal jhumkas — explore our most-loved categories."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: "easeOut",
              }}
              onClick={() => navigate({ name: "shop", category: cat.slug })}
              className="group relative aspect-square rounded-xl overflow-hidden border border-transparent hover:border-accent transition-colors text-left"
            >
              <LuxeImage
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-serif text-lg lg:text-xl text-cream">
                  {cat.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-cream/70 group-hover:text-accent transition-colors">
                  Shop now
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 4. Featured Collections
// ============================================================================

function FeaturedCollections() {
  const { navigate } = useRouter()
  return (
    <section className="py-16 lg:py-24 bg-secondary/40">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Curated by our atelier"
          title="Curated Collections"
          subtitle="Three signature edits, each with its own story to tell."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {COLLECTIONS.map((col, i) => (
            <motion.button
              key={col.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              onClick={() =>
                navigate({ name: "shop", collection: col.slug })
              }
              className={cn(
                "group relative rounded-2xl overflow-hidden text-left shadow-luxe",
                // Vary heights for visual interest on desktop
                i === 1
                  ? "md:mt-8 aspect-[4/5]"
                  : "aspect-[4/5] md:aspect-[4/5.6]"
              )}
            >
              <LuxeImage
                src={col.image}
                alt={col.name}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-2">
                  Collection
                </p>
                <h3 className="font-serif text-2xl lg:text-3xl text-cream leading-tight">
                  {col.name}
                </h3>
                <p className="mt-2 text-sm text-cream/75">{col.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-cream/90 group-hover:text-accent transition-colors">
                  Discover
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 5. Bestsellers grid
// ============================================================================

function useProducts(query: string) {
  const [products, setProducts] = React.useState<ProductCardData[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setProducts(null)
    setError(false)
    fetch(query)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed")
        return r.json()
      })
      .then((data: { products: ProductCardData[] }) => {
        if (!cancelled) setProducts(data.products || [])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  return { products, error }
}

function Bestsellers() {
  const { navigate } = useRouter()
  const { products, error } = useProducts(
    "/api/products?bestseller=true&limit=8"
  )

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Loved by 10,000+ customers"
          title="Bestsellers"
          subtitle="The pieces our community keeps coming back for."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products
            ? products.slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))
            : error
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 flex items-center justify-center aspect-[4/5] rounded-xl bg-muted/60 text-xs text-muted-foreground"
                  >
                    Unable to load
                  </div>
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
        </div>
        <div className="mt-10 lg:mt-14 flex justify-center">
          <button
            onClick={() => navigate({ name: "shop" })}
            className="border border-ink text-ink rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink hover:text-cream transition-colors inline-flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 6. Brand Story / Atelier
// ============================================================================

function AtelierStory() {
  const { navigate } = useRouter()
  return (
    <section className="py-16 lg:py-24 bg-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-luxe-radial opacity-50 pointer-events-none" />
      <div className="container-luxe relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/5] rounded-2xl overflow-hidden shadow-luxe">
              <LuxeImage
                src="/images/lifestyle/atelier.jpg"
                alt="Inside the Provelaa Mumbai atelier"
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            </div>
            {/* decorative gold frame */}
            <div className="absolute -inset-3 -z-10 rounded-3xl border border-accent/30" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-accent mb-3">
              The Provelaa Atelier
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream leading-[1.1] text-balance">
              Crafted by Hand, Worn with Love
            </h2>
            <div className="mt-5 space-y-4 text-cream/75 text-sm lg:text-base leading-relaxed">
              <p>
                Nestled in the heart of Mumbai, our atelier brings together
                third-generation karigars and contemporary designers. Each piece
                begins as a sketch and ends in your hands — shaped, polished,
                and set by hand.
              </p>
              <p>
                We work only with ethically sourced gemstones and recycled
                champagne gold, because beauty should never come at the cost of
                conscience.
              </p>
              <p>
                Every Provelaa piece is backed by our lifetime warranty — free
                polish, re-plating and repairs, for as long as you wear it.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center"
                >
                  <p className="font-serif text-xl lg:text-2xl text-gold-gradient">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream/60">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigate({ name: "about" })}
              className="mt-8 bg-gold-gradient text-ink rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Read Our Story
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 7. New Arrivals
// ============================================================================

function NewArrivals() {
  const { navigate } = useRouter()
  const { products, error } = useProducts(
    "/api/products?newArrival=true&limit=4"
  )
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Fresh from the atelier"
          title="Just Arrived"
          subtitle="The newest additions to the Provelaa family."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products
            ? products.length > 0
              ? products
                  .slice(0, 4)
                  .map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 flex items-center justify-center aspect-[4/5] rounded-xl bg-muted/60 text-xs text-muted-foreground"
                  >
                    Coming soon
                  </div>
                ))
            : error
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 flex items-center justify-center aspect-[4/5] rounded-xl bg-muted/60 text-xs text-muted-foreground"
                  >
                    Unable to load
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
        </div>
        <div className="mt-10 lg:mt-14 flex justify-center">
          <button
            onClick={() => navigate({ name: "shop" })}
            className="border border-ink text-ink rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink hover:text-cream transition-colors inline-flex items-center gap-2"
          >
            Shop New In
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 8. Testimonials
// ============================================================================

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/40">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="From the Provelaa community"
          title="Worn & Adored"
          subtitle="Real stories from customers who wear our pieces every day."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
              className="relative rounded-2xl border border-accent/30 bg-card p-6 lg:p-7 shadow-luxe"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-accent/20" />
              <Stars count={t.rating} />
              <blockquote className="mt-4 text-sm lg:text-[15px] text-foreground/85 leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold-gradient flex items-center justify-center text-ink font-serif text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 9. Instagram / Social strip
// ============================================================================

function InstagramStrip() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="@provelaa on Instagram"
          title="Follow @provelaa"
          subtitle="Tag #WornByProvelaa for a chance to be featured."
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {INSTAGRAM_IMAGES.map((img, i) => (
            <motion.a
              key={i}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Provelaa on Instagram"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <LuxeImage
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                <Instagram className="h-7 w-7 text-cream opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 10. Newsletter CTA band
// ============================================================================

function NewsletterCta() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast.success("Welcome to the Provelaa Circle! Check your inbox for 10% off.")
        setEmail("")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Something went wrong.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-champagne via-background to-accent/30" />
      <div className="absolute inset-0 bg-luxe-radial" />
      <div className="container-luxe relative py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-accent font-medium">
            <Sparkles className="h-4 w-4" />
            The Provelaa Circle
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-ink text-balance leading-[1.1]">
            Join the Provelaa Circle
          </h2>
          <p className="mt-3 text-sm lg:text-base text-ink/70">
            Get 10% off your first order + early access to new collections.
          </p>
          <form
            onSubmit={subscribe}
            className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-card/80 backdrop-blur border border-border rounded-full pl-11 pr-5 py-3.5 text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-gradient text-ink rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-[11px] text-ink/50">
            No spam, just jewellery love. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// Main HomeView
// ============================================================================

export default function HomeView() {
  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <UspStrip />
      <ShopByCategory />
      <FeaturedCollections />
      <Bestsellers />
      <AtelierStory />
      <NewArrivals />
      <Testimonials />
      <InstagramStrip />
      <NewsletterCta />
    </div>
  )
}
