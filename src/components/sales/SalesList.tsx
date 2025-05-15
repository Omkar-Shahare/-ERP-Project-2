import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';
import SaleForm from './SaleForm';

const SalesList: React.FC = () => {
  const { sales } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSale, setExpandedSale] = useState<string | null>(null);

  // Filter sales based on search term
  const filteredSales = sales
    .filter(
      (sale) =>
        sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.products.some((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Toggle sale details
  const toggleSaleDetails = (id: string) => {
    if (expandedSale === id) {
      setExpandedSale(null);
    } else {
      setExpandedSale(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header section */}
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex flex-wrap items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Sales History</h3>
        
        <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add sale button */}
          <Button 
            variant="primary" 
            size="md" 
            icon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
          >
            New Sale
          </Button>
        </div>
      </div>
      
      {/* Sales list */}
      <div className="overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No sales found. Try a different search or create a new sale.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <li key={sale.id}>
                <div 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleSaleDetails(sale.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(sale.date)}
                      </div>
                      <div className="sm:ml-4 text-sm text-gray-500">
                        {sale.customerName ? (
                          <span>Customer: {sale.customerName}</span>
                        ) : (
                          <span>Walk-in Customer</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(sale.totalAmount)}
                      </div>
                      
                      <div>
                        {expandedSale === sale.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary of items */}
                  <div className="mt-2 text-sm text-gray-500">
                    {sale.products.length === 1 ? (
                      <span>{sale.products[0].productName}</span>
                    ) : (
                      <span>{sale.products.length} products</span>
                    )}
                  </div>
                </div>
                
                {/* Expanded sale details */}
                {expandedSale === sale.id && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="mb-3 flex flex-wrap justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium">{sale.paymentMethod}</p>
                      </div>
                      
                      {sale.customerPhone && (
                        <div className="mt-2 sm:mt-0">
                          <p className="text-xs text-gray-500">Customer Phone</p>
                          <p className="text-sm font-medium">{sale.customerPhone}</p>
                        </div>
                      )}
                      
                      {sale.notes && (
                        <div className="mt-2 sm:mt-0">
                          <p className="text-xs text-gray-500">Notes</p>
                          <p className="text-sm">{sale.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">Products</p>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qty
                            </th>
                            <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sale.products.map((item, index) => (
                            <tr key={index} className="text-sm">
                              <td className="px-2 py-2 whitespace-nowrap text-gray-900">
                                {item.productName}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-gray-900 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-gray-900 text-right">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-gray-900 text-right font-medium">
                                {formatCurrency(item.totalPrice)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                              Total
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                              {formatCurrency(sale.totalAmount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* New sale modal */}
      {showAddModal && (
        <SaleForm 
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
};

export default SalesList;