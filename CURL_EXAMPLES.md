# 🚀 cURL Examples for CrewAI

Ready-to-use cURL commands for testing the StackMoneyUp API.

---

## 🔑 **Step 1: Get Your Token**

### **Option A: From Browser (Quick Test)**

1. Login: https://stackmoneyup.com/en/login
2. F12 → Application → Cookies → `sb-qhxettplmhkwmmcgrcef-auth-token`
3. Copy the value

### **Option B: Generate Programmatically**

```bash
# Login to get token
curl -X POST "https://qhxettplmhkwmmcgrcef.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password"}'
```

Copy the `access_token` from the response.

---

## 📝 **Example 1: Basic Post (No Charts)**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "How to Start Investing",
    "title_it": "Come Iniziare a Investire",
    "title_es": "Cómo Empezar a Invertir",
    "excerpt_en": "A beginner guide to investing. Learn the basics and start building wealth today.",
    "excerpt_it": "Una guida per principianti all'investimento. Impara le basi e inizia a costruire ricchezza oggi.",
    "excerpt_es": "Una guía para principiantes sobre inversiones. Aprende lo básico y comienza a construir riqueza hoy.",
    "content_en": "# How to Start Investing\n\nInvesting can seem overwhelming, but it doesn't have to be.\n\n## Step 1: Set Your Goals\n\nBefore you start investing, know what you're investing for.\n\n## Step 2: Start Small\n\nYou don't need thousands to start. Even €100/month can make a difference.\n\n## Step 3: Stay Consistent\n\nConsistency beats timing. Invest regularly, regardless of market conditions.",
    "content_it": "# Come Iniziare a Investire\n\nInvestire può sembrare travolgente, ma non deve esserlo.\n\n## Passo 1: Definisci i Tuoi Obiettivi\n\nPrima di iniziare a investire, sappi per cosa stai investendo.\n\n## Passo 2: Inizia Piccolo\n\nNon hai bisogno di migliaia per iniziare. Anche €100/mese possono fare la differenza.\n\n## Passo 3: Rimani Costante\n\nLa costanza batte il timing. Investi regolarmente, indipendentemente dalle condizioni di mercato.",
    "content_es": "# Cómo Empezar a Invertir\n\nInvertir puede parecer abrumador, pero no tiene que serlo.\n\n## Paso 1: Establece Tus Objetivos\n\nAntes de empezar a invertir, sabe para qué estás invirtiendo.\n\n## Paso 2: Empieza Pequeño\n\nNo necesitas miles para empezar. Incluso €100/mes pueden marcar la diferencia.\n\n## Paso 3: Mantén la Consistencia\n\nLa consistencia supera al timing. Invierte regularmente, independientemente de las condiciones del mercado.",
    "category": "Investing",
    "tags": ["investing", "beginners", "getting-started"]
  }'
