#!/usr/bin/env python3
"""
CrewAI Example - Blog Post Creation
===================================

Complete example of using CrewAI to create blog posts on StackMoneyUp.

Requirements:
    pip install crewai crewai-tools requests

Usage:
    # Set your token
    export STACKMONEYUP_API_TOKEN="your-token-here"
    
    # Run
    python scripts/crewai_example.py
"""

import os
from crewai import Agent, Task, Crew
from scripts.crewai_blog_tool import create_blog_post


# Configuration
API_TOKEN = os.getenv("STACKMONEYUP_API_TOKEN")

if not API_TOKEN:
    print("❌ Error: STACKMONEYUP_API_TOKEN not set")
    print("\nSet it with:")
    print("  export STACKMONEYUP_API_TOKEN='your-token-here'")
    exit(1)


# Create the Blog Writer Agent
blog_writer = Agent(
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


# Create a Task
write_compound_interest_post = Task(
    description="""Create a comprehensive blog post about compound interest.

    EXTRACT AND PROVIDE ALL THESE PARAMETERS FOR THE create_blog_post TOOL:
    
    TITLES (provide all 3):
    - title_en: "Compound Interest Explained"
    - title_it: "Interesse Composto Spiegato"
    - title_es: "Interés Compuesto Explicado"
    
    EXCERPTS (120-160 characters each, provide all 3):
    - excerpt_en: "Learn how compound interest grows your money over time. See real examples with interactive charts."
    - excerpt_it: "Impara come l'interesse composto fa crescere i tuoi soldi nel tempo. Vedi esempi reali con grafici interattivi."
    - excerpt_es: "Aprende cómo el interés compuesto hace crecer tu dinero con el tiempo. Ve ejemplos reales con gráficos interactivos."
    
    CONTENT (Markdown format, provide all 3 languages):
    - content_en: Full English article in Markdown explaining compound interest, with examples and this chart:
      [chart:line title="Investment Growth (7% annual return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="450" currency="€" /]
    - content_it: Full Italian article in Markdown with the same chart (translated)
    - content_es: Full Spanish article in Markdown with the same chart (translated)
    
    METADATA:
    - category: "Investing" (must be exactly this string)
    - tags: ["compound-interest", "investing", "long-term", "passive-income"]
    - cover_image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80"
    
    The post should:
    - Explain what compound interest is clearly
    - Show real examples with numbers
    - Include the interactive chart in all 3 language versions
    - Give actionable advice
    - Be engaging and easy to understand
    
    IMPORTANT: When calling create_blog_post tool, provide ALL 12 parameters above.
    """,
    agent=blog_writer,
    expected_output="""A blog post created successfully with:
    - Post ID
    - Slug
    - All content in 3 languages (title_en, title_it, title_es, excerpt_en, excerpt_it, excerpt_es, content_en, content_it, content_es)
    - Category: "Investing"
    - Tags: ["compound-interest", "investing", "long-term", "passive-income"]
    - Interactive chart included in all language versions
    - Cover image URL
    - Status: DRAFT (ready for manual review)
    
    The tool call must include all 12 required parameters."""
)


# Create the Crew
crew = Crew(
    agents=[blog_writer],
    tasks=[write_compound_interest_post],
    verbose=True
)


# Run the Crew
if __name__ == "__main__":
    print("🤖 Starting CrewAI Blog Post Creation...")
    print("=" * 60)
    
    try:
        result = crew.kickoff()
        
        print("\n" + "=" * 60)
        print("✅ CrewAI execution completed!")
        print(f"\n📝 Result:\n{result}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

