import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale, Notification, User } from '../types';
import { generateId } from '../utils/formatters';

interface AppContextType {
  // State
  products: Product[];
  sales: Sale[];
  notifications: Notification[];
  currentUser: User | null;
  // Product methods
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Sale methods
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  // Notification methods
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  // User methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const API_URL = 'http://localhost:5000/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  // Authentication methods
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Product management methods
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        const updated = products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        setProducts(updated);
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // Sale management methods
  const addSale = async (saleData: Omit<Sale, 'id' | 'date'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        const newSale = await response.json();
        setSales([...sales, newSale]);

        // Update product quantities
        const updatedProducts = [...products];
        saleData.products.forEach((item) => {
          const productIndex = updatedProducts.findIndex((p) => p.id === item.productId);
          if (productIndex !== -1) {
            const product = updatedProducts[productIndex];
            const newQuantity = product.quantity - item.quantity;
            updatedProducts[productIndex] = {
              ...product,
              quantity: newQuantity,
              updatedAt: new Date(),
            };

            // Create low stock notification if needed
            if (newQuantity <= product.threshold && newQuantity > 0) {
              const notification: Notification = {
                id: generateId(),
                title: 'Low Stock Alert',
                message: `${product.name} is running low on stock (${newQuantity} remaining)`,
                type: 'warning',
                read: false,
                date: new Date(),
              };
              setNotifications([notification, ...notifications]);
            } else if (newQuantity <= 0) {
              const notification: Notification = {
                id: generateId(),
                title: 'Out of Stock Alert',
                message: `${product.name} is now out of stock!`,
                type: 'error',
                read: false,
                date: new Date(),
              };
              setNotifications([notification, ...notifications]);
            }
          }
        });
        
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Failed to add sale:', error);
    }
  };

  // Notification management methods
  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch products
        const productsResponse = await fetch(`${API_URL}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        // Fetch sales
        const salesResponse = await fetch(`${API_URL}/sales`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          setSales(salesData);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        notifications,
        currentUser,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        markNotificationAsRead,
        clearNotifications,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};