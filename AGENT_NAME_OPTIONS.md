# 🤖 Agent Name Options

**Choose a name for your AI agent that will appear as the author of articles.**

---

## ✅ Current Setup

**Agent User:**
- Email: `agent+local@example.com`
- Role: `editor`
- **Current Name:** `StackMoneyUp Editorial Team` ✅

---

## 📋 Name Options

### Option 1: Organization Style (Current)
- **Name:** `StackMoneyUp Editorial Team`
- **Pros:** Professional, team-based
- **Use case:** Articles appear as written by editorial team

### Option 2: AI Assistant Style
- **Name:** `StackMoneyUp AI`
- **Pros:** Clear it's AI-generated
- **Use case:** Transparent about AI authorship

### Option 3: Brand Name Only
- **Name:** `StackMoneyUp`
- **Pros:** Simple, brand-focused
- **Use case:** Articles appear as brand content

### Option 4: Editorial Team Variant
- **Name:** `StackMoneyUp Content Team`
- **Pros:** Professional, content-focused
- **Use case:** Emphasizes content creation

### Option 5: Custom Name
- **Name:** `[Your Custom Name]`
- **Pros:** Unique, personalized
- **Use case:** Specific branding

---

## 🔄 How to Change

**Update via SQL:**
```sql
UPDATE profiles 
SET full_name = 'Your Chosen Name' 
WHERE id = '9352cfbe-4f8d-4fa4-af80-6357f2fbf351';
```

**Or via Supabase Dashboard:**
1. Go to Supabase → Table Editor → `profiles`
2. Find user with email `agent+local@example.com`
3. Edit `full_name` field
4. Save

---

## 📝 Current Status

**Agent Name:** `StackMoneyUp Editorial Team` ✅

This name will appear:
- In blog post metadata
- In author fields
- In any author displays

---

**Want to change it?** Let me know what name you prefer!


