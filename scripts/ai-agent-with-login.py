#!/usr/bin/env python3
"""
AI Agent Blog Post Creator with Automatic Login
================================================

This script automatically logs in to StackMoneyUp and creates a blog post.
No need to manually copy tokens from the browser!

Usage:
    # Set credentials as environment variables
    export STACKMONEYUP_EMAIL="your@email.com"
    export STACKMONEYUP_PASSWORD="your-password"
    
    # Run the script
    python ai-agent-with-login.py

Requirements:
    pip install requests
"""

import requests
import json
import os
import sys
from datetime import datetime


# Configuration
SUPABASE_URL = "https://qhxettplmhkwmmcgrcef.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"
API_URL = "https://stackmoneyup.com/api/blog/create"

# Get credentials from environment variables
EMAIL = os.getenv("STACKMONEYUP_EMAIL")
PASSWORD = os.getenv("STACKMONEYUP_PASSWORD")


def login(email: str, password: str) -> str:
    """
    Login to Supabase and get an access token.
    
    Args:
        email: User email
        password: User password
        
    Returns:
        Access token string
        
    Raises:
        Exception: If login fails
    """
    print("🔐 Logging in to StackMoneyUp...")
    
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
        error_data = response.json()
        error_msg = error_data.get('error_description', error_data.get('msg', 'Unknown error'))
        raise Exception(f"Login failed: {error_msg}")
    
    token = response.json()["access_token"]
    user_email = response.json()["user"]["email"]
    user_role = response.json()["user"]["user_metadata"].get("role", "user")
    
    print(f"✅ Login successful!")
    print(f"   Email: {user_email}")
    print(f"   Role: {user_role}")
    
    if user_role not in ["editor", "admin"]:
        print(f"\n⚠️  WARNING: Your role is '{user_role}'. You need 'editor' or 'admin' role to create posts.")
        print("   Contact an admin to upgrade your role.")
    
    return token


def create_post(token: str, post_data: dict) -> dict:
    """
    Create a blog post using the API.
    
    Args:
        token: Authentication token
        post_data: Post content dictionary
        
    Returns:
        API response dictionary
        
    Raises:
        Exception: If post creation fails
    """
    print("\n📝 Creating blog post...")
    print(f"   Title (EN): {post_data['title_en']}")
    print(f"   Category: {post_data['category']}")
    print(f"   Tags: {', '.join(post_data['tags'])}")
    
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        },
        json=post_data
    )
    
    if response.status_code != 201:
        error_data = response.json()
        error_msg = error_data.get('error', 'Unknown error')
        raise Exception(f"Failed to create post: {error_msg}")
    
    return response.json()


