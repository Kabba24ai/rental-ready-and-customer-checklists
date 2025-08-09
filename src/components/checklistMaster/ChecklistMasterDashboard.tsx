import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle, Settings, ClipboardList } from 'lucide-react';
import { ChecklistMasterSystemWithCounts } from '../../types/checklistMaster';
import { mockChecklistMasterSystems } from '../../data/checklistMasterMockData';
import { mockChecklistTemplates } from '../../data/adminMockData';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';
import AdminNavigation from '../admin/AdminNavigation';

interface ChecklistMasterDashboardProps {
  onCreateNew: () => void;
  onEditSystem: (systemId: string) => void;
  onNavigateToRentalReady: () => void;
  onNavigateToCustomerAdmin: () => void;
  onNavigateToEquipmentManagement: () => void;
}

const ChecklistMasterDashboard: React.FC<ChecklistMasterDashboardProps> = ({
  onCreateNew,
  onEditSystem,
  onNavigateToRentalReady,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Combine master systems with question counts
  const systemsWithCounts: ChecklistMasterSystemWithCounts[] = mockChecklistMasterSystems.map(system => {
    const rentalReadyTemplate = mockChecklistTemplates.find(t => t.id === system.rentalReadyTemplateId);
    const customerTemplate = mockCustomerChecklistTemplates.find(t => t.id === system.customerTemplateId);
    
    return {
      ...system,
      rentalReadyQuestionCount: rentalReadyTemplate?.questions.length || 0,
      customerQuestionCount: customerTemplate?.questions.length || 0
    };
  });

  const filteredSystems = systemsWithCounts.filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSystem = (systemId: string) => {
    if (confirm('Are you sure you want to delete this checklist system?')) {
      // In a real app, this would delete from the database
      showSuccessMessage('Checklist system deleted successfully!');
    }
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
                <h1 className="text-xl font-semibold text-gray-900">Checklist Management</h1>
                <p className="text-sm text-gray-600">Manage complete checklist systems for equipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <AdminNavigation
          currentView="checklist-master"
          onNavigateToChecklistMaster={() => {}} // Already on this screen
          onNavigateToRentalReadyAdmin={onNavigateToRentalReady}
          onNavigateToCustomerAdmin={onNavigateToCustomerAdmin}
          onNavigateToRentalReadyManagement={onNavigateToEquipmentManagement}
        />

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checklist Systems</h2>
            <p className="text-gray-600">Independent checklist systems that can be assigned to multiple equipment items</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Checklist System
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search checklist systems..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Systems List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredSystems.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Checklist Systems Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No systems match your search criteria.' : 'Get started by creating your first checklist system.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Checklist Mgt.</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist System Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rental Ready
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Checklist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSystems.map((system) => (
                    <tr key={system.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{system.name}</div>
                            <div className="text-sm text-gray-500">
                              Created {new Date(system.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {system.rentalReadyTemplateId ? (
                          <button
                            onClick={onNavigateToRentalReady}
                            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded-lg transition-colors group"
                            title="Go to Rental Ready Admin"
                          >
                            <ClipboardList className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                            <div className="text-left">
                              <div className="text-sm text-gray-900">
                                {system.rentalReadyQuestionCount} questions
                              </div>
                              <div className="text-xs text-gray-500">
                                {mockChecklistTemplates.find(t => t.id === system.rentalReadyTemplateId)?.name || 'Unknown Template'}
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 p-2 text-gray-400">
                            <ClipboardList className="w-4 h-4" />
                            <div className="text-left">
                              <div className="text-sm">No template assigned</div>
                              <div className="text-xs">Click to assign</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {system.customerTemplateId ? (
                          <button
                            onClick={onNavigateToCustomerAdmin}
                            className="flex items-center gap-2 hover:bg-purple-50 p-2 rounded-lg transition-colors group"
                            title="Go to Customer Checklist Admin"
                          >
                            <ClipboardList className="w-4 h-4 text-purple-500 group-hover:text-purple-600" />
                            <div className="text-left">
                              <div className="text-sm text-gray-900">
                                {system.customerQuestionCount} questions
                              </div>
                              <div className="text-xs text-gray-500">
                                {mockCustomerChecklistTemplates.find(t => t.id === system.customerTemplateId)?.name || 'Unknown Template'}
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 p-2 text-gray-400">
                            <ClipboardList className="w-4 h-4" />
                            <div className="text-left">
                              <div className="text-sm">No template assigned</div>
                              <div className="text-xs">Click to assign</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditSystem(system.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit System"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSystem(system.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete System"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📋 System Assignment</h3>
          <p className="text-sm text-blue-800">
            These checklist systems are independent and can be assigned to multiple equipment items (3, 5, 12, or more) 
            through the Equipment Profile screen in a separate module. Each system combines both rental ready and customer 
            checklists for complete equipment management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistMasterDashboard;