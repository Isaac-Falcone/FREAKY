import { CATEGORIES } from '../src/data/categories.js';
import * as fs from 'fs';

const featuredProducts = [
  {
    name: "CHAOS HOODIE / 01",
    category: "HEAVYWEIGHT FLEECE",
    price: "R$ 489",
    size: "lg:col-span-2",
    img: "/hot stuff/chaos hoodie 02.jpg",
    imgHover: "/hot stuff/chaos hoodie 01.jpg",
    imgFit: "cover-top",
    imgArchive: "/the archive/chaos hoodie 02.jpg",
    imgArchiveHover: "/the archive/chaos hoodie 01.jpg",
    imgArchiveFit: "cover-bottom",
  },
  {
    name: "FREAKY CAP / 02",
    category: "6-PANEL STRUCTURE",
    price: "R$ 189",
    size: "",
    img: "/hot stuff/freaky cap 01",
    imgHover: "/hot stuff/freaky cap 02",
    imgFit: "contain",
    imgArchive: "/the archive/freaky cap 01.jpg",
    imgArchiveHover: "/the archive/freaky cap 02.jpg",
    imgArchiveFit: "cover-top",
  },
  {
    name: "UTILITY PANT / 03",
    category: "RIPSTOP CARGO",
    price: "R$ 379",
    size: "",
    img: "/hot stuff/utility pant 01",
    imgHover: "/hot stuff/utility pant 02",
    imgFit: "cover-center",
    imgArchive: "/the archive/utility pant 01.jpg",
    imgArchiveHover: "/the archive/utility pant 02.jpg",
    imgArchiveFit: "cover-center",
  },
  {
    name: "SIGNAL TEE / 04",
    category: "COTTON 240GSM",
    price: "R$ 229",
    size: "lg:col-span-2",
    img: "/the archive/signal tee 01.jpg",
    imgHover: "/the archive/signal tee 02.jpg",
    imgFit: "cover-top",
    imgArchive: "/the archive/signal tee 01.jpg",
    imgArchiveHover: "/the archive/signal tee 02.jpg",
    imgArchiveFit: "cover-bottom",
  },
];

let sql = `-- Supabase Schema and Initial Data Migration
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
`;

// Categories
CATEGORIES.forEach(cat => {
  sql += `INSERT INTO public.categories (slug, label, description, folder_path) VALUES (
    '${cat.slug}',
    '${cat.label.replace(/'/g, "''")}',
    '${cat.description.replace(/'/g, "''")}',
    '${cat.folderPath}'
  );\n`;
});

sql += `\n-- Insert Products\n`;

// Insert normal products
CATEGORIES.forEach(cat => {
  cat.products.forEach(prod => {
    sql += `INSERT INTO public.products (
      category_id, name, category_label, price, img, img_hover, is_featured
    ) VALUES (
      (SELECT id FROM public.categories WHERE slug = '${cat.slug}'),
      '${prod.name.replace(/'/g, "''")}',
      '${cat.label.replace(/'/g, "''")}',
      '${prod.price}',
      '${prod.img.replace(/'/g, "''")}',
      '${prod.imgHover.replace(/'/g, "''")}',
      false
    );\n`;
  });
});

// Insert featured products (with no specific category relation for now, or just leave category_id NULL)
sql += `\n-- Insert Featured Products\n`;
featuredProducts.forEach(prod => {
  sql += `INSERT INTO public.products (
    name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class
  ) VALUES (
    '${prod.name.replace(/'/g, "''")}',
    '${prod.category.replace(/'/g, "''")}',
    '${prod.price}',
    '${prod.img.replace(/'/g, "''")}',
    '${prod.imgHover.replace(/'/g, "''")}',
    '${prod.imgArchive.replace(/'/g, "''")}',
    '${prod.imgArchiveHover.replace(/'/g, "''")}',
    true,
    '${prod.size}',
    '${prod.imgFit}',
    '${prod.imgArchiveFit}'
  );\n`;
});

fs.writeFileSync('supabase.sql', sql);
console.log('Successfully generated supabase.sql');
