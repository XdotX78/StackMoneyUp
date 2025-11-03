-- ============================================
-- Migration: 002_seed_data.sql
-- Description: Seed data for development/testing
-- Created: January 2025
-- WARNING: Only run this in development!
-- ============================================

-- ============================================
-- Seed Tags
-- ============================================

-- Insert sample tags (only if they don't exist)
INSERT INTO public.tags (slug, name_en, name_it, description_en, description_it)
VALUES
  ('investing', 'Investing', 'Investimenti', 'Articles about investing strategies', 'Articoli su strategie di investimento'),
  ('budgeting', 'Budgeting', 'Budget', 'Budgeting and money management tips', 'Consigli su budget e gestione del denaro'),
  ('saving', 'Saving', 'Risparmio', 'Ways to save money effectively', 'Modi per risparmiare denaro efficacemente'),
  ('debt', 'Debt', 'Debito', 'Debt management and payoff strategies', 'Gestione del debito e strategie di estinzione'),
  ('personal-finance', 'Personal Finance', 'Finanza Personale', 'General personal finance topics', 'Argomenti generali di finanza personale'),
  ('compound-interest', 'Compound Interest', 'Interesse Composto', 'The power of compound interest', 'Il potere dell''interesse composto'),
  ('emergency-fund', 'Emergency Fund', 'Fondo di Emergenza', 'Building and maintaining emergency funds', 'Costruire e mantenere fondi di emergenza'),
  ('side-hustle', 'Side Hustle', 'Lavoro Secondario', 'Earning extra income', 'Guadagnare reddito extra'),
  ('mindset', 'Mindset', 'Mentalità', 'Financial mindset and psychology', 'Mentalità e psicologia finanziaria'),
  ('long-term', 'Long Term', 'Lungo Termine', 'Long-term financial planning', 'Pianificazione finanziaria a lungo termine')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Blog Posts (Optional - only for development)
-- ============================================

-- Note: Blog posts should be created through the application
-- to ensure proper author_id assignment and trigger execution.
-- This is just an example structure.

-- Example seed post (uncomment and modify if needed):
/*
INSERT INTO public.blog_posts (
  slug,
  title_en,
  title_it,
  excerpt_en,
  excerpt_it,
  content_en,
  content_it,
  category,
  tags,
  published,
  featured,
  read_time,
  author_id,
  published_at
)
VALUES (
  'example-post',
  'Example Blog Post',
  'Post di Esempio',
  'This is an example blog post for testing.',
  'Questo è un post di esempio per i test.',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Full content here"}]}]}',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Contenuto completo qui"}]}]}',
  'Investing',
  ARRAY['investing', 'compound-interest'],
  true,
  false,
  5,
  (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
*/

-- ============================================
-- Seed Complete
-- ============================================