```

---

## 📊 **Example 2: Post with Line Chart**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "The Power of Compound Interest",
    "title_it": "Il Potere dell'\''Interesse Composto",
    "title_es": "El Poder del Interés Compuesto",
    "excerpt_en": "See how compound interest can turn small monthly investments into significant wealth over time.",
    "excerpt_it": "Vedi come l'\''interesse composto può trasformare piccoli investimenti mensili in ricchezza significativa nel tempo.",
    "excerpt_es": "Ve cómo el interés compuesto puede convertir pequeñas inversiones mensuales en riqueza significativa con el tiempo.",
    "content_en": "# The Power of Compound Interest\n\nCompound interest is often called the eighth wonder of the world.\n\n## Visualizing Growth\n\nHere'\''s how your money grows:\n\n[chart:line title=\"Investment Growth (7% annual return)\" labels=\"10 years,20 years,30 years\" datasets='\''[{\"label\":\"€100/month\",\"data\":[17308,52093,122709]},{\"label\":\"€200/month\",\"data\":[34616,104186,245418]}]\'\'' height=\"450\" currency=\"€\" /]\n\nAs you can see, consistency is key!",
    "content_it": "# Il Potere dell'\''Interesse Composto\n\nL'\''interesse composto è spesso chiamato l'\''ottava meraviglia del mondo.\n\n## Visualizzare la Crescita\n\nEcco come crescono i tuoi soldi:\n\n[chart:line title=\"Crescita Investimento (7% rendimento annuo)\" labels=\"10 anni,20 anni,30 anni\" datasets='\''[{\"label\":\"€100/mese\",\"data\":[17308,52093,122709]},{\"label\":\"€200/mese\",\"data\":[34616,104186,245418]}]\'\'' height=\"450\" currency=\"€\" /]\n\nCome puoi vedere, la costanza è la chiave!",
    "content_es": "# El Poder del Interés Compuesto\n\nEl interés compuesto a menudo se llama la octava maravilla del mundo.\n\n## Visualizando el Crecimiento\n\nAsí crece tu dinero:\n\n[chart:line title=\"Crecimiento de Inversión (7% retorno anual)\" labels=\"10 años,20 años,30 años\" datasets='\''[{\"label\":\"€100/mes\",\"data\":[17308,52093,122709]},{\"label\":\"€200/mes\",\"data\":[34616,104186,245418]}]\'\'' height=\"450\" currency=\"€\" /]\n\n¡Como puedes ver, la consistencia es la clave!",
    "category": "Investing",
    "tags": ["compound-interest", "investing", "long-term"]
  }'
```

---

## 📊 **Example 3: Post with Multiple Charts**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @test-api-with-charts.json
```

Or use the prepared JSON file:

```bash
# Download the file first, or use the one in the repo
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @test-api-with-charts.json
```

---

## 🥧 **Example 4: Post with Pie Chart (Budget)**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "The 50/30/20 Budget Rule",
    "title_it": "La Regola del Budget 50/30/20",
    "title_es": "La Regla del Presupuesto 50/30/20",
    "excerpt_en": "Learn how to allocate your income using the popular 50/30/20 budget rule for better financial health.",
    "excerpt_it": "Impara come allocare il tuo reddito usando la popolare regola del budget 50/30/20 per una migliore salute finanziaria.",
    "excerpt_es": "Aprende cómo asignar tus ingresos usando la popular regla del presupuesto 50/30/20 para una mejor salud financiera.",
    "content_en": "# The 50/30/20 Budget Rule\n\nThe 50/30/20 rule is a simple way to manage your money.\n\n## How It Works\n\n[chart:pie title=\"50/30/20 Budget Rule (€2,000 income)\" labels=\"Needs (50%),Wants (30%),Savings (20%)\" data=\"1000,600,400\" height=\"400\" currency=\"€\" /]\n\n- **50%** for Needs (housing, food, utilities)\n- **30%** for Wants (entertainment, dining out)\n- **20%** for Savings and investments",
    "content_it": "# La Regola del Budget 50/30/20\n\nLa regola 50/30/20 è un modo semplice per gestire i tuoi soldi.\n\n## Come Funziona\n\n[chart:pie title=\"Regola 50/30/20 (€2.000 reddito)\" labels=\"Necessità (50%),Desideri (30%),Risparmi (20%)\" data=\"1000,600,400\" height=\"400\" currency=\"€\" /]\n\n- **50%** per Necessità (casa, cibo, utenze)\n- **30%** per Desideri (intrattenimento, ristoranti)\n- **20%** per Risparmi e investimenti",
    "content_es": "# La Regla del Presupuesto 50/30/20\n\nLa regla 50/30/20 es una forma simple de gestionar tu dinero.\n\n## Cómo Funciona\n\n[chart:pie title=\"Regla 50/30/20 (€2.000 de ingresos)\" labels=\"Necesidades (50%),Deseos (30%),Ahorros (20%)\" data=\"1000,600,400\" height=\"400\" currency=\"€\" /]\n\n- **50%** para Necesidades (vivienda, comida, servicios)\n- **30%** para Deseos (entretenimiento, restaurantes)\n- **20%** para Ahorros e inversiones",
    "category": "Budgeting & Spending",
    "tags": ["budgeting", "50-30-20-rule", "personal-finance"]
  }'
```

