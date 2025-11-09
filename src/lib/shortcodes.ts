/**
 * Shortcode Parser for Blog Posts
 * ================================
 * 
 * Parses custom shortcodes in markdown content and extracts chart data.
 * 
 * Supported shortcodes:
 * - [chart:line] - Line chart for trends over time
 * - [chart:bar] - Bar chart for comparisons
 * - [chart:pie] - Pie chart for distributions
 */

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  id: string;
  title?: string;
  labels: string[];
  datasets?: {
    label: string;
    data: number[];
  }[];
  data?: number[]; // For pie charts (single dataset)
  height?: number;
  currency?: string;
}

/**
 * Extract all chart shortcodes from markdown content
 */
export function extractCharts(content: string): ChartData[] {
  const charts: ChartData[] = [];
  
  // Regex to match [chart:type ...attributes... /]
  // Note: Using [\s\S] instead of . with 's' flag for compatibility
  const chartRegex = /\[chart:(line|bar|pie)\s+([\s\S]*?)\s*\/\]/g;
  
  let match;
  let chartIndex = 0;
  
  while ((match = chartRegex.exec(content)) !== null) {
    const type = match[1] as 'line' | 'bar' | 'pie';
    const attributes = match[2];
    
    try {
      const chart = parseChartAttributes(type, attributes, `chart-${chartIndex}`);
      charts.push(chart);
      chartIndex++;
    } catch (error) {
      console.error('Failed to parse chart shortcode:', error);
    }
  }
  
  return charts;
}

/**
 * Parse chart attributes from shortcode
 */
function parseChartAttributes(
  type: 'line' | 'bar' | 'pie',
  attributesString: string,
  id: string
): ChartData {
  const attributes: Record<string, string> = {};
  
  // Extract attributes (key="value" or key='value')
  const attrRegex = /(\w+)=["']([^"']*?)["']/g;
  let match;
  
  while ((match = attrRegex.exec(attributesString)) !== null) {
    attributes[match[1]] = match[2];
  }
  
  // Parse labels (comma-separated)
  const labels = attributes.labels
    ? attributes.labels.split(',').map(l => l.trim())
    : [];
  
  // Parse datasets (JSON format)
  let datasets: { label: string; data: number[] }[] | undefined;
  let data: number[] | undefined;
  
  if (type === 'pie') {
    // Pie chart uses single dataset
    data = attributes.data
      ? attributes.data.split(',').map(d => parseFloat(d.trim()))
      : [];
  } else {
    // Line and Bar charts use multiple datasets
    if (attributes.datasets) {
      try {
        datasets = JSON.parse(attributes.datasets);
      } catch {
        // Fallback: simple comma-separated values
        data = attributes.data
          ? attributes.data.split(',').map(d => parseFloat(d.trim()))
          : [];
        datasets = [{ label: attributes.title || 'Data', data: data }];
      }
    }
  }
  
  return {
    type,
    id,
    title: attributes.title,
    labels,
    datasets,
    data,
    height: attributes.height ? parseInt(attributes.height) : 300,
    currency: attributes.currency || '€',
  };
}

/**
 * Replace chart shortcodes with placeholders for rendering
 */
export function replaceChartsWithPlaceholders(content: string): string {
  let chartIndex = 0;
  
  return content.replace(
    /\[chart:(line|bar|pie)\s+([\s\S]*?)\s*\/\]/g,
    () => {
      const placeholder = `<div data-chart-placeholder="${chartIndex}"></div>`;
      chartIndex++;
      return placeholder;
    }
  );
}

/**
 * Example shortcode usage for documentation:
 * 
 * Line Chart (Compound Interest Example):
 * [chart:line title="Compound Interest Growth" labels="Year 10,Year 20,Year 30" datasets='[{"label":"€100/month","data":[17308,52093,122709]},{"label":"€200/month","data":[34616,104186,245418]}]' height="400" currency="€" /]
 * 
 * Bar Chart (Budget Allocation):
 * [chart:bar title="Monthly Budget Allocation" labels="Housing,Food,Transport,Savings,Entertainment" datasets='[{"label":"Budget","data":[1200,400,200,500,300]}]' height="350" currency="€" /]
 * 
 * Pie Chart (Portfolio Distribution):
 * [chart:pie title="Investment Portfolio" labels="Stocks,Bonds,Real Estate,Cash" data="50,25,20,5" height="400" currency="€" /]
 */

