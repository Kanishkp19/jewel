// Seed Provelaa database with categories, collections, products, and reviews
// Usage: bun run scripts/seed.ts
import { db } from "../src/lib/db"

type ProductSeed = {
  slug: string
  name: string
  description: string
  price: number
  compareAt?: number
  metal: string
  material: string
  gemstone?: string
  weight?: string
  categorySlug: string
  collectionSlug?: string
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  isBestseller?: boolean
  isNewArrival?: boolean
  tags: string[]
  reviews?: { author: string; rating: number; title: string; body: string }[]
}

const categories = [
  {
    slug: "rings",
    name: "Rings",
    description: "From everyday bands to statement cocktail rings, each piece is handcrafted to be worn and stacked.",
    image: "/images/categories/rings.jpg",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    description: "Delicate chains, layered pendants, and traditional temple haars — find your perfect length.",
    image: "/images/categories/necklaces.jpg",
  },
  {
    slug: "earrings",
    name: "Earrings",
    description: "Jhumkas, chandbalis, studs and hoops — finishing touches for every occasion.",
    image: "/images/categories/earrings.jpg",
  },
  {
    slug: "mangalsutra",
    name: "Mangalsutra",
    description: "Classic black-bead mangalsutras with a contemporary twist — tradition, reimagined.",
    image: "/images/categories/mangalsutra.jpg",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    description: "Tennis bracelets, charm chains and kadas — wrist candy for every day.",
    image: "/images/categories/bracelets.jpg",
  },
]

const collections = [
  {
    slug: "champagne-gold",
    name: "The Champagne Gold Edit",
    tagline: "Warm, golden, made to glow.",
    description: "Our signature champagne gold finish — a warm, rosé-tinged gold that flatters every skin tone.",
    image: "/images/collections/champagne-gold.jpg",
  },
  {
    slug: "festive-edit",
    name: "The Festive Edit",
    tagline: "For the season of celebration.",
    description: "Kundan-inspired pieces, jhumkas and temple haar — designed for weddings, festivals and once-in-a-lifetime moments.",
    image: "/images/collections/festive-edit.jpg",
  },
  {
    slug: "minimalist",
    name: "Everyday Minimalist",
    tagline: "Dainty, stackable, lived-in.",
    description: "Thin chains, tiny studs and simple bands — the foundation of a modern jewellery wardrobe.",
    image: "/images/collections/minimalist.jpg",
  },
]

