# 🤖 Guida CrewAI - Interfaccia Grafica

Come usare il tool StackMoneyUp nell'interfaccia grafica di CrewAI.

---

## 🎯 **Setup Iniziale (Una Volta Sola)**

### **Step 1: Configura Email e Password**

Hai 2 opzioni:

#### **Opzione A: Variabili d'Ambiente (CONSIGLIATO)**

```bash
# Windows PowerShell
$env:STACKMONEYUP_EMAIL="fcarp78@icloud.com"
$env:STACKMONEYUP_PASSWORD="tua-password-qui"

# Linux/Mac
export STACKMONEYUP_EMAIL="fcarp78@icloud.com"
export STACKMONEYUP_PASSWORD="tua-password-qui"
```

#### **Opzione B: Modifica il File**

Apri `scripts/crewai_simple_tool.py` e modifica:

```python
API_EMAIL = "fcarp78@icloud.com"  # 👈 La tua email
API_PASSWORD = "tua-password-qui"  # 👈 La tua password
```

---

## 🚀 **Uso in CrewAI (Interfaccia Grafica)**

### **Step 1: Importa il Tool**

Nell'interfaccia CrewAI, quando crei un Agent, aggiungi il tool:

```python
from scripts.crewai_simple_tool import create_blog_post_tool
```

### **Step 2: Crea l'Agent**

```python
from crewai import Agent
from scripts.crewai_simple_tool import create_blog_post_tool

blog_writer = Agent(
    role='Financial Blog Writer',
    goal='Create engaging blog posts about personal finance',
    backstory="""You are an expert financial writer.
    You write in English, Italian, and Spanish.
    You always include visual charts when relevant.""",
    tools=[create_blog_post_tool],  # 👈 Il tool è qui!
    verbose=True
)
```

### **Step 3: Crea il Task**

```python
from crewai import Task

write_post_task = Task(
    description="""Create a blog post about compound interest.
    
    Requirements:
    - Title in EN/IT/ES
    - Excerpt in all 3 languages (120-160 chars)
    - Full content in Markdown
    - Include a line chart showing growth over 30 years
      Use: [chart:line title="Investment Growth" labels="10y,20y,30y" datasets='[{"label":"€100/month","data":[17308,52093,122709]}]' height="400" currency="€" /]
    - Category: Investing
    - Tags: compound-interest, investing, long-term
    """,
    agent=blog_writer,
    expected_output="Blog post created successfully with post ID and slug"
)
```

### **Step 4: Esegui il Crew**

```python
from crewai import Crew

crew = Crew(
    agents=[blog_writer],
    tasks=[write_post_task],
    verbose=True
)

result = crew.kickoff()
```

---

## 📋 **Esempio Completo per CrewAI GUI**

Copia e incolla questo codice completo:

```python
from crewai import Agent, Task, Crew
from scripts.crewai_simple_tool import create_blog_post_tool

# 1. Crea l'Agent
blog_writer = Agent(
    role='Financial Blog Writer',
    goal='Create engaging, educational blog posts about personal finance in 3 languages',
    backstory="""You are an expert financial writer with 10+ years of experience.
    You specialize in making complex financial concepts accessible.
    You write fluently in English, Italian, and Spanish.
    You always include interactive charts when showing data.""",
    tools=[create_blog_post_tool],
    verbose=True,
    allow_delegation=False
)

# 2. Crea il Task
write_compound_interest_post = Task(
    description="""Create a comprehensive blog post about compound interest.

    The post must include:
    1. Title in English, Italian, and Spanish
    2. Excerpt in all 3 languages (120-160 characters each)
    3. Full content in Markdown format for all 3 languages
    4. A line chart showing investment growth over 30 years
       Chart shortcode: [chart:line title="Investment Growth (7% return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="450" currency="€" /]
    5. Category: "Investing"
    6. Tags: ["compound-interest", "investing", "long-term", "passive-income"]
    7. Cover image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80"
    
    The content should:
    - Explain what compound interest is
    - Show real examples with numbers
    - Include the interactive chart
    - Give actionable advice
    - Be engaging and easy to understand
    """,
    agent=blog_writer,
    expected_output="Blog post created successfully. Returns post ID, slug, and edit URL."
)

# 3. Crea il Crew
crew = Crew(
    agents=[blog_writer],
    tasks=[write_compound_interest_post],
    verbose=True
)

# 4. Esegui
result = crew.kickoff()
print(result)
```

---

## 🎨 **Personalizza il Tool**

Se vuoi cambiare email/password senza modificare il codice, usa variabili d'ambiente:

```python
import os
os.environ["STACKMONEYUP_EMAIL"] = "tua-email@example.com"
os.environ["STACKMONEYUP_PASSWORD"] = "tua-password"

# Poi importa il tool
from scripts.crewai_simple_tool import create_blog_post_tool
```

---

## 📊 **Aggiungi Grafici nei Post**

Il tool supporta chart shortcodes direttamente nel contenuto:

### **Line Chart (Tendenze)**
```markdown
[chart:line title="Investment Growth" labels="10y,20y,30y" datasets='[{"label":"€100/month","data":[17308,52093,122709]}]' height="400" currency="€" /]
```

### **Bar Chart (Confronti)**
```markdown
[chart:bar title="Monthly Budget" labels="Housing,Food,Savings" datasets='[{"label":"Amount","data":[1200,400,500]}]' height="350" currency="€" /]
```

### **Pie Chart (Distribuzioni)**
```markdown
[chart:pie title="Portfolio" labels="Stocks,Bonds,Cash" data="60,30,10" height="400" currency="€" /]
```

**Vedi:** `CHART_SHORTCODES_GUIDE.md` per esempi completi.

---

## ✅ **Verifica il Risultato**

Dopo che CrewAI ha eseguito il task:

1. Vai su: **https://stackmoneyup.com/en/dashboard**
2. Trova il nuovo post (status: **DRAFT**)
3. Clicca per modificarlo
4. **Preview** per vedere i grafici
5. Pubblica quando pronto!

---

## 🐛 **Troubleshooting**

### **"STACKMONEYUP_PASSWORD non configurato"**

**Soluzione:**
```python
# Aggiungi all'inizio del tuo script CrewAI:
import os
os.environ["STACKMONEYUP_PASSWORD"] = "tua-password"
```

### **"Autenticazione fallita"**

**Soluzione:**
- Controlla email e password
- Assicurati di essere editor/admin

### **"Permessi insufficienti"**

**Soluzione:**
- Il tuo account deve avere ruolo `editor` o `admin`
- Vai su Supabase Dashboard → Authentication → Users
- Cambia il ruolo del tuo user

---

## 🎯 **Workflow Completo**

1. ✅ Configura email/password (una volta)
2. ✅ Importa `create_blog_post_tool` in CrewAI
3. ✅ Aggiungi il tool all'agent
4. ✅ Crea task con descrizione dettagliata
5. ✅ Esegui crew
6. ✅ Vai alla dashboard per vedere il post
7. ✅ Review e pubblica!

---

## 📚 **Risorse**

- **Tool completo:** `scripts/crewai_simple_tool.py`
- **Esempi grafici:** `CHART_SHORTCODES_GUIDE.md`
- **API docs:** `AI_AGENT_API_DOCUMENTATION.md`

---

**Pronto per CrewAI!** 🚀

