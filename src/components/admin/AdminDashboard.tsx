import React from 'react';
import AdminNavigation, { AdminNavView } from './AdminNavigation';

interface AdminDashboardProps {
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReady: () => void; // admin config area
  onNavigateToCustomerAdmin: () => void;
  onNavigateToEquipmentManagement: () => void; // rental-ready operational screen
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToChecklistMaster,
  onNavigateToRentalReady,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement,
}) => {
  const currentView: AdminNavView = 'rental-ready-admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation
          currentView={currentView}
          onNavigateToChecklistMaster={onNavigateToChecklistMaster}
          onNavigateToRentalReady={onNavigateToRentalReady}
          onNavigateToCustomerAdmin={onNavigateToCustomerAdmin}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600 text-sm">
            Use the navigation above to manage templates, questions, and customer checklists or jump to the operational Rental Ready equipment management screen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;