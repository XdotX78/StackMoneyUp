# 🔑 Come Ottenere il Token API

Guida per ottenere il token di autenticazione per l'API `/api/blog/create`.

---

## ✅ **METODO 1: Session Cookie dal Browser (PIÙ FACILE)**

Questo è il metodo più veloce per testare l'API.

### Passaggi:

1. **Login al Dashboard**
   - Vai su https://stackmoneyup.com/en/login
   - Fai login con il tuo account (editor o admin)

2. **Apri DevTools**
   - Premi `F12` (o `Ctrl+Shift+I` su Windows)
   - Vai sul tab **Application** (o **Storage** in Firefox)

3. **Trova i Cookies**
   - Nel menu laterale, espandi **Cookies**
   - Clicca su `https://stackmoneyup.com`

4. **Copia il Token**
   - Cerca un cookie chiamato `sb-qhxettplmhkwmmcgrcef-auth-token`
   - Clicca su di esso
   - Copia tutto il valore (sarà molto lungo, tipo JSON)

5. **Usa il Token**
   ```bash
   # Esporta come variabile (Linux/Mac)
   export STACKMONEYUP_API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   # PowerShell (Windows)
   $env:STACKMONEYUP_API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

### Test Rapido con cURL:
```bash
curl -X POST http://localhost:3000/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "Test Post",
    "title_it": "Post di Test",
    "title_es": "Post de Prueba",
    "excerpt_en": "This is a test excerpt in English.",
    "excerpt_it": "Questo è un estratto di test in italiano.",
    "excerpt_es": "Este es un extracto de prueba en español.",
    "content_en": "# Test\n\nContent in English.",
    "content_it": "# Test\n\nContenuto in italiano.",
    "content_es": "# Prueba\n\nContenido en español.",
    "category": "Investing",
    "tags": ["test"]
  }'
```

---

## 🔐 **METODO 2: Supabase Access Token (PROGRAMMATICO)**

Per script automatici o AI agents che devono autenticarsi programmaticamente.

### Con JavaScript/TypeScript:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qhxettplmhkwmmcgrcef.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E'
);

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
});

if (error) {
  console.error('Login failed:', error);
  process.exit(1);
}

// Ottieni il token
const token = data.session?.access_token;

// Usa il token per l'API
const response = await fetch('https://stackmoneyup.com/api/blog/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    // ... your post data
  })
});
```

### Con Python:

```python
import requests

# 1. Login con Supabase
supabase_url = "https://qhxettplmhkwmmcgrcef.supabase.co"
supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"

# Login
auth_response = requests.post(
    f"{supabase_url}/auth/v1/token?grant_type=password",
    headers={
        "apikey": supabase_anon_key,
        "Content-Type": "application/json"
    },
    json={
        "email": "your-email@example.com",
        "password": "your-password"
    }
)

if auth_response.status_code != 200:
    print("Login failed:", auth_response.json())
    exit(1)

# Ottieni il token
token = auth_response.json()["access_token"]

# 2. Usa il token per creare un post
post_response = requests.post(
    "https://stackmoneyup.com/api/blog/create",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    },
    json={
        # ... your post data
    }
)

print(post_response.json())
```

---

## 🛠️ **METODO 3: Script Automatico Completo**

Ho già creato uno script Python che gestisce tutto automaticamente:

### File: `scripts/ai-agent-with-login.py`

