"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  SlidersHorizontal,
  ChevronRight,
  X,
  PackageSearch,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { Link } from "@/components/link"
import {
  ProductCard,
  type ProductCardData,
} from "@/components/site/product-card"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================================================
// Types
// ============================================================================

type Props = {
  initialCategory?: string
  initialCollection?: string
  initialQuery?: string
}

type SortValue = "featured" | "price-asc" | "price-desc" | "rating"

type Filters = {
  category: string // "all" | slug
  collection: string // "all" | slug
  metal: string // "all" | exact metal name
  priceRange: [number, number]
  sort: SortValue
  q: string
}

type Category = {
  id: string
  slug: string
  name: string
  description?: string | null
  image?: string | null
}

type Collection = {
  id: string
  slug: string
  name: string
  tagline?: string | null
  description?: string | null
  image?: string | null
}

// The API product is a superset of ProductCardData; structural typing lets us
// treat it as a ProductCardData directly (extra fields are ignored by the card).
type Product = ProductCardData

// ============================================================================
// Constants
// ============================================================================

const METAL_OPTIONS = [
  "Gold Plated",
  "Sterling Silver",
  "Rose Gold",
  "Champagne Gold",
] as const

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
]

const MIN_PRICE = 0
const MAX_PRICE = 50000
const PRICE_STEP = 500
const SKELETON_COUNT = 8
const DEBOUNCE_MS = 300

const DEFAULT_FILTERS: Filters = {
  category: "all",
  collection: "all",
  metal: "all",
  priceRange: [MIN_PRICE, MAX_PRICE],
  sort: "featured",
  q: "",
}

// ============================================================================
// Helpers
// ============================================================================

function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== "all")
    params.set("category", filters.category)
  if (filters.collection && filters.collection !== "all")
    params.set("collection", filters.collection)
  // Metal is a single-equals match in the API; we send only the first selected
  // metal. The sidebar exposes this as a single-select RadioGroup, so only one
  // metal is ever chosen.
  if (filters.metal && filters.metal !== "all")
    params.set("metal", filters.metal)
  if (filters.q) params.set("q", filters.q)
  if (filters.priceRange[0] > MIN_PRICE)
    params.set("minPrice", String(filters.priceRange[0]))
  if (filters.priceRange[1] < MAX_PRICE)
    params.set("maxPrice", String(filters.priceRange[1]))
  params.set("sort", filters.sort)
  const qs = params.toString()
  return `/api/products${qs ? `?${qs}` : ""}`
}

function getActiveFilterCount(filters: Filters): number {
  let n = 0
  if (filters.category !== "all") n++
  if (filters.collection !== "all") n++
  if (filters.metal !== "all") n++
  if (filters.priceRange[0] > MIN_PRICE || filters.priceRange[1] < MAX_PRICE) n++
  // sort & q are not counted as "filters" for the badge
  return n
}

// ============================================================================
// ProductCardSkeleton — 4:5 aspect to match ProductCard
// ============================================================================

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

// ============================================================================
// FilterRadioRow — label + radio row, used inside RadioGroup
// ============================================================================

function FilterRadioRow({
  id,
  value,
  currentValue,
  label,
}: {
  id: string
  value: string
  currentValue: string
  label: string
}) {
  const checked = currentValue === value
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer py-1.5 group"
    >
      <RadioGroupItem
        id={id}
        value={value}
        className="data-[state=checked]:border-accent data-[state=checked]:text-accent"
      />
      <span
        aria-current={checked ? "true" : undefined}
        className={cn(
          "text-sm transition-colors",
          checked
            ? "text-ink font-medium"
            : "text-muted-foreground group-hover:text-ink"
        )}
      >
        {label}
      </span>
    </label>
  )
}

// ============================================================================
// FiltersPanel — shared by the desktop sidebar and the mobile Sheet
// ============================================================================

