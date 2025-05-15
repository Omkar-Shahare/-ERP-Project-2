import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  X,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationsDropdown from '../notifications/NotificationsDropdown';

const Header: React.FC = () => {
  const { notifications, currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/' 
    },
    { 
      label: 'Inventory', 
      icon: <Package size={20} />, 
      path: '/inventory' 
    },
    { 
      label: 'Sales', 
      icon: <ShoppingCart size={20} />, 
      path: '/sales' 
    },
    { 
      label: 'Reports', 
      icon: <BarChart3 size={20} />, 
      path: '/reports' 
    },
    { 
      label: 'Users', 
      icon: <Users size={20} />, 
      path: '/users',
      adminOnly: true
    },
    { 
      label: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/settings' 
    },
  ];

  const filteredMenuItems = menuItems.filter(
    item => !item.adminOnly || currentUser?.role === 'admin'
  );
  
  // Get page title
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'ERP System';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and logo */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 ml-2 md:ml-0">
              {getPageTitle()}
            </h1>
          </div>
          
          {/* Right side - Notifications and profile */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <NotificationsDropdown
                  onClose={() => setNotificationsOpen(false)}
                />
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-4">
              <div className="flex items-center">
                {currentUser && (
                  <div className="flex items-center">
                    <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
                      {currentUser.name}
                    </span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser.avatar || 'https://i.pravatar.cc/150?img=1'}
                      alt={currentUser.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 h-16 border-b border-blue-800">
              <h2 className="text-xl font-bold">ERP System</h2>
              <button 
                className="text-white hover:text-blue-200" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            {currentUser && (
              <div className="flex items-center px-6 py-4 border-b border-blue-800">
                <div className="flex-shrink-0">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={currentUser.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={currentUser.name}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-blue-300">{currentUser.role}</p>
                </div>
              </div>
            )}
            
            <nav className="mt-5">
              <ul className="space-y-1 px-2">
                {filteredMenuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-800 text-white'
                          : 'text-blue-100 hover:bg-blue-800'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
                
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-800 transition-colors duration-200"
                  >
                    <LogOut size={20} className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;