import React from 'react';
import AdminNavigation, { AdminNavView } from '../admin/AdminNavigation';

interface CustomerAdminDashboardProps {
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReady: () => void;
  onNavigateToEquipmentManagement: () => void;
}

const CustomerAdminDashboard: React.FC<CustomerAdminDashboardProps> = ({
  onNavigateToChecklistMaster,
  onNavigateToRentalReady,
  onNavigateToEquipmentManagement,
}) => {
  const currentView: AdminNavView = 'customer-admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation
          currentView={currentView}
          onNavigateToChecklistMaster={onNavigateToChecklistMaster}
          onNavigateToRentalReady={onNavigateToRentalReady}
          onNavigateToCustomerAdmin={() => { /* already here */ }}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Customer Admin</h2>
          <p className="text-gray-600 text-sm">
            Configure delivery/return questions and templates for customer-facing checklists.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerAdminDashboard;