/**
 * Content Converter Utilities
 * Converts HTML/Markdown to TipTap JSON format
 */

/**
 * Convert HTML/Markdown content to TipTap JSON format
 * This ensures all content in the database is in consistent JSON format
 */
export function convertToTipTapJSON(content: string): string {
  if (!content || content.trim().length === 0) {
    // Return empty TipTap JSON structure
    return JSON.stringify({
      type: 'doc',
      content: []
    });
  }

  // Check if content is already JSON (TipTap format)
  const trimmed = content.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(content);
      // Validate it's a TipTap JSON structure
      if (parsed.type === 'doc' || parsed.type === 'paragraph') {
        return content; // Already valid TipTap JSON
      }
    } catch {
      // Not valid JSON, continue with conversion
    }
  }

  // Convert HTML/Markdown to TipTap JSON
  // Parse HTML first, then convert to TipTap structure
  const htmlContent = parseMarkdownToHTML(content);
  return convertHTMLToTipTapJSON(htmlContent);
}

/**
 * Convert Markdown to HTML (simple implementation)
 */
function parseMarkdownToHTML(markdown: string): string {
  let html = markdown;
  
  // Headings
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags
  if (!html.startsWith('<h') && !html.startsWith('<p')) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

/**
 * Convert HTML to TipTap JSON format
 */
function convertHTMLToTipTapJSON(html: string): string {
  // Remove HTML tags and extract text content
  // Simple approach: convert HTML to paragraphs
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (!textContent) {
    return JSON.stringify({
      type: 'doc',
      content: []
    });
  }

  // Split by paragraphs and convert
  const paragraphs = html.split(/<\/p>|<p>/).filter(p => p.trim().length > 0);
  const tipTapContent: any[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Check for headings
    if (trimmed.match(/^<h1>/)) {
      const text = trimmed.replace(/<\/?h1>/g, '').trim();
      tipTapContent.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: parseHTMLToText(text) }]
      });
    } else if (trimmed.match(/^<h2>/)) {
      const text = trimmed.replace(/<\/?h2>/g, '').trim();
      tipTapContent.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: parseHTMLToText(text) }]
      });
    } else if (trimmed.match(/^<h3>/)) {
      const text = trimmed.replace(/<\/?h3>/g, '').trim();
      tipTapContent.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: parseHTMLToText(text) }]
      });
    } else if (trimmed.match(/^<h4>/)) {
      const text = trimmed.replace(/<\/?h4>/g, '').trim();
      tipTapContent.push({
        type: 'heading',
        attrs: { level: 4 },
        content: [{ type: 'text', text: parseHTMLToText(text) }]
      });
    } else {
      // Regular paragraph
      const text = parseHTMLToText(trimmed);
      if (text) {
        tipTapContent.push({
          type: 'paragraph',
          content: [{ type: 'text', text: text }]
        });
      }
    }
  }

  // If no content, create empty paragraph
  if (tipTapContent.length === 0) {
    tipTapContent.push({
      type: 'paragraph',
      content: []
    });
  }

  return JSON.stringify({
    type: 'doc',
    content: tipTapContent
  });
}

/**
 * Simple HTML to text converter (removes HTML tags and decodes entities)
 */
function parseHTMLToText(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  return text.trim();
}

/**
 * Check if content is already in TipTap JSON format
 */
export function isTipTapJSON(content: string): boolean {
  if (!content || content.trim().length === 0) return false;
  
  const trimmed = content.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return false;
  
  try {
    const parsed = JSON.parse(content);
    return parsed.type === 'doc' || parsed.type === 'paragraph';
  } catch {
    return false;
  }
}