function FiltersPanel({
  filters,
  updateFilter,
  categories,
  collections,
  onClear,
  activeCount,
}: {
  filters: Filters
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  categories: Category[]
  collections: Collection[]
  onClear: () => void
  activeCount: number
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">Filters</h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Category */}
      <fieldset className="space-y-2">
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Category
        </legend>
        <RadioGroup
          value={filters.category}
          onValueChange={(v) => updateFilter("category", v)}
          aria-label="Filter by category"
        >
          <FilterRadioRow
            id="cat-all"
            value="all"
            currentValue={filters.category}
            label="All Jewellery"
          />
          {categories.map((c) => (
            <FilterRadioRow
              key={c.id}
              id={`cat-${c.id}`}
              value={c.slug}
              currentValue={filters.category}
              label={c.name}
            />
          ))}
        </RadioGroup>
      </fieldset>

      <Separator />

      {/* Metal */}
      <fieldset className="space-y-2">
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Metal
        </legend>
        <RadioGroup
          value={filters.metal}
          onValueChange={(v) => updateFilter("metal", v)}
          aria-label="Filter by metal"
        >
          <FilterRadioRow
            id="metal-all"
            value="all"
            currentValue={filters.metal}
            label="All Metals"
          />
          {METAL_OPTIONS.map((m) => (
            <FilterRadioRow
              key={m}
              id={`metal-${m.replace(/\s+/g, "-")}`}
              value={m}
              currentValue={filters.metal}
              label={m}
            />
          ))}
        </RadioGroup>
      </fieldset>

      <Separator />

      {/* Price range */}
      <fieldset className="space-y-4">
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Price Range
        </legend>
        <Slider
          value={filters.priceRange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={PRICE_STEP}
          onValueChange={(v) =>
            updateFilter("priceRange", [
              v[0] ?? MIN_PRICE,
              v[1] ?? MAX_PRICE,
            ])
          }
          aria-label="Price range"
          className="[&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:border-accent"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="tabular-nums">{formatPrice(filters.priceRange[0])}</span>
          <span className="opacity-40">—</span>
          <span className="tabular-nums">{formatPrice(filters.priceRange[1])}</span>
        </div>
      </fieldset>

      <Separator />

      {/* Collections */}
      <fieldset className="space-y-2">
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Collections
        </legend>
        {collections.length === 0 ? (
          <p className="text-xs text-muted-foreground/70 italic">
            Loading collections…
          </p>
        ) : (
          <RadioGroup
            value={filters.collection}
            onValueChange={(v) => updateFilter("collection", v)}
            aria-label="Filter by collection"
          >
            <FilterRadioRow
              id="col-all"
              value="all"
              currentValue={filters.collection}
              label="All Collections"
            />
            {collections.map((c) => (
              <FilterRadioRow
                key={c.id}
                id={`col-${c.id}`}
                value={c.slug}
                currentValue={filters.collection}
                label={c.name}
              />
            ))}
          </RadioGroup>
        )}
      </fieldset>
    </div>
  )
}

// ============================================================================
// Breadcrumb
// ============================================================================

function Breadcrumb({ crumbLabel }: { crumbLabel: string | null }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <li>
          <Link to={{ name: "home" }} className="hover:text-accent transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden className="opacity-40">
          <ChevronRight className="h-3 w-3" />
        </li>
        <li>
          <Link to={{ name: "shop" }} className="hover:text-accent transition-colors">
            Shop
          </Link>
        </li>
        {crumbLabel && (
          <>
            <li aria-hidden className="opacity-40">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="text-ink">
              {crumbLabel}
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}

// ============================================================================
// ActiveFilterChips — removable chips above the grid
// ============================================================================

function ActiveFilterChips({
  filters,
  categories,
  collections,
  onRemove,
  onClear,
}: {
  filters: Filters
  categories: Category[]
  collections: Collection[]
  onRemove: (key: "category" | "collection" | "metal" | "priceRange") => void
  onClear: () => void
}) {
  const chips: { label: string; onRemove: () => void }[] = []
  if (filters.category !== "all") {
    const c = categories.find((x) => x.slug === filters.category)
    chips.push({
      label: c?.name || filters.category,
      onRemove: () => onRemove("category"),
    })
  }
  if (filters.collection !== "all") {
    const col = collections.find((x) => x.slug === filters.collection)
    chips.push({
      label: col?.name || filters.collection,
      onRemove: () => onRemove("collection"),
    })
  }
  if (filters.metal !== "all") {
    chips.push({ label: filters.metal, onRemove: () => onRemove("metal") })
  }
  if (filters.priceRange[0] > MIN_PRICE || filters.priceRange[1] < MAX_PRICE) {
    chips.push({
      label: `${formatPrice(filters.priceRange[0])} – ${formatPrice(
        filters.priceRange[1]
      )}`,
      onRemove: () => onRemove("priceRange"),
    })
  }
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-ink hover:border-accent transition-colors"
        >
          {chip.label}
          <X className="h-3 w-3 text-muted-foreground group-hover:text-accent" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-muted-foreground hover:text-accent underline underline-offset-4 ml-1"
      >
        Clear all
      </button>
    </div>
  )
}

// ============================================================================
// EmptyState
// ============================================================================

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-28 text-center">
      <div className="h-16 w-16 rounded-full bg-champagne/50 flex items-center justify-center">
        <PackageSearch className="h-7 w-7 text-accent" />
      </div>
      <h3 className="mt-5 font-serif text-2xl lg:text-3xl text-ink">
        No pieces match your filters
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Try adjusting or clearing your filters to explore our full atelier collection.
      </p>
      <Button
        onClick={onClear}
        className="mt-6 bg-ink text-cream hover:bg-ink/90 rounded-full px-6"
      >
        <RotateCcw className="h-4 w-4" />
        Clear filters
      </Button>
    </div>
  )
}

