import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Home,
  UserCheck,
  UserX,
  PiggyBank,
  HandCoins,
  UserCog,
  ScrollText,
  CreditCard,
  Landmark,
  CircleDollarSign,
  TrendingUp,
  UserPlus,
  MoreHorizontal,
  Settings,
  FileText,
  BarChart3,
  Sliders,
  BadgePercent,
  Receipt,
  Coins,
  Banknote,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('lendsqr-token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', category: 'main' },
    
    // CUSTOMERS
    { name: 'Users', icon: Users, path: '/users', category: 'customers' },
    { name: 'Guarantors', icon: UserCheck, path: '/guarantors', category: 'customers' },
    { name: 'Loans', icon: HandCoins, path: '/loans', category: 'customers' },
    { name: 'Decision Models', icon: UserCog, path: '/decision-models', category: 'customers' },
    { name: 'Savings', icon: PiggyBank, path: '/savings', category: 'customers' },
    { name: 'Loan Requests', icon: ScrollText, path: '/loan-requests', category: 'customers' },
    { name: 'Whitelist', icon: UserPlus, path: '/whitelist', category: 'customers' },
    { name: 'Karma', icon: UserX, path: '/karma', category: 'customers' },
    
    // BUSINESSES
    { name: 'Organization', icon: Landmark, path: '/organization', category: 'businesses' },
    { name: 'Loan Products', icon: CircleDollarSign, path: '/loan-products', category: 'businesses' },
    { name: 'Savings Products', icon: PiggyBank, path: '/savings-products', category: 'businesses' },
    { name: 'Fees and Charges', icon: Receipt, path: '/fees-charges', category: 'businesses' },
    { name: 'Transactions', icon: CreditCard, path: '/transactions', category: 'businesses' },
    { name: 'Services', icon: Sliders, path: '/services', category: 'businesses' },
    { name: 'Service Account', icon: UserCog, path: '/service-account', category: 'businesses' },
    { name: 'Settlements', icon: Banknote, path: '/settlements', category: 'businesses' },
    { name: 'Reports', icon: BarChart3, path: '/reports', category: 'businesses' },
    
    // SETTINGS
    { name: 'Preferences', icon: Settings, path: '/preferences', category: 'settings' },
    { name: 'Fees and Pricing', icon: BadgePercent, path: '/fees-pricing', category: 'settings' },
    { name: 'Audit Logs', icon: FileText, path: '/audit-logs', category: 'settings' }
  ];

  const getCategoryTitle = (category: string) => {
    switch(category) {
      case 'customers': return 'CUSTOMERS';
      case 'businesses': return 'BUSINESSES';
      case 'settings': return 'SETTINGS';
      default: return '';
    }
  };

  const renderMenuItems = () => {
    let currentCategory = '';
    const items: React.ReactElement[] = [];

    menuItems.forEach((item, index) => {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        const categoryTitle = getCategoryTitle(item.category);
        if (categoryTitle && item.category !== 'main') {
          items.push(
            <div key={`category-${item.category}`} className="mt-6 mb-3">
              <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider px-6">
                {categoryTitle}
              </p>
            </div>
          );
        }
      }

      items.push(
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                : 'text-lendsqr-gray hover:bg-lendsqr-light-gray hover:text-lendsqr-navy'
            }`
          }
        >
          <item.icon className="w-4 h-4 mr-3" />
          {item.name}
        </NavLink>
      );
    });

    return items;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'z-50' : 'hidden lg:block'}
        w-64 bg-white shadow-lg h-screen overflow-y-auto transition-transform duration-300 ease-in-out
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-lendsqr-gray hover:text-lendsqr-navy z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <div className="p-6 border-b border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold text-lendsqr-navy">lendsqr</span>
        </div>
      </div>

      {/* Organization Switch */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center text-sm text-lendsqr-gray">
          <Landmark className="w-4 h-4 mr-2" />
          <span>Switch Organization</span>
          <MoreHorizontal className="w-4 h-4 ml-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="pb-6">
        {renderMenuItems()}
      </nav>

      {/* Logout */}
      <div className="border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-lendsqr-gray hover:bg-lendsqr-light-gray hover:text-lendsqr-navy transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;