def main():
    """Main function to create a blog post."""
    
    print("🤖 AI Agent Blog Post Creator")
    print("=" * 50)
    
    # Check credentials
    if not EMAIL or not PASSWORD:
        print("\n❌ Error: Missing credentials!")
        print("\nYou need to set these environment variables:")
        print("  STACKMONEYUP_EMAIL")
        print("  STACKMONEYUP_PASSWORD")
        print("\nExample (Linux/Mac):")
        print('  export STACKMONEYUP_EMAIL="your@email.com"')
        print('  export STACKMONEYUP_PASSWORD="your-password"')
        print("\nExample (Windows PowerShell):")
        print('  $env:STACKMONEYUP_EMAIL="your@email.com"')
        print('  $env:STACKMONEYUP_PASSWORD="your-password"')
        return 1
    
    try:
        # Step 1: Login
        token = login(EMAIL, PASSWORD)
        
        # Step 2: Prepare post data (Example post)
        post_data = {
            "title_en": "The Compound Effect of Consistent Investing",
            "title_it": "L'Effetto Composto degli Investimenti Costanti",
            "title_es": "El Efecto Compuesto de las Inversiones Constantes",
            
            "excerpt_en": "Why investing €100 monthly beats trying to time the market. Discover the power of consistency.",
            "excerpt_it": "Perché investire €100 al mese batte il tentativo di cronometrare il mercato. Scopri il potere della costanza.",
            "excerpt_es": "Por qué invertir €100 mensuales supera intentar cronometrar el mercado. Descubre el poder de la consistencia.",
            
            "content_en": """# The Power of Consistency in Investing

When it comes to building wealth, consistency beats timing every single time.

## The Math Behind Compound Interest

Here's what happens when you invest €100 every month at an average 7% annual return:

- **After 10 years:** €17,308
- **After 20 years:** €52,093  
- **After 30 years:** €122,709

The key isn't finding the perfect moment to invest—it's starting now and staying consistent.

## Why Timing the Market Fails

Most people who try to time the market:

1. Miss the best days (and the best days often follow the worst)
2. Pay more in taxes on short-term gains
3. Rack up trading fees
4. Experience stress and anxiety

## The Simple Strategy

Instead of trying to be clever:

1. Set up automatic monthly investments
2. Choose low-cost index funds
3. Ignore the daily noise
4. Stay invested for decades

## Real Example

Sarah started investing €100/month at age 25. By age 55, she had €122,000—despite never "timing" the market or picking individual stocks.

Her secret? She just kept going, month after month, for 30 years.

## Action Steps

1. Open a brokerage account today
2. Set up automatic €100 monthly investment
3. Choose a diversified ETF
4. Don't check it every day
5. Let time do the work

Remember: Time in the market beats timing the market.
""",
            
            "content_it": """# Il Potere della Costanza negli Investimenti

Quando si tratta di costruire ricchezza, la costanza batte il timing ogni singola volta.

## La Matematica Dell'Interesse Composto

Ecco cosa succede quando investi €100 ogni mese con un rendimento medio annuo del 7%:

- **Dopo 10 anni:** €17.308
- **Dopo 20 anni:** €52.093
- **Dopo 30 anni:** €122.709

La chiave non è trovare il momento perfetto per investire—è iniziare ora e rimanere costanti.

## Perché Cronometrare il Mercato Fallisce

La maggior parte delle persone che cerca di cronometrare il mercato:

1. Perde i giorni migliori (e i giorni migliori spesso seguono i peggiori)
2. Paga più tasse sui guadagni a breve termine
3. Accumula commissioni di trading
4. Sperimenta stress e ansia

## La Strategia Semplice

Invece di cercare di essere furbi:

1. Imposta investimenti mensili automatici
2. Scegli fondi indicizzati a basso costo
3. Ignora il rumore quotidiano
4. Rimani investito per decenni

## Esempio Reale

Sarah ha iniziato a investire €100/mese a 25 anni. A 55 anni, aveva €122.000—nonostante non abbia mai "cronometrato" il mercato o scelto azioni individuali.

Il suo segreto? Ha semplicemente continuato, mese dopo mese, per 30 anni.

## Passi Da Seguire

1. Apri un conto di intermediazione oggi
2. Imposta un investimento mensile automatico di €100
3. Scegli un ETF diversificato
4. Non controllarlo ogni giorno
5. Lascia che il tempo faccia il lavoro

Ricorda: il tempo nel mercato batte il timing del mercato.
""",
            
            "content_es": """# El Poder de la Consistencia en las Inversiones

Cuando se trata de construir riqueza, la consistencia supera al timing cada vez.

## Las Matemáticas del Interés Compuesto

Esto es lo que sucede cuando inviertes €100 cada mes con un rendimiento promedio anual del 7%:

- **Después de 10 años:** €17.308
- **Después de 20 años:** €52.093
- **Después de 30 años:** €122.709

La clave no es encontrar el momento perfecto para invertir—es empezar ahora y mantenerse consistente.

## Por Qué Cronometrar el Mercado Falla

La mayoría de las personas que intentan cronometrar el mercado:

1. Pierden los mejores días (y los mejores días a menudo siguen a los peores)
2. Pagan más impuestos sobre ganancias a corto plazo
3. Acumulan comisiones de trading
4. Experimentan estrés y ansiedad

## La Estrategia Simple

En lugar de intentar ser inteligentes:

1. Configura inversiones mensuales automáticas
2. Elige fondos indexados de bajo costo
3. Ignora el ruido diario
4. Mantente invertido durante décadas

## Ejemplo Real

Sarah comenzó a invertir €100/mes a los 25 años. A los 55, tenía €122.000—a pesar de nunca haber "cronometrado" el mercado o elegido acciones individuales.

¿Su secreto? Simplemente continuó, mes tras mes, durante 30 años.

## Pasos a Seguir

1. Abre una cuenta de corretaje hoy
2. Configura una inversión mensual automática de €100
3. Elige un ETF diversificado
4. No lo revises todos los días
5. Deja que el tiempo haga el trabajo

Recuerda: el tiempo en el mercado supera al timing del mercado.
""",
            
            "category": "Investing",
            "tags": ["investing", "compound-interest", "passive-income", "long-term", "etf"],
            "cover_image": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80"
        }
        
        # Step 3: Create post
        result = create_post(token, post_data)
        
        # Step 4: Show results
        print("\n✅ Post created successfully!")
        print("=" * 50)
        print(f"Post ID: {result['post']['id']}")
        print(f"Slug: {result['post']['slug']}")
        print(f"Published: {result['post']['published']} (DRAFT - Manual review required)")
        print(f"Category: {result['post']['category']}")
        print(f"Created: {result['post']['created_at']}")
        
        print("\n📋 Next Steps:")
        for step in result['next_steps']:
            print(f"  • {step}")
        
        print(f"\n🔗 Edit URL: https://stackmoneyup.com/dashboard/edit/{result['post']['slug']}")
        print("\n💡 Remember: The post is saved as DRAFT. Review it in the dashboard before publishing!")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

