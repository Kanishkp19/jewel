export const siteConfig = {
  name: "Provelaa",
  tagline: "Handcrafted Luxury Jewellery",
  description:
    "Timeless jewellery in champagne gold, sterling silver & ethically sourced gemstones.",
  url: "https://provelaa.com",
  email: "care@provelaa.com",
  phone: "+91 98765 43210",
  address: "Provelaa Atelier, Bandra West, Mumbai 400050, India",
  social: {
    instagram: "https://instagram.com/provelaa",
    facebook: "https://facebook.com/provelaa",
    pinterest: "https://pinterest.com/provelaa",
    youtube: "https://youtube.com/@provelaa",
  },
  shipping: {
    freeOver: 2999,
    flatRate: 99,
    codAvailable: true,
  },
  currency: "INR",
  currencySymbol: "₹",
} as const

export const formatPrice = (amount: number, currency = siteConfig.currency) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/#shop" },
  { label: "Rings", href: "/#shop?category=rings" },
  { label: "Necklaces", href: "/#shop?category=necklaces" },
  { label: "Earrings", href: "/#shop?category=earrings" },
  { label: "Mangalsutra", href: "/#shop?category=mangalsutra" },
  { label: "Track Order", href: "/#track" },
] as const
