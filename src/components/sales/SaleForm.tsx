import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SaleItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface SaleFormProps {
  onClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ onClose }) => {
  const { products, addSale } = useAppContext();
  
  // Form state
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate total
  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  
  // Add a product row
  const addProductRow = () => {
    if (products.length === 0) return;
    
    const availableProducts = products.filter(
      (product) => product.quantity > 0 && 
      !selectedProducts.some((item) => item.productId === product.id)
    );
    
    if (availableProducts.length === 0) return;
    
    const newProduct = availableProducts[0];
    const newItem: SaleItem = {
      productId: newProduct.id,
      productName: newProduct.name,
      quantity: 1,
      unitPrice: newProduct.price,
      totalPrice: newProduct.price,
    };
    
    setSelectedProducts([...selectedProducts, newItem]);
  };
  
  // Remove a product row
  const removeProductRow = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };
  
  // Update product selection
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      productId,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
    };
    
    setSelectedProducts(updatedProducts);
  };
  
  // Update product quantity
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedProducts = [...selectedProducts];
    const item = updatedProducts[index];
    const product = products.find((p) => p.id === item.productId);
    
    if (!product) return;
    
    // Limit quantity to available stock
    const maxQuantity = product.quantity;
    const validQuantity = Math.min(Math.max(1, quantity), maxQuantity);
    
    updatedProducts[index] = {
      ...item,
      quantity: validQuantity,
      totalPrice: validQuantity * item.unitPrice,
    };
    
    setSelectedProducts(updatedProducts);
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }
    
    if (customerPhone && !/^\d{10}$/.test(customerPhone)) {
      newErrors.customerPhone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addSale({
        products: selectedProducts,
        totalAmount,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        paymentMethod,
        notes: notes || undefined,
      });
      
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Initialize with one empty product row
  useEffect(() => {
    if (selectedProducts.length === 0 && products.length > 0) {
      addProductRow();
    }
  }, [products]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Sale
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Products section */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Products</h4>
            
            {selectedProducts.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                No products added yet. Click "Add Product" to start.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProducts.map((item, index) => {
                      const product = products.find((p) => p.id === item.productId);
                      const maxQuantity = product ? product.quantity : 0;
                      
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <select
                              value={item.productId}
                              onChange={(e) => handleProductChange(index, e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              {products
                                .filter((p) => p.quantity > 0 && (p.id === item.productId || !selectedProducts.some((sp) => sp.productId === p.id)))
                                .map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} ({p.quantity} in stock)
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1">
                              <input
                                type="number"
                                min="1"
                                max={maxQuantity}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                className="block w-16 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-right"
                              />
                              <span className="text-xs text-gray-400">/ {maxQuantity}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right font-medium">
                            {formatCurrency(item.totalPrice)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <button
                              type="button"
                              onClick={() => removeProductRow(index)}
                              className="text-red-600 hover:text-red-900"
                              disabled={selectedProducts.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Total row */}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-right font-medium">
                        Total Amount
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right font-bold">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {errors.products && (
              <p className="mt-1 text-sm text-red-600">{errors.products}</p>
            )}
            
            <div className="mt-3">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                icon={<Plus size={16} />}
                onClick={addProductRow}
                disabled={products.filter(
                  (p) => p.quantity > 0 && !selectedProducts.some((item) => item.productId === p.id)
                ).length === 0}
              >
                Add Product
              </Button>
            </div>
          </div>
          
          {/* Customer info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Optional"
              />
            </div>
            
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="10-digit number"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              disabled={selectedProducts.length === 0}
            >
              Complete Sale
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;