const products: ProductSeed[] = [
  // ─── RINGS ──────────────────────────────────────────
  {
    slug: "aurora-solitaire-ring",
    name: "Aurora Solitaire Ring",
    description:
      "A single brilliant-cut diamond set in champagne gold, designed to catch light from every angle. The Aurora is our most-loved engagement ring — timeless, delicate, and made to be worn long after the big day.",
    price: 8999,
    compareAt: 12999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Brilliant Cut CZ (0.5ct)",
    weight: "3.2g",
    categorySlug: "rings",
    collectionSlug: "champagne-gold",
    images: ["/images/products/ring-solitaire-1.jpg", "/images/products/ring-solitaire-2.jpg"],
    rating: 4.9,
    reviewCount: 248,
    stock: 18,
    isBestseller: true,
    tags: ["engagement", "diamond", "everyday"],
    reviews: [
      { author: "Priya M.", rating: 5, title: "Even prettier in person", body: "Got this as a gift and I haven't taken it off since. The champagne gold is so warm and flattering." },
      { author: "Riya S.", rating: 5, title: "Perfect engagement ring", body: "My now-fiancé proposed with this and I cried. It's delicate but sparkles like crazy in sunlight." },
      { author: "Meera K.", rating: 4, title: "Beautiful, runs slightly large", body: "Gorgeous ring but I'd size down half a size. Quality is excellent for the price." },
    ],
  },
  {
    slug: "celeste-stack-set",
    name: "Celeste Stack Ring Set (3 pcs)",
    description:
      "Three delicate bands — a plain champagne gold band, a tiny diamond-studded band, and a single pearl accent — designed to be worn together or apart. The ultimate everyday stack.",
    price: 6499,
    compareAt: 8999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "CZ + Freshwater Pearl",
    weight: "4.8g (set)",
    categorySlug: "rings",
    collectionSlug: "minimalist",
    images: ["/images/products/ring-stack-1.jpg", "/images/products/ring-stack-2.jpg"],
    rating: 4.8,
    reviewCount: 187,
    stock: 24,
    isBestseller: true,
    tags: ["stackable", "everyday", "set"],
    reviews: [
      { author: "Ananya R.", rating: 5, title: "My new everyday rings", body: "I wear all three together every single day. So delicate and the pearl one is my favourite." },
      { author: "Sneha P.", rating: 5, title: "Great value", body: "Three rings for this price is a steal. Quality is genuinely good." },
    ],
  },
  {
    slug: "emerald-noir-cocktail-ring",
    name: "Emerald Noir Cocktail Ring",
    description:
      "A statement oval emerald-green gemstone surrounded by a halo of tiny diamonds, set in champagne gold. Made for festive evenings and special occasions — this ring demands to be noticed.",
    price: 11499,
    compareAt: 15999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Emerald-green CZ (1.2ct) + Diamond Halo",
    weight: "6.1g",
    categorySlug: "rings",
    collectionSlug: "festive-edit",
    images: ["/images/products/ring-cocktail-1.jpg", "/images/products/ring-cocktail-2.jpg"],
    rating: 4.7,
    reviewCount: 92,
    stock: 12,
    isNewArrival: true,
    tags: ["cocktail", "statement", "festive", "emerald"],
    reviews: [
      { author: "Kavya D.", rating: 5, title: "Showstopper", body: "Wore this to a wedding and got so many compliments. The emerald is gorgeous." },
    ],
  },
  // ─── NECKLACES ──────────────────────────────────────
  {
    slug: "pearl-drop-pendant",
    name: "Pearl Drop Pendant Necklace",
    description:
      "A single freshwater pearl suspended from a delicate champagne gold chain. Adjustable from 16 to 18 inches. The piece you'll reach for every morning.",
    price: 4999,
    compareAt: 6999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Freshwater Pearl (6mm)",
    weight: "2.8g",
    categorySlug: "necklaces",
    collectionSlug: "minimalist",
    images: ["/images/products/neck-pendant-1.jpg", "/images/products/neck-pendant-2.jpg"],
    rating: 4.9,
    reviewCount: 312,
    stock: 30,
    isBestseller: true,
    tags: ["pendant", "pearl", "everyday", "layering"],
    reviews: [
      { author: "Tanvi B.", rating: 5, title: "Goes with everything", body: "I literally have not taken this off in 3 months. It's perfect." },
      { author: "Ishita G.", rating: 5, title: "Dainty and beautiful", body: "Exactly what I wanted. The pearl has lovely lustre." },
      { author: "Neha V.", rating: 4, title: "Chain is delicate", body: "Beautiful piece but the chain is very thin. Treat with care." },
    ],
  },
  {
    slug: "layered-gold-chain-set",
    name: "Layered Gold Chain Set (3 pcs)",
    description:
      "Three pre-clasped chains of varying lengths — 16, 18, and 20 inches — with tiny pendants. The layered look without the tangles. Wear all three or just one.",
    price: 7999,
    compareAt: 10999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    weight: "5.4g (set)",
    categorySlug: "necklaces",
    collectionSlug: "champagne-gold",
    images: ["/images/products/neck-layered-1.jpg", "/images/products/neck-pendant-1.jpg"],
    rating: 4.8,
    reviewCount: 156,
    stock: 20,
    isBestseller: true,
    tags: ["layered", "set", "everyday"],
    reviews: [
      { author: "Aditi J.", rating: 5, title: "No more tangled chains", body: "The pre-clasped design is genius. I get the layered look with zero effort." },
    ],
  },
  {
    slug: "pearl-choker-necklace",
    name: "Pearl & Gold Choker",
    description:
      "A modern choker of tiny champagne gold beads with freshwater pearl accents, sitting close to the collarbone. Elegant for festive wear, dainty enough for everyday.",
    price: 8499,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Freshwater Pearls",
    weight: "7.2g",
    categorySlug: "necklaces",
    collectionSlug: "festive-edit",
    images: ["/images/products/neck-choker-1.jpg", "/images/products/neck-pendant-2.jpg"],
    rating: 4.7,
    reviewCount: 78,
    stock: 14,
    isNewArrival: true,
    tags: ["choker", "pearl", "festive"],
    reviews: [
      { author: "Roshni T.", rating: 5, title: "Stunning for sarees", body: "Wore this with a silk saree and it was perfect. So elegant." },
    ],
  },
  {
    slug: "temple-haar-necklace",
    name: "Temple Haar — Traditional South Indian Necklace",
    description:
      "Inspired by traditional South Indian temple jewellery, this haar features intricate carved gold work with small ruby accents. A heritage piece for weddings and festivals.",
    price: 18999,
    compareAt: 24999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Ruby CZ",
    weight: "22g",
    categorySlug: "necklaces",
    collectionSlug: "festive-edit",
    images: ["/images/products/neck-temple-1.jpg", "/images/products/neck-choker-1.jpg"],
    rating: 4.9,
    reviewCount: 64,
    stock: 8,
    tags: ["temple", "traditional", "festive", "wedding"],
    reviews: [
      { author: "Lakshmi A.", rating: 5, title: "Heirloom quality", body: "This feels like a piece passed down through generations. Stunning craftsmanship." },
    ],
  },
  // ─── EARRINGS ───────────────────────────────────────
  {
    slug: "pearl-jhumka-earrings",
    name: "Pearl Drop Jhumkas",
    description:
      "Traditional jhumka silhouette in champagne gold with delicate pearl drops. Lightweight enough for all-day wear, elegant enough for evenings. A Provelaa classic.",
    price: 5499,
    compareAt: 7499,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Freshwater Pearls",
    weight: "8.4g (pair)",
    categorySlug: "earrings",
    collectionSlug: "festive-edit",
    images: ["/images/products/ear-jhumka-1.jpg", "/images/products/ear-jhumka-2.jpg"],
    rating: 4.9,
    reviewCount: 421,
    stock: 25,
    isBestseller: true,
    tags: ["jhumka", "pearl", "festive", "traditional"],
    reviews: [
      { author: "Deepa N.", rating: 5, title: "My go-to earrings", body: "I wear these with everything — kurtis, sarees, even jeans. So versatile." },
      { author: "Pooja H.", rating: 5, title: "Lightweight and beautiful", body: "Was worried they'd be heavy but they're so comfortable. The pearl drops are gorgeous." },
    ],
  },
  {
    slug: "chandbali-ruby-earrings",
    name: "Ruby Chandbali Earrings",
    description:
      "Crescent-moon chandbalis in champagne gold with ruby-red gemstones and pearl drops. A statement earring for weddings, receptions and festive celebrations.",
    price: 9499,
    compareAt: 12999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Ruby CZ + Freshwater Pearls",
    weight: "14g (pair)",
    categorySlug: "earrings",
    collectionSlug: "festive-edit",
    images: ["/images/products/ear-jhumka-2.jpg", "/images/products/ear-jhumka-1.jpg"],
    rating: 4.8,
    reviewCount: 134,
    stock: 10,
    isNewArrival: true,
    tags: ["chandbali", "ruby", "statement", "wedding"],
    reviews: [
      { author: "Shruti W.", rating: 5, title: "Wedding-ready", body: "Wore these for my reception — felt like royalty. Heavier than everyday but worth it." },
    ],
  },
  {
    slug: "diamond-stud-earrings",
    name: "Tiny Diamond Stud Earrings",
    description:
      "The perfect everyday stud — a single brilliant-cut CZ diamond in a four-prong champagne gold setting. Small enough to sleep in, sparkly enough to be noticed.",
    price: 2999,
    compareAt: 3999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Brilliant Cut CZ (0.25ct)",
    weight: "1.2g (pair)",
    categorySlug: "earrings",
    collectionSlug: "minimalist",
    images: ["/images/products/ear-stud-1.jpg", "/images/products/ear-hoop-1.jpg"],
    rating: 4.9,
    reviewCount: 567,
    stock: 40,
    isBestseller: true,
    tags: ["stud", "everyday", "minimalist", "diamond"],
    reviews: [
      { author: "Aarthi K.", rating: 5, title: "Never take them off", body: "These are my daily studs. Small, sparkly, perfect." },
      { author: "Mira S.", rating: 5, title: "Great first piercing earrings", body: "Bought these for my daughter's first real earrings. She loves them." },
    ],
  },
  {
    slug: "pearl-hoop-earrings",
    name: "Pearl Accent Gold Hoops",
    description:
      "Delicate champagne gold hoop earrings with tiny removable pearl charms. Wear them plain for everyday or add the pearls for a touch of elegance.",
    price: 3799,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Freshwater Pearls (removable)",
    weight: "3.6g (pair)",
    categorySlug: "earrings",
    collectionSlug: "champagne-gold",
    images: ["/images/products/ear-hoop-1.jpg", "/images/products/ear-stud-1.jpg"],
    rating: 4.7,
    reviewCount: 198,
    stock: 28,
    tags: ["hoop", "pearl", "everyday", "convertible"],
    reviews: [
      { author: "Kavya R.", rating: 4, title: "Two looks in one", body: "Love that I can remove the pearls. The hoops alone are perfect for daily wear." },
    ],
  },
  // ─── MANGALSUTRA ────────────────────────────────────
  {
    slug: "classic-mangalsutra",
    name: "Classic Black Bead Mangalsutra",
    description:
      "The traditional mangalsutra, reimagined. Black onyx beads with a delicate champagne gold and diamond pendant. Adjustable length. Made to be worn every day, not just for ceremonies.",
    price: 9999,
    compareAt: 13999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Black Onyx Beads + CZ Diamond",
    weight: "11g",
    categorySlug: "mangalsutra",
    collectionSlug: "festive-edit",
    images: ["/images/products/mang-classic-1.jpg", "/images/products/mang-contemporary-1.jpg"],
    rating: 4.9,
    reviewCount: 287,
    stock: 16,
    isBestseller: true,
    tags: ["mangalsutra", "traditional", "wedding", "everyday"],
    reviews: [
      { author: "Snehal D.", rating: 5, title: "Perfect for daily wear", body: "I wanted a mangalsutra I could wear to work without it being too heavy. This is perfect." },
      { author: "Rupali M.", rating: 5, title: "Beautiful craftsmanship", body: "The pendant is so well made. Worth every rupee." },
    ],
  },
  {
    slug: "contemporary-mangalsutra",
    name: "Contemporary Mangalsutra",
    description:
      "A modern take on the mangalsutra — a thin black bead chain with a minimalist geometric gold pendant and single diamond. For the woman who wants tradition with a contemporary edge.",
    price: 7499,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Black Onyx Beads + CZ Diamond",
    weight: "6.8g",
    categorySlug: "mangalsutra",
    collectionSlug: "minimalist",
    images: ["/images/products/mang-contemporary-1.jpg", "/images/products/mang-classic-1.jpg"],
    rating: 4.7,
    reviewCount: 89,
    stock: 20,
    isNewArrival: true,
    tags: ["mangalsutra", "contemporary", "modern", "everyday"],
    reviews: [
      { author: "Trisha N.", rating: 4, title: "Modern and pretty", body: "Love the minimalist pendant. Chain is a bit delicate but overall gorgeous." },
    ],
  },
  // ─── BRACELETS ──────────────────────────────────────
  {
    slug: "diamond-tennis-bracelet",
    name: "Diamond Tennis Bracelet",
    description:
      "A continuous line of tiny brilliant-cut CZ diamonds in champagne gold. The ultimate everyday luxury — delicate enough to stack, sparkly enough to stand alone. 6.5 inches with extender.",
    price: 10999,
    compareAt: 14999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Brilliant Cut CZ (1.5ct total)",
    weight: "4.2g",
    categorySlug: "bracelets",
    collectionSlug: "champagne-gold",
    images: ["/images/products/brac-tennis-1.jpg", "/images/products/brac-charm-1.jpg"],
    rating: 4.9,
    reviewCount: 178,
    stock: 15,
    isBestseller: true,
    tags: ["tennis", "diamond", "everyday", "luxury"],
    reviews: [
      { author: "Pallavi J.", rating: 5, title: "Sparkles like real diamonds", body: "I get compliments every time I wear this. Looks way more expensive than it is." },
      { author: "Nisha A.", rating: 5, title: "Perfect everyday bracelet", body: "Dainty, secure clasp, goes with everything. Love it." },
    ],
  },
  {
    slug: "charm-bracelet-gold",
    name: "Gold Charm Bracelet",
    description:
      "A delicate champagne gold chain bracelet with tiny pearl and star charms. Adjustable length. The bracelet equivalent of your favourite necklace — light, feminine, made to layer.",
    price: 4299,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    gemstone: "Freshwater Pearl Charms",
    weight: "3.4g",
    categorySlug: "bracelets",
    collectionSlug: "minimalist",
    images: ["/images/products/brac-charm-1.jpg", "/images/products/brac-tennis-1.jpg"],
    rating: 4.6,
    reviewCount: 112,
    stock: 22,
    isNewArrival: true,
    tags: ["charm", "everyday", "layering"],
    reviews: [
      { author: "Aisha B.", rating: 4, title: "Cute and delicate", body: "Very pretty. The charms are tiny which I like — subtle." },
    ],
  },
  {
    slug: "engraved-kada-pair",
    name: "Engraved Gold Kada (Pair)",
    description:
      "A pair of traditional champagne gold kada bangles with intricate engraved detailing. Wear them as a statement pair or mix with thinner bangles. Heritage design, modern finish.",
    price: 13499,
    compareAt: 17999,
    metal: "Champagne Gold",
    material: "925 Sterling Silver + 18k Gold Plating",
    weight: "26g (pair)",
    categorySlug: "bracelets",
    collectionSlug: "festive-edit",
    images: ["/images/products/brac-kada-1.jpg", "/images/products/brac-tennis-1.jpg"],
    rating: 4.8,
    reviewCount: 67,
    stock: 9,
    tags: ["kada", "bangle", "traditional", "festive"],
    reviews: [
      { author: "Bhavya S.", rating: 5, title: "Stunning traditional piece", body: "These are beautiful. The engraving is so detailed. Got them for my wedding." },
    ],
  },
]

