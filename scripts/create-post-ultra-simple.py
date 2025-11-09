#!/usr/bin/env python3
"""
🚀 Script ULTRA SEMPLICE per Creare Post
========================================

Basta modificare config.json con email e password!

Uso:
    1. Copia config.json.example in config.json
    2. Modifica config.json con la tua email e password
    3. Esegui: python create-post-ultra-simple.py
"""

import requests
import json
import os

# Carica configurazione
config_file = os.path.join(os.path.dirname(__file__), "config.json")

if not os.path.exists(config_file):
    print("❌ File config.json non trovato!")
    print()
    print("Crea il file config.json:")
    print("  1. Copia config.json.example")
    print("  2. Rinominalo in config.json")
    print("  3. Modifica email e password")
    exit(1)

with open(config_file, "r") as f:
    config = json.load(f)

EMAIL = config.get("email")
PASSWORD = config.get("password")
SITE_URL = config.get("site_url", "https://stackmoneyup.com")

if not EMAIL or not PASSWORD:
    print("❌ Email o password mancanti in config.json!")
    exit(1)

print("🚀 Creazione Post StackMoneyUp")
print("=" * 50)
print()

# Login
print("🔐 Login...")
supabase_url = "https://qhxettplmhkwmmcgrcef.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"

try:
    response = requests.post(
        f"{supabase_url}/auth/v1/token?grant_type=password",
        headers={"apikey": supabase_key, "Content-Type": "application/json"},
        json={"email": EMAIL, "password": PASSWORD},
        timeout=10
    )
    
    if response.status_code != 200:
        print(f"❌ Login fallito: {response.json().get('error_description', 'Errore sconosciuto')}")
        exit(1)
    
    token = response.json()["access_token"]
    print("✅ Login riuscito!")
    print()
    
except Exception as e:
    print(f"❌ Errore login: {e}")
    exit(1)

# Crea post
print("📝 Creazione post...")

post_data = {
    "title_en": "Test Post - Ultra Semplice!",
    "title_it": "Post di Test - Ultra Semplice!",
    "title_es": "Post de Prueba - ¡Ultra Simple!",
    "excerpt_en": "This post was created using the ultra simple script. Just edit config.json and run!",
    "excerpt_it": "Questo post è stato creato usando lo script ultra semplice. Basta modificare config.json e eseguire!",
    "excerpt_es": "Esta publicación fue creada usando el script ultra simple. ¡Solo edita config.json y ejecuta!",
    "content_en": "# Test Post\n\nCreated with ultra simple script!\n\nJust edit `config.json` and run the script. That's it!",
    "content_it": "# Post di Test\n\nCreato con lo script ultra semplice!\n\nBasta modificare `config.json` ed eseguire lo script. Fatto!",
    "content_es": "# Post de Prueba\n\n¡Creado con el script ultra simple!\n\nSolo edita `config.json` y ejecuta el script. ¡Listo!",
    "category": "Investing",
    "tags": ["test", "simple"]
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
        print("✅ Post creato!")
        print(f"   Slug: {result['post']['slug']}")
        print(f"   Edit: {SITE_URL}/dashboard/edit/{result['post']['slug']}")
    else:
        print(f"❌ Errore {response.status_code}: {response.json()}")
        
except Exception as e:
    print(f"❌ Errore: {e}")

