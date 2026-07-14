// Round-based image generation — run specific subset, foreground
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const OUT = path.resolve(process.cwd(), 'public/images')
const round = process.argv[2] || '1'

const rounds: Record<string, { file: string; prompt: string; size: string }[]> = {
  '1': [
    { file: 'hero/hero-3.jpg', size: '1344x768', prompt: 'Macro shot of champagne gold engagement ring with diamond on cream silk, warm light, sparkling reflections, luxury jewellery product photography, photorealistic, shallow depth of field' },
    { file: 'lifestyle/atelier.jpg', size: '1344x768', prompt: 'Jewellery craftsman hands setting gemstone into gold ring at wooden workbench, warm light, tools and gemstones, artisanal atelier, photorealistic, shallow depth of field' },
    { file: 'lifestyle/model-1.jpg', size: '864x1152', prompt: 'Indian woman wearing gold jhumka earrings and gold layered necklace, warm cream background, soft champagne light, luxury editorial fashion, photorealistic' },
    { file: 'lifestyle/model-2.jpg', size: '864x1152', prompt: 'Close-up of woman wrist wearing delicate gold tennis bracelet with tiny diamonds, cream silk background, soft natural light, luxury jewellery editorial, photorealistic' },
    { file: 'categories/rings.jpg', size: '1024x1024', prompt: 'Collection of delicate gold rings with diamonds and gemstones on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic' },
    { file: 'categories/necklaces.jpg', size: '1024x1024', prompt: 'Delicate gold chain necklaces with pendants on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic' },
    { file: 'categories/earrings.jpg', size: '1024x1024', prompt: 'Gold jhumka earrings and gold studs on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic' },
    { file: 'categories/mangalsutra.jpg', size: '1024x1024', prompt: 'Traditional Indian mangalsutra with black beads and gold pendant on cream silk, top-down flatlay, soft champagne light, luxury product photography, photorealistic' },
    { file: 'categories/bracelets.jpg', size: '1024x1024', prompt: 'Delicate gold chain bracelets and charm bracelet on cream silk, top-down flatlay, soft champagne light, luxury jewellery product photography, photorealistic' },
    { file: 'collections/champagne-gold.jpg', size: '1024x1024', prompt: 'Champagne gold jewellery set necklace earrings ring with pearls on cream silk, warm golden light, luxury editorial flatlay, photorealistic' },
    { file: 'collections/festive-edit.jpg', size: '1024x1024', prompt: 'Festive Indian gold kundan necklace with jhumka earrings and maang tikka on cream and maroon silk, warm light, luxury product photography, photorealistic' },
    { file: 'collections/minimalist.jpg', size: '1024x1024', prompt: 'Minimalist dainty gold jewellery, thin chain necklace, small hoop earrings, band ring on white marble, soft daylight, modern luxury, photorealistic' },
  ],
  '2': [
    { file: 'products/ring-solitaire-2.jpg', size: '1024x1024', prompt: 'Side angle champagne gold diamond solitaire ring on cream background, prong setting detail, studio product photography, photorealistic' },
    { file: 'products/ring-stack-1.jpg', size: '1024x1024', prompt: 'Three stackable thin gold rings with diamonds and pearl in a row on cream background, studio product photography, photorealistic' },
    { file: 'products/ring-stack-2.jpg', size: '1024x1024', prompt: 'Stackable gold rings worn on finger, close-up macro, cream background, champagne light, luxury product photography, photorealistic' },
    { file: 'products/ring-cocktail-1.jpg', size: '1024x1024', prompt: 'Gold cocktail ring with oval emerald-green gemstone and diamond halo on cream background, studio product photography, photorealistic' },
    { file: 'products/ring-cocktail-2.jpg', size: '1024x1024', prompt: 'Gold cocktail ring with ruby-red gemstone and diamond halo on cream background, studio product photography, photorealistic' },
    { file: 'products/neck-pendant-1.jpg', size: '1024x1024', prompt: 'Delicate gold chain necklace with pearl pendant on cream background, studio product photography, photorealistic' },
    { file: 'products/neck-pendant-2.jpg', size: '1024x1024', prompt: 'Delicate gold chain necklace with diamond pendant on cream silk, studio product photography, photorealistic' },
    { file: 'products/neck-layered-1.jpg', size: '1024x1024', prompt: 'Three layered gold chain necklaces different lengths with pendants on cream background, studio product photography, photorealistic' },
  ],
  '3': [
    { file: 'products/neck-choker-1.jpg', size: '1024x1024', prompt: 'Gold choker necklace with pearls and diamonds on cream silk, studio product photography, photorealistic' },
    { file: 'products/neck-temple-1.jpg', size: '1024x1024', prompt: 'Traditional South Indian temple necklace gold with carving and rubies on cream silk, studio product photography, photorealistic' },
    { file: 'products/ear-jhumka-1.jpg', size: '1024x1024', prompt: 'Traditional Indian gold jhumka earrings with pearl drops on cream background, studio product photography, photorealistic' },
    { file: 'products/ear-jhumka-2.jpg', size: '1024x1024', prompt: 'Gold chandbali earrings with pearls and ruby accents on cream background, studio product photography, photorealistic' },
    { file: 'products/ear-stud-1.jpg', size: '1024x1024', prompt: 'Pair of small gold stud earrings with diamonds on cream background, studio product photography, photorealistic' },
    { file: 'products/ear-hoop-1.jpg', size: '1024x1024', prompt: 'Pair of delicate gold hoop earrings with pearl accents on cream background, studio product photography, photorealistic' },
    { file: 'products/mang-classic-1.jpg', size: '1024x1024', prompt: 'Classic Indian mangalsutra black beads gold pendant with diamond on cream silk, studio product photography, photorealistic' },
    { file: 'products/mang-contemporary-1.jpg', size: '1024x1024', prompt: 'Contemporary mangalsutra thin black bead chain modern gold pendant with diamond on cream background, studio product photography, photorealistic' },
  ],
  '4': [
    { file: 'products/brac-tennis-1.jpg', size: '1024x1024', prompt: 'Delicate gold tennis bracelet with row of tiny diamonds on cream background, studio product photography, photorealistic' },
    { file: 'products/brac-charm-1.jpg', size: '1024x1024', prompt: 'Delicate gold chain charm bracelet with pearl and star charms on cream background, studio product photography, photorealistic' },
    { file: 'products/brac-kada-1.jpg', size: '1024x1024', prompt: 'Pair of gold kada bangles with engraved pattern on cream silk, studio product photography, photorealistic' },
  ],
}

async function main() {
  const jobs = rounds[round]
  if (!jobs) {
    console.error('Unknown round. Use 1, 2, 3, or 4')
    process.exit(1)
  }
  const zai = await ZAI.create()
  let ok = 0, skip = 0, fail = 0
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i]
    const outPath = path.join(OUT, job.file)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
      console.log(`[${i + 1}/${jobs.length}] [skip] ${job.file}`)
      skip++
      continue
    }
    let success = false
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size as '1024x1024',
        })
        const b64 = res.data[0].base64
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
        console.log(`[${i + 1}/${jobs.length}] [ok]   ${job.file}`)
        success = true
        break
      } catch (e) {
        console.log(`[${i + 1}/${jobs.length}] [retry ${attempt}] ${job.file}`)
        await new Promise((r) => setTimeout(r, 2000))
      }
    }
    if (success) ok++
    else fail++
  }
  console.log(`\nRound ${round} done. ok=${ok} skip=${skip} fail=${fail}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
