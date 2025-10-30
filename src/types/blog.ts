/**
 * Blog Post Types
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: {
    en: string;
    it: string;
  };
  excerpt: {
    en: string;
    it: string;
  };
  content: {
    en: string;
    it: string;
  };
  cover_image?: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  read_time?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id: string;
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: {
    en: string;
    it: string;
  };
  excerpt: {
    en: string;
    it: string;
  };
  cover_image?: string;
  category: string;
  tags: string[];
  read_time?: number;
  published_at?: string;
}

/**
 * Tag Types
 */

export interface Tag {
  id: string;
  slug: string;
  name: {
    en: string;
    it: string;
  };
  description?: {
    en: string;
    it: string;
  };
  post_count: number;
  created_at: string;
}

/**
 * Author Types
 */

export interface Author {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: {
    en: string;
    it: string;
  };
  created_at: string;
}

/**
 * Language Types
 */

export type Language = 'en' | 'it';

export type LocalizedContent = {
  en: string;
  it: string;
};
