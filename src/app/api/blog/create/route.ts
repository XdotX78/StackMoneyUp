import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/blog';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

/**
 * API Endpoint for AI Agent to Create Blog Posts
 * 
 * POST /api/blog/create
 * 
 * Security:
 * - Requires authentication (Bearer token or session)
 * - Posts are ALWAYS created as DRAFT (published: false)
 * - Only users with 'editor' or 'admin' role can create posts
 * 
 * Request Body:
 * {
 *   "title_en": "English Title",
 *   "title_it": "Titolo Italiano",
 *   "title_es": "Título Español",
 *   "excerpt_en": "English excerpt...",
 *   "excerpt_it": "Estratto italiano...",
 *   "excerpt_es": "Extracto español...",
 *   "content_en": "Full English content in markdown...",
 *   "content_it": "Contenuto completo italiano in markdown...",
 *   "content_es": "Contenido completo español en markdown...",
 *   "category": "Investing",
 *   "tags": ["investing", "stocks"],
 *   "cover_image": "https://example.com/image.jpg" // optional
 * }
 * 
 * Response:
 * - 201: Post created successfully (returns post object)
 * - 400: Invalid request body
 * - 401: Unauthorized (not logged in)
 * - 403: Forbidden (not editor/admin)
 * - 500: Server error
 */

interface CreatePostRequest {
  title_en: string;
  title_it: string;
  title_es: string;
  excerpt_en: string;
  excerpt_it: string;
  excerpt_es: string;
  content_en: string;
  content_it: string;
  content_es: string;
  category: string;
  tags: string[];
  cover_image?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication Check
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // 2. Authorization Check (only editors and admins can create posts)
    if (user.role !== 'editor' && user.role !== 'admin') {
      return NextResponse.json(
        { 
          error: 'Forbidden. Only editors and admins can create posts.',
          required_role: 'editor or admin',
          your_role: user.role 
        },
        { status: 403 }
      );
    }

    // 3. Parse and Validate Request Body
    let body: CreatePostRequest;
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // 4. Validate Required Fields
    const requiredFields = [
      'title_en', 'title_it', 'title_es',
      'excerpt_en', 'excerpt_it', 'excerpt_es',
      'content_en', 'content_it', 'content_es',
      'category', 'tags'
    ];

    const missingFields = requiredFields.filter(field => !body[field as keyof CreatePostRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missing_fields: missingFields
        },
        { status: 400 }
      );
    }

    // 5. Validate Field Types
    if (typeof body.title_en !== 'string' || body.title_en.trim().length === 0) {
      return NextResponse.json(
        { error: 'title_en must be a non-empty string' },
        { status: 400 }
      );
    }

    if (typeof body.title_it !== 'string' || body.title_it.trim().length === 0) {
      return NextResponse.json(
        { error: 'title_it must be a non-empty string' },
        { status: 400 }
      );
    }

    if (typeof body.title_es !== 'string' || body.title_es.trim().length === 0) {
      return NextResponse.json(
        { error: 'title_es must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.tags) || body.tags.length === 0) {
      return NextResponse.json(
        { error: 'tags must be a non-empty array of strings' },
        { status: 400 }
      );
    }

    // 6. Validate Category (must be one of the predefined categories)
    const validCategories = [
      'Investing',
      'Saving & Emergency Fund',
      'Budgeting & Spending',
      'Debt & Loans',
      'Income & Earning More',
      'Money Mindset'
    ];

    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { 
          error: 'Invalid category',
          valid_categories: validCategories,
          received: body.category
        },
        { status: 400 }
      );
    }

    // 7. Generate slug from English title
    const slug = generateSlug(body.title_en.trim());

    // 8. Create Post (ALWAYS as DRAFT)
    const newPost = await createPost({
      slug: slug,
      title_en: body.title_en.trim(),
      title_it: body.title_it.trim(),
      title_es: body.title_es.trim(),
      excerpt_en: body.excerpt_en.trim(),
      excerpt_it: body.excerpt_it.trim(),
      excerpt_es: body.excerpt_es.trim(),
      content_en: body.content_en.trim(),
      content_it: body.content_it.trim(),
      content_es: body.content_es.trim(),
      category: body.category,
      tags: body.tags.map(tag => tag.trim()),
      cover_image: body.cover_image || '',
      published: false, // 🔒 ALWAYS DRAFT - Manual review required
      featured: false,
    });

    // 9. Return Success Response
    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully as DRAFT. Manual review required before publishing.',
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          category: newPost.category,
          published: newPost.published, // Will be false
          created_at: newPost.created_at,
        },
        next_steps: [
          'Review the post in the dashboard',
          `Edit at: /dashboard/edit/${newPost.slug}`,
          'Publish manually when ready'
        ]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating post via API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight (if needed for external AI agents)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust based on your needs
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

