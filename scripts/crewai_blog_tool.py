#!/usr/bin/env python3
"""
CrewAI Tool for StackMoneyUp Blog Creation
==========================================

This tool can be used directly in CrewAI agents to create blog posts.

Usage in CrewAI:
    from crewai_tools import tool
    from scripts.crewai_blog_tool import create_blog_post
    
    agent = Agent(
        role='Blog Writer',
        tools=[create_blog_post],
        ...
    )
"""

import requests
import os
from typing import Dict, Any, List, Optional
from crewai_tools import tool


# Configuration
API_URL = os.getenv(
    "STACKMONEYUP_API_URL",
    "https://stackmoneyup.com/api/blog/create"
)
API_TOKEN = os.getenv("STACKMONEYUP_API_TOKEN")


@tool("Create Blog Post on StackMoneyUp")
def create_blog_post(
    title_en: str,
    title_it: str,
    title_es: str,
    excerpt_en: str,
    excerpt_it: str,
    excerpt_es: str,
    content_en: str,
    content_it: str,
    content_es: str,
    category: str,
    tags: List[str],
    cover_image: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a blog post on StackMoneyUp platform.
    
    All posts are saved as DRAFTS and require manual review before publishing.
    
    Args:
        title_en: English title (required)
        title_it: Italian title (required)
        title_es: Spanish title (required)
        excerpt_en: English excerpt, 120-160 characters (required)
        excerpt_it: Italian excerpt, 120-160 characters (required)
        excerpt_es: Spanish excerpt, 120-160 characters (required)
        content_en: English content in Markdown format. Can include chart shortcodes:
                    [chart:line ...], [chart:bar ...], [chart:pie ...] (required)
        content_it: Italian content in Markdown format (required)
        content_es: Spanish content in Markdown format (required)
        category: One of: Investing, Saving & Emergency Fund, Budgeting & Spending,
                  Debt & Loans, Income & Earning More, Money Mindset (required)
        tags: List of tag strings, e.g. ["investing", "compound-interest"] (required)
        cover_image: Optional cover image URL
        
    Returns:
        Dictionary with:
        - success: bool
        - message: str
        - post: dict with id, slug, title, category, published (False), created_at
        - next_steps: list of strings
        
    Raises:
        Exception: If API call fails or returns error
        
    Example:
        >>> result = create_blog_post(
        ...     title_en="Compound Interest Explained",
        ...     title_it="Interesse Composto Spiegato",
        ...     title_es="Interés Compuesto Explicado",
        ...     excerpt_en="Learn how compound interest grows your money over time.",
        ...     excerpt_it="Impara come l'interesse composto fa crescere i tuoi soldi.",
        ...     excerpt_es="Aprende cómo el interés compuesto hace crecer tu dinero.",
        ...     content_en="# Compound Interest\\n\\n[chart:line ...]",
        ...     content_it="# Interesse Composto\\n\\n[chart:line ...]",
        ...     content_es="# Interés Compuesto\\n\\n[chart:line ...]",
        ...     category="Investing",
        ...     tags=["investing", "compound-interest"]
        ... )
        >>> print(result["post"]["slug"])
        'compound-interest-explained'
    """
    if not API_TOKEN:
        raise Exception(
            "STACKMONEYUP_API_TOKEN environment variable not set. "
            "Set it with: export STACKMONEYUP_API_TOKEN='your-token-here'"
        )
    
    # Validate category
    valid_categories = [
        "Investing",
        "Saving & Emergency Fund",
        "Budgeting & Spending",
        "Debt & Loans",
        "Income & Earning More",
        "Money Mindset"
    ]
    
    if category not in valid_categories:
        raise ValueError(
            f"Invalid category: {category}. "
            f"Must be one of: {', '.join(valid_categories)}"
        )
    
    # Prepare payload
    payload = {
        "title_en": title_en.strip(),
        "title_it": title_it.strip(),
        "title_es": title_es.strip(),
        "excerpt_en": excerpt_en.strip(),
        "excerpt_it": excerpt_it.strip(),
        "excerpt_es": excerpt_es.strip(),
        "content_en": content_en.strip(),
        "content_it": content_it.strip(),
        "content_es": content_es.strip(),
        "category": category,
        "tags": [tag.strip() for tag in tags],
    }
    
    if cover_image:
        payload["cover_image"] = cover_image.strip()
    
    # Make API request
    try:
        response = requests.post(
            API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_TOKEN}"
            },
            json=payload,
            timeout=30
        )
        
        # Handle response
        if response.status_code == 201:
            return response.json()
        elif response.status_code == 401:
            raise Exception("Unauthorized: Invalid or expired token. Check STACKMONEYUP_API_TOKEN.")
        elif response.status_code == 403:
            error_data = response.json()
            raise Exception(
                f"Forbidden: {error_data.get('error', 'Access denied')}. "
                f"Your role: {error_data.get('your_role', 'unknown')}. "
                f"Required: {error_data.get('required_role', 'editor or admin')}"
            )
        elif response.status_code == 400:
            error_data = response.json()
            missing = error_data.get('missing_fields', [])
            if missing:
                raise Exception(f"Bad Request: Missing fields: {', '.join(missing)}")
            else:
                raise Exception(f"Bad Request: {error_data.get('error', 'Invalid request')}")
        else:
            error_data = response.json() if response.content else {}
            raise Exception(
                f"API Error {response.status_code}: "
                f"{error_data.get('error', 'Unknown error')}"
            )
            
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error: {str(e)}")


# Example usage (for testing)
if __name__ == "__main__":
    import sys
    
    # Check if token is set
    if not API_TOKEN:
        print("❌ Error: STACKMONEYUP_API_TOKEN not set")
        print("\nSet it with:")
        print("  export STACKMONEYUP_API_TOKEN='your-token-here'")
        print("\nOr in PowerShell:")
        print("  $env:STACKMONEYUP_API_TOKEN='your-token-here'")
        sys.exit(1)
    
    # Test the tool
    print("🧪 Testing create_blog_post tool...")
    
    try:
        result = create_blog_post(
            title_en="Test Post from CrewAI Tool",
            title_it="Post di Test da CrewAI Tool",
            title_es="Post de Prueba de CrewAI Tool",
            excerpt_en="This is a test post created using the CrewAI tool.",
            excerpt_it="Questo è un post di test creato usando il tool CrewAI.",
            excerpt_es="Esta es una publicación de prueba creada usando la herramienta CrewAI.",
            content_en="# Test Post\n\nThis is test content with a chart:\n\n[chart:line title=\"Test Chart\" labels=\"A,B,C\" datasets='[{\"label\":\"Data\",\"data\":[10,20,30]}]' height=\"300\" currency=\"€\" /]",
            content_it="# Post di Test\n\nQuesto è contenuto di test con un grafico:\n\n[chart:line title=\"Grafico di Test\" labels=\"A,B,C\" datasets='[{\"label\":\"Dati\",\"data\":[10,20,30]}]' height=\"300\" currency=\"€\" /]",
            content_es="# Post de Prueba\n\nEste es contenido de prueba con un gráfico:\n\n[chart:line title=\"Gráfico de Prueba\" labels=\"A,B,C\" datasets='[{\"label\":\"Datos\",\"data\":[10,20,30]}]' height=\"300\" currency=\"€\" /]",
            category="Investing",
            tags=["test", "crewai", "automation"]
        )
        
        print("\n✅ Post created successfully!")
        print(f"   Post ID: {result['post']['id']}")
        print(f"   Slug: {result['post']['slug']}")
        print(f"   Published: {result['post']['published']} (DRAFT)")
        print(f"\n📋 Next Steps:")
        for step in result['next_steps']:
            print(f"   • {step}")
        print(f"\n🔗 Edit URL: https://stackmoneyup.com/dashboard/edit/{result['post']['slug']}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