async function main() {
  console.log("Seeding Provelaa database…")

  // Clean slate
  await db.contactMessage.deleteMany()
  await db.newsletter.deleteMany()
  await db.trackingEvent.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.review.deleteMany()
  await db.product.deleteMany()
  await db.collection.deleteMany()
  await db.category.deleteMany()
  console.log("  ✓ Cleared existing data")

  // Categories
  for (const c of categories) {
    await db.category.create({ data: c })
  }
  console.log(`  ✓ Created ${categories.length} categories`)

  // Collections
  for (const c of collections) {
    await db.collection.create({ data: c })
  }
  console.log(`  ✓ Created ${collections.length} collections`)

  // Products + reviews
  let productCount = 0
  let reviewCount = 0
  for (const p of products) {
    const { categorySlug, collectionSlug, reviews, images, tags, ...rest } = p
    const category = await db.category.findUnique({ where: { slug: categorySlug } })
    if (!category) throw new Error(`Category not found: ${categorySlug}`)
    const collection = collectionSlug
      ? await db.collection.findUnique({ where: { slug: collectionSlug } })
      : null

    const created = await db.product.create({
      data: {
        ...rest,
        images: JSON.stringify(images),
        tags: JSON.stringify(tags),
        categoryId: category.id,
        collectionId: collection?.id || null,
      },
    })

    if (reviews && reviews.length > 0) {
      for (const r of reviews) {
        await db.review.create({
          data: { ...r, productId: created.id, verified: true },
        })
        reviewCount++
      }
    }
    productCount++
  }
  console.log(`  ✓ Created ${productCount} products with ${reviewCount} reviews`)

  console.log("\n✅ Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
