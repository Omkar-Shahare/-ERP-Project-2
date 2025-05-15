import React, { useRef, useEffect } from 'react';

interface SalesChartProps {
  salesData: {
    date: string;
    sales: number;
    revenue: number;
  }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ salesData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (salesData.length === 0 || !canvasRef.current) return;
    
    // This is a simplified chart implementation for demonstration
    // In a real application, you would use a charting library like Chart.js
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set canvas dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;
    
    // Find max revenue for scaling
    const maxRevenue = Math.max(...salesData.map(d => d.revenue), 1);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw bars
    const barWidth = (width - 2 * padding) / salesData.length - 4;
    
    salesData.forEach((data, i) => {
      const x = padding + i * ((width - 2 * padding) / salesData.length) + 2;
      const barHeight = ((height - 2 * padding) * data.revenue) / maxRevenue;
      const y = height - padding - barHeight;
      
      // Draw bar
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw date label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      const shortDate = new Date(data.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      ctx.fillText(shortDate, x + barWidth / 2, height - padding + 15);
    });
    
    // Draw revenue labels on y-axis
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (height - 2 * padding)) / 5;
      const value = (i * maxRevenue) / 5;
      ctx.fillText(
        value >= 1000
          ? `₹${(value / 1000).toFixed(0)}K`
          : `₹${value.toFixed(0)}`,
        padding - 5,
        y + 3
      );
      
      // Draw horizontal grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
  }, [salesData]);
  
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-medium text-gray-900">Sales Trend</h3>
      </div>
      
      {salesData.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No sales data available for the selected period.
        </div>
      ) : (
        <div className="p-4">
          <canvas 
            ref={canvasRef} 
            width="800" 
            height="300" 
            className="w-full h-auto"
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default SalesChart;