'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { createRoot } from 'react-dom/client';
import { extractCharts, replaceChartsWithPlaceholders, type ChartData } from '@/lib/shortcodes';
import { LineChart, BarChart, PieChart } from '@/components/charts';

interface BlogContentWithChartsProps {
  content: string;
  className?: string;
}

/**
 * Renders blog post content with embedded charts
 * Parses shortcodes like [chart:line ...] and renders Chart.js components
 */
export default function BlogContentWithCharts({
  content,
  className = '',
}: BlogContentWithChartsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Extract all chart data from content
    const charts = extractCharts(content);

    if (charts.length === 0) return;

    // Find all chart placeholders and render charts
    const placeholders = contentRef.current.querySelectorAll('[data-chart-placeholder]');

    placeholders.forEach((placeholder, index) => {
      const chart = charts[index];
      if (!chart) return;

      // Create a container for the React component
      const container = document.createElement('div');
      placeholder.replaceWith(container);

      // Render the appropriate chart component
      const root = createRoot(container);

      switch (chart.type) {
        case 'line':
          root.render(
            <LineChart
              title={chart.title}
              labels={chart.labels}
              datasets={chart.datasets || []}
              height={chart.height}
              currency={chart.currency}
            />
          );
          break;

        case 'bar':
          root.render(
            <BarChart
              title={chart.title}
              labels={chart.labels}
              datasets={chart.datasets || []}
              height={chart.height}
              currency={chart.currency}
            />
          );
          break;

        case 'pie':
          root.render(
            <PieChart
              title={chart.title}
              labels={chart.labels}
              data={chart.data || []}
              height={chart.height}
              currency={chart.currency}
            />
          );
          break;
      }
    });
  }, [content]);

  // Replace chart shortcodes with placeholders
  const processedContent = replaceChartsWithPlaceholders(content);

  return (
    <div ref={contentRef} className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold mb-6 mt-8" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold mb-4 mt-6" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold mb-3 mt-4" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-emerald-600 hover:text-emerald-700 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-emerald-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
                {...props}
              />
            ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

