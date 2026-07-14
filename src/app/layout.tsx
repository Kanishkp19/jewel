import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Provelaa — Handcrafted Luxury Jewellery",
  description:
    "Provelaa crafts timeless jewellery in champagne gold, sterling silver and ethically sourced gemstones. Shop rings, necklaces, earrings & mangalsutra.",
  keywords: [
    "Provelaa",
    "luxury jewellery",
    "gold jewellery",
    "rings",
    "necklaces",
    "earrings",
    "mangalsutra",
    "handcrafted jewellery",
  ],
  authors: [{ name: "Provelaa" }],
  openGraph: {
    title: "Provelaa — Handcrafted Luxury Jewellery",
    description:
      "Timeless jewellery in champagne gold, sterling silver & ethically sourced gemstones.",
    siteName: "Provelaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Provelaa — Handcrafted Luxury Jewellery",
    description:
      "Timeless jewellery in champagne gold, sterling silver & ethically sourced gemstones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
