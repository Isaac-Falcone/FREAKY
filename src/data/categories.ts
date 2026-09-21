// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: string;
  img: string;   // imagem estática (padrão)
  imgHover: string; // imagem ao hover
}

export interface Category {
  slug: string;
  label: string;
  description: string;
  folderPath: string; // caminho dentro de /public
  products: Product[];
}

// ─── Helper: monta URL pública ─────────────────────────────────────────────────
const p = (folder: string, file: string) =>
  `/${folder}/${file}`;

// ─── Dados ─────────────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    slug: "hoodies",
    label: "Y2K Hoodies & Moletom",
    description: "Hoodies oversized com gráficos ousados, lavagem ácida e peso premium. Para quem lidera o caos.",
    folderPath: "Y2K Hoodies & moletom",
    products: [
      {
        id: "hoodie-1",
        name: "Boxy Acid Wash Hoodie",
        price: "R$ 289",
        img: p("Y2K Hoodies & moletom", "Boxy-Oversized-Acid-Wash-Hoodie-Starphase-streetwe-0_360x.jpg"),
        imgHover: p("Y2K Hoodies & moletom", "Boxy-Oversized-Acid-Wash-Hoodie-Starphase-streetwe-7567_360x.jpg"),
      },
      {
        id: "hoodie-2",
        name: "Cyberpunk Planet Hoodie",
        price: "R$ 319",
        img: p("Y2K Hoodies & moletom", "Cyberpunk-Planet-Oversized-Fleece-Hoodie-Starphase-16_360x.jpg"),
        imgHover: p("Y2K Hoodies & moletom", "Cyberpunk-Planet-Oversized-Fleece-Hoodie-Starphase-8_360x.jpg"),
      },
      {
        id: "hoodie-3",
        name: "Ghetto Star Oversized Hoodie",
        price: "R$ 269",
        img: p("Y2K Hoodies & moletom", "Ghetto-Star-Oversized-Fleece-Hoodie-Starphase-stre-0_360x.jpg"),
        imgHover: p("Y2K Hoodies & moletom", "Ghetto-Star-Oversized-Fleece-Hoodie-Starphase-stre-5_360x.jpg"),
      },
      {
        id: "hoodie-4",
        name: "LA California Fleece Hoodie",
        price: "R$ 299",
        img: p("Y2K Hoodies & moletom", "LA-California-Oversized-Fleece-Hoodie-Starphase-st-3025_360x.jpg"),
        imgHover: p("Y2K Hoodies & moletom", "LA-California-Oversized-Fleece-Hoodie-Starphase-st-3_360x.jpg"),
      },
      {
        id: "hoodie-5",
        name: "Mad Dog Doberman Washed Hoodie",
        price: "R$ 349",
        img: p("Y2K Hoodies & moletom", "Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starpha-35_360x.png"),
        imgHover: p("Y2K Hoodies & moletom", "Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starphase-6933_360x.jpg"),
      },
      {
        id: "hoodie-6",
        name: "NY State of Mind Hoodie",
        price: "R$ 279",
        img: p("Y2K Hoodies & moletom", "NY-State-of-Mind-Oversized-Washed-Hoodie-Starphase-0_360x.jpg"),
        imgHover: p("Y2K Hoodies & moletom", "NY-State-of-Mind-Oversized-Washed-Hoodie-Starphase-1_360x.jpg"),
      },
    ],
  },
  {
    slug: "jaquetas",
    label: "Jaquetas & Casacos",
    description: "Bomber jackets, puffers e jaquetas de couro com atitude. Camadas que fazem barulho.",
    folderPath: "jaquetas e casacos",
    products: [
      {
        id: "jaqueta-1",
        name: "Camouflage Hooded Puffer Jacket",
        price: "R$ 429",
        img: p("jaquetas e casacos", "Camouflage-Pattern-Oversize-Hooded-Puffer-Jacket-S-8925_360x.jpg"),
        imgHover: p("jaquetas e casacos", "Camouflage-Pattern-Oversize-Hooded-Puffer-Jacket-S-8925_360x.jpg"),
      },
      {
        id: "jaqueta-2",
        name: "Gloss Puffer Jacket",
        price: "R$ 469",
        img: p("jaquetas e casacos", "Men-s-Gloss-Puffer-Jacket-High-Street-Winter-Essen-0_360x.png"),
        imgHover: p("jaquetas e casacos", "Men-s-Gloss-Puffer-Jacket-High-Street-Winter-Essen-2823_360x.png"),
      },
      {
        id: "jaqueta-3",
        name: "Midnight Letter Bomber Jacket",
        price: "R$ 399",
        img: p("jaquetas e casacos", "Midnight-Letter-Embroidered-Bomber-Jacket-Brewing-0_360x.jpg"),
        imgHover: p("jaquetas e casacos", "Midnight-Letter-Embroidered-Bomber-Jacket-Brewing-0998_360x.jpg"),
      },
      {
        id: "jaqueta-4",
        name: "Oversized Faux Fur Hooded Jacket",
        price: "R$ 499",
        img: p("jaquetas e casacos", "Oversized-Faux-Fur-Hooded-Jacket-Winter-Weight-Sta-0_360x.png"),
        imgHover: p("jaquetas e casacos", "Oversized-Faux-Fur-Hooded-Jacket-Winter-Weight-Sta-9206_360x.png"),
      },
      {
        id: "jaqueta-5",
        name: "Hooded Pilot Leather Bomber",
        price: "R$ 449",
        img: p("jaquetas e casacos", "Oversized-Hooded-Pilot-Leather-Bomber-Jacket-Starp-4_360x.jpg"),
        imgHover: p("jaquetas e casacos", "Oversized-Hooded-Pilot-Leather-Bomber-Jacket-Starp-6_360x.jpg"),
      },
      {
        id: "jaqueta-6",
        name: "Shadow Hood PU Leather Jacket",
        price: "R$ 419",
        img: p("jaquetas e casacos", "Shadow-Hood-PU-Leather-Jacket-Starphase-streetwear-0_360x.webp"),
        imgHover: p("jaquetas e casacos", "Shadow-Hood-PU-Leather-Jacket-Starphase-streetwear-2272_360x.webp"),
      },
    ],
  },
  {
    slug: "calcas",
    label: "Y2K Calças Baggy",
    description: "Calças cargo, wide leg e baggy jeans para quem ocupa espaço com intenção.",
    folderPath: "Y2K calças baggy",
    products: [
      {
        id: "calca-1",
        name: "Baggy Camouflage Cargo Pants",
        price: "R$ 259",
        img: p("Y2K calças baggy", "Baggy-Camouflage-Wide-Leg-Cargo-Pants-Starphase-st-3_360x.jpg"),
        imgHover: p("Y2K calças baggy", "Baggy-Camouflage-Wide-Leg-Cargo-Pants-Starphase-st-5_360x.jpg"),
      },
      {
        id: "calca-2",
        name: "Black Shiny PU Wide Leg Pants",
        price: "R$ 299",
        img: p("Y2K calças baggy", "Black-Shiny-PU-Wide-Leg-Pants-Starphase-streetwear-0_360x.png"),
        imgHover: p("Y2K calças baggy", "Black-Shiny-PU-Wide-Leg-Pants-Starphase-streetwear-7584_360x.png"),
      },
      {
        id: "calca-3",
        name: "Distressed Dark Blue Baggy Jeans",
        price: "R$ 279",
        img: p("Y2K calças baggy", "Distressed-Dark-Blue-90-s-Baggy-Jeans-Starphase-st-1191_360x.jpg"),
        imgHover: p("Y2K calças baggy", "Distressed-Dark-Blue-90-s-Baggy-Jeans-Starphase-st-7240_360x.jpg"),
      },
      {
        id: "calca-4",
        name: "Distressed Wide Leg Baggy Jeans",
        price: "R$ 269",
        img: p("Y2K calças baggy", "Distressed-Wide-Leg-90-s-Baggy-Blue-Jeans-Starphas-5_360x.jpg"),
        imgHover: p("Y2K calças baggy", "Distressed-Wide-Leg-90-s-Baggy-Blue-Jeans-Starphas-6_360x.jpg"),
      },
      {
        id: "calca-5",
        name: "Light Camo Wide Leg Cargo Pants",
        price: "R$ 239",
        img: p("Y2K calças baggy", "Light-Camouflage-Wide-Leg-Baggy-Cargo-Pants-Starph-0_360x.jpg"),
        imgHover: p("Y2K calças baggy", "Light-Camouflage-Wide-Leg-Baggy-Cargo-Pants-Starph-3791_360x.jpg"),
      },
      {
        id: "calca-6",
        name: "Graphic Stitch Baggy Jeans",
        price: "R$ 289",
        img: p("Y2K calças baggy", "Oversized-Graphic-Stitch-Baggy-Jeans-Starphase-str-0_360x.jpg"),
        imgHover: p("Y2K calças baggy", "Oversized-Graphic-Stitch-Baggy-Jeans-Starphase-str-0_360x.png"),
      },
    ],
  },
  {
    slug: "shorts",
    label: "Y2K Shorts",
    description: "Shorts baggy, cargo e denim lavados para qualquer estação. Estilo que não pede desculpa.",
    folderPath: "Y2K shorts",
    products: [
      {
        id: "short-1",
        name: "Classic Distressed Denim Shorts",
        price: "R$ 189",
        img: p("Y2K shorts", "Classic-Distressed-Blue-Denim-Baggy-Shorts-Starpha-1_360x.jpg"),
        imgHover: p("Y2K shorts", "Classic-Distressed-Blue-Denim-Baggy-Shorts-Starpha-10_360x.jpg"),
      },
      {
        id: "short-2",
        name: "Loose Camouflage Cargo Shorts",
        price: "R$ 219",
        img: p("Y2K shorts", "Distressed-Loose-Camouflage-Cargo-Shorts-Starphase-0_360x.jpg"),
        imgHover: p("Y2K shorts", "Distressed-Loose-Camouflage-Cargo-Shorts-Starphase-5890_360x.jpg"),
      },
      {
        id: "short-3",
        name: "Washed Graffiti Denim Shorts",
        price: "R$ 229",
        img: p("Y2K shorts", "Retro-Washed-Graffiti-Denim-Long-Shorts-Men-Starph-0_360x.png"),
        imgHover: p("Y2K shorts", "Retro-Washed-Graffiti-Denim-Long-Shorts-Men-Starph-9830_360x.png"),
      },
      {
        id: "short-4",
        name: "Retro Y2K Baggy Denim Shorts",
        price: "R$ 199",
        img: p("Y2K shorts", "Retro-Y2K-Baggy-Denim-Shorts-Starphase-streetwear-0_360x.jpg"),
        imgHover: p("Y2K shorts", "Retro-Y2K-Baggy-Denim-Shorts-Starphase-streetwear-8_360x.jpg"),
      },
      {
        id: "short-5",
        name: "Vintage Wide Leg Denim Shorts",
        price: "R$ 209",
        img: p("Y2K shorts", "Vintage-Washed-Oversized-Wide-Leg-Denim-Shorts-Sta-0_360x.png"),
        imgHover: p("Y2K shorts", "Vintage-Washed-Oversized-Wide-Leg-Denim-Shorts-Sta-6574_360x.png"),
      },
      {
        id: "short-6",
        name: "Women's Camo Cargo Shorts",
        price: "R$ 199",
        img: p("Y2K shorts", "Women-s-Camouflage-Y2K-Baggy-Cargo-Shorts-Starphas-0_360x.jpg"),
        imgHover: p("Y2K shorts", "Women-s-Camouflage-Y2K-Baggy-Cargo-Shorts-Starphas-8_360x.jpg"),
      },
    ],
  },
  {
    slug: "headwear",
    label: "Headwear",
    description: "Snapbacks, beanies e caps que completam o look. Cada detalhe conta.",
    folderPath: "headwear",
    products: [
      {
        id: "head-1",
        name: "Distorted Flat Bill Snapback",
        price: "R$ 129",
        img: p("headwear", "Distorted-Flat-Bill-Snapback-Hat-Starphase-streetw-1_360x.jpg"),
        imgHover: p("headwear", "Distorted-Flat-Bill-Snapback-Hat-Starphase-streetw-9_360x.jpg"),
      },
      {
        id: "head-2",
        name: "Red Star Pentagram Trapper Hat",
        price: "R$ 149",
        img: p("headwear", "Red-Star-Black-Plush-Pentagram-Trapper-Hat-Starpha-1_360x.jpg"),
        imgHover: p("headwear", "Red-Star-Black-Plush-Pentagram-Trapper-Hat-Starpha-4_360x.jpg"),
      },
      {
        id: "head-3",
        name: "SP Embroidered Beanie",
        price: "R$ 99",
        img: p("headwear", "SP-Embroidered-Beanie-Starphase-streetwear-6_360x.jpg"),
        imgHover: p("headwear", "SP-Embroidered-Beanie-Starphase-streetwear-9_360x.jpg"),
      },
      {
        id: "head-4",
        name: "SP Star Flat Bill Cap",
        price: "R$ 119",
        img: p("headwear", "SP-Star-Flat-Bill-Cap-Starphase-streetwear-7_360x.jpg"),
        imgHover: p("headwear", "SP-Star-Flat-Bill-Cap-Starphase-streetwear-9_360x.jpg"),
      },
      {
        id: "head-5",
        name: "Sci-Fi Logo Baseball Cap",
        price: "R$ 109",
        img: p("headwear", "Sci-Fi-Logo-Flat-Bill-Baseball-Cap-Starphase-stree-0_360x.jpg"),
        imgHover: p("headwear", "Sci-Fi-Logo-Flat-Bill-Baseball-Cap-Starphase-stree-7_360x.jpg"),
      },
      {
        id: "head-6",
        name: "Letter Flat Bill Snapback",
        price: "R$ 129",
        img: p("headwear", "Starphase-Letter-Flat-Bill-Snapback-Hat-Starphase-3_360x.jpg"),
        imgHover: p("headwear", "Starphase-Letter-Flat-Bill-Snapback-Hat-Starphase-9_360x.jpg"),
      },
    ],
  },
  {
    slug: "destaque",
    label: "Estilo em Destaque",
    description: "Os melhores de cada categoria. Peças selecionadas que definem o que é FREAKY®.",
    folderPath: "estilo em destaque",
    products: [
      {
        id: "dest-1",
        name: "Mad Dog Doberman Washed Hoodie",
        price: "R$ 349",
        img: p("estilo em destaque", "Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starpha-35_360x.png"),
        imgHover: p("estilo em destaque", "Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starphase-6933_360x.jpg"),
      },
      {
        id: "dest-2",
        name: "Oversized Suede Leather Bomber",
        price: "R$ 449",
        img: p("estilo em destaque", "Oversized-Hooded-Suede-Leather-Bomber-Jacket-Starp-0_360x.jpg"),
        imgHover: p("estilo em destaque", "Oversized-Hooded-Suede-Leather-Bomber-Jacket-Starp-5_360x.jpg"),
      },
      {
        id: "dest-3",
        name: "Washed Denim Hoodie",
        price: "R$ 299",
        img: p("estilo em destaque", "Oversized-Washed-Denim-Hoodie-Starphase-streetwear-3_360x.jpg"),
        imgHover: p("estilo em destaque", "Oversized-Washed-Denim-Hoodie-Starphase-streetwear-8_360x.jpg"),
      },
      {
        id: "dest-4",
        name: "Chrome Logo Fleece Hoodie",
        price: "R$ 319",
        img: p("estilo em destaque", "Starphase-Chrome-Logo-Oversized-Fleece-Hoodie-Star-2_360x.jpg"),
        imgHover: p("estilo em destaque", "Starphase-Chrome-Logo-Oversized-Fleece-Hoodie-Star-7_360x.jpg"),
      },
      {
        id: "dest-5",
        name: "Cosmic Abyss T-Shirt",
        price: "R$ 199",
        img: p("estilo em destaque", "Starphase-Cosmic-Abyss-T-Shirt-Starphase-streetwea-6_360x.jpg"),
        imgHover: p("estilo em destaque", "Starphase-Cosmic-Abyss-T-Shirt-Starphase-streetwea-7_360x.jpg"),
      },
      {
        id: "dest-6",
        name: "Stellar Washed Graphic T-Shirt",
        price: "R$ 179",
        img: p("estilo em destaque", "Stellar-Oversized-Washed-Graphic-T-Shirt-Starphase-0_360x.jpg"),
        imgHover: p("estilo em destaque", "Stellar-Oversized-Washed-Graphic-T-Shirt-Starphase-7_360x.jpg"),
      },
    ],
  },
  {
    slug: "acessorios",
    label: "Acessórios Y2K",
    description: "Correntes, pulseiras e joias que finalizam qualquer look. Detalhes que gritam.",
    folderPath: "acessórios Y2K",
    products: [
      {
        id: "acess-1",
        name: "Big Curb Chunky Chain Bracelet",
        price: "R$ 149",
        img: p("acessórios Y2K", "Big-Curb-Chunky-Chain-Hip-Hop-Bracelet-Starphase-s-3_360x.jpg"),
        imgHover: p("acessórios Y2K", "Big-Curb-Chunky-Chain-Hip-Hop-Bracelet-Starphase-s-8_360x.jpg"),
      },
      {
        id: "acess-2",
        name: "Iced Out Miami Cuban Link",
        price: "R$ 179",
        img: p("acessórios Y2K", "Iced-Out-Miami-Cuban-Link-Bracelets-Starphase-stre-6_360x.jpg"),
        imgHover: p("acessórios Y2K", "Iced-Out-Miami-Cuban-Link-Bracelets-Starphase-stre-7_360x.jpg"),
      },
      {
        id: "acess-3",
        name: "Luxurious Stainless Steel Bracelet",
        price: "R$ 129",
        img: p("acessórios Y2K", "Luxurious-Stainless-Steel-Bracelet-Starphase-stree-2_360x.jpg"),
        imgHover: p("acessórios Y2K", "Luxurious-Stainless-Steel-Bracelet-Starphase-stree-9_360x.jpg"),
      },
      {
        id: "acess-4",
        name: "Macramê Beads Crown Bracelet",
        price: "R$ 89",
        img: p("acessórios Y2K", "Macrame-Beads-Crown-Bracelets-Starphase-streetwear-4_360x.jpg"),
        imgHover: p("acessórios Y2K", "Macrame-Beads-Crown-Bracelets-Starphase-streetwear-8_360x.jpg"),
      },
    ],
  },
  {
    slug: "camisetas",
    label: "Camiseta Oversized",
    description: "Gráficos que provocam. Lavagem que envelhece bem. Tecido que respira.",
    folderPath: "camiseta oversized",
    products: [
      {
        id: "tee-1",
        name: "Archangel Washed Graphic Tee",
        price: "R$ 189",
        img: p("camiseta oversized", "Archangel-Oversized-Washed-Graphic-T-Shirt-Starpha-3_360x.jpg"),
        imgHover: p("camiseta oversized", "Archangel-Oversized-Washed-Graphic-T-Shirt-Starpha-4_360x.jpg"),
      },
      {
        id: "tee-2",
        name: "Ascension Relaxed Fit Tee",
        price: "R$ 169",
        img: p("camiseta oversized", "Ascension-Relaxed-Fit-Graphic-T-Shirt-Starphase-st-15_360x.jpg"),
        imgHover: p("camiseta oversized", "Ascension-Relaxed-Fit-Graphic-T-Shirt-Starphase-st-20_360x.jpg"),
      },
      {
        id: "tee-3",
        name: "Bored Teddy Bear Graphic Tee",
        price: "R$ 159",
        img: p("camiseta oversized", "Bored-Teddy-Bear-Relaxed-Fit-Graphic-T-Shirt-Starp-14_360x.jpg"),
        imgHover: p("camiseta oversized", "Bored-Teddy-Bear-Relaxed-Fit-Graphic-T-Shirt-Starp-7_360x.jpg"),
      },
      {
        id: "tee-4",
        name: "Cat Women Anime Washed Tee",
        price: "R$ 179",
        img: p("camiseta oversized", "Cat-Women-Anime-Oversized-Washed-T-Shirt-Starphase-2_360x.jpg"),
        imgHover: p("camiseta oversized", "Cat-Women-Anime-Oversized-Washed-T-Shirt-Starphase-7_360x.jpg"),
      },
      {
        id: "tee-5",
        name: "Cosmic Abyss Washed Graphic Tee",
        price: "R$ 199",
        img: p("camiseta oversized", "Cosmic-Abyss-Oversized-Washed-Graphic-T-Shirt-Star-2_360x.jpg"),
        imgHover: p("camiseta oversized", "Cosmic-Abyss-Oversized-Washed-Graphic-T-Shirt-Star-9_360x.jpg"),
      },
      {
        id: "tee-6",
        name: "Heartbreaker Graffiti T-Shirt",
        price: "R$ 189",
        img: p("camiseta oversized", "Heartbreaker-Oversized-Washed-Graffiti-T-Shirt-Sta-1_360x.jpg"),
        imgHover: p("camiseta oversized", "Heartbreaker-Oversized-Washed-Graffiti-T-Shirt-Sta-9_360x.jpg"),
      },
    ],
  },
];

// Lookup por slug
export const getCategoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);
