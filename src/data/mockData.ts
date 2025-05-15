import { Product, Sale, Notification, User } from '../types';
import { generateId } from '../utils/formatters';

// Function to generate dates within the past month
const getRandomDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// Mock products data
const products: Product[] = [
  {
    id: generateId(),
    name: 'Laptop - ProBook 450',
    description: 'High-performance laptop for professionals',
    category: 'Electronics',
    price: 58999,
    costPrice: 45000,
    quantity: 15,
    threshold: 5,
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(60),
    updatedAt: getRandomDate(30),
  },
  {
    id: generateId(),
    name: 'Office Chair - Ergonomic',
    description: 'Comfortable ergonomic chair for office use',
    category: 'Furniture',
    price: 12999,
    costPrice: 8500,
    quantity: 8,
    threshold: 3,
    imageUrl: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(45),
    updatedAt: getRandomDate(20),
  },
  {
    id: generateId(),
    name: 'Wireless Mouse',
    description: 'Bluetooth wireless mouse with long battery life',
    category: 'Accessories',
    price: 1499,
    costPrice: 800,
    quantity: 25,
    threshold: 10,
    imageUrl: 'https://images.pexels.com/photos/5054776/pexels-photo-5054776.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(90),
    updatedAt: getRandomDate(15),
  },
  {
    id: generateId(),
    name: 'Desk Lamp - LED',
    description: 'Adjustable LED desk lamp with multiple brightness levels',
    category: 'Lighting',
    price: 2499,
    costPrice: 1200,
    quantity: 18,
    threshold: 7,
    imageUrl: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(75),
    updatedAt: getRandomDate(10),
  },
  {
    id: generateId(),
    name: 'Notebook Set - Premium',
    description: 'Set of 3 premium hardcover notebooks',
    category: 'Stationery',
    price: 899,
    costPrice: 450,
    quantity: 30,
    threshold: 15,
    imageUrl: 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(50),
    updatedAt: getRandomDate(5),
  },
  {
    id: generateId(),
    name: 'Laser Printer - Monochrome',
    description: 'Fast and reliable monochrome laser printer',
    category: 'Electronics',
    price: 15999,
    costPrice: 11000,
    quantity: 5,
    threshold: 2,
    imageUrl: 'https://images.pexels.com/photos/6010432/pexels-photo-6010432.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(40),
    updatedAt: getRandomDate(3),
  },
  {
    id: generateId(),
    name: 'External Hard Drive - 2TB',
    description: 'Portable external hard drive with 2TB storage',
    category: 'Storage',
    price: 6999,
    costPrice: 4500,
    quantity: 12,
    threshold: 4,
    imageUrl: 'https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: getRandomDate(35),
    updatedAt: getRandomDate(8),
  },
];

// Mock sales data
const sales: Sale[] = [
  {
    id: generateId(),
    products: [
      {
        productId: products[0].id,
        productName: products[0].name,
        quantity: 1,
        unitPrice: products[0].price,
        totalPrice: products[0].price,
      },
      {
        productId: products[2].id,
        productName: products[2].name,
        quantity: 1,
        unitPrice: products[2].price,
        totalPrice: products[2].price,
      },
    ],
    totalAmount: products[0].price + products[2].price,
    paymentMethod: 'Credit Card',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    date: getRandomDate(25),
    notes: 'Business purchase',
  },
  {
    id: generateId(),
    products: [
      {
        productId: products[1].id,
        productName: products[1].name,
        quantity: 2,
        unitPrice: products[1].price,
        totalPrice: products[1].price * 2,
      },
    ],
    totalAmount: products[1].price * 2,
    paymentMethod: 'UPI',
    customerName: 'Priya Patel',
    customerPhone: '8765432109',
    date: getRandomDate(18),
    notes: 'Office setup',
  },
  {
    id: generateId(),
    products: [
      {
        productId: products[4].id,
        productName: products[4].name,
        quantity: 5,
        unitPrice: products[4].price,
        totalPrice: products[4].price * 5,
      },
      {
        productId: products[2].id,
        productName: products[2].name,
        quantity: 3,
        unitPrice: products[2].price,
        totalPrice: products[2].price * 3,
      },
    ],
    totalAmount: (products[4].price * 5) + (products[2].price * 3),
    paymentMethod: 'Cash',
    customerName: 'Amit Kumar',
    customerPhone: '7654321098',
    date: getRandomDate(15),
    notes: 'Bulk purchase for new staff',
  },
  {
    id: generateId(),
    products: [
      {
        productId: products[3].id,
        productName: products[3].name,
        quantity: 2,
        unitPrice: products[3].price,
        totalPrice: products[3].price * 2,
      },
    ],
    totalAmount: products[3].price * 2,
    paymentMethod: 'Net Banking',
    customerName: 'Neha Singh',
    customerPhone: '6543210987',
    date: getRandomDate(10),
    notes: '',
  },
  {
    id: generateId(),
    products: [
      {
        productId: products[5].id,
        productName: products[5].name,
        quantity: 1,
        unitPrice: products[5].price,
        totalPrice: products[5].price,
      },
      {
        productId: products[6].id,
        productName: products[6].name,
        quantity: 2,
        unitPrice: products[6].price,
        totalPrice: products[6].price * 2,
      },
    ],
    totalAmount: products[5].price + (products[6].price * 2),
    paymentMethod: 'Credit Card',
    customerName: 'Rajesh Gupta',
    date: getRandomDate(5),
    notes: 'Office equipment upgrade',
  },
];

// Mock notifications
const notifications: Notification[] = [
  {
    id: generateId(),
    title: 'Low Stock Alert',
    message: `${products[5].name} is running low on stock (${products[5].quantity} remaining)`,
    type: 'warning',
    read: false,
    date: new Date(),
  },
  {
    id: generateId(),
    title: 'New Sale Completed',
    message: `Sale of ₹${sales[0].totalAmount.toLocaleString('en-IN')} was completed successfully`,
    type: 'success',
    read: true,
    date: getRandomDate(2),
  },
  {
    id: generateId(),
    title: 'System Update',
    message: 'The system has been updated to the latest version',
    type: 'info',
    read: false,
    date: getRandomDate(3),
  },
];

// Mock users
const users: User[] = [
  {
    id: generateId(),
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: generateId(),
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: generateId(),
    name: 'Employee User',
    email: 'employee@example.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const currentUser = users[0]; // Default to admin user

export default {
  products,
  sales,
  notifications,
  users,
  currentUser,
};