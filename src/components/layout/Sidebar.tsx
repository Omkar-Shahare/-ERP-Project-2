import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Users
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { logout, currentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <h2 className="text-xl font-bold">ERP System</h2>
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
      
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
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
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-800 transition-colors duration-200"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;