# 📊 Chart Shortcodes Guide

Complete guide for embedding interactive charts in blog posts using shortcodes.

---

## 🎯 **Overview**

StackMoneyUp supports interactive financial charts powered by Chart.js. You can embed charts directly in your markdown content using simple shortcodes.

**Supported Chart Types:**
- 📈 **Line Chart** - For trends over time (compound interest, growth)
- 📊 **Bar Chart** - For comparisons (budgets, expenses)
- 🥧 **Pie Chart** - For distributions (portfolio allocation)

---

## 📝 **Syntax**

All charts use this format:

```
[chart:TYPE attribute1="value1" attribute2="value2" ... /]
```

**Important:**
- Charts must be on their own line
- Use double quotes `"` for attribute values
- Close with `  /]` (space before slash)
- Datasets use JSON format

---

## 📈 **Line Chart**

Perfect for showing growth over time (compound interest, investment returns, savings growth).

### **Syntax:**

```
[chart:line 
  title="Chart Title" 
  labels="Label1,Label2,Label3" 
  datasets='[{"label":"Series 1","data":[10,20,30]},{"label":"Series 2","data":[15,25,35]}]'
  height="400" 
  currency="€" 
/]
```

### **Attributes:**

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `title` | No | Chart title | `"Compound Interest Growth"` |
| `labels` | Yes | X-axis labels (comma-separated) | `"Year 10,Year 20,Year 30"` |
| `datasets` | Yes | Data series (JSON array) | See below |
| `height` | No | Chart height in pixels | `"400"` (default: 300) |
| `currency` | No | Currency symbol | `"€"` or `"$"` (default: €) |

### **Datasets Format:**

```json
[
  {
    "label": "€100/month",
    "data": [17308, 52093, 122709]
  },
  {
    "label": "€200/month",
    "data": [34616, 104186, 245418]
  }
]
```

### **Example 1: Compound Interest**

```markdown
# The Power of Compound Interest

When you invest consistently, compound interest works magic:

[chart:line title="Investment Growth (7% annual return)" labels="10 years,20 years,30 years" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]},{"label":"€500/month","data":[86540,260465,306772]}]' height="450" currency="€" /]

As you can see, doubling your monthly investment more than doubles your final amount!
```

### **Example 2: Stock Market Performance**

```markdown
[chart:line title="S&P 500 Historical Returns" labels="1 year,5 years,10 years,20 years" datasets='[{"label":"Average Return","data":[10.5,14.3,13.8,10.2]}]' height="350" currency="%" /]
```

---

## 📊 **Bar Chart**

Perfect for comparisons (monthly budgets, expense categories, income sources).

### **Syntax:**

```
[chart:bar 
  title="Chart Title" 
  labels="Category1,Category2,Category3" 
  datasets='[{"label":"Budget","data":[1200,400,300]}]'
  height="400" 
  currency="€" 
/]
```

### **Attributes:**

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `title` | No | Chart title | `"Monthly Budget"` |
| `labels` | Yes | Category labels (comma-separated) | `"Housing,Food,Transport"` |
| `datasets` | Yes | Data series (JSON array) | See below |
| `height` | No | Chart height in pixels | `"350"` (default: 300) |
| `currency` | No | Currency symbol | `"€"` or `"$"` (default: €) |

### **Example 1: Monthly Budget**

```markdown
# My Monthly Budget Breakdown

Here's how I allocate my €2,600 monthly income:

[chart:bar title="Monthly Budget Allocation" labels="Housing,Food,Transport,Savings,Entertainment,Utilities" datasets='[{"label":"Monthly Budget","data":[1200,400,200,500,200,100]}]' height="400" currency="€" /]

Notice that savings come **before** entertainment!
```

### **Example 2: Budget vs Actual Spending**

```markdown
[chart:bar title="Budget vs Actual Spending" labels="Housing,Food,Transport,Entertainment" datasets='[{"label":"Budget","data":[1200,400,200,300]},{"label":"Actual","data":[1200,450,180,250]}]' height="400" currency="€" /]
```

---

## 🥧 **Pie Chart**

Perfect for showing distributions (portfolio allocation, expense breakdown by percentage).

### **Syntax:**

```
[chart:pie 
  title="Chart Title" 
  labels="Category1,Category2,Category3" 
  data="50,30,20"
  height="400" 
  currency="€" 
/]
```

### **Attributes:**

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `title` | No | Chart title | `"Portfolio Distribution"` |
| `labels` | Yes | Slice labels (comma-separated) | `"Stocks,Bonds,Cash"` |
| `data` | Yes | Values (comma-separated) | `"60,30,10"` |
| `height` | No | Chart height in pixels | `"400"` (default: 300) |
| `currency` | No | Currency symbol | `"€"` or `"$"` (default: €) |

