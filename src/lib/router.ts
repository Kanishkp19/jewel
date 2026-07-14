"use client"

import { useEffect, useState, useCallback } from "react"

export type Route =
  | { name: "home" }
  | { name: "shop"; category?: string; collection?: string; q?: string }
  | { name: "product"; slug: string }
  | { name: "checkout" }
  | { name: "track"; orderNumber?: string }
  | { name: "about" }
  | { name: "contact" }

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, "")
  const [path, queryStr] = clean.split("?")
  const segments = path.split("/").filter(Boolean)
  const params = new URLSearchParams(queryStr || "")

  if (segments.length === 0) return { name: "home" }
  if (segments[0] === "shop")
    return {
      name: "shop",
      category: params.get("category") || undefined,
      collection: params.get("collection") || undefined,
      q: params.get("q") || undefined,
    }
  if (segments[0] === "product" && segments[1])
    return { name: "product", slug: segments[1] }
  if (segments[0] === "checkout") return { name: "checkout" }
  if (segments[0] === "track")
    return { name: "track", orderNumber: params.get("order") || undefined }
  if (segments[0] === "about") return { name: "about" }
  if (segments[0] === "contact") return { name: "contact" }
  return { name: "home" }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/"
    case "shop": {
      const p = new URLSearchParams()
      if (route.category) p.set("category", route.category)
      if (route.collection) p.set("collection", route.collection)
      if (route.q) p.set("q", route.q)
      const qs = p.toString()
      return `#/shop${qs ? `?${qs}` : ""}`
    }
    case "product":
      return `#/product/${route.slug}`
    case "checkout":
      return "#/checkout"
    case "track":
      return route.orderNumber ? `#/track?order=${route.orderNumber}` : "#/track"
    case "about":
      return "#/about"
    case "contact":
      return "#/contact"
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(typeof window !== "undefined" ? window.location.hash : "")
  )

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const navigate = useCallback((to: Route) => {
    const hash = routeToHash(to)
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      // same hash, force scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  return { route, navigate }
}

export type Router = ReturnType<typeof useRouter>
