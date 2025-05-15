import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import { Bell, CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearNotifications } = useAppContext();

  // Icon mapping based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  // Sort notifications by date and unread first
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Handle clicking on a notification
  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  // Clear all notifications
  const handleClearAll = () => {
    clearNotifications();
    onClose();
  };

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Bell size={16} className="mr-2" />
            <span className="font-medium">Notifications</span>
            {notifications.length > 0 && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  notification.read ? 'opacity-75' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-2">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(notification.date)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-3 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={handleClearAll}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;