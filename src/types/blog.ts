/**
 * Blog Post Types
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: {
    en: string;
    it: string;
    es: string;
  };
  excerpt: {
    en: string;
    it: string;
    es: string;
  };
  content: {
    en: string;
    it: string;
    es: string;
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
    es: string;
  };
  excerpt: {
    en: string;
    it: string;
    es: string;
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
    es: string;
  };
  description?: {
    en: string;
    it: string;
    es: string;
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
    es: string;
  };
  created_at: string;
}

/**
 * Language Types
 */

/**
 * Comment Types
 */

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_id: string;
  author_name?: string;
  author_avatar?: string | null;
  content: string;
  approved: boolean;
  edited: boolean;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
  reply_count?: number;
}

export interface CommentFormData {
  content: string;
  parent_id?: string | null;
}

/**
 * Language Types
 */

export type Language = 'en' | 'it' | 'es';

export type LocalizedContent = {
  en: string;
  it: string;
  es: string;
};
