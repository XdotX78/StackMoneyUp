# 🤖 AI Agent API Documentation

Complete guide for AI agents to create blog posts programmatically.

---

## 📌 **Overview**

This API allows AI agents to create blog posts in **English, Italian, and Spanish** automatically. All posts are created as **DRAFTS** and require manual review before publication.

**Endpoint:** `POST https://stackmoneyup.com/api/blog/create`

---

## 🔐 **Authentication**

The API requires authentication. You have two options:

### Option 1: Session Cookie (Recommended)
Login to the dashboard first, then the session cookie will be automatically included.

### Option 2: Bearer Token
Include your authentication token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Required Role:** `editor` or `admin`

---

## 📝 **Request Format**

### **Headers**
```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

### **Body (JSON)**
```json
{
  "title_en": "The Compound Effect of Consistent Investing",
  "title_it": "L'Effetto Composto degli Investimenti Costanti",
  "title_es": "El Efecto Compuesto de las Inversiones Constantes",
  
  "excerpt_en": "Why investing €100 monthly beats trying to time the market. Discover the power of consistency.",
  "excerpt_it": "Perché investire €100 al mese batte il tentativo di cronometrare il mercato. Scopri il potere della costanza.",
  "excerpt_es": "Por qué invertir €100 mensuales supera intentar cronometrar el mercado. Descubre el poder de la consistencia.",
  
  "content_en": "# Introduction\n\nInvesting consistently is one of the most powerful strategies...\n\n## The Math Behind It\n\nWhen you invest €100 every month...",
  "content_it": "# Introduzione\n\nInvestire in modo costante è una delle strategie più potenti...\n\n## La Matematica Dietro\n\nQuando investi €100 ogni mese...",
  "content_es": "# Introducción\n\nInvertir de forma constante es una de las estrategias más poderosas...\n\n## Las Matemáticas Detrás\n\nCuando inviertes €100 cada mes...",
  
  "category": "Investing",
  "tags": ["investing", "compound-interest", "passive-income"],
  "cover_image": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200"
}
```

---

## 📋 **Required Fields**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title_en` | string | English title (required) | "How to Start Investing" |
| `title_it` | string | Italian title (required) | "Come Iniziare a Investire" |
| `title_es` | string | Spanish title (required) | "Cómo Empezar a Invertir" |
| `excerpt_en` | string | English excerpt (120-160 chars) | "A beginner's guide to..." |
| `excerpt_it` | string | Italian excerpt (120-160 chars) | "Una guida per principianti..." |
| `excerpt_es` | string | Spanish excerpt (120-160 chars) | "Una guía para principiantes..." |
| `content_en` | string | English content (Markdown) | "# Title\n\nContent..." |
| `content_it` | string | Italian content (Markdown) | "# Titolo\n\nContenuto..." |
| `content_es` | string | Spanish content (Markdown) | "# Título\n\nContenido..." |
| `category` | string | Post category (see list below) | "Investing" |
| `tags` | array | Array of tag strings | ["investing", "stocks"] |
| `cover_image` | string | Image URL (optional) | "https://..." |

---

## 📂 **Valid Categories**

Must be one of:
- `Investing`
- `Saving & Emergency Fund`
- `Budgeting & Spending`
- `Debt & Loans`
- `Income & Earning More`
- `Money Mindset`

---

## ✅ **Success Response**

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Post created successfully as DRAFT. Manual review required before publishing.",
  "post": {
    "id": "uuid-here",
    "slug": "compound-effect-investing",
    "title": {
      "en": "The Compound Effect of Consistent Investing",
      "it": "L'Effetto Composto degli Investimenti Costanti",
      "es": "El Efecto Compuesto de las Inversiones Constantes"
    },
    "category": "Investing",
    "published": false,
    "created_at": "2025-01-09T21:30:00Z"
  },
  "next_steps": [
    "Review the post in the dashboard",
    "Edit at: /dashboard/edit/compound-effect-investing",
    "Publish manually when ready"
  ]
}
```

---

## ❌ **Error Responses**

### 400 - Bad Request
```json
{
  "error": "Missing required fields",
  "missing_fields": ["title_es", "content_es"]
}
```

### 401 - Unauthorized
```json
{
  "error": "Unauthorized. Please log in."
}
```

### 403 - Forbidden
```json
{
  "error": "Forbidden. Only editors and admins can create posts.",
  "required_role": "editor or admin",
  "your_role": "user"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details here"
}
```

---

## 🐍 **Python Example**

```python
import requests
import json

# API Configuration
API_URL = "https://stackmoneyup.com/api/blog/create"
AUTH_TOKEN = "your-bearer-token-here"  # Get from Supabase or login session