```python
#!/usr/bin/env python3
"""
AI Agent with Automatic Login
==============================

This script automatically logs in and creates a blog post.
No need to manually copy tokens!
"""

import requests
import json
import os

# Configuration
SUPABASE_URL = "https://qhxettplmhkwmmcgrcef.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"
API_URL = "https://stackmoneyup.com/api/blog/create"

# Get credentials from environment or prompt
EMAIL = os.getenv("STACKMONEYUP_EMAIL")
PASSWORD = os.getenv("STACKMONEYUP_PASSWORD")

def login(email: str, password: str) -> str:
    """Login to Supabase and get access token."""
    
    print("🔐 Logging in...")
    
    response = requests.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        },
        json={
            "email": email,
            "password": password
        }
    )
    
    if response.status_code != 200:
        raise Exception(f"Login failed: {response.json()}")
    
    token = response.json()["access_token"]
    print("✅ Login successful!")
    return token

def create_post(token: str, post_data: dict) -> dict:
    """Create a blog post using the API."""
    
    print("\n📝 Creating blog post...")
    
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        },
        json=post_data
    )
    
    if response.status_code != 201:
        raise Exception(f"Failed to create post: {response.json()}")
    
    return response.json()

def main():
    """Main function."""
    
    # Get credentials
    if not EMAIL or not PASSWORD:
        print("❌ Error: Set STACKMONEYUP_EMAIL and STACKMONEYUP_PASSWORD environment variables")
        print("\nExample:")
        print("  export STACKMONEYUP_EMAIL='your@email.com'")
        print("  export STACKMONEYUP_PASSWORD='your-password'")
        return 1
    
    try:
        # Login
        token = login(EMAIL, PASSWORD)
        
        # Post data
        post_data = {
            "title_en": "Test Post from AI Agent",
            "title_it": "Post di Test dall'AI Agent",
            "title_es": "Post de Prueba del Agente AI",
            "excerpt_en": "This is an automated test post created by an AI agent.",
            "excerpt_it": "Questo è un post di test automatizzato creato da un agente AI.",
            "excerpt_es": "Esta es una publicación de prueba automatizada creada por un agente AI.",
            "content_en": "# Automated Post\n\nThis post was created automatically by an AI agent.",
            "content_it": "# Post Automatizzato\n\nQuesto post è stato creato automaticamente da un agente AI.",
            "content_es": "# Publicación Automatizada\n\nEsta publicación fue creada automáticamente por un agente AI.",
            "category": "Investing",
            "tags": ["test", "ai-generated"],
        }
        
        # Create post
        result = create_post(token, post_data)
        
        print("\n✅ Post created successfully!")
        print("=" * 50)
        print(f"Post ID: {result['post']['id']}")
        print(f"Slug: {result['post']['slug']}")
        print(f"Edit URL: https://stackmoneyup.com/dashboard/edit/{result['post']['slug']}")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
```

### Come usare:

```bash
# 1. Set your credentials
export STACKMONEYUP_EMAIL="your-email@example.com"
export STACKMONEYUP_PASSWORD="your-password"

# 2. Run
python scripts/ai-agent-with-login.py
```

---

## 📋 **RIEPILOGO VELOCE**

| Metodo | Complessità | Uso | Scadenza |
|--------|-------------|-----|----------|
| **Session Cookie** | 🟢 Facile | Test manuali | 7 giorni |
| **Login Programmatico** | 🟡 Media | Script automatici | 1 ora (refresh) |
| **Service Role** | 🔴 Avanzato | Server-side | Mai |

---

## ⚠️ **NOTE IMPORTANTI**

1. **NON condividere mai il tuo token** - È come la tua password!
2. **I token scadono** - Session tokens durano ~7 giorni, access tokens ~1 ora
3. **Refresh automatico** - Gli script dovrebbero implementare il refresh del token
4. **Rate limiting** - Considera di aggiungere rate limiting se usi API pubblicamente

---

## 🆘 **TROUBLESHOOTING**

**Token non funziona?**
- Verifica di essere loggato come editor/admin
- Controlla che il token non sia scaduto
- Assicurati di aver copiato tutto il token (è molto lungo!)

**401 Unauthorized?**
- Token mancante o invalido
- Fai logout e login di nuovo

**403 Forbidden?**
- Il tuo account non è editor/admin
- Vai su Supabase → Authentication → Users → Cambia role

---

**Hai bisogno di aiuto?** Fammi sapere!

