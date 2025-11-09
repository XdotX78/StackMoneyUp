# 🚀 Metodo SUPER SEMPLICE - Nessun Token!

**Nessun token da copiare! Basta email e password.**

---

## ⚡ **METODO PIÙ VELOCE (2 Minuti)**

### **Step 1: Modifica lo Script**

Apri `scripts/create-post-simple.py` e modifica queste due righe:

```python
EMAIL = "fcarp78@icloud.com"  # 👈 La tua email
PASSWORD = "tua-password-qui"  # 👈 La tua password
```

### **Step 2: Esegui**

```bash
cd C:\Users\fcarp\Desktop\Projects\stackmoneyup
python scripts/create-post-simple.py
```

### **FATTO!** 🎉

Il post viene creato automaticamente. Vai alla dashboard per vederlo!

---

## 🎯 **METODO ANCORA PIÙ SEMPLICE (con File Config)**

### **Step 1: Crea il File Config**

```bash
cd C:\Users\fcarp\Desktop\Projects\stackmoneyup\scripts
copy config.json.example config.json
```

### **Step 2: Modifica config.json**

Apri `scripts/config.json` e modifica:

```json
{
  "email": "tua-email@example.com",
  "password": "tua-password-qui",
  "site_url": "https://stackmoneyup.com"
}
```

### **Step 3: Esegui**

```bash
python scripts/create-post-ultra-simple.py
```

**FATTO!** 🎉

---

## 📋 **Cosa Fa lo Script?**

1. ✅ Fa login automaticamente con email/password
2. ✅ Ottiene il token (automaticamente, non devi copiarlo!)
3. ✅ Crea il post
4. ✅ Ti mostra il link per modificarlo

**Nessun token da copiare, nessun cURL, nessun DevTools!**

---

## 🎨 **Personalizza il Post**

Modifica il contenuto in `scripts/create-post-simple.py`:

```python
post_data = {
    "title_en": "Il Mio Post Personalizzato",
    "title_it": "Il Mio Post Personalizzato",
    "title_es": "Mi Publicación Personalizada",
    # ... modifica qui
}
```

---

## 📊 **Aggiungi Grafici**

Puoi aggiungere grafici nel contenuto:

```python
"content_en": """# Il Mio Post

Ecco un grafico:

[chart:line title="Crescita" labels="10y,20y,30y" datasets='[{"label":"€100/mese","data":[17308,52093,122709]}]' height="400" currency="€" /]

Fantastico!"""
```

---

## ✅ **Vedi il Risultato**

Dopo aver eseguito lo script:

1. Vai su: https://stackmoneyup.com/en/dashboard
2. Trova il nuovo post (status: DRAFT)
3. Clicca per modificarlo
4. Preview per vedere come appare
5. Pubblica quando pronto!

---

## 🆘 **Problemi?**

### **"Login fallito"**
- Controlla email e password
- Assicurati di essere editor/admin

### **"Errore durante la creazione"**
- Controlla la connessione internet
- Verifica che il sito sia online

### **"Module 'requests' not found"**
```bash
pip install requests
```

---

## 🎉 **Questo è Tutto!**

**Nessun token, nessun cURL, nessun DevTools. Solo email, password e un comando!**

Per domande, controlla:
- `scripts/create-post-simple.py` - Script base
- `scripts/create-post-ultra-simple.py` - Con file config
- `CHART_SHORTCODES_GUIDE.md` - Per aggiungere grafici

