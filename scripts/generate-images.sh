#!/usr/bin/env bash
# Generate images sequentially with retry (most reliable)
set -u
cd /home/z/my-project
mkdir -p public/images/{hero,lifestyle,categories,collections,products}

gen_one() {
  local file="$1"; local size="$2"; local prompt="$3"
  local out="public/images/$file"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "[skip] $file"
    return 0
  fi
  for attempt in 1 2 3 4; do
    if timeout 180 z-ai image -p "$prompt" -o "$out" -s "$size" >/dev/null 2>&1; then
      if [ -s "$out" ]; then
        echo "[ok]   $file (attempt $attempt)"
        return 0
      fi
    fi
    echo "       retry $attempt for $file"
    sleep $((attempt * 4))
  done
  echo "[fail] $file"
  return 1
}

jobs=(
"hero/hero-1.jpg|1344x768|Luxury jewellery flatlay on cream silk, gold chain necklace with pearl pendant, diamond ring, gold earrings, champagne gold tones, warm light, editorial product photography, top-down, photorealistic"
"hero/hero-2.jpg|768x1344|Indian woman wearing delicate gold layered necklaces and small stud earrings, warm champagne lighting, cream background, luxury jewellery editorial fashion photography, shallow depth of field, photorealistic"
"hero/hero-3.jpg|1344x768|Macro shot of champagne gold engagement ring with diamond on cream silk, warm light, sparkling reflections, luxury jewellery product photography, photorealistic, shallow depth of field"
"lifestyle/atelier.jpg|1344x768|Jewellery craftsman hands setting gemstone into gold ring at wooden workbench, warm light, tools and gemstones, artisanal atelier, photorealistic, shallow depth of field"
"lifestyle/model-1.jpg|864x1152|Indian woman wearing gold jhumka earrings and gold layered necklace, warm cream background, soft champagne light, luxury editorial fashion, photorealistic"
"lifestyle/model-2.jpg|864x1152|Close-up of woman wrist wearing delicate gold tennis bracelet with tiny diamonds, cream silk background, soft natural light, luxury jewellery editorial, photorealistic"
"categories/rings.jpg|1024x1024|Collection of delicate gold rings with diamonds and gemstones on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic"
"categories/necklaces.jpg|1024x1024|Delicate gold chain necklaces with pendants on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic"
"categories/earrings.jpg|1024x1024|Gold jhumka earrings and gold studs on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic"
"categories/mangalsutra.jpg|1024x1024|Traditional Indian mangalsutra with black beads and gold pendant on cream silk, top-down flatlay, soft champagne light, luxury product photography, photorealistic"
"categories/bracelets.jpg|1024x1024|Delicate gold chain bracelets and charm bracelet on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic"
"collections/champagne-gold.jpg|1024x1024|Champagne gold jewellery set necklace earrings ring with pearls on cream silk, warm golden light, luxury editorial flatlay, photorealistic"
"collections/festive-edit.jpg|1024x1024|Festive Indian gold kundan necklace with jhumka earrings and maang tikka on cream and maroon silk, warm light, luxury product photography, photorealistic"
"collections/minimalist.jpg|1024x1024|Minimalist dainty gold jewellery, thin chain necklace, small hoop earrings, band ring on white marble, soft daylight, modern luxury, photorealistic"
"products/ring-solitaire-1.jpg|1024x1024|Champagne gold solitaire engagement ring with diamond, isolated on cream background, studio product photography, soft shadow, photorealistic"
"products/ring-solitaire-2.jpg|1024x1024|Side angle champagne gold diamond solitaire ring on cream background, prong setting detail, studio product photography, photorealistic"
"products/ring-stack-1.jpg|1024x1024|Three stackable thin gold rings with diamonds and pearl in a row on cream background, studio product photography, photorealistic"
"products/ring-stack-2.jpg|1024x1024|Stackable gold rings worn on finger, close-up macro, cream background, champagne light, luxury product photography, photorealistic"
"products/ring-cocktail-1.jpg|1024x1024|Gold cocktail ring with oval emerald-green gemstone and diamond halo on cream background, studio product photography, photorealistic"
"products/ring-cocktail-2.jpg|1024x1024|Gold cocktail ring with ruby-red gemstone and diamond halo on cream background, studio product photography, photorealistic"
"products/neck-pendant-1.jpg|1024x1024|Delicate gold chain necklace with pearl pendant on cream background, studio product photography, photorealistic"
"products/neck-pendant-2.jpg|1024x1024|Delicate gold chain necklace with diamond pendant on cream silk, studio product photography, photorealistic"
"products/neck-layered-1.jpg|1024x1024|Three layered gold chain necklaces different lengths with pendants on cream background, studio product photography, photorealistic"
"products/neck-choker-1.jpg|1024x1024|Gold choker necklace with pearls and diamonds on cream silk, studio product photography, photorealistic"
"products/neck-temple-1.jpg|1024x1024|Traditional South Indian temple necklace gold with carving and rubies on cream silk, studio product photography, photorealistic"
"products/ear-jhumka-1.jpg|1024x1024|Traditional Indian gold jhumka earrings with pearl drops on cream background, studio product photography, photorealistic"
"products/ear-jhumka-2.jpg|1024x1024|Gold chandbali earrings with pearls and ruby accents on cream background, studio product photography, photorealistic"
"products/ear-stud-1.jpg|1024x1024|Pair of small gold stud earrings with diamonds on cream background, studio product photography, photorealistic"
"products/ear-hoop-1.jpg|1024x1024|Pair of delicate gold hoop earrings with pearl accents on cream background, studio product photography, photorealistic"
"products/mang-classic-1.jpg|1024x1024|Classic Indian mangalsutra black beads gold pendant with diamond on cream silk, studio product photography, photorealistic"
"products/mang-contemporary-1.jpg|1024x1024|Contemporary mangalsutra thin black bead chain modern gold pendant with diamond on cream background, studio product photography, photorealistic"
"products/brac-tennis-1.jpg|1024x1024|Delicate gold tennis bracelet with row of tiny diamonds on cream background, studio product photography, photorealistic"
"products/brac-charm-1.jpg|1024x1024|Delicate gold chain charm bracelet with pearl and star charms on cream background, studio product photography, photorealistic"
"products/brac-kada-1.jpg|1024x1024|Pair of gold kada bangles with engraved pattern on cream silk, studio product photography, photorealistic"
)

total=${#jobs[@]}
echo "Generating $total images sequentially (with retry)…"
ok=0; fail=0
for line in "${jobs[@]}"; do
  file="${line%%|*}"; rest="${line#*|}"
  size="${rest%%|*}"; prompt="${rest#*|}"
  if gen_one "$file" "$size" "$prompt"; then
    ok=$((ok+1))
  else
    fail=$((fail+1))
  fi
done
echo "Done. ok=$ok fail=$fail"
