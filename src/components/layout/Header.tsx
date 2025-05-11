import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, Calendar, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserRole } from '../../types';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userNotifications = user 
    ? notifications.filter(n => n.userId === user.id && !n.read)
    : [];
  
  const handleNotificationClick = (notificationId: string, link?: string) => {
    markNotificationAsRead(notificationId);
    if (link) {
      navigate(link);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user?.role === UserRole.MANAGER
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: <Calendar size={18} /> },
        { label: 'Shifts', path: '/shifts', icon: <Calendar size={18} /> },
        { label: 'Swap Requests', path: '/swap-requests', icon: <RefreshCcw size={18} /> },
      ]
    : [
        { label: 'My Schedule', path: '/dashboard', icon: <Calendar size={18} /> },
        { label: 'Swap Shifts', path: '/swap-shifts', icon: <RefreshCcw size={18} /> },
        { label: 'My Swaps', path: '/my-swaps', icon: <RefreshCcw size={18} /> },
      ];

  return (
    <header className="bg-dominos-blue text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Domino's Schedule</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'border-b-2 border-white'
                        : 'hover:text-gray-200'
                    }`}
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-1 rounded-full hover:bg-dominos-darkblue"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <Bell size={20} />
                    {userNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-dominos-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {userNotifications.length}
                      </span>
                    )}
                  </button>
                  
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 py-1 text-gray-700">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium">Notifications</h3>
                      </div>
                      
                      {userNotifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {userNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0"
                              onClick={() => handleNotificationClick(notification.id, notification.link)}
                            >
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="flex items-center">
                  <span className="text-sm mr-2">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-dominos-darkblue focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dominos-darkblue">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? 'bg-dominos-blue text-white'
                        : 'text-white hover:bg-dominos-blue'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </div>
                  </Link>
                ))}
                
                {/* Notifications */}
                <div className="px-3 py-2 border-t border-dominos-blue mt-2">
                  <p className="text-white font-medium mb-2">Notifications</p>
                  {userNotifications.length === 0 ? (
                    <p className="text-gray-300 text-sm">No new notifications</p>
                  ) : (
                    <div className="space-y-2">
                      {userNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          className="w-full px-3 py-2 bg-dominos-blue rounded-md text-left text-white text-sm"
                          onClick={() => handleNotificationClick(notification.id, notification.link)}
                        >
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-200">{notification.message}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* User actions */}
                <div className="px-3 py-3 border-t border-dominos-blue flex justify-between items-center">
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-white" />
                    <span className="text-white">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 p-2"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="px-3 py-3 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigate('/register');
                    setMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;