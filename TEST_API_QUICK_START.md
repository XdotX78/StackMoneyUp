# 🚀 Quick Test - API con Grafici

Guida rapida per testare l'API con i nuovi grafici Chart.js.

---

## 📋 **Step 1: Assicurati che il Server sia Running**

```bash
npm run dev
```

Aspetta che vedi: `✓ Ready in X ms`

Il server dovrebbe essere su: `http://localhost:3000`

---

## 🔑 **Step 2: Ottieni il Token di Autenticazione**

### Metodo A: Dal Browser (PIÙ VELOCE)

1. Apri http://localhost:3000/en/login
2. Fai login con il tuo account admin
3. Apri DevTools (F12)
4. Vai su **Application** → **Cookies** → `localhost`
5. Cerca il cookie chiamato `sb-qhxettplmhkwmmcgrcef-auth-token`
6. **Copia tutto il valore** (sarà molto lungo, tipo JSON)

### Metodo B: Con Python Script

```bash
# Set le tue credenziali
$env:STACKMONEYUP_EMAIL="fcarp78@icloud.com"
$env:STACKMONEYUP_PASSWORD="tua-password"

# Esegui lo script (crea il post automaticamente!)
python scripts/ai-agent-with-login.py
```

**FATTO!** Lo script creerà automaticamente un post con grafici.

---

## 🧪 **Step 3: Testa l'API con cURL**

### Opzione 1: Con il file JSON preparato

```bash
# Sostituisci YOUR_TOKEN_HERE con il token che hai copiato
curl -X POST http://localhost:3000/api/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @test-api-with-charts.json
```

### Opzione 2: Con PowerShell

```powershell
# 1. Set il token
$token = "YOUR_TOKEN_HERE"

# 2. Leggi il file JSON
$body = Get-Content test-api-with-charts.json -Raw

# 3. Fai la richiesta
Invoke-RestMethod -Uri "http://localhost:3000/api/blog/create" `
  -Method Post `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

### Opzione 3: Con Postman/Insomnia

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/blog/create`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN_HERE`
4. **Body:** Copia il contenuto di `test-api-with-charts.json`
5. **Send!**

---

## ✅ **Step 4: Verifica il Risultato**

### Risposta Attesa (201 Created):

```json
{
  "success": true,
  "message": "Post created successfully as DRAFT. Manual review required before publishing.",
  "post": {
    "id": "uuid-qui",
    "slug": "compound-effect-investing",
    "title": {
      "en": "The Compound Effect of Consistent Investing",
      "it": "L'Effetto Composto degli Investimenti Costanti",
      "es": "El Efecto Compuesto de las Inversiones Constantes"
    },
    "category": "Investing",
    "published": false,
    "created_at": "2025-01-09T..."
  },
  "next_steps": [
    "Review the post in the dashboard",
    "Edit at: /dashboard/edit/compound-effect-investing",
    "Publish manually when ready"
  ]
}
```

---

## 👀 **Step 5: Vedi il Post con i Grafici!**

### 1. Vai alla Dashboard

```
http://localhost:3000/en/dashboard
```

Dovresti vedere il nuovo post nella lista (con status DRAFT).

### 2. Vai alla Pagina di Edit

```
http://localhost:3000/en/dashboard/edit/compound-effect-investing
```

### 3. Preview del Post

Clicca su "Preview" per vedere i grafici renderizzati!

Dovresti vedere:
- 📈 **Line Chart** - Investment Growth (3 linee colorate)
- 🥧 **Pie Chart** - 50/30/20 Budget Rule
- 📊 **Bar Chart** - Monthly Budget Breakdown

### 4. Pubblica il Post

Se tutto sembra ok:
1. Scorri in fondo alla pagina di edit
2. Spunta "Published"
3. Clicca "Update Post"

### 5. Vedi il Post Live

```
http://localhost:3000/en/blog/compound-effect-investing
```

I grafici dovrebbero essere **interattivi**:
- Hover per vedere i valori
- Click sulla legenda per nascondere/mostrare dataset
- Responsive su mobile

---

## 🐛 **Troubleshooting**

### ❌ Error 401 - Unauthorized

**Problema:** Token mancante o invalido

**Soluzione:**
1. Assicurati di aver fatto login
2. Copia di nuovo il token (potrebbe essere scaduto)
3. Verifica che il token sia corretto (deve essere lungo!)

---

### ❌ Error 403 - Forbidden

**Problema:** Il tuo account non è admin/editor

**Soluzione:**
1. Vai su Supabase Dashboard
2. Authentication → Users
3. Trova il tuo user
4. Cambia `user_metadata.role` a `admin`

---

### ❌ Error 400 - Missing required fields

**Problema:** Dati mancanti nel JSON

**Soluzione:**
- Controlla che il file `test-api-with-charts.json` sia completo
- Verifica che tutti i campi richiesti siano presenti
- Assicurati che il JSON sia valido (usa un JSON validator)

---

### ❌ Grafici non visibili

**Problema:** Gli shortcode non vengono parsati

**Soluzione:**
1. Controlla la sintassi degli shortcode
2. Verifica che ci sia uno spazio prima di `/]`
3. Assicurati che i datasets usino JSON valido
4. Guarda la console del browser per errori

---

### ❌ Server non risponde

**Problema:** Il server dev non è running

**Soluzione:**
```bash
# Stoppa il server (Ctrl+C)
# Riavvia
npm run dev
```

---

## 📊 **Esempi di Grafici Funzionanti**

### Line Chart - OK ✅
```markdown
[chart:line title="Test" labels="A,B,C" datasets='[{"label":"Data","data":[10,20,30]}]' height="300" currency="€" /]
```

### Bar Chart - OK ✅
```markdown
[chart:bar title="Budget" labels="Food,Rent" datasets='[{"label":"Cost","data":[400,1200]}]' height="350" currency="€" /]
```

### Pie Chart - OK ✅
```markdown
[chart:pie title="Portfolio" labels="Stocks,Bonds" data="70,30" height="400" currency="€" /]
```

---

## 🎉 **Success!**

Se vedi i grafici interattivi sul post, **tutto funziona perfettamente!**

Ora puoi:
1. ✅ Creare post con grafici dall'editor
2. ✅ Usare l'API per automatizzare la creazione
3. ✅ Far creare grafici all'AI agent
4. ✅ Offrire contenuti finanziari visuali ai lettori

---

**Hai problemi?** Controlla i log del server (`npm run dev` output) o apri la console del browser.

**Vuoi più esempi?** Guarda `CHART_SHORTCODES_GUIDE.md` per tutti i tipi di grafici disponibili!

