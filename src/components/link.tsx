"use client"

import * as React from "react"
import { useRouter, type Route } from "@/lib/router"
import { cn } from "@/lib/utils"

type LinkProps = {
  to: Route
  className?: string
  children: React.ReactNode
  onClick?: () => void
  "aria-label"?: string
}

export function Link({ to, className, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  return (
    <a
      href={routeToHref(to)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(to)
        onClick?.()
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

function routeToHref(to: Route): string {
  switch (to.name) {
    case "home":
      return "#/"
    case "shop": {
      const p = new URLSearchParams()
      if (to.category) p.set("category", to.category)
      if (to.collection) p.set("collection", to.collection)
      if (to.q) p.set("q", to.q)
      const qs = p.toString()
      return `#/shop${qs ? `?${qs}` : ""}`
    }
    case "product":
      return `#/product/${to.slug}`
    case "checkout":
      return "#/checkout"
    case "track":
      return to.orderNumber ? `#/track?order=${to.orderNumber}` : "#/track"
    case "about":
      return "#/about"
    case "contact":
      return "#/contact"
  }
}

export { Link as RouteLink }