### **Example 1: Investment Portfolio**

```markdown
# My Investment Portfolio

After 5 years of investing, here's my asset allocation:

[chart:pie title="Portfolio Distribution (€50,000 total)" labels="Stocks,Bonds,Real Estate,Cash" data="30000,10000,8000,2000" height="400" currency="€" /]

I keep 4% in cash for emergencies.
```

### **Example 2: Expense Categories**

```markdown
[chart:pie title="Where My Money Goes" labels="Housing,Food,Transport,Savings,Entertainment,Utilities" data="1200,400,200,500,200,100" height="400" currency="€" /]
```

---

## 🤖 **For AI Agents**

When generating blog posts via the API, include chart shortcodes in the `content_en`, `content_it`, and `content_es` fields.

### **Example API Request:**

```json
{
  "title_en": "Compound Interest Calculator",
  "content_en": "# The Power of Compound Interest\n\nLet's visualize how your money grows:\n\n[chart:line title=\"Investment Growth\" labels=\"10 years,20 years,30 years\" datasets='[{\"label\":\"€100/month\",\"data\":[17308,52093,122709]}]' height=\"400\" currency=\"€\" /]\n\nStart investing today!",
  
  "title_it": "Calcolatore di Interesse Composto",
  "content_it": "# Il Potere dell'Interesse Composto\n\nVisualizziamo come crescono i tuoi soldi:\n\n[chart:line title=\"Crescita Investimento\" labels=\"10 anni,20 anni,30 anni\" datasets='[{\"label\":\"€100/mese\",\"data\":[17308,52093,122709]}]' height=\"400\" currency=\"€\" /]\n\nInizia a investire oggi!",
  
  "category": "Investing",
  "tags": ["compound-interest", "investing", "charts"]
}
```

---

## 💡 **Best Practices**

### **1. Use Descriptive Titles**
```
✅ Good: "Investment Growth Over 30 Years"
❌ Bad: "Chart 1"
```

### **2. Keep Data Simple**
- Max 5-7 data points for line/bar charts
- Max 6-8 slices for pie charts
- Too many data points make charts unreadable

### **3. Use Appropriate Chart Types**
- **Time series?** → Line Chart
- **Comparisons?** → Bar Chart
- **Percentages/Distribution?** → Pie Chart

### **4. Add Context**
Always explain the chart before and after:

```markdown
Here's how much you'd have after 30 years of consistent investing:

[chart:line ... /]

As you can see, starting early makes a huge difference!
```

### **5. Match Currency to Content**
- European audience → `currency="€"`
- US audience → `currency="$"`
- Percentages → `currency="%"`

---

## 🔍 **Common Examples**

### **Compound Interest (Most Common)**

```markdown
[chart:line title="€100 Monthly Investment (7% annual return)" labels="5 years,10 years,15 years,20 years,25 years,30 years" datasets='[{"label":"Total Value","data":[7201,17308,30067,52093,81524,122709]}]' height="450" currency="€" /]
```

### **50/30/20 Budget Rule**

```markdown
[chart:pie title="50/30/20 Budget Rule (€2,000 income)" labels="Needs (50%),Wants (30%),Savings (20%)" data="1000,600,400" height="400" currency="€" /]
```

### **Debt Payoff Comparison**

```markdown
[chart:bar title="Debt Payoff: Snowball vs Avalanche" labels="Month 6,Month 12,Month 18,Month 24" datasets='[{"label":"Snowball Method","data":[5000,8000,12000,15000]},{"label":"Avalanche Method","data":[6000,10000,14000,16500]}]' height="400" currency="€" /]
```

### **Emergency Fund Growth**

```markdown
[chart:line title="Emergency Fund Goal: €10,000" labels="Month 3,Month 6,Month 9,Month 12" datasets='[{"label":"Actual","data":[1500,3200,5800,8500]},{"label":"Goal","data":[2500,5000,7500,10000]}]' height="400" currency="€" /]
```

---

## ⚠️ **Troubleshooting**

### **Chart not showing?**
- Check shortcode syntax (space before `/]`)
- Ensure datasets use single quotes for the attribute, double quotes inside JSON
- Verify JSON is valid (use a JSON validator)

### **Data not aligned?**
- Number of labels must match number of data points in each dataset
- Example: 3 labels → each dataset must have 3 values

### **Colors look weird?**
- Colors are auto-generated
- Each dataset gets a unique color
- No way to customize colors (by design, for consistency)

---

## 📚 **Additional Resources**

- Chart.js Documentation: https://www.chartjs.org/
- JSON Validator: https://jsonlint.com/
- Financial Calculators: Coming soon!

---

**Last Updated:** January 2025  
**Version:** 1.0

For questions or issues, contact the development team.

