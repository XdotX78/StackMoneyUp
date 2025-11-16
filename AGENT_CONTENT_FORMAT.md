# 📝 Agent Content Format Guide

**How CrewAI agents send content and how it's processed.**

---

## ✅ Current Flow (After Our Fix)

### 1. **Agent Writes Content**
- **Format:** Markdown ✅
- **Example:**
  ```markdown
  # Hello from StackMoneyUp
  
  This is a test article with **bold text**.
  
  ## Subheading
  
  - Bullet point 1
  - Bullet point 2
  
  [Link to something](https://example.com)
  
  [chart:line title="Test Chart" labels="A,B,C" datasets='[{"label":"Data","data":[10,20,30]}]' height="300" currency="€" /]
  ```

### 2. **Tool Sends to API**
- **Format:** JSON payload with Markdown content
- **Example:**
  ```json
  {
    "title_en": "Hello from StackMoneyUp",
    "content_en": "# Hello from StackMoneyUp\n\nThis is a test...",
    "category": "Money Mindset",
    "tags": ["test", "system-check"]
  }
  ```

### 3. **API Converts (Automatic)**
- **Input:** Markdown/HTML from agent
- **Process:** Converts to TipTap JSON format
- **Output:** TipTap JSON structure
- **Location:** `src/lib/contentConverter.ts`

### 4. **Database Storage**
- **Format:** TipTap JSON ✅
- **Example:**
  ```json
  {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Hello from StackMoneyUp" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "This is a test..." }]
      }
    ]
  }
  ```

### 5. **Editor Display**
- **Format:** TipTap JSON (loaded directly)
- **Result:** ✅ Works perfectly, no errors!

### 6. **Website Display**
- **Format:** HTML (converted from TipTap JSON)
- **Result:** Beautiful rendered content

---

## 🎯 Summary

**Agent Perspective:**
- ✅ Write in Markdown (easy for AI)
- ✅ Include chart shortcodes
- ✅ Use formatting (headers, lists, links, bold, etc.)
- ✅ Send as JSON payload

**System Handles:**
- ✅ Converts Markdown → TipTap JSON automatically
- ✅ Stores as JSON (consistent format)
- ✅ Editor works perfectly
- ✅ Website displays as HTML

---

## ✅ What This Means

**For Agents:**
- Keep writing in Markdown! ✅
- No changes needed ✅
- Chart shortcodes work ✅
- All formatting supported ✅

**For You:**
- All content stored consistently (JSON) ✅
- Editor works without errors ✅
- Easy to edit and manage ✅
- Beautiful display on website ✅

---

## 📋 Supported Markdown Features

- ✅ Headers (`#`, `##`, `###`, `####`)
- ✅ Bold (`**text**` or `__text__`)
- ✅ Italic (`*text*` or `_text_`)
- ✅ Links (`[text](url)`)
- ✅ Code (`\`code\``)
- ✅ Paragraphs (line breaks)
- ✅ Chart shortcodes (`[chart:line ...]`)

---

**Perfect! Agents can keep using Markdown, and everything works automatically!** 🚀


