import React, { useState } from 'react';
import { ChecklistSystemsPage } from './components/checklistSystems/ChecklistSystemsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerAdminDashboard from './components/customer/CustomerAdminDashboard';

type AppView = 'checklist-master' | 'rental-ready-admin' | 'customer-admin' | 'equipment-management';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('checklist-master');

  const handleNavigateToChecklistMaster = () => {
    setCurrentView('checklist-master');
  };

  const handleNavigateToRentalReadyAdmin = () => {
    setCurrentView('rental-ready-admin');
  };

  const handleNavigateToCustomerAdmin = () => {
    setCurrentView('customer-admin');
  };

  const handleNavigateToEquipmentManagement = () => {
    setCurrentView('equipment-management');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rental-ready-admin':
        return (
          <AdminDashboard
            onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
            onNavigateToChecklistMaster={handleNavigateToChecklistMaster}
            onNavigateToEquipmentManagement={handleNavigateToEquipmentManagement}
          />
        );
      case 'customer-admin':
        return (
          <CustomerAdminDashboard
            onNavigateToRentalReady={handleNavigateToRentalReadyAdmin}
            onNavigateToChecklistMaster={handleNavigateToChecklistMaster}
            onNavigateToEquipmentManagement={handleNavigateToEquipmentManagement}
          />
        );
      case 'equipment-management':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Equipment Management</h1>
              <p className="text-gray-600 mb-6">Equipment management functionality coming soon.</p>
              <button
                onClick={handleNavigateToChecklistMaster}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Back to Checklist Master
              </button>
            </div>
          </div>
        );
      case 'checklist-master':
      default:
        return (
          <ChecklistSystemsPage
            onNavigateToRentalReadyAdmin={handleNavigateToRentalReadyAdmin}
            onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
            onNavigateToEquipmentManagement={handleNavigateToEquipmentManagement}
          />
        );
    }
  };

  return renderCurrentView();
}

export default App;