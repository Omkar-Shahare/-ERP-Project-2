import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import ReportFilters from '../components/reports/ReportFilters';
import SalesSummary from '../components/reports/SalesSummary';
import TopProducts from '../components/reports/TopProducts';
import SalesChart from '../components/reports/SalesChart';

const Reports: React.FC = () => {
  const { products, sales } = useAppContext();
  
  // Get unique product categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Report filters state
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [category, setCategory] = useState<string>('');
  const [filteredSales, setFilteredSales] = useState(sales);
  
  // Apply filters to sales data
  const applyFilters = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of the day
    
    let filtered = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= start && saleDate <= end;
    });
    
    if (category) {
      filtered = filtered.filter(sale => {
        return sale.products.some(item => {
          const product = products.find(p => p.id === item.productId);
          return product && product.category === category;
        });
      });
    }
    
    setFilteredSales(filtered);
  };
  
  // Reset filters
  const resetFilters = () => {
    const date = new Date();
    setStartDate(new Date(date.setMonth(date.getMonth() - 1)).toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    applyFilters();
  };
  
  // Apply filters on component mount
  useEffect(() => {
    applyFilters();
  }, []);
  
  // Calculate report metrics
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  // Calculate total profit (revenue - cost)
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const saleProfit = sale.products.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const itemProfit = (item.unitPrice - product.costPrice) * item.quantity;
        return itemSum + itemProfit;
      }
      return itemSum;
    }, 0);
    
    return sum + saleProfit;
  }, 0);
  
  // Calculate profit margin
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Calculate average order value
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Get top selling products
  const productSalesMap = new Map();
  
  filteredSales.forEach(sale => {
    sale.products.forEach(item => {
      const existingProduct = productSalesMap.get(item.productId);
      
      if (existingProduct) {
        existingProduct.quantity += item.quantity;
        existingProduct.revenue += item.totalPrice;
      } else {
        productSalesMap.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          revenue: item.totalPrice,
        });
      }
    });
  });
  
  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  // Prepare sales chart data
  const salesByDay = new Map();
  
  filteredSales.forEach(sale => {
    const dateStr = new Date(sale.date).toISOString().split('T')[0];
    
    const existingData = salesByDay.get(dateStr);
    if (existingData) {
      existingData.sales += 1;
      existingData.revenue += sale.totalAmount;
    } else {
      salesByDay.set(dateStr, {
        date: dateStr,
        sales: 1,
        revenue: sale.totalAmount,
      });
    }
  });
  
  const salesChartData = Array.from(salesByDay.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Analyze sales data and business performance</p>
      </div>
      
      {/* Report filters */}
      <ReportFilters
        startDate={startDate}
        endDate={endDate}
        category={category}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategory}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        categories={categories}
      />
      
      {/* Sales summary */}
      <SalesSummary
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        profitMargin={profitMargin}
        averageOrderValue={averageOrderValue}
      />
      
      {/* Sales chart */}
      <SalesChart salesData={salesChartData} />
      
      {/* Top products */}
      <TopProducts products={topProducts} />
    </div>
  );
};

export default Reports;