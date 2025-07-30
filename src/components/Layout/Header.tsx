import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile }) => {
  return (
    <header className="bg-white shadow-sm border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="p-2 text-lendsqr-gray hover:text-lendsqr-navy md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full pl-4 pr-12 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
          <button className="absolute right-0 top-0 h-full px-3 bg-primary text-white rounded-r-lg hover:bg-primary-hover transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Docs Link - Hidden on small screens */}
        <a href="#" className="hidden sm:block text-sm text-lendsqr-gray hover:text-lendsqr-navy underline">
          Docs
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-lendsqr-gray hover:text-lendsqr-navy">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-lendsqr-navy">Adedeji</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;