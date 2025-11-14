import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * API Endpoint to Trigger Agent Article Generation
 * 
 * POST /api/agent/generate
 * 
 * This endpoint triggers your existing CrewAI Python agents.
 * The agent runs separately and calls /api/blog/create when done.
 * 
 * Request Body:
 * {
 *   "topic": "compound interest",
 *   "category": "Investing",
 *   "tags": ["investing", "compound-interest"],
 *   "cover_image": "https://..." // optional
 * }
 * 
 * Response:
 * - 202: Agent job started (returns job_id)
 * - 401: Unauthorized
 * - 403: Forbidden (not editor/admin)
 * - 500: Server error
 */

interface GenerateRequest {
  topic: string;
  category?: string;
  tags?: string[];
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

    // 2. Authorization Check (only editors and admins can generate articles)
    if (user.role !== 'editor' && user.role !== 'admin') {
      return NextResponse.json(
        { 
          error: 'Forbidden. Only editors and admins can generate articles.',
          required_role: 'editor or admin',
          your_role: user.role 
        },
        { status: 403 }
      );
    }

    // 3. Parse Request Body
    let body: GenerateRequest;
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // 4. Validate Required Fields
    if (!body.topic || typeof body.topic !== 'string' || body.topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // 5. Get agent service URL from environment
    const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8000';
    
    // 6. Trigger agent (call your Python agent service)
    try {
      const agentResponse = await fetch(`${AGENT_SERVICE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass auth token so agent can call back to /api/blog/create
          'X-Auth-Token': request.headers.get('authorization') || '',
        },
        body: JSON.stringify({
          topic: body.topic.trim(),
          category: body.category || 'Investing',
          tags: body.tags || [],
          cover_image: body.cover_image,
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog/create`,
        }),
        // Don't wait for agent to finish - it will call back
        signal: AbortSignal.timeout(5000), // 5 second timeout for initial response
      });

      if (!agentResponse.ok) {
        const errorData = await agentResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Agent service returned ${agentResponse.status}`);
      }

      const agentData = await agentResponse.json();

      // 7. Return job ID (agent is running in background)
      return NextResponse.json(
        {
          success: true,
          message: 'Article generation started',
          job_id: agentData.job_id || 'unknown',
          status: 'processing',
          topic: body.topic,
        },
        { status: 202 } // Accepted - processing
      );

    } catch (error: any) {
      // If agent service is not available, return helpful error
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        return NextResponse.json(
          { 
            error: 'Agent service unavailable',
            message: 'The article generation service is not running. Please start it or check AGENT_SERVICE_URL.',
            hint: 'Run: python scripts/agent_service.py'
          },
          { status: 503 }
        );
      }

      throw error;
    }

  } catch (error) {
    console.error('Error triggering agent:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


