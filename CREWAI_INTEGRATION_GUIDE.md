# 🤖 CrewAI Integration Guide

Complete guide for integrating StackMoneyUp API with CrewAI agents.

---

## 🎯 **Overview**

Your CrewAI agents can create blog posts programmatically using the `/api/blog/create` endpoint. All posts are saved as **DRAFTS** for manual review.

---

## 🔑 **Authentication**

### **Option 1: Service Account Token (RECOMMENDED for CrewAI)**

For automated agents, you should use a **service account** or **long-lived token**.

#### **Get Token from Supabase:**

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your admin user (or create a service account)
3. Copy the user's **Access Token** (or generate a new one via API)

#### **Or Generate Token Programmatically:**

```python
import requests

# Login to get token
response = requests.post(
    "https://qhxettplmhkwmmcgrcef.supabase.co/auth/v1/token?grant_type=password",
    headers={
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E",
        "Content-Type": "application/json"
    },
    json={
        "email": "your-service-account@example.com",
        "password": "your-password"
    }
)

token = response.json()["access_token"]
print(f"Token: {token}")
```

### **Option 2: Session Cookie (For Testing)**

1. Login to https://stackmoneyup.com/en/login
2. Open DevTools (F12) → Application → Cookies
3. Copy `sb-qhxettplmhkwmmcgrcef-auth-token` value

---

## 🚀 **cURL Examples**

### **Basic Post Creation**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "Test Post from CrewAI",
    "title_it": "Post di Test da CrewAI",
    "title_es": "Post de Prueba de CrewAI",
    "excerpt_en": "This is a test post created by CrewAI agent.",
    "excerpt_it": "Questo è un post di test creato dall'agente CrewAI.",
    "excerpt_es": "Esta es una publicación de prueba creada por el agente CrewAI.",
    "content_en": "# Test Post\n\nThis is test content.",
    "content_it": "# Post di Test\n\nQuesto è contenuto di test.",
    "content_es": "# Post de Prueba\n\nEste es contenido de prueba.",
    "category": "Investing",
    "tags": ["test", "crewai"]
  }'
```

### **Post with Charts**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "Compound Interest Explained",
    "title_it": "Interesse Composto Spiegato",
    "title_es": "Interés Compuesto Explicado",
    "excerpt_en": "See how compound interest grows your money over time with interactive charts.",
    "excerpt_it": "Vedi come l'interesse composto fa crescere i tuoi soldi nel tempo con grafici interattivi.",
    "excerpt_es": "Ve cómo el interés compuesto hace crecer tu dinero con el tiempo con gráficos interactivos.",
    "content_en": "# Compound Interest\n\nHere is how your money grows:\n\n[chart:line title=\"Investment Growth (7% return)\" labels=\"10 years,20 years,30 years\" datasets='[{\"label\":\"€100/month\",\"data\":[17308,52093,122709]}]' height=\"400\" currency=\"€\" /]\n\nStart investing today!",
    "content_it": "# Interesse Composto\n\nEcco come crescono i tuoi soldi:\n\n[chart:line title=\"Crescita Investimento (7% rendimento)\" labels=\"10 anni,20 anni,30 anni\" datasets='[{\"label\":\"€100/mese\",\"data\":[17308,52093,122709]}]' height=\"400\" currency=\"€\" /]\n\nInizia a investire oggi!",
    "content_es": "# Interés Compuesto\n\nAsí crece tu dinero:\n\n[chart:line title=\"Crecimiento de Inversión (7% retorno)\" labels=\"10 años,20 años,30 años\" datasets='[{\"label\":\"€100/mes\",\"data\":[17308,52093,122709]}]' height=\"400\" currency=\"€\" /]\n\n¡Empieza a invertir hoy!",
    "category": "Investing",
    "tags": ["compound-interest", "investing", "charts"]
  }'
```

### **Using JSON File**

```bash
# Save your post data to a file
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @post-data.json
```

---

## 🐍 **Python Integration for CrewAI**

### **Create a Tool for CrewAI**

```python
# tools/blog_creator.py
import requests
import json
from typing import Dict, Any
from crewai_tools import tool

@tool("Create Blog Post")
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
    tags: list,
    cover_image: str = None
) -> Dict[str, Any]:
    """
    Create a blog post on StackMoneyUp.
    
    Args:
        title_en: English title
        title_it: Italian title
        title_es: Spanish title
        excerpt_en: English excerpt (120-160 chars)
        excerpt_it: Italian excerpt
        excerpt_es: Spanish excerpt
        content_en: English content (Markdown with optional chart shortcodes)
        content_it: Italian content
        content_es: Spanish content
        category: Post category (Investing, Saving & Emergency Fund, etc.)
        tags: List of tags
        cover_image: Optional cover image URL
        
    Returns:
        API response with post details
    """
    API_URL = "https://stackmoneyup.com/api/blog/create"
    TOKEN = "YOUR_TOKEN_HERE"  # Set as environment variable in production
    
    payload = {
        "title_en": title_en,
        "title_it": title_it,
        "title_es": title_es,
        "excerpt_en": excerpt_en,
        "excerpt_it": excerpt_it,
        "excerpt_es": excerpt_es,
        "content_en": content_en,
        "content_it": content_it,
        "content_es": content_es,
        "category": category,
        "tags": tags,
    }
    
    if cover_image:
        payload["cover_image"] = cover_image
    
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}"
        },
        json=payload
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"Failed to create post: {response.json()}")
```

