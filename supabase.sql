-- Supabase Schema and Initial Data Migration
-- Run this in the Supabase SQL Editor

-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text NOT NULL,
  folder_path text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_label text NOT NULL,
  price text NOT NULL,
  img text NOT NULL,
  img_hover text,
  img_archive text,
  img_archive_hover text,
  is_featured boolean DEFAULT false,
  size_class text,
  fit_class text,
  archive_fit_class text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read access
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);

-- Clear existing data (optional, but good for idempotent runs)
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- Insert Categories
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'hoodies',
    'Y2K Hoodies & Moletom',
    'Hoodies oversized com gráficos ousados, lavagem ácida e peso premium. Para quem lidera o caos.',
    'Y2K Hoodies & moletom'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'jaquetas',
    'Jaquetas & Casacos',
    'Bomber jackets, puffers e jaquetas de couro com atitude. Camadas que fazem barulho.',
    'jaquetas e casacos'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'calcas',
    'Y2K Calças Baggy',
    'Calças cargo, wide leg e baggy jeans para quem ocupa espaço com intenção.',
    'Y2K calças baggy'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'shorts',
    'Y2K Shorts',
    'Shorts baggy, cargo e denim lavados para qualquer estação. Estilo que não pede desculpa.',
    'Y2K shorts'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'headwear',
    'Headwear',
    'Snapbacks, beanies e caps que completam o look. Cada detalhe conta.',
    'headwear'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'destaque',
    'Estilo em Destaque',
    'Os melhores de cada categoria. Peças selecionadas que definem o que é FREAKY®.',
    'estilo em destaque'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'acessorios',
    'Acessórios Y2K',
    'Correntes, pulseiras e joias que finalizam qualquer look. Detalhes que gritam.',
    'acessórios Y2K'
  );
INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    'camisetas',
    'Camiseta Oversized',
    'Gráficos que provocam. Lavagem que envelhece bem. Tecido que respira.',
    'camiseta oversized'
  );