---

## 📊 **Example 5: Post with Bar Chart**

```bash
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title_en": "Monthly Budget Breakdown",
    "title_it": "Dettaglio Budget Mensile",
    "title_es": "Desglose del Presupuesto Mensual",
    "excerpt_en": "See how I allocate my monthly income across different categories for optimal financial health.",
    "excerpt_it": "Vedi come alloco il mio reddito mensile tra diverse categorie per una salute finanziaria ottimale.",
    "excerpt_es": "Ve cómo asigno mis ingresos mensuales entre diferentes categorías para una salud financiera óptima.",
    "content_en": "# Monthly Budget Breakdown\n\nHere'\''s how I allocate my €2,600 monthly income:\n\n[chart:bar title=\"My Monthly Budget\" labels=\"Housing,Food,Transport,Savings,Entertainment,Utilities\" datasets='\''[{\"label\":\"Monthly Allocation\",\"data\":[1200,400,200,500,200,100]}]\'\'' height=\"400\" currency=\"€\" /]\n\nNotice that savings come **before** entertainment!",
    "content_it": "# Dettaglio Budget Mensile\n\nEcco come alloco i miei €2.600 di reddito mensile:\n\n[chart:bar title=\"Il Mio Budget Mensile\" labels=\"Casa,Cibo,Trasporti,Risparmi,Svago,Utenze\" datasets='\''[{\"label\":\"Allocazione Mensile\",\"data\":[1200,400,200,500,200,100]}]\'\'' height=\"400\" currency=\"€\" /]\n\nNota che i risparmi vengono **prima** dello svago!",
    "content_es": "# Desglose del Presupuesto Mensual\n\nAsí es como asigno mis €2.600 de ingresos mensuales:\n\n[chart:bar title=\"Mi Presupuesto Mensual\" labels=\"Vivienda,Comida,Transporte,Ahorros,Entretenimiento,Servicios\" datasets='\''[{\"label\":\"Asignación Mensual\",\"data\":[1200,400,200,500,200,100]}]\'\'' height=\"400\" currency=\"€\" /]\n\n¡Nota que los ahorros vienen **antes** del entretenimiento!",
    "category": "Budgeting & Spending",
    "tags": ["budgeting", "expenses", "financial-planning"]
  }'
```

---

## 🔧 **Using Environment Variables**

For production, use environment variables:

```bash
# Set token
export TOKEN="your-token-here"

# Use in cURL
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @post-data.json
```

---

## ✅ **Expected Response**

```json
{
  "success": true,
  "message": "Post created successfully as DRAFT. Manual review required before publishing.",
  "post": {
    "id": "uuid-here",
    "slug": "compound-interest-explained",
    "title": {
      "en": "The Power of Compound Interest",
      "it": "Il Potere dell'Interesse Composto",
      "es": "El Poder del Interés Compuesto"
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

---

## 🐛 **Common Errors**

### **401 Unauthorized**
```json
{"error": "Unauthorized. Please log in."}
```
**Solution:** Check your token is valid and not expired.

### **403 Forbidden**
```json
{
  "error": "Forbidden. Only editors and admins can create posts.",
  "required_role": "editor or admin",
  "your_role": "user"
}
```
**Solution:** Update your user role in Supabase Dashboard.

### **400 Bad Request**
```json
{
  "error": "Missing required fields",
  "missing_fields": ["title_es", "content_es"]
}
```
**Solution:** Ensure all required fields are present.

---

## 📚 **More Examples**

- **Full API Documentation:** `AI_AGENT_API_DOCUMENTATION.md`
- **Chart Shortcodes:** `CHART_SHORTCODES_GUIDE.md`
- **CrewAI Integration:** `CREWAI_INTEGRATION_GUIDE.md`
- **Test File:** `test-api-with-charts.json`

---

**Ready to test?** Replace `YOUR_TOKEN_HERE` with your actual token and run any example above!

