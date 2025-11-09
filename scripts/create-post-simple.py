#!/usr/bin/env python3
"""
🚀 Script SUPER SEMPLICE per Creare Post
========================================

Nessun token da copiare! Basta email e password.

Uso:
    python create-post-simple.py
"""

import requests
import json

# ============================================
# CONFIGURAZIONE - MODIFICA QUI!
# ============================================

EMAIL = "fcarp78@icloud.com"  # 👈 La tua email
PASSWORD = "tua-password-qui"  # 👈 La tua password

# URL del sito (usa localhost se stai testando in locale)
SITE_URL = "https://stackmoneyup.com"  # o "http://localhost:3000" per test locale

# ============================================
# FINE CONFIGURAZIONE
# ============================================

def main():
    print("🚀 Creazione Post StackMoneyUp")
    print("=" * 50)
    print()
    
    # Step 1: Login
    print("🔐 Step 1: Login...")
    supabase_url = "https://qhxettplmhkwmmcgrcef.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"
    
    try:
        response = requests.post(
            f"{supabase_url}/auth/v1/token?grant_type=password",
            headers={
                "apikey": supabase_key,
                "Content-Type": "application/json"
            },
            json={"email": EMAIL, "password": PASSWORD},
            timeout=10
        )
        
        if response.status_code != 200:
            print(f"❌ Login fallito: {response.json()}")
            return
        
        token = response.json()["access_token"]
        print("✅ Login riuscito!")
        print()
        
    except Exception as e:
        print(f"❌ Errore durante il login: {e}")
        return
    
    # Step 2: Crea il post
    print("📝 Step 2: Creazione post...")
    
    post_data = {
        "title_en": "Test Post - Super Semplice!",
        "title_it": "Post di Test - Super Semplice!",
        "title_es": "Post de Prueba - ¡Súper Simple!",
        "excerpt_en": "This post was created using the super simple Python script. No token copying needed!",
        "excerpt_it": "Questo post è stato creato usando lo script Python super semplice. Nessun token da copiare!",
        "excerpt_es": "Esta publicación fue creada usando el script Python súper simple. ¡No se necesita copiar tokens!",
        "content_en": """# Test Post - Super Semplice!

Questo post è stato creato usando lo script `create-post-simple.py`.

## Come Funziona?

1. Modifichi email e password nello script
2. Esegui: `python create-post-simple.py`
3. Fatto! Il post viene creato automaticamente.

## Prossimi Passi

- Vai alla dashboard per vedere il post
- Modificalo se necessario
- Pubblicalo quando pronto!

**Nessun token da copiare!** 🎉""",
        "content_it": """# Post di Test - Super Semplice!

Questo post è stato creato usando lo script `create-post-simple.py`.

## Come Funziona?

1. Modifichi email e password nello script
2. Esegui: `python create-post-simple.py`
3. Fatto! Il post viene creato automaticamente.

## Prossimi Passi

- Vai alla dashboard per vedere il post
- Modificalo se necessario
- Pubblicalo quando pronto!

**Nessun token da copiare!** 🎉""",
        "content_es": """# Post de Prueba - ¡Súper Simple!

Esta publicación fue creada usando el script `create-post-simple.py`.

## ¿Cómo Funciona?

1. Modificas email y contraseña en el script
2. Ejecutas: `python create-post-simple.py`
3. ¡Listo! La publicación se crea automáticamente.

## Próximos Pasos

- Ve al panel para ver la publicación
- Modifícala si es necesario
- ¡Publícala cuando esté lista!

**¡No se necesita copiar tokens!** 🎉""",
        "category": "Investing",
        "tags": ["test", "api", "automation"]
    }
    
    try:
        response = requests.post(
            f"{SITE_URL}/api/blog/create",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            json=post_data,
            timeout=30
        )
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Post creato con successo!")
            print()
            print("📋 Dettagli:")
            print(f"   ID: {result['post']['id']}")
            print(f"   Slug: {result['post']['slug']}")
            print(f"   Status: DRAFT (revisione manuale richiesta)")
            print()
            print("🔗 Link:")
            print(f"   Dashboard: {SITE_URL}/en/dashboard")
            print(f"   Edit: {SITE_URL}/dashboard/edit/{result['post']['slug']}")
            print()
            print("💡 Prossimi passi:")
            for step in result['next_steps']:
                print(f"   • {step}")
        else:
            print(f"❌ Errore: {response.status_code}")
            print(response.json())
            
    except Exception as e:
        print(f"❌ Errore durante la creazione: {e}")

if __name__ == "__main__":
    main()

