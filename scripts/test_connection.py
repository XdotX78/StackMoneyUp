#!/usr/bin/env python3
"""
Test Agent Connection to Website
================================

This script tests if your agent can connect to the website API.

Usage:
    export STACKMONEYUP_API_TOKEN="your-token"
    python scripts/test_connection.py
"""

import requests
import os
import sys
import json

# Configuration
API_URL = os.getenv(
    "STACKMONEYUP_URL",
    "https://stackmoneyup.com"
)
API_TOKEN = os.getenv("STACKMONEYUP_API_TOKEN")

def test_connection():
    """Test connection to website API."""
    
    if not API_TOKEN:
        print("❌ Error: STACKMONEYUP_API_TOKEN not set")
        print("\nGet token with:")
        print("  export STACKMONEYUP_PASSWORD='your-password'")
        print("  python scripts/get_token.py")
        sys.exit(1)
    
    print("🧪 Testing connection to website API...")
    print(f"   URL: {API_URL}/api/blog/create")
    print(f"   Token: {API_TOKEN[:20]}...")
    print()
    
    # Test data
    test_post = {
        "title_en": "Test Connection Article",
        "title_it": "Articolo di Test Connessione",
        "title_es": "Artículo de Prueba de Conexión",
        "excerpt_en": "This is a test article to verify the agent can connect to the website API.",
        "excerpt_it": "Questo è un articolo di test per verificare che l'agente possa connettersi all'API del sito.",
        "excerpt_es": "Este es un artículo de prueba para verificar que el agente pueda conectarse a la API del sitio.",
        "content_en": "# Test Connection\n\nThis article was created to test the connection between the agent and the website.",
        "content_it": "# Test Connessione\n\nQuesto articolo è stato creato per testare la connessione tra l'agente e il sito web.",
        "content_es": "# Prueba de Conexión\n\nEste artículo fue creado para probar la conexión entre el agente y el sitio web.",
        "category": "Investing",
        "tags": ["test", "connection"]
    }
    
    try:
        print("📤 Sending test request...")
        response = requests.post(
            f"{API_URL}/api/blog/create",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_TOKEN}"
            },
            json=test_post,
            timeout=30
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print("\n✅ SUCCESS! Connection works!")
            print(f"   Post ID: {result.get('post', {}).get('id', 'unknown')}")
            print(f"   Slug: {result.get('post', {}).get('slug', 'unknown')}")
            print(f"\n📝 Post created as DRAFT")
            print(f"   Edit: {API_URL}/dashboard/edit/{result.get('post', {}).get('slug', '')}")
            return True
            
        elif response.status_code == 401:
            print("\n❌ UNAUTHORIZED - Token invalid or expired")
            print("   Get a new token with: python scripts/get_token.py")
            return False
            
        elif response.status_code == 403:
            error_data = response.json()
            print("\n❌ FORBIDDEN - Your account doesn't have permission")
            print(f"   Your role: {error_data.get('your_role', 'unknown')}")
            print(f"   Required: {error_data.get('required_role', 'editor or admin')}")
            print("\n   Make sure your account is 'editor' or 'admin'")
            return False
            
        elif response.status_code == 400:
            error_data = response.json()
            print("\n❌ BAD REQUEST")
            print(f"   Error: {error_data.get('error', 'Unknown error')}")
            if 'missing_fields' in error_data:
                print(f"   Missing: {', '.join(error_data['missing_fields'])}")
            return False
            
        else:
            error_data = response.json() if response.content else {}
            print(f"\n❌ ERROR {response.status_code}")
            print(f"   {error_data.get('error', 'Unknown error')}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Network error: {e}")
        print("\n   Check:")
        print("   - Is the website running?")
        print("   - Is STACKMONEYUP_URL correct?")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)