-- Insert Products
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'Boxy Acid Wash Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 289',
      '/Y2K Hoodies & moletom/Boxy-Oversized-Acid-Wash-Hoodie-Starphase-streetwe-0_360x.jpg',
      '/Y2K Hoodies & moletom/Boxy-Oversized-Acid-Wash-Hoodie-Starphase-streetwe-7567_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'Cyberpunk Planet Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 319',
      '/Y2K Hoodies & moletom/Cyberpunk-Planet-Oversized-Fleece-Hoodie-Starphase-16_360x.jpg',
      '/Y2K Hoodies & moletom/Cyberpunk-Planet-Oversized-Fleece-Hoodie-Starphase-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'Ghetto Star Oversized Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 269',
      '/Y2K Hoodies & moletom/Ghetto-Star-Oversized-Fleece-Hoodie-Starphase-stre-0_360x.jpg',
      '/Y2K Hoodies & moletom/Ghetto-Star-Oversized-Fleece-Hoodie-Starphase-stre-5_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'LA California Fleece Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 299',
      '/Y2K Hoodies & moletom/LA-California-Oversized-Fleece-Hoodie-Starphase-st-3025_360x.jpg',
      '/Y2K Hoodies & moletom/LA-California-Oversized-Fleece-Hoodie-Starphase-st-3_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'Mad Dog Doberman Washed Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 349',
      '/Y2K Hoodies & moletom/Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starpha-35_360x.png',
      '/Y2K Hoodies & moletom/Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starphase-6933_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'hoodies'),
      'NY State of Mind Hoodie',
      'Y2K Hoodies & Moletom',
      'R$ 279',
      '/Y2K Hoodies & moletom/NY-State-of-Mind-Oversized-Washed-Hoodie-Starphase-0_360x.jpg',
      '/Y2K Hoodies & moletom/NY-State-of-Mind-Oversized-Washed-Hoodie-Starphase-1_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Camouflage Hooded Puffer Jacket',
      'Jaquetas & Casacos',
      'R$ 429',
      '/jaquetas e casacos/Camouflage-Pattern-Oversize-Hooded-Puffer-Jacket-S-8925_360x.jpg',
      '/jaquetas e casacos/Camouflage-Pattern-Oversize-Hooded-Puffer-Jacket-S-8925_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Gloss Puffer Jacket',
      'Jaquetas & Casacos',
      'R$ 469',
      '/jaquetas e casacos/Men-s-Gloss-Puffer-Jacket-High-Street-Winter-Essen-0_360x.png',
      '/jaquetas e casacos/Men-s-Gloss-Puffer-Jacket-High-Street-Winter-Essen-2823_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Midnight Letter Bomber Jacket',
      'Jaquetas & Casacos',
      'R$ 399',
      '/jaquetas e casacos/Midnight-Letter-Embroidered-Bomber-Jacket-Brewing-0_360x.jpg',
      '/jaquetas e casacos/Midnight-Letter-Embroidered-Bomber-Jacket-Brewing-0998_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Oversized Faux Fur Hooded Jacket',
      'Jaquetas & Casacos',
      'R$ 499',
      '/jaquetas e casacos/Oversized-Faux-Fur-Hooded-Jacket-Winter-Weight-Sta-0_360x.png',
      '/jaquetas e casacos/Oversized-Faux-Fur-Hooded-Jacket-Winter-Weight-Sta-9206_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Hooded Pilot Leather Bomber',
      'Jaquetas & Casacos',
      'R$ 449',
      '/jaquetas e casacos/Oversized-Hooded-Pilot-Leather-Bomber-Jacket-Starp-4_360x.jpg',
      '/jaquetas e casacos/Oversized-Hooded-Pilot-Leather-Bomber-Jacket-Starp-6_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'jaquetas'),
      'Shadow Hood PU Leather Jacket',
      'Jaquetas & Casacos',
      'R$ 419',
      '/jaquetas e casacos/Shadow-Hood-PU-Leather-Jacket-Starphase-streetwear-0_360x.webp',
      '/jaquetas e casacos/Shadow-Hood-PU-Leather-Jacket-Starphase-streetwear-2272_360x.webp',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Baggy Camouflage Cargo Pants',
      'Y2K Calças Baggy',
      'R$ 259',
      '/Y2K calças baggy/Baggy-Camouflage-Wide-Leg-Cargo-Pants-Starphase-st-3_360x.jpg',
      '/Y2K calças baggy/Baggy-Camouflage-Wide-Leg-Cargo-Pants-Starphase-st-5_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Black Shiny PU Wide Leg Pants',
      'Y2K Calças Baggy',
      'R$ 299',
      '/Y2K calças baggy/Black-Shiny-PU-Wide-Leg-Pants-Starphase-streetwear-0_360x.png',
      '/Y2K calças baggy/Black-Shiny-PU-Wide-Leg-Pants-Starphase-streetwear-7584_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Distressed Dark Blue Baggy Jeans',
      'Y2K Calças Baggy',
      'R$ 279',
      '/Y2K calças baggy/Distressed-Dark-Blue-90-s-Baggy-Jeans-Starphase-st-1191_360x.jpg',
      '/Y2K calças baggy/Distressed-Dark-Blue-90-s-Baggy-Jeans-Starphase-st-7240_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Distressed Wide Leg Baggy Jeans',
      'Y2K Calças Baggy',
      'R$ 269',
      '/Y2K calças baggy/Distressed-Wide-Leg-90-s-Baggy-Blue-Jeans-Starphas-5_360x.jpg',
      '/Y2K calças baggy/Distressed-Wide-Leg-90-s-Baggy-Blue-Jeans-Starphas-6_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Light Camo Wide Leg Cargo Pants',
      'Y2K Calças Baggy',
      'R$ 239',
      '/Y2K calças baggy/Light-Camouflage-Wide-Leg-Baggy-Cargo-Pants-Starph-0_360x.jpg',
      '/Y2K calças baggy/Light-Camouflage-Wide-Leg-Baggy-Cargo-Pants-Starph-3791_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'calcas'),
      'Graphic Stitch Baggy Jeans',
      'Y2K Calças Baggy',
      'R$ 289',
      '/Y2K calças baggy/Oversized-Graphic-Stitch-Baggy-Jeans-Starphase-str-0_360x.jpg',
      '/Y2K calças baggy/Oversized-Graphic-Stitch-Baggy-Jeans-Starphase-str-0_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Classic Distressed Denim Shorts',
      'Y2K Shorts',
      'R$ 189',
      '/Y2K shorts/Classic-Distressed-Blue-Denim-Baggy-Shorts-Starpha-1_360x.jpg',
      '/Y2K shorts/Classic-Distressed-Blue-Denim-Baggy-Shorts-Starpha-10_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Loose Camouflage Cargo Shorts',
      'Y2K Shorts',
      'R$ 219',
      '/Y2K shorts/Distressed-Loose-Camouflage-Cargo-Shorts-Starphase-0_360x.jpg',
      '/Y2K shorts/Distressed-Loose-Camouflage-Cargo-Shorts-Starphase-5890_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Washed Graffiti Denim Shorts',
      'Y2K Shorts',
      'R$ 229',
      '/Y2K shorts/Retro-Washed-Graffiti-Denim-Long-Shorts-Men-Starph-0_360x.png',
      '/Y2K shorts/Retro-Washed-Graffiti-Denim-Long-Shorts-Men-Starph-9830_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Retro Y2K Baggy Denim Shorts',
      'Y2K Shorts',
      'R$ 199',
      '/Y2K shorts/Retro-Y2K-Baggy-Denim-Shorts-Starphase-streetwear-0_360x.jpg',
      '/Y2K shorts/Retro-Y2K-Baggy-Denim-Shorts-Starphase-streetwear-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Vintage Wide Leg Denim Shorts',
      'Y2K Shorts',
      'R$ 209',
      '/Y2K shorts/Vintage-Washed-Oversized-Wide-Leg-Denim-Shorts-Sta-0_360x.png',
      '/Y2K shorts/Vintage-Washed-Oversized-Wide-Leg-Denim-Shorts-Sta-6574_360x.png',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'shorts'),
      'Women''s Camo Cargo Shorts',
      'Y2K Shorts',
      'R$ 199',
      '/Y2K shorts/Women-s-Camouflage-Y2K-Baggy-Cargo-Shorts-Starphas-0_360x.jpg',
      '/Y2K shorts/Women-s-Camouflage-Y2K-Baggy-Cargo-Shorts-Starphas-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'Distorted Flat Bill Snapback',
      'Headwear',
      'R$ 129',
      '/headwear/Distorted-Flat-Bill-Snapback-Hat-Starphase-streetw-1_360x.jpg',
      '/headwear/Distorted-Flat-Bill-Snapback-Hat-Starphase-streetw-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'Red Star Pentagram Trapper Hat',
      'Headwear',
      'R$ 149',
      '/headwear/Red-Star-Black-Plush-Pentagram-Trapper-Hat-Starpha-1_360x.jpg',
      '/headwear/Red-Star-Black-Plush-Pentagram-Trapper-Hat-Starpha-4_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'SP Embroidered Beanie',
      'Headwear',
      'R$ 99',
      '/headwear/SP-Embroidered-Beanie-Starphase-streetwear-6_360x.jpg',
      '/headwear/SP-Embroidered-Beanie-Starphase-streetwear-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'SP Star Flat Bill Cap',
      'Headwear',
      'R$ 119',
      '/headwear/SP-Star-Flat-Bill-Cap-Starphase-streetwear-7_360x.jpg',
      '/headwear/SP-Star-Flat-Bill-Cap-Starphase-streetwear-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'Sci-Fi Logo Baseball Cap',
      'Headwear',
      'R$ 109',
      '/headwear/Sci-Fi-Logo-Flat-Bill-Baseball-Cap-Starphase-stree-0_360x.jpg',
      '/headwear/Sci-Fi-Logo-Flat-Bill-Baseball-Cap-Starphase-stree-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'headwear'),
      'Letter Flat Bill Snapback',
      'Headwear',
      'R$ 129',
      '/headwear/Starphase-Letter-Flat-Bill-Snapback-Hat-Starphase-3_360x.jpg',
      '/headwear/Starphase-Letter-Flat-Bill-Snapback-Hat-Starphase-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Mad Dog Doberman Washed Hoodie',
      'Estilo em Destaque',
      'R$ 349',
      '/estilo em destaque/Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starpha-35_360x.png',
      '/estilo em destaque/Mad-Dog-Doberman-Washed-Oversize-Hoodie-Starphase-6933_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Oversized Suede Leather Bomber',
      'Estilo em Destaque',
      'R$ 449',
      '/estilo em destaque/Oversized-Hooded-Suede-Leather-Bomber-Jacket-Starp-0_360x.jpg',
      '/estilo em destaque/Oversized-Hooded-Suede-Leather-Bomber-Jacket-Starp-5_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Washed Denim Hoodie',
      'Estilo em Destaque',
      'R$ 299',
      '/estilo em destaque/Oversized-Washed-Denim-Hoodie-Starphase-streetwear-3_360x.jpg',
      '/estilo em destaque/Oversized-Washed-Denim-Hoodie-Starphase-streetwear-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Chrome Logo Fleece Hoodie',
      'Estilo em Destaque',
      'R$ 319',
      '/estilo em destaque/Starphase-Chrome-Logo-Oversized-Fleece-Hoodie-Star-2_360x.jpg',
      '/estilo em destaque/Starphase-Chrome-Logo-Oversized-Fleece-Hoodie-Star-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Cosmic Abyss T-Shirt',
      'Estilo em Destaque',
      'R$ 199',
      '/estilo em destaque/Starphase-Cosmic-Abyss-T-Shirt-Starphase-streetwea-6_360x.jpg',
      '/estilo em destaque/Starphase-Cosmic-Abyss-T-Shirt-Starphase-streetwea-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'destaque'),
      'Stellar Washed Graphic T-Shirt',
      'Estilo em Destaque',
      'R$ 179',
      '/estilo em destaque/Stellar-Oversized-Washed-Graphic-T-Shirt-Starphase-0_360x.jpg',
      '/estilo em destaque/Stellar-Oversized-Washed-Graphic-T-Shirt-Starphase-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'acessorios'),
      'Big Curb Chunky Chain Bracelet',
      'Acessórios Y2K',
      'R$ 149',
      '/acessórios Y2K/Big-Curb-Chunky-Chain-Hip-Hop-Bracelet-Starphase-s-3_360x.jpg',
      '/acessórios Y2K/Big-Curb-Chunky-Chain-Hip-Hop-Bracelet-Starphase-s-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'acessorios'),
      'Iced Out Miami Cuban Link',
      'Acessórios Y2K',
      'R$ 179',
      '/acessórios Y2K/Iced-Out-Miami-Cuban-Link-Bracelets-Starphase-stre-6_360x.jpg',
      '/acessórios Y2K/Iced-Out-Miami-Cuban-Link-Bracelets-Starphase-stre-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'acessorios'),
      'Luxurious Stainless Steel Bracelet',
      'Acessórios Y2K',
      'R$ 129',
      '/acessórios Y2K/Luxurious-Stainless-Steel-Bracelet-Starphase-stree-2_360x.jpg',
      '/acessórios Y2K/Luxurious-Stainless-Steel-Bracelet-Starphase-stree-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'acessorios'),
      'Macramê Beads Crown Bracelet',
      'Acessórios Y2K',
      'R$ 89',
      '/acessórios Y2K/Macrame-Beads-Crown-Bracelets-Starphase-streetwear-4_360x.jpg',
      '/acessórios Y2K/Macrame-Beads-Crown-Bracelets-Starphase-streetwear-8_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Archangel Washed Graphic Tee',
      'Camiseta Oversized',
      'R$ 189',
      '/camiseta oversized/Archangel-Oversized-Washed-Graphic-T-Shirt-Starpha-3_360x.jpg',
      '/camiseta oversized/Archangel-Oversized-Washed-Graphic-T-Shirt-Starpha-4_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Ascension Relaxed Fit Tee',
      'Camiseta Oversized',
      'R$ 169',
      '/camiseta oversized/Ascension-Relaxed-Fit-Graphic-T-Shirt-Starphase-st-15_360x.jpg',
      '/camiseta oversized/Ascension-Relaxed-Fit-Graphic-T-Shirt-Starphase-st-20_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Bored Teddy Bear Graphic Tee',
      'Camiseta Oversized',
      'R$ 159',
      '/camiseta oversized/Bored-Teddy-Bear-Relaxed-Fit-Graphic-T-Shirt-Starp-14_360x.jpg',
      '/camiseta oversized/Bored-Teddy-Bear-Relaxed-Fit-Graphic-T-Shirt-Starp-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Cat Women Anime Washed Tee',
      'Camiseta Oversized',
      'R$ 179',
      '/camiseta oversized/Cat-Women-Anime-Oversized-Washed-T-Shirt-Starphase-2_360x.jpg',
      '/camiseta oversized/Cat-Women-Anime-Oversized-Washed-T-Shirt-Starphase-7_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Cosmic Abyss Washed Graphic Tee',
      'Camiseta Oversized',
      'R$ 199',
      '/camiseta oversized/Cosmic-Abyss-Oversized-Washed-Graphic-T-Shirt-Star-2_360x.jpg',
      '/camiseta oversized/Cosmic-Abyss-Oversized-Washed-Graphic-T-Shirt-Star-9_360x.jpg',
      false
    );
INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = 'camisetas'),
      'Heartbreaker Graffiti T-Shirt',
      'Camiseta Oversized',
      'R$ 189',
      '/camiseta oversized/Heartbreaker-Oversized-Washed-Graffiti-T-Shirt-Sta-1_360x.jpg',
      '/camiseta oversized/Heartbreaker-Oversized-Washed-Graffiti-T-Shirt-Sta-9_360x.jpg',
      false
    );

-- Insert Featured Products
INSERT INTO public.products (
    name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class
  ) VALUES (
    'CHAOS HOODIE / 01',
    'HEAVYWEIGHT FLEECE',
    'R$ 489',
    '/hot stuff/chaos hoodie 02.jpg',
    '/hot stuff/chaos hoodie 01.jpg',
    '/the archive/chaos hoodie 02.jpg',
    '/the archive/chaos hoodie 01.jpg',
    true,
    'lg:col-span-2',
    'cover-top',
    'cover-bottom'
  );
INSERT INTO public.products (
    name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class
  ) VALUES (
    'FREAKY CAP / 02',
    '6-PANEL STRUCTURE',
    'R$ 189',
    '/hot stuff/freaky cap 01',
    '/hot stuff/freaky cap 02',
    '/the archive/freaky cap 01.jpg',
    '/the archive/freaky cap 02.jpg',
    true,
    '',
    'contain',
    'cover-top'
  );
INSERT INTO public.products (
    name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class
  ) VALUES (
    'UTILITY PANT / 03',
    'RIPSTOP CARGO',
    'R$ 379',
    '/hot stuff/utility pant 01',
    '/hot stuff/utility pant 02',
    '/the archive/utility pant 01.jpg',
    '/the archive/utility pant 02.jpg',
    true,
    '',
    'cover-center',
    'cover-center'
  );
INSERT INTO public.products (
    name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class
  ) VALUES (
    'SIGNAL TEE / 04',
    'COTTON 240GSM',
    'R$ 229',
    '/the archive/signal tee 01.jpg',
    '/the archive/signal tee 02.jpg',
    '/the archive/signal tee 01.jpg',
    '/the archive/signal tee 02.jpg',
    true,
    'lg:col-span-2',
    'cover-top',
    'cover-bottom'
  );