// ============================================================================
// ErrorState
// ============================================================================

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-28 text-center">
      <div className="h-16 w-16 rounded-full bg-champagne/50 flex items-center justify-center">
        <AlertCircle className="h-7 w-7 text-accent" />
      </div>
      <h3 className="mt-5 font-serif text-2xl lg:text-3xl text-ink">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        We couldn&apos;t load these pieces. Please try again in a moment.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="mt-6 rounded-full px-6"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}

// ============================================================================
// ShopView (default export)
// ============================================================================

export default function ShopView({
  initialCategory,
  initialCollection,
  initialQuery,
}: Props) {
  const { navigate } = useRouter()

  const [filters, setFilters] = React.useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    category: initialCategory || "all",
    collection: initialCollection || "all",
    q: initialQuery || "",
  }))

  const [categories, setCategories] = React.useState<Category[]>([])
  const [collections, setCollections] = React.useState<Collection[]>([])
  const [products, setProducts] = React.useState<Product[] | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [refreshNonce, setRefreshNonce] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Keep filters in sync when the router hands us new initial props
  // (e.g. navbar navigates from /shop?category=rings to /shop?category=necklaces).
  React.useEffect(() => {
    setFilters((f) => ({
      ...f,
      category: initialCategory || "all",
      collection: initialCollection || "all",
      q: initialQuery || "",
    }))
  }, [initialCategory, initialCollection, initialQuery])

  // Fetch categories & collections once on mount
  React.useEffect(() => {
    let cancelled = false
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d: { categories: Category[] }) => {
        if (!cancelled) setCategories(d.categories || [])
      })
      .catch(() => {})
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d: { collections: Collection[] }) => {
        if (!cancelled) setCollections(d.collections || [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const updateFilter = React.useCallback(
    <K extends keyof Filters,>(key: K, value: Filters[K]) => {
      setFilters((f) => ({ ...f, [key]: value }))
    },
    []
  )

  const queryString = React.useMemo(() => buildQueryString(filters), [filters])
  const activeCount = React.useMemo(
    () => getActiveFilterCount(filters),
    [filters]
  )

  // Debounced product fetch — 300ms after the last filter change.
  // Shows skeletons only on the very first load; subsequent refetches keep
  // the previous products visible with a subtle opacity dim (stale-while-
  // revalidate) so the slider never flashes skeletons mid-drag.
  React.useEffect(() => {
    setError(false)
    const controller = new AbortController()
    const t = setTimeout(() => {
      setLoading(true)
      fetch(queryString, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error("fetch failed")
          return r.json()
        })
        .then((d: { products: Product[] }) => {
          setProducts(d.products || [])
        })
        .catch((e: unknown) => {
          if (e instanceof DOMException && e.name === "AbortError") return
          setError(true)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, DEBOUNCE_MS)
    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [queryString, refreshNonce])

  const handleClear = React.useCallback(() => {
    // Preserve the search query (it comes from props, not the sidebar) but
    // reset every other filter — and the sort — back to defaults.
    setFilters((f) => ({ ...DEFAULT_FILTERS, q: f.q }))
  }, [])

  const removeFilter = React.useCallback(
    (key: "category" | "collection" | "metal" | "priceRange") => {
      setFilters((f) => ({
        ...f,
        [key]: key === "priceRange" ? [MIN_PRICE, MAX_PRICE] : "all",
      }))
    },
    []
  )

  const activeCategory = React.useMemo(
    () => categories.find((c) => c.slug === filters.category) || null,
    [categories, filters.category]
  )
  const activeCollection = React.useMemo(
    () => collections.find((c) => c.slug === filters.collection) || null,
    [collections, filters.collection]
  )

  const heading = filters.q
    ? `Search: ‘${filters.q}’`
    : activeCategory
      ? activeCategory.name
      : activeCollection
        ? activeCollection.name
        : "All Jewellery"

  const subtitle = filters.q
    ? "Pieces matching your search across our atelier."
    : activeCategory?.description
      ? activeCategory.description
      : activeCollection?.tagline || activeCollection?.description
        ? (activeCollection.tagline || activeCollection.description)
        : "Handcrafted fine jewellery, made to be treasured."

  const crumbLabel = filters.q
    ? "Search"
    : activeCategory?.name || activeCollection?.name || null

  const isInitialLoad = loading && products === null

  return (
    <div className="bg-background min-h-screen">
      <div className="container-luxe py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-28 max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-luxe pr-2 pb-6">
              <FiltersPanel
                filters={filters}
                updateFilter={updateFilter}
                categories={categories}
                collections={collections}
                onClear={handleClear}
                activeCount={activeCount}
              />
            </div>
          </aside>

          {/* Main column */}
          <div>
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative bg-luxe-radial rounded-3xl px-6 py-7 lg:px-10 lg:py-9 mb-7 lg:mb-9"
            >
              <Breadcrumb crumbLabel={crumbLabel} />
              <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                <div className="max-w-2xl">
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05] text-balance">
                    {heading}
                  </h1>
                  <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed max-w-xl">
                    {subtitle}
                  </p>
                </div>

                {/* Mobile filters trigger */}
                <div className="lg:hidden">
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        aria-label={
                          activeCount > 0
                            ? `Open filters, ${activeCount} active`
                            : "Open filters"
                        }
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeCount > 0 && (
                          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-gradient px-1.5 text-[10px] font-semibold text-ink">
                            {activeCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[88vw] sm:max-w-md flex flex-col p-0"
                    >
                      <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                        <SheetTitle className="font-serif text-2xl">
                          Filters
                        </SheetTitle>
                        <SheetDescription className="sr-only">
                          Refine your jewellery selection by category, metal,
                          price and collection.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto scrollbar-luxe px-6 py-6">
                        <FiltersPanel
                          filters={filters}
                          updateFilter={updateFilter}
                          categories={categories}
                          collections={collections}
                          onClear={handleClear}
                          activeCount={activeCount}
                        />
                      </div>
                      <SheetFooter className="px-6 py-4 border-t border-border">
                        <Button
                          onClick={() => setSheetOpen(false)}
                          className="w-full bg-ink text-cream hover:bg-ink/90 rounded-full"
                        >
                          Show {products?.length ?? 0} results
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </motion.header>

            {/* Result bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 mb-5">
              <span className="text-sm text-muted-foreground">
                {isInitialLoad
                  ? "Searching the atelier…"
                  : products
                    ? `Showing ${products.length} ${
                        products.length === 1 ? "piece" : "pieces"
                      }`
                    : "—"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:block">
                  Sort
                </span>
                <Select
                  value={filters.sort}
                  onValueChange={(v) => updateFilter("sort", v as SortValue)}
                >
                  <SelectTrigger
                    className="w-[190px] rounded-full"
                    aria-label="Sort products"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filter chips */}
            <div className="mb-6">
              <ActiveFilterChips
                filters={filters}
                categories={categories}
                collections={collections}
                onRemove={removeFilter}
                onClear={handleClear}
              />
            </div>

            {/* Grid / states */}
            {isInitialLoad ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={() => setRefreshNonce((n) => n + 1)} />
            ) : !products || products.length === 0 ? (
              <EmptyState onClear={handleClear} />
            ) : (
              <motion.div
                animate={{ opacity: loading ? 0.45 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
              >
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            )}

            {/* Bespoke CTA */}
            {!loading && !error && products && products.length > 0 && (
              <div className="mt-16 lg:mt-20 text-center">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  Made to order
                </div>
                <p className="mt-3 font-display text-2xl lg:text-3xl text-ink">
                  Looking for something bespoke?
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Our atelier crafts made-to-order pieces in champagne gold and
                  sterling silver — designed with you, made to be treasured.
                </p>
                <Button
                  variant="outline"
                  className="mt-5 rounded-full"
                  onClick={() => navigate({ name: "contact" })}
                >
                  Speak to our atelier
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
