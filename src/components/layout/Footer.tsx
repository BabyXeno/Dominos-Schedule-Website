import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-dominos-dark text-white py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Domino's Schedule Swap</h3>
            <p className="text-sm text-gray-300">
              A tool for Domino's employees to manage schedules and request shift swaps.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-300 mb-2">
              For support, please contact your store manager.
            </p>
            <p className="text-sm text-gray-300">
              For technical issues, email: <span className="text-white">support@dominosschedule.com</span>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Domino's Schedule Swap. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            This is a demo application and is not affiliated with Domino's Pizza, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;