"use client"

import { Suspense } from "react"
import { useRouter } from "@/lib/router"
import { AnnouncementBar } from "@/components/site/announcement-bar"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { ScrollToTop } from "@/components/site/scroll-to-top"
import HomeView from "@/components/views/home-view"
import ShopView from "@/components/views/shop-view"
import ProductView from "@/components/views/product-view"
import CheckoutView from "@/components/views/checkout-view"
import TrackView from "@/components/views/track-view"
import { AboutView } from "@/components/views/about-view"
import { ContactView } from "@/components/views/contact-view"

function ViewRouter() {
  const { route } = useRouter()
  switch (route.name) {
    case "home":
      return <HomeView />
    case "shop":
      return (
        <ShopView
          initialCategory={route.category}
          initialCollection={route.collection}
          initialQuery={route.q}
        />
      )
    case "product":
      return <ProductView slug={route.slug} />
    case "checkout":
      return <CheckoutView />
    case "track":
      return <TrackView initialOrderNumber={route.orderNumber} />
    case "about":
      return <AboutView />
    case "contact":
      return <ContactView />
    default:
      return <HomeView />
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-luxe py-32 text-center text-muted-foreground">
              Loading…
            </div>
          }
        >
          <ViewRouter />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
