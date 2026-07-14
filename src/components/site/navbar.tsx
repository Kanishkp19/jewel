"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  Package,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { useCart, useWishlist } from "@/lib/cart-store"
import { siteConfig, formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"
import { CartDrawer } from "./cart-drawer"
import { Button } from "@/components/ui/button"

const NAV = [
  {
    label: "Rings",
    category: "rings",
    children: [
      { label: "Engagement Rings", category: "rings" },
      { label: "Stackable Rings", category: "rings" },
      { label: "Cocktail Rings", category: "rings" },
      { label: "Couple Bands", category: "rings" },
    ],
  },
  {
    label: "Necklaces",
    category: "necklaces",
    children: [
      { label: "Pendant Necklaces", category: "necklaces" },
      { label: "Choker Sets", category: "necklaces" },
      { label: "Layered Chains", category: "necklaces" },
      { label: "Temple Haar", category: "necklaces" },
    ],
  },
  {
    label: "Earrings",
    category: "earrings",
    children: [
      { label: "Studs", category: "earrings" },
      { label: "Jhumkas", category: "earrings" },
      { label: "Hoops", category: "earrings" },
      { label: "Chandbalis", category: "earrings" },
    ],
  },
  {
    label: "Mangalsutra",
    category: "mangalsutra",
    children: [
      { label: "Classic Black Bead", category: "mangalsutra" },
      { label: "Contemporary", category: "mangalsutra" },
    ],
  },
  {
    label: "Bracelets",
    category: "bracelets",
    children: [
      { label: "Tennis Bracelets", category: "bracelets" },
      { label: "Charm Bracelets", category: "bracelets" },
      { label: "Kada", category: "bracelets" },
    ],
  },
]

export function Navbar() {
  const { route, navigate } = useRouter()
  const cart = useCart()
  const wishlist = useWishlist()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const cartCount = cart.count()
  const wishCount = wishlist.ids.length

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate({ name: "shop", q: query.trim() })
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-luxe border-b border-border/60"
            : "bg-background/95 backdrop-blur-sm border-b border-transparent"
        )}
        onMouseLeave={() => setHoveredNav(null)}
      >
        <div className="container-luxe">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Left: mobile menu + search */}
            <div className="flex items-center gap-2 flex-1">
              <button
                aria-label="Open menu"
                className="lg:hidden p-2 -ml-2 hover:text-accent transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                aria-label="Search"
                className="hidden lg:inline-flex p-2 -ml-2 hover:text-accent transition-colors"
                onClick={() => setSearchOpen((s) => !s)}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Center: logo */}
            <button
              onClick={() => navigate({ name: "home" })}
              className="flex flex-col items-center justify-center group"
              aria-label="Provelaa home"
            >
              <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-[0.18em] uppercase text-ink leading-none">
                Provelaa
              </span>
              <span className="hidden sm:block text-[9px] lg:text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-1">
                Fine Jewellery
              </span>
            </button>

            {/* Right: actions */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1">
              <button
                aria-label="Track order"
                className="hidden sm:inline-flex p-2 hover:text-accent transition-colors"
                onClick={() => navigate({ name: "track" })}
              >
                <Package className="h-[18px] w-[18px]" />
              </button>
              <button
                aria-label="Wishlist"
                className="relative p-2 hover:text-accent transition-colors"
                onClick={() => navigate({ name: "shop" })}
              >
                <Heart className="h-[18px] w-[18px]" />
                {wishCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-accent text-accent-foreground text-[10px] font-medium h-4 min-w-4 px-1 rounded-full inline-flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </button>
              <button
                aria-label="Cart"
                className="relative p-2 hover:text-accent transition-colors"
                onClick={() => cart.open()}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0.5 right-0.5 bg-accent text-accent-foreground text-[10px] font-semibold h-4 min-w-4 px-1 rounded-full inline-flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-8 pb-3">
            {NAV.map((item) => (
              <button
                key={item.label}
                className="relative text-[13px] uppercase tracking-[0.18em] font-medium text-foreground/80 hover:text-ink transition-colors py-1"
                onMouseEnter={() => setHoveredNav(item.label)}
                onClick={() => navigate({ name: "shop", category: item.category })}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300",
                    hoveredNav === item.label ? "w-full" : "w-0"
                  )}
                />
              </button>
            ))}
            <button
              className="text-[13px] uppercase tracking-[0.18em] font-medium text-foreground/80 hover:text-ink transition-colors py-1"
              onClick={() => navigate({ name: "about" })}
            >
              Our Story
            </button>
            <button
              className="text-[13px] uppercase tracking-[0.18em] font-medium text-foreground/80 hover:text-ink transition-colors py-1"
              onClick={() => navigate({ name: "contact" })}
            >
              Contact
            </button>
          </nav>

          {/* Mega menu */}
          <AnimatePresence>
            {hoveredNav && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-px w-[min(640px,92vw)] bg-card border border-border shadow-luxe rounded-b-xl overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-6 p-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                      Shop {hoveredNav}
                    </p>
                    {NAV.find((n) => n.label === hoveredNav)?.children.map(
                      (c) => (
                        <button
                          key={c.label}
                          onClick={() =>
                            navigate({ name: "shop", category: c.category })
                          }
                          className="group flex items-center justify-between w-full py-2 text-sm text-foreground/80 hover:text-accent transition-colors"
                        >
                          {c.label}
                          <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      navigate({
                        name: "shop",
                        category:
                          NAV.find((n) => n.label === hoveredNav)?.category,
                      })
                    }
                    className="group relative rounded-lg overflow-hidden bg-gradient-to-br from-champagne to-accent/30 p-5 text-left"
                  >
                    <div className="absolute inset-0 bg-luxe-radial opacity-60" />
                    <div className="relative">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Featured
                      </p>
                      <p className="font-serif text-xl mt-2 text-ink">
                        The {hoveredNav} Edit
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Handpicked favourites, atelier crafted.
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent-foreground">
                        Explore
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <form onSubmit={submitSearch} className="container-luxe py-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search rings, necklaces, earrings…"
                      className="flex-1 bg-transparent text-lg font-display outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1.5 hover:text-accent"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-card shadow-luxe flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-serif text-2xl tracking-[0.18em] uppercase">
                  Provelaa
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={submitSearch} className="p-5 border-b border-border">
                <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2.5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search jewellery…"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </form>
              <div className="flex-1 overflow-y-auto scrollbar-luxe p-5 space-y-1">
                <MobileLink
                  label="Shop All"
                  onClick={() => {
                    navigate({ name: "shop" })
                    setMobileOpen(false)
                  }}
                />
                {NAV.map((item) => (
                  <div key={item.label}>
                    <button
                      className="w-full text-left py-3 font-serif text-xl text-ink"
                      onClick={() => {
                        navigate({ name: "shop", category: item.category })
                        setMobileOpen(false)
                      }}
                    >
                      {item.label}
                    </button>
                    <div className="pl-4 border-l border-border ml-1 mb-2">
                      {item.children.map((c) => (
                        <button
                          key={c.label}
                          className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-accent"
                          onClick={() => {
                            navigate({ name: "shop", category: c.category })
                            setMobileOpen(false)
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <MobileLink
                  label="Track Order"
                  onClick={() => {
                    navigate({ name: "track" })
                    setMobileOpen(false)
                  }}
                />
                <MobileLink
                  label="Our Story"
                  onClick={() => {
                    navigate({ name: "about" })
                    setMobileOpen(false)
                  }}
                />
                <MobileLink
                  label="Contact"
                  onClick={() => {
                    navigate({ name: "contact" })
                    setMobileOpen(false)
                  }}
                />
              </div>
              <div className="p-5 border-t border-border text-xs text-muted-foreground">
                <p className="font-medium text-ink mb-1">{siteConfig.phone}</p>
                <p>{siteConfig.email}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  )
}

function MobileLink({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left py-3 font-serif text-xl text-ink hover:text-accent transition-colors"
    >
      {label}
    </button>
  )
}
