import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;