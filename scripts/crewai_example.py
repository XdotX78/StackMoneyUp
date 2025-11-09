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
    You always include visual data with charts when relevant.""",
    tools=[create_blog_post],
    verbose=True,
    allow_delegation=False
)


# Create a Task
write_compound_interest_post = Task(
    description="""Create a comprehensive blog post about compound interest.

    Requirements:
    1. Title in English, Italian, and Spanish
    2. Excerpt in all 3 languages (120-160 characters each)
    3. Full content in Markdown format for all 3 languages
    4. Include a line chart showing investment growth over 30 years
       Use this chart shortcode:
       [chart:line title="Investment Growth (7% annual return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="450" currency="€" /]
    5. Category: "Investing"
    6. Tags: ["compound-interest", "investing", "long-term", "passive-income"]
    7. Cover image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80"
    
    The post should:
    - Explain what compound interest is
    - Show real examples with numbers
    - Include the interactive chart
    - Give actionable advice
    - Be engaging and easy to understand
    """,
    agent=blog_writer,
    expected_output="""A blog post created successfully with:
    - Post ID
    - Slug
    - All content in 3 languages
    - Interactive chart included
    - Status: DRAFT (ready for manual review)"""
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

