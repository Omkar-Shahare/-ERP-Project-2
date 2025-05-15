import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface SalesSummaryProps {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  averageOrderValue: number;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  totalSales,
  totalRevenue,
  totalProfit,
  profitMargin,
  averageOrderValue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-medium text-gray-900">Sales Summary</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalSales}</p>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Total Profit</p>
          <p className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(totalProfit)}
          </p>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Profit Margin</p>
          <p className={`text-2xl font-bold mt-1 ${profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {profitMargin.toFixed(2)}%
          </p>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(averageOrderValue)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;