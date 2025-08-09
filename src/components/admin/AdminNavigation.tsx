import React from 'react';
import { ClipboardList, Settings, Users, FileText, Database } from 'lucide-react';

interface AdminNavigationProps {
  currentView: 'checklist-master' | 'rental-ready-admin' | 'customer-admin' | 'rental-ready-management';
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReadyAdmin: () => void;
  onNavigateToCustomerAdmin: () => void;
  onNavigateToRentalReadyManagement: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentView,
  onNavigateToChecklistMaster,
  onNavigateToRentalReadyAdmin,
  onNavigateToCustomerAdmin,
  onNavigateToRentalReadyManagement
}) => {
  const navItems = [
    {
      id: 'checklist-master',
      label: 'Checklist Master',
      description: 'Manage checklist systems',
      icon: ClipboardList,
      color: 'blue',
      onClick: onNavigateToChecklistMaster
    },
    {
      id: 'rental-ready-admin',
      label: 'Rental Ready Admin',
      description: 'Questions & templates',
      icon: Settings,
      color: 'green',
      onClick: onNavigateToRentalReadyAdmin
    },
    {
      id: 'customer-admin',
      label: 'Customer Admin',
      description: 'Delivery & return checklists',
      icon: Users,
      color: 'purple',
      onClick: onNavigateToCustomerAdmin
    },
    {
      id: 'rental-ready-management',
      label: 'Rental Ready Mgt.',
      description: 'Equipment inspections',
      icon: FileText,
      color: 'indigo',
      onClick: onNavigateToRentalReadyManagement
    }
  ];

  const getButtonStyles = (itemId: string, color: string) => {
    const isActive = currentView === itemId;
    
    const colorStyles = {
      blue: isActive 
        ? 'bg-blue-100 border-blue-300 text-blue-800' 
        : 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
      green: isActive 
        ? 'bg-green-100 border-green-300 text-green-800' 
        : 'border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700',
      purple: isActive 
        ? 'bg-purple-100 border-purple-300 text-purple-800' 
        : 'border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700',
      indigo: isActive 
        ? 'bg-indigo-100 border-indigo-300 text-indigo-800' 
        : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
    };

    return `flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${colorStyles[color as keyof typeof colorStyles]}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-gray-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Admin Navigation</h3>
          <p className="text-sm text-gray-600">Navigate between admin screens</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              disabled={isActive}
              className={`${getButtonStyles(item.id, item.color)} ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;