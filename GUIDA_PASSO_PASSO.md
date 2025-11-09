# 🚀 Guida Passo-Passo per Principianti

Guida completa per testare l'API StackMoneyUp da zero.

---

## 📋 **COSA SERVE:**

1. ✅ Un account su StackMoneyUp (già ce l'hai se sei loggato)
2. ✅ Un terminale/command prompt aperto
3. ✅ 5 minuti di tempo

---

## 🎯 **STEP 1: Ottieni il Token di Autenticazione**

Il token è come una "password temporanea" per usare l'API.

### **Metodo A: Dal Browser (PIÙ FACILE)**

#### **Passo 1.1: Apri il Sito**

1. Apri il browser (Chrome, Firefox, Edge, ecc.)
2. Vai su: **https://stackmoneyup.com/en/login**
3. **Fai login** con il tuo account (email e password)

#### **Passo 1.2: Apri DevTools**

1. Dopo il login, premi **F12** sulla tastiera
   - Oppure: Click destro → "Ispeziona" / "Inspect"
   - Oppure: Menu → Strumenti Sviluppatore

2. Si aprirà un pannello in basso o a lato

#### **Passo 1.3: Vai ai Cookies**

1. Nel pannello DevTools, cerca i tab in alto
2. Clicca su **"Application"** (o "Storage" in Firefox)
3. Nel menu a sinistra, espandi **"Cookies"**
4. Clicca su **"https://stackmoneyup.com"**

#### **Passo 1.4: Trova il Token**

1. Nella lista dei cookies, cerca uno chiamato:
   - `sb-qhxettplmhkwmmcgrcef-auth-token`
   - Oppure qualcosa simile con "auth-token" nel nome

2. **Clicca** su quel cookie

3. Nella parte destra, vedrai un campo **"Value"** (o "Valore")
   - Il valore sarà MOLTO LUNGO (tipo 200+ caratteri)
   - Sembra: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **COPIA TUTTO IL VALORE** (Ctrl+C o click destro → Copy)

5. **SALVALO DA QUALCHE PARTE** (blocco note, file di testo, ecc.)
   - Ti servirà tra poco!

---

## 🖥️ **STEP 2: Apri il Terminale**

### **Su Windows:**

1. Premi **Windows + R**
2. Scrivi: `powershell`
3. Premi **Invio**
4. Si aprirà una finestra nera (PowerShell)

### **Su Mac/Linux:**

1. Premi **Cmd + Spazio** (Mac) o **Ctrl + Alt + T** (Linux)
2. Scrivi: `terminal`
3. Premi **Invio**

---

## 📝 **STEP 3: Prepara il File JSON**

Creiamo un file con i dati del post da creare.

### **Passo 3.1: Crea un File di Test**

1. Nel terminale, vai nella cartella del progetto:
   ```powershell
   cd C:\Users\fcarp\Desktop\Projects\stackmoneyup
   ```

2. Verifica che esista il file `test-api-with-charts.json`:
   ```powershell
   dir test-api-with-charts.json
   ```
   
   Se esiste, perfetto! Altrimenti, creiamolo.

### **Passo 3.2: Crea il File (se non esiste)**

Apri un editor di testo (Notepad, VS Code, ecc.) e crea un file chiamato `test-simple.json` con questo contenuto:

```json
{
  "title_en": "Test Post from cURL",
  "title_it": "Post di Test da cURL",
  "title_es": "Post de Prueba de cURL",
  "excerpt_en": "This is a simple test post created using cURL command.",
  "excerpt_it": "Questo è un semplice post di test creato usando il comando cURL.",
  "excerpt_es": "Esta es una publicación de prueba simple creada usando el comando cURL.",
  "content_en": "# Test Post\n\nThis is a test post created via API.\n\n## What is this?\n\nThis post was created automatically using cURL!\n\n## Next Steps\n\n1. Review the post\n2. Edit if needed\n3. Publish when ready",
  "content_it": "# Post di Test\n\nQuesto è un post di test creato via API.\n\n## Cos'\''è questo?\n\nQuesto post è stato creato automaticamente usando cURL!\n\n## Prossimi Passi\n\n1. Rivedi il post\n2. Modifica se necessario\n3. Pubblica quando pronto",
  "content_es": "# Post de Prueba\n\nEsta es una publicación de prueba creada vía API.\n\n## ¿Qué es esto?\n\n¡Esta publicación fue creada automáticamente usando cURL!\n\n## Próximos Pasos\n\n1. Revisa la publicación\n2. Edita si es necesario\n3. Publica cuando esté lista",
  "category": "Investing",
  "tags": ["test", "api", "curl"]
}
```

**SALVA** il file come `test-simple.json` nella cartella del progetto.

---

## 🚀 **STEP 4: Esegui il Comando cURL**

### **Passo 4.1: Prepara il Comando**

Nel terminale PowerShell, scrivi questo comando:

```powershell
curl -X POST https://stackmoneyup.com/api/blog/create `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TUO_TOKEN_QUI" `
  -d @test-simple.json
```

**IMPORTANTE:** Sostituisci `TUO_TOKEN_QUI` con il token che hai copiato prima!

### **Passo 4.2: Esempio Completo**

Se il tuo token è `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, il comando sarà:

```powershell
curl -X POST https://stackmoneyup.com/api/blog/create `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." `
  -d @test-simple.json
```

### **Passo 4.3: Esegui**

1. **Copia** il comando completo (con il tuo token)
2. **Incolla** nel terminale PowerShell
3. Premi **Invio**

---

## ✅ **STEP 5: Verifica il Risultato**

### **Cosa Aspettarsi:**

Se tutto va bene, vedrai una risposta tipo:

```json
{
  "success": true,
  "message": "Post created successfully as DRAFT...",
  "post": {
    "id": "qualche-uuid",
    "slug": "test-post-from-curl",
    "title": {
      "en": "Test Post from cURL",
      ...
    },
    "published": false,
    ...
  }
}
```

### **Se Vedi Errori:**

#### **❌ Error 401 - Unauthorized**
```
{"error": "Unauthorized. Please log in."}
```
**Soluzione:** Il token non è valido. Ripeti lo STEP 1 e copia di nuovo il token.

#### **❌ Error 403 - Forbidden**
```
{"error": "Forbidden. Only editors and admins can create posts."}
```
**Soluzione:** Il tuo account non ha i permessi. Contatta un admin per aggiornare il tuo ruolo.

#### **❌ Error 400 - Bad Request**
```
{"error": "Missing required fields", "missing_fields": [...]}
```
**Soluzione:** Controlla che il file JSON abbia tutti i campi richiesti.

---

## 👀 **STEP 6: Vedi il Post Creato**

### **Passo 6.1: Vai alla Dashboard**

1. Apri il browser
2. Vai su: **https://stackmoneyup.com/en/dashboard**
3. Dovresti vedere il nuovo post nella lista (con status **DRAFT**)

### **Passo 6.2: Modifica il Post**

1. **Clicca** sul post che hai appena creato
2. Oppure vai direttamente a:
   ```
   https://stackmoneyup.com/dashboard/edit/test-post-from-curl
   ```
   (sostituisci `test-post-from-curl` con lo slug che hai ricevuto)

### **Passo 6.3: Preview**

1. Nella pagina di edit, scorri in basso
2. Clicca su **"Preview"**
3. Dovresti vedere il post come lo vedranno i lettori!

### **Passo 6.4: Pubblica (Opzionale)**

Se il post ti piace:
1. Scorri in fondo alla pagina
2. Spunta la casella **"Published"**
3. Clicca **"Update Post"**
4. Il post sarà ora LIVE sul sito!

---

## 🎉 **SUCCESSO!**

Se hai visto il post nella dashboard, **HAI FATTO TUTTO CORRETTAMENTE!** 🎊

---

## 📚 **PROSSIMI PASSI:**

### **1. Prova con un Grafico**

Modifica il file JSON e aggiungi un grafico:

```json
{
  "content_en": "# Test with Chart\n\nHere's a chart:\n\n[chart:line title=\"Test Chart\" labels=\"A,B,C\" datasets='[{\"label\":\"Data\",\"data\":[10,20,30]}]' height=\"300\" currency=\"€\" /]\n\nCool, right?",
  ...
}
```

Poi esegui di nuovo il comando cURL!

### **2. Usa il File con 3 Grafici**

Prova con il file completo:
```powershell
curl -X POST https://stackmoneyup.com/api/blog/create `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TUO_TOKEN_QUI" `
  -d @test-api-with-charts.json
```

### **3. Integra con CrewAI**

Ora che sai come funziona, puoi integrare con i tuoi agenti CrewAI usando:
- `scripts/crewai_blog_tool.py`
- `CREWAI_INTEGRATION_GUIDE.md`

---

## 🆘 **HAI PROBLEMI?**

### **Il token non funziona?**
- Assicurati di aver copiato TUTTO il valore (è molto lungo!)
- Prova a fare logout e login di nuovo, poi copia un nuovo token

### **Il comando cURL non funziona?**
- Verifica di essere nella cartella giusta (`cd` nella cartella del progetto)
- Controlla che il file JSON esista (`dir test-simple.json`)
- Assicurati di aver sostituito `TUO_TOKEN_QUI` con il token reale

### **Non vedi il post nella dashboard?**
- Controlla che la risposta dell'API sia stata `success: true`
- Verifica di essere loggato come admin/editor
- Controlla la lista dei post (potrebbe essere in fondo)

---

## 📞 **HAI BISOGNO DI AIUTO?**

Se qualcosa non funziona:
1. Controlla i messaggi di errore nel terminale
2. Leggi la sezione "Troubleshooting" sopra
3. Verifica che tutti gli step siano stati completati

---

**Buona fortuna! 🚀**