### **Use in CrewAI Agent**

```python
# agents/blog_writer.py
from crewai import Agent, Task
from tools.blog_creator import create_blog_post

# Create the agent
blog_writer = Agent(
    role='Financial Blog Writer',
    goal='Create engaging, educational blog posts about personal finance',
    backstory="""You are an expert financial writer with years of experience
    creating content about investing, budgeting, and personal finance.
    You write in English, Italian, and Spanish.""",
    tools=[create_blog_post],
    verbose=True
)

# Create a task
write_post_task = Task(
    description="""Create a blog post about compound interest.
    Include:
    - Title in EN/IT/ES
    - Excerpt in all 3 languages
    - Full content with a line chart showing growth over 30 years
    - Category: Investing
    - Tags: compound-interest, investing, long-term
    
    Use the chart shortcode:
    [chart:line title="Investment Growth" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]}]' height="400" currency="€" /]
    """,
    agent=blog_writer,
    expected_output="Blog post created successfully with post ID and slug"
)
```

---

## 📊 **Chart Shortcodes for CrewAI**

Your CrewAI agents can include interactive charts in posts using shortcodes:

### **Line Chart (Trends)**

```markdown
[chart:line title="Investment Growth" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]}]' height="400" currency="€" /]
```

### **Bar Chart (Comparisons)**

```markdown
[chart:bar title="Monthly Budget" labels="Housing,Food,Savings" datasets='[{"label":"Amount","data":[1200,400,500]}]' height="350" currency="€" /]
```

### **Pie Chart (Distributions)**

```markdown
[chart:pie title="Portfolio" labels="Stocks,Bonds,Cash" data="60,30,10" height="400" currency="€" /]
```

**Full documentation:** See `CHART_SHORTCODES_GUIDE.md`

---

## 🔧 **Environment Variables**

For production, use environment variables:

```bash
# .env
STACKMONEYUP_API_URL=https://stackmoneyup.com/api/blog/create
STACKMONEYUP_API_TOKEN=your-long-lived-token-here
```

```python
import os

API_URL = os.getenv("STACKMONEYUP_API_URL")
TOKEN = os.getenv("STACKMONEYUP_API_TOKEN")
```

---

## ✅ **Response Format**

### **Success (201 Created)**

```json
{
  "success": true,
  "message": "Post created successfully as DRAFT. Manual review required before publishing.",
  "post": {
    "id": "uuid-here",
    "slug": "compound-interest-explained",
    "title": {
      "en": "Compound Interest Explained",
      "it": "Interesse Composto Spiegato",
      "es": "Interés Compuesto Explicado"
    },
    "category": "Investing",
    "published": false,
    "created_at": "2025-01-09T21:30:00Z"
  },
  "next_steps": [
    "Review the post in the dashboard",
    "Edit at: /dashboard/edit/compound-interest-explained",
    "Publish manually when ready"
  ]
}
```

### **Error (400/401/403/500)**

```json
{
  "error": "Error message here",
  "missing_fields": ["field1", "field2"]  // Only for 400
}
```

---

## 🎯 **Best Practices for CrewAI**

### **1. Always Save as DRAFT**

All posts are automatically saved as DRAFT. This is intentional for:
- Manual review before publishing
- Quality control
- SEO optimization

### **2. Use Chart Shortcodes**

Include visual data with charts:
- Compound interest → Line chart
- Budget breakdown → Bar or Pie chart
- Portfolio allocation → Pie chart

### **3. Multi-language Content**

Always provide content in all 3 languages (EN/IT/ES):
- Better SEO
- Wider audience reach
- Professional appearance

### **4. Category Selection**

Use appropriate categories:
- `Investing`
- `Saving & Emergency Fund`
- `Budgeting & Spending`
- `Debt & Loans`
- `Income & Earning More`
- `Money Mindset`

### **5. Tag Strategy**

Use 3-5 relevant tags:
- Specific (not generic)
- SEO-friendly
- Related to content

---

## 🐛 **Troubleshooting**

### **401 Unauthorized**

- Token expired or invalid
- Solution: Generate new token

### **403 Forbidden**

- User role is not `editor` or `admin`
- Solution: Update user role in Supabase

### **400 Bad Request**

- Missing required fields
- Invalid category
- Invalid JSON format
- Solution: Check payload structure

### **500 Internal Server Error**

- Server issue
- Solution: Check server logs, retry later

---

## 📚 **Additional Resources**

- **API Documentation:** `AI_AGENT_API_DOCUMENTATION.md`
- **Chart Shortcodes:** `CHART_SHORTCODES_GUIDE.md`
- **Token Guide:** `HOW_TO_GET_API_TOKEN.md`
- **Test Examples:** `test-api-with-charts.json`

---

## 🚀 **Quick Start Example**

```bash
# 1. Get your token (see HOW_TO_GET_API_TOKEN.md)
export TOKEN="your-token-here"

# 2. Create a post
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @test-api-with-charts.json

# 3. Check response
# Should return 201 with post details
```

---

**Last Updated:** January 2025  
**Version:** 1.0

For questions or issues, check the main API documentation or contact the development team.