# Post Data (Multi-language)
post_data = {
    "title_en": "The Compound Effect of Consistent Investing",
    "title_it": "L'Effetto Composto degli Investimenti Costanti",
    "title_es": "El Efecto Compuesto de las Inversiones Constantes",
    
    "excerpt_en": "Why investing €100 monthly beats trying to time the market.",
    "excerpt_it": "Perché investire €100 al mese batte il tentativo di cronometrare il mercato.",
    "excerpt_es": "Por qué invertir €100 mensuales supera intentar cronometrar el mercado.",
    
    "content_en": """# The Power of Consistency

Investing consistently is one of the most powerful wealth-building strategies.

## The Math Behind It

When you invest €100 every month at an average 7% return:
- After 10 years: €17,308
- After 20 years: €52,093
- After 30 years: €122,709

## Key Takeaways

1. Start early
2. Stay consistent
3. Don't try to time the market
4. Focus on the long term

## Visualizing Growth

Here's how €100/month grows over time:

[chart:line title="Investment Growth (7% annual return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="400" currency="€" /]

Amazing, right?
""",
    
    "content_it": """# Il Potere della Costanza

Investire in modo costante è una delle strategie più potenti per costruire ricchezza.

## La Matematica Dietro

Quando investi €100 ogni mese con un rendimento medio del 7%:
- Dopo 10 anni: €17.308
- Dopo 20 anni: €52.093
- Dopo 30 anni: €122.709

## Punti Chiave

1. Inizia presto
2. Mantieni la costanza
3. Non cercare di cronometrare il mercato
4. Concentrati sul lungo termine

## Visualizzare la Crescita

Ecco come crescono €100/mese nel tempo:

[chart:line title="Crescita Investimento (7% rendimento annuo)" labels="10 anni,20 anni,30 anni" datasets='[{"label":"€100/mese","data":[17308,52093,122709]},{"label":"€200/mese","data":[34616,104186,245418]}]' height="400" currency="€" /]

Incredibile, vero?
""",
    
    "content_es": """# El Poder de la Consistencia

Invertir de forma constante es una de las estrategias más poderosas para construir riqueza.

## Las Matemáticas Detrás

Cuando inviertes €100 cada mes con un rendimiento promedio del 7%:
- Después de 10 años: €17.308
- Después de 20 años: €52.093
- Después de 30 años: €122.709

## Puntos Clave

1. Empieza temprano
2. Mantén la consistencia
3. No intentes cronometrar el mercado
4. Enfócate en el largo plazo

## Visualizando el Crecimiento

Así crecen €100/mes con el tiempo:

[chart:line title="Crecimiento de Inversión (7% retorno anual)" labels="10 años,20 años,30 años" datasets='[{"label":"€100/mes","data":[17308,52093,122709]},{"label":"€200/mes","data":[34616,104186,245418]}]' height="400" currency="€" /]

¡Increíble, verdad?
""",
    
    "category": "Investing",
    "tags": ["investing", "compound-interest", "passive-income", "long-term"],
    "cover_image": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200"
}

# Make Request
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

response = requests.post(API_URL, headers=headers, json=post_data)

# Handle Response
if response.status_code == 201:
    result = response.json()
    print("✅ Post created successfully!")
    print(f"Post ID: {result['post']['id']}")
    print(f"Slug: {result['post']['slug']}")
    print(f"Edit at: https://stackmoneyup.com/dashboard/edit/{result['post']['slug']}")
else:
    print(f"❌ Error {response.status_code}: {response.json()}")
```

---

## 🟢 **Node.js / TypeScript Example**

```typescript
interface PostData {
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

async function createBlogPost(postData: PostData, authToken: string) {
  const response = await fetch('https://stackmoneyup.com/api/blog/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(postData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error}`);
  }

  return await response.json();
}

// Usage
const newPost = await createBlogPost({
  title_en: "The Compound Effect of Consistent Investing",
  title_it: "L'Effetto Composto degli Investimenti Costanti",
  title_es: "El Efecto Compuesto de las Inversiones Constantes",
  // ... rest of the fields
}, 'your-token-here');

console.log('Post created:', newPost.post.slug);
```

---

## 🔒 **Security Notes**

1. **Posts are ALWAYS created as DRAFTS** - They will NOT be published automatically
2. **Manual review required** - Check the post in the dashboard before publishing
3. **Authentication required** - Only logged-in editors/admins can use this API
4. **Rate limiting** - Consider implementing rate limits if needed
5. **Input validation** - All inputs are validated before saving

---

## 📊 **Workflow**

```
AI Agent → POST /api/blog/create → Database (DRAFT)
                                      ↓
                            Human reviews in Dashboard
                                      ↓
                            Manual publish when ready
                                      ↓
                            Post goes LIVE ✅
```

---

## ❓ **FAQ**

**Q: Can I publish posts directly?**  
A: No. All posts are created as DRAFTS for manual review.

**Q: What format should content be in?**  
A: Markdown format. Supports headings, lists, links, images, code blocks, etc.

**Q: Can I update existing posts?**  
A: Not yet. Currently only supports creating new posts.

**Q: What happens if I use an invalid category?**  
A: The API returns a 400 error with a list of valid categories.

**Q: How do I get an auth token?**  
A: Login to the dashboard, then use your session cookie or generate a token from Supabase.

---

## 📊 **Interactive Charts (NEW!)**

You can now embed interactive financial charts directly in your blog posts using shortcodes!

### **Chart Types**

1. **Line Chart** - For trends (compound interest, growth over time)
2. **Bar Chart** - For comparisons (budget categories, expenses)
3. **Pie Chart** - For distributions (portfolio allocation)

### **Shortcode Format**

```markdown
[chart:line title="Investment Growth" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]}]' height="400" currency="€" /]
```

### **Quick Examples**

**Compound Interest (Line Chart):**
```markdown
[chart:line title="Investment Growth (7% return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="400" currency="€" /]
```

**Monthly Budget (Bar Chart):**
```markdown
[chart:bar title="Monthly Budget" labels="Housing,Food,Transport,Savings" datasets='[{"label":"Budget","data":[1200,400,200,500]}]' height="350" currency="€" /]
```

**Portfolio Distribution (Pie Chart):**
```markdown
[chart:pie title="My Portfolio" labels="Stocks,Bonds,Real Estate,Cash" data="50000,20000,15000,5000" height="400" currency="€" /]
```

### **Full Documentation**

See `CHART_SHORTCODES_GUIDE.md` for complete documentation with examples and best practices.

---

## 📞 **Support**

For issues or questions, contact the development team or check the codebase at:
- API Route: `src/app/api/blog/create/route.ts`
- Blog Functions: `src/lib/blog.ts`
- Chart Shortcodes: `CHART_SHORTCODES_GUIDE.md`

---

**Last Updated:** January 2025  
**API Version:** 1.1 (Added Charts Support)

