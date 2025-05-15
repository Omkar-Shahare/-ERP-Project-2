import React from 'react';
import SalesList from '../components/sales/SalesList';

const Sales: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
        <p className="text-gray-600">Create new sales and view sales history</p>
      </div>
      
      <SalesList />
    </div>
  );
};

export default Sales;