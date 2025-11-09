"""
CrewAI Tool - StackMoneyUp Blog Creator
========================================

Tool semplice per CrewAI che gestisce tutto automaticamente.
Nessun token da configurare, basta email e password!

Uso in CrewAI:
    from scripts.crewai_simple_tool import create_blog_post_tool
    
    agent = Agent(
        role='Blog Writer',
        tools=[create_blog_post_tool],
        ...
    )
"""

import requests
import os
from typing import Dict, Any, List, Optional
from crewai_tools import tool

# Configurazione - Modifica qui o usa variabili d'ambiente
API_EMAIL = os.getenv("STACKMONEYUP_EMAIL", "fcarp78@icloud.com")
API_PASSWORD = os.getenv("STACKMONEYUP_PASSWORD", "")
SITE_URL = os.getenv("STACKMONEYUP_URL", "https://stackmoneyup.com")

# Supabase config
SUPABASE_URL = "https://qhxettplmhkwmmcgrcef.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"


def _get_auth_token() -> str:
    """
    Ottiene il token di autenticazione automaticamente.
    """
    if not API_PASSWORD:
        raise Exception(
            "STACKMONEYUP_PASSWORD non configurato! "
            "Imposta la variabile d'ambiente STACKMONEYUP_PASSWORD "
            "oppure modifica API_PASSWORD in questo file."
        )
    
    response = requests.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json"
        },
        json={
            "email": API_EMAIL,
            "password": API_PASSWORD
        },
        timeout=10
    )
    
    if response.status_code != 200:
        error_msg = response.json().get('error_description', 'Login fallito')
        raise Exception(f"Autenticazione fallita: {error_msg}")
    
    return response.json()["access_token"]


@tool("Create Blog Post on StackMoneyUp")
def create_blog_post_tool(
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
    Crea un post del blog su StackMoneyUp.
    
    Questo tool gestisce automaticamente l'autenticazione.
    Non serve configurare token manualmente!
    
    Args:
        title_en: Titolo in inglese
        title_it: Titolo in italiano
        title_es: Titolo in spagnolo
        excerpt_en: Estratto in inglese (120-160 caratteri)
        excerpt_it: Estratto in italiano
        excerpt_es: Estratto in spagnolo
        content_en: Contenuto in inglese (Markdown). Puoi includere grafici con shortcode:
                    [chart:line ...], [chart:bar ...], [chart:pie ...]
        content_it: Contenuto in italiano (Markdown)
        content_es: Contenuto in spagnolo (Markdown)
        category: Categoria (Investing, Saving & Emergency Fund, Budgeting & Spending,
                  Debt & Loans, Income & Earning More, Money Mindset)
        tags: Lista di tag, es. ["investing", "compound-interest"]
        cover_image: URL immagine di copertina (opzionale)
        
    Returns:
        Dizionario con:
        - success: bool
        - post: dict con id, slug, title, ecc.
        - next_steps: lista di prossimi passi
        
    Example:
        >>> result = create_blog_post_tool(
        ...     title_en="Compound Interest Explained",
        ...     title_it="Interesse Composto Spiegato",
        ...     title_es="Interés Compuesto Explicado",
        ...     excerpt_en="Learn how compound interest works...",
        ...     excerpt_it="Impara come funziona l'interesse composto...",
        ...     excerpt_es="Aprende cómo funciona el interés compuesto...",
        ...     content_en="# Compound Interest\\n\\n[chart:line ...]",
        ...     content_it="# Interesse Composto\\n\\n[chart:line ...]",
        ...     content_es="# Interés Compuesto\\n\\n[chart:line ...]",
        ...     category="Investing",
        ...     tags=["investing", "compound-interest"]
        ... )
    """
    # Validazione categoria
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
            f"Categoria invalida: {category}. "
            f"Deve essere una di: {', '.join(valid_categories)}"
        )
    
    # Ottieni token automaticamente
    try:
        token = _get_auth_token()
    except Exception as e:
        raise Exception(f"Errore autenticazione: {str(e)}")
    
    # Prepara payload
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
    
    # Crea post
    try:
        response = requests.post(
            f"{SITE_URL}/api/blog/create",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            json=payload,
            timeout=30
        )
        
        if response.status_code == 201:
            return response.json()
        elif response.status_code == 401:
            raise Exception("Token non valido. Controlla email e password.")
        elif response.status_code == 403:
            error_data = response.json()
            raise Exception(
                f"Permessi insufficienti. Ruolo richiesto: {error_data.get('required_role')}. "
                f"Il tuo ruolo: {error_data.get('your_role')}"
            )
        elif response.status_code == 400:
            error_data = response.json()
            missing = error_data.get('missing_fields', [])
            if missing:
                raise Exception(f"Campi mancanti: {', '.join(missing)}")
            else:
                raise Exception(f"Errore validazione: {error_data.get('error')}")
        else:
            error_data = response.json() if response.content else {}
            raise Exception(
                f"Errore API {response.status_code}: {error_data.get('error', 'Errore sconosciuto')}"
            )
            
    except requests.exceptions.RequestException as e:
        raise Exception(f"Errore di connessione: {str(e)}")


# Esempio di uso diretto (per test)
if __name__ == "__main__":
    import sys
    
    if not API_PASSWORD:
        print("❌ Errore: STACKMONEYUP_PASSWORD non configurato!")
        print("\nOpzioni:")
        print("  1. Imposta variabile d'ambiente:")
        print("     export STACKMONEYUP_PASSWORD='tua-password'")
        print("  2. Modifica API_PASSWORD in questo file")
        sys.exit(1)
    
    print("🧪 Test create_blog_post_tool...")
    
    try:
        result = create_blog_post_tool(
            title_en="Test from CrewAI Tool",
            title_it="Test da CrewAI Tool",
            title_es="Prueba de CrewAI Tool",
            excerpt_en="This is a test post created using the CrewAI tool.",
            excerpt_it="Questo è un post di test creato usando il tool CrewAI.",
            excerpt_es="Esta es una publicación de prueba creada usando la herramienta CrewAI.",
            content_en="# Test\n\nCreated with CrewAI tool!",
            content_it="# Test\n\nCreato con il tool CrewAI!",
            content_es="# Prueba\n\n¡Creado con la herramienta CrewAI!",
            category="Investing",
            tags=["test", "crewai"]
        )
        
        print("\n✅ Post creato!")
        print(f"   Slug: {result['post']['slug']}")
        print(f"   Edit: {SITE_URL}/dashboard/edit/{result['post']['slug']}")
        
    except Exception as e:
        print(f"\n❌ Errore: {e}")
        sys.exit(1)

