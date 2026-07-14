"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Eye, Star, Plus } from "lucide-react"
import { useRouter } from "@/lib/router"
import { useCart, useWishlist } from "@/lib/cart-store"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"

export type ProductCardData = {
  id: string
  slug: string
  name: string
  price: number
  compareAt?: number | null
  images: string[]
  metal: string
  rating: number
  reviewCount: number
  isBestseller?: boolean
  isNewArrival?: boolean
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData
  index?: number
}) {
  const { navigate } = useRouter()
  const cart = useCart()
  const wishlist = useWishlist()
  const [hovered, setHovered] = React.useState(false)
  const [imgIdx, setImgIdx] = React.useState(0)
  const wished = wishlist.has(product.id)

  const images = product.images || []
  const primaryImg = images[0] || "/placeholder.jpg"
  const secondaryImg = images[1] || images[0] || "/placeholder.jpg"

  React.useEffect(() => {
    setImgIdx(hovered && images.length > 1 ? 1 : 0)
  }, [hovered, images.length])

  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(
          ((product.compareAt - product.price) / product.compareAt) * 100
        )
      : 0

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    cart.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: primaryImg,
      metal: product.metal,
    })
  }

  const toggleWish = (e: React.MouseEvent) => {
    e.stopPropagation()
    wishlist.toggle(product.id)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate({ name: "product", slug: product.slug })}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted cursor-pointer">
        <motion.img
          src={primaryImg}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ opacity: imgIdx === 0 ? 1 : 0, scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.img
          src={secondaryImg}
          alt={`${product.name} alternate`}
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ opacity: imgIdx === 1 ? 1 : 0, scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-card/90 backdrop-blur text-ink text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-gold-gradient text-ink text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={toggleWish}
          aria-label="Add to wishlist"
          className={cn(
            "absolute top-3 right-3 z-10 h-9 w-9 rounded-full glass flex items-center justify-center transition-colors",
            wished ? "text-destructive" : "text-ink hover:text-accent"
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>

        {/* Quick actions */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-3 bottom-3 z-10 flex gap-2"
        >
          <button
            onClick={quickAdd}
            className="flex-1 bg-ink/95 backdrop-blur text-cream rounded-full py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-ink transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Quick Add
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate({ name: "product", slug: product.slug })
            }}
            aria-label="Quick view"
            className="h-10 w-10 glass rounded-full flex items-center justify-center text-ink hover:text-accent"
          >
            <Eye className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="pt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span>
            {product.rating.toFixed(1)}{" "}
            <span className="opacity-60">({product.reviewCount})</span>
          </span>
          <span className="mx-1 opacity-40">·</span>
          <span className="uppercase tracking-wider">{product.metal}</span>
        </div>
        <h3 className="font-serif text-base leading-snug line-clamp-1 cursor-pointer hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
