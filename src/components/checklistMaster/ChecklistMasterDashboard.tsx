import React, { useState } from 'react';
import { Plus, Edit, Trash2, ClipboardList, Settings, Users, FileText } from 'lucide-react';
import { mockChecklistMasterSystems } from '../../data/checklistMasterMockData';
import { ChecklistMasterSystem } from '../../types/checklistMaster';

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
  const [systems] = useState<ChecklistMasterSystem[]>(mockChecklistMasterSystems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checklist Master</h1>
                <p className="text-sm text-gray-600">Manage checklist systems</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium cursor-default"
              >
                <ClipboardList className="w-4 h-4" />
                Checklist Master
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button
                onClick={onNavigateToEquipmentManagement}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Equipment Mgt.
              </button>
              <button
                onClick={onNavigateToRentalReady}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                Rental Ready Admin
              </button>
              <button
                onClick={onNavigateToCustomerAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Customer Checklist Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Checklist Systems</h2>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New System
            </button>
          </div>

          {/* Simple List */}
          <div className="space-y-3">
            {systems.map((system) => (
              <div
                key={system.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{system.name}</h3>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(system.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    system.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {system.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => onEditSystem(system.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistMasterDashboard;