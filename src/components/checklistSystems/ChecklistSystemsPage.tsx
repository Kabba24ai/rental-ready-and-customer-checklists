import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings, 
  FileText
} from 'lucide-react';

interface ChecklistSystem {
  id: string;
  name: string;
  description: string;
  category: 'Heavy Equipment' | 'Compact Equipment' | 'Power Equipment' | 'Specialty';
  status: 'Active' | 'Draft' | 'Archived';
  questionsCount: number;
  equipmentCount: number;
  lastModified: string;
  createdBy: string;
}

interface ChecklistSystemsPageProps {
  onNavigateToRentalReadyAdmin?: () => void;
  onNavigateToCustomerAdmin?: () => void;
  onNavigateToEquipmentManagement?: () => void;
}

const mockChecklistSystems: ChecklistSystem[] = [
  {
    id: 'cs-001',
    name: 'Heavy Equipment Standard',
    description: 'Comprehensive checklist for excavators, bulldozers, and large machinery',
    category: 'Heavy Equipment',
    status: 'Active',
    questionsCount: 45,
    equipmentCount: 23,
    lastModified: '2024-01-25',
    createdBy: 'John Smith'
  },
  {
    id: 'cs-002',
    name: 'Compact Equipment Pro',
    description: 'Optimized checklist for skid steers, mini excavators, and compact loaders',
    category: 'Compact Equipment',
    status: 'Active',
    questionsCount: 32,
    equipmentCount: 18,
    lastModified: '2024-01-24',
    createdBy: 'Sarah Johnson'
  },
  {
    id: 'cs-003',
    name: 'Power Equipment Essential',
    description: 'Essential checks for generators, compressors, and power tools',
    category: 'Power Equipment',
    status: 'Active',
    questionsCount: 28,
    equipmentCount: 35,
    lastModified: '2024-01-23',
    createdBy: 'Mike Rodriguez'
  }
];

export const ChecklistSystemsPage: React.FC<ChecklistSystemsPageProps> = ({
  onNavigateToRentalReadyAdmin,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement
}) => {
  const [systems] = useState<ChecklistSystem[]>(mockChecklistSystems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checklist Systems</h1>
                <p className="text-sm text-gray-600">Manage checklist systems</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToRentalReadyAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Rental Ready Admin
              </button>
              <button
                onClick={onNavigateToCustomerAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                Customer Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Checklist Systems</h2>
            <div className="space-y-3">
              {systems.map((system) => (
                <div key={system.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-600">{system.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};