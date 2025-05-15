// Common types used throughout the application

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  threshold: number; // Low stock threshold
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  products: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  date: Date;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Report {
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  salesByDay: {
    date: string;
    sales: number;
    revenue: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'employee';
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  date: Date;
}