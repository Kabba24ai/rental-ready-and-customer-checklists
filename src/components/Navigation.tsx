import React from 'react';
import { ClipboardList, Settings, Users, FileText } from 'lucide-react';

interface NavigationProps {
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReadyAdmin: () => void;
  onNavigateToCustomerAdmin: () => void;
  onNavigateToEquipmentManagement: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onNavigateToChecklistMaster,
  onNavigateToRentalReadyAdmin,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement
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
      id: 'equipment-mgt',
      label: 'Equipment Mgt',
      description: 'Equipment inspections',
      icon: FileText,
      color: 'indigo',
      onClick: onNavigateToEquipmentManagement
    }
  ];

  const getButtonStyles = (color: string) => {
    const colorStyles = {
      blue: 'border-blue-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
      green: 'border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700',
      purple: 'border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700',
      indigo: 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
    };

    return `flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${colorStyles[color as keyof typeof colorStyles]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rental Ready System</h1>
                <p className="text-sm text-gray-600">Equipment Management & Checklist System</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
          <p className="text-lg text-gray-600">
            Choose a section to manage your rental equipment system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={getButtonStyles(item.color)}
              >
                <Icon className="w-8 h-8 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-lg">{item.label}</div>
                  <div className="text-sm opacity-75">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">System Overview</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Checklist Master:</strong> Create and manage complete checklist systems</p>
            <p><strong>Rental Ready Admin:</strong> Manage inspection questions and templates</p>
            <p><strong>Customer Admin:</strong> Manage delivery/return questions and templates</p>
            <p><strong>Equipment Mgt:</strong> Perform equipment inspections and status management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;