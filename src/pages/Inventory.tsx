import React from 'react';
import ProductList from '../components/inventory/ProductList';

const Inventory: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Manage your products, stock levels, and pricing</p>
      </div>
      
      <ProductList />
    </div>
  );
};

export default Inventory;