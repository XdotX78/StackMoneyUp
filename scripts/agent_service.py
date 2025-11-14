#!/usr/bin/env python3
"""
Agent Service - Run CrewAI Agents Without CrewAI Runtime
=========================================================

This service runs your CrewAI agents as a separate service.
It can be triggered from the Next.js website.

Usage:
    # Install dependencies
    pip install fastapi uvicorn requests crewai crewai-tools
    
    # Run service
    python scripts/agent_service.py
    
    # Or with uvicorn directly
    uvicorn scripts.agent_service:app --host 0.0.0.0 --port 8000
"""

import os
import asyncio
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from crewai import Agent, Task, Crew
from scripts.crewai_blog_tool import create_blog_post

app = FastAPI(title="StackMoneyUp Agent Service")

# CORS middleware (allow Next.js to call this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing agent definition (from crewai_example.py)
def create_blog_writer_agent():
    """Create the blog writer agent using CrewAI structure"""
    return Agent(
        role='Financial Blog Writer',
        goal='Create engaging, educational blog posts about personal finance in English, Italian, and Spanish',
        backstory="""You are an expert financial writer with 10+ years of experience
        creating content about investing, budgeting, and personal finance.
        You specialize in making complex financial concepts accessible to everyone.
        You write in English, Italian, and Spanish fluently.
        You always include visual data with charts when relevant.
        
        CRITICAL: When using the create_blog_post tool, you MUST provide ALL 12 required parameters:
        1. title_en, title_it, title_es (titles in all 3 languages)
        2. excerpt_en, excerpt_it, excerpt_es (excerpts in all 3 languages, 120-160 chars each)
        3. content_en, content_it, content_es (full content in Markdown for all 3 languages)
        4. category (must be exactly one of the valid categories)
        5. tags (list of tag strings)
        6. cover_image (optional, but recommended)
        
        Never skip any required field. Extract all parameters from the task description before calling the tool.""",
        tools=[create_blog_post],
        verbose=True,
        allow_delegation=False
    )


# Request/Response models
class GenerateRequest(BaseModel):
    topic: str
    category: Optional[str] = "Investing"
    tags: Optional[List[str]] = []
    cover_image: Optional[str] = None
    callback_url: Optional[str] = None


class GenerateResponse(BaseModel):
    job_id: str
    status: str
    message: str


# In-memory job storage (use Redis/DB in production)
jobs = {}


@app.post("/generate", response_model=GenerateResponse)
async def generate_article(
    request: GenerateRequest,
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token")
):
    """
    Trigger article generation.
    
    This endpoint starts the agent in the background and returns immediately.
    The agent will call the callback_url when done.
    """
    import uuid
    job_id = str(uuid.uuid4())
    
    # Store job
    jobs[job_id] = {
        "status": "processing",
        "topic": request.topic,
        "started_at": None
    }
    
    # Start agent in background
    asyncio.create_task(run_agent(job_id, request, x_auth_token))
    
    return GenerateResponse(
        job_id=job_id,
        status="processing",
        message=f"Article generation started for topic: {request.topic}"
    )


async def run_agent(job_id: str, request: GenerateRequest, auth_token: Optional[str]):
    """
    Run the CrewAI agent to generate an article.
    This runs in the background.
    """
    try:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["started_at"] = asyncio.get_event_loop().time()
        
        # Create agent
        blog_writer = create_blog_writer_agent()
        
        # Create task
        task_description = f"""Create a comprehensive blog post about {request.topic}.

        EXTRACT AND PROVIDE ALL THESE PARAMETERS FOR THE create_blog_post TOOL:
        
        TITLES (provide all 3 languages):
        - title_en: English title about {request.topic}
        - title_it: Italian title about {request.topic}
        - title_es: Spanish title about {request.topic}
        
        EXCERPTS (120-160 characters each, provide all 3):
        - excerpt_en: English excerpt (120-160 chars)
        - excerpt_it: Italian excerpt (120-160 chars)
        - excerpt_es: Spanish excerpt (120-160 chars)
        
        CONTENT (Markdown format, provide all 3 languages):
        - content_en: Full English article in Markdown about {request.topic}
        - content_it: Full Italian article in Markdown (translated)
        - content_es: Full Spanish article in Markdown (translated)
        
        METADATA:
        - category: "{request.category}" (must be exactly this string)
        - tags: {request.tags}
        - cover_image: "{request.cover_image or ''}"
        
        The post should:
        - Be comprehensive and well-researched
        - Include examples and actionable advice
        - Be engaging and easy to understand
        - Include charts if relevant
        
        IMPORTANT: When calling create_blog_post tool, provide ALL 12 parameters above.
        """
        
        task = Task(
            description=task_description,
            agent=blog_writer,
            expected_output="Blog post created successfully with all required fields"
        )
        
        # Create crew and run
        crew = Crew(
            agents=[blog_writer],
            tasks=[task],
            verbose=True
        )
        
        # Execute agent (this will call create_blog_post tool)
        result = crew.kickoff()
        
        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = str(result)
        
        # If callback_url provided, notify Next.js
        if request.callback_url:
            try:
                # The agent already called /api/blog/create via the tool
                # But we can send a notification if needed
                pass
            except Exception as e:
                print(f"Error calling callback: {e}")
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        print(f"Agent error: {e}")
        import traceback
        traceback.print_exc()


@app.get("/status/{job_id}")
async def get_status(job_id: str):
    """Get status of a job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return jobs[job_id]


@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "service": "agent-service"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)


