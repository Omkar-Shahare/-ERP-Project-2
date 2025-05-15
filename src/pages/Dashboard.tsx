import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  MoreHorizontal,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { products, sales, notifications } = useAppContext();
  const navigate = useNavigate();
  
  // Calculate dashboard stats
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= p.threshold).length;
  const totalSales = sales.length;
  
  // Calculate total revenue
  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );
  
  // Get recent sales (last 5)
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get low stock products
  const lowStockProducts = products
    .filter(p => p.quantity <= p.threshold)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your business dashboard</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp size={24} />}
          change="+12.5%"
          isPositive={true}
          color="blue"
        />
        
        <StatCard
          title="Total Sales"
          value={totalSales}
          icon={<ShoppingBag size={24} />}
          change="+8.2%"
          isPositive={true}
          color="green"
        />
        
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} />}
          color="purple"
        />
        
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<AlertTriangle size={24} />}
          color="amber"
        />
      </div>
      
      {/* Recent Sales and Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
            <button
              onClick={() => navigate('/sales')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentSales.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No sales recorded yet. Create your first sale to see it here.
              </div>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sale.customerName || 'Walk-in Customer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sale.products.length} {sale.products.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {recentSales.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => navigate('/sales')}
              >
                View All Sales
              </Button>
            </div>
          )}
        </div>
        
        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Products</h3>
            <button
              onClick={() => navigate('/inventory')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No low stock products. Your inventory is in good shape!
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {product.imageUrl ? (
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={product.imageUrl} 
                            alt={product.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <Package size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        product.quantity === 0 
                          ? 'text-red-600' 
                          : 'text-amber-600'
                      }`}>
                        {product.quantity} in stock
                      </p>
                      <p className="text-xs text-gray-500">
                        Threshold: {product.threshold}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {lowStockProducts.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <Button 
                variant="warning" 
                fullWidth 
                onClick={() => navigate('/inventory')}
              >
                Manage Inventory
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Sales Summary */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sales Summary</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">This Month</p>
                <ArrowUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(totalRevenue * 0.6)}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                +15% from last month
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-emerald-900">This Week</p>
                <ArrowUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {formatCurrency(totalRevenue * 0.25)}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                +8% from last week
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-amber-900">Today</p>
                <ArrowDown size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {formatCurrency(totalRevenue * 0.05)}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                -3% from yesterday
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/reports')}
            >
              View Detailed Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;