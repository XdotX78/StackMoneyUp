'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title?: string;
  labels: string[];
  data: number[];
  height?: number;
  currency?: string;
}

export default function PieChart({
  title,
  labels,
  data,
  height = 300,
  currency = '€',
}: PieChartProps) {
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            return `${label}: ${currency}${new Intl.NumberFormat('en-US').format(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Generate colors dynamically
  const backgroundColors = labels.map(
    (_, index) => `hsla(${index * (360 / labels.length)}, 70%, 60%, 0.8)`
  );
  const borderColors = labels.map(
    (_, index) => `hsl(${index * (360 / labels.length)}, 70%, 50%)`
  );

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div style={{ height: `${height}px` }}>
        <Pie options={options} data={chartData} />
      </div>
    </div>
  );
}

