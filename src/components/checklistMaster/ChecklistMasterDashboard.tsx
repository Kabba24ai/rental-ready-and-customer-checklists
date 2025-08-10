import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ClipboardList, 
  FileText, 
  Users, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  User,
  MoreVertical,
  Eye,
  Copy,
  Archive
} from 'lucide-react';
import { ChecklistMasterSystemWithCounts } from '../../types/checklistMaster';
import { mockChecklistMasterSystems } from '../../data/checklistMasterMockData';
import { mockChecklistTemplates } from '../../data/adminMockData';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';

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
  const [systems, setSystems] = useState(mockChecklistMasterSystems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Get system with question counts
  const getSystemWithCounts = (system: any): ChecklistMasterSystemWithCounts => {
    const rentalReadyTemplate = mockChecklistTemplates.find(t => t.id === system.rentalReadyTemplateId);
    const customerTemplate = mockCustomerChecklistTemplates.find(t => t.id === system.customerTemplateId);
    
    return {
      ...system,
      rentalReadyQuestionCount: rentalReadyTemplate?.questions.length || 0,
      customerQuestionCount: customerTemplate?.questions.length || 0
    };
  };

  const systemsWithCounts = systems.map(getSystemWithCounts);

  const filteredSystems = systemsWithCounts.filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSystem = (systemId: string) => {
    if (confirm('Are you sure you want to delete this checklist system?')) {
      setSystems(prev => prev.filter(s => s.id !== systemId));
      showSuccessMessage('Checklist system deleted successfully!');
    }
  };

  const handleDuplicateSystem = (systemId: string) => {
    const systemToDuplicate = systems.find(s => s.id === systemId);
    if (systemToDuplicate) {
      const newSystem = {
        ...systemToDuplicate,
        id: `cms-${Date.now()}`,
        name: `${systemToDuplicate.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSystems(prev => [...prev, newSystem]);
      showSuccessMessage('Checklist system duplicated successfully!');
    }
  };

  const toggleSystemSelection = (systemId: string) => {
    setSelectedSystems(prev => 
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  const stats = {
    total: systems.length,
    active: systems.filter(s => s.isActive).length,
    inactive: systems.filter(s => !s.isActive).length,
    totalRentalReadyQuestions: systemsWithCounts.reduce((sum, s) => sum + s.rentalReadyQuestionCount, 0),
    totalCustomerQuestions: systemsWithCounts.reduce((sum, s) => sum + s.customerQuestionCount, 0)
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
                <h1 className="text-xl font-semibold text-gray-900">Checklist Master</h1>
                <p className="text-sm text-gray-600">Manage complete checklist systems</p>
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

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Systems</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Systems</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rental Ready Questions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalRentalReadyQuestions}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Questions</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCustomerQuestions}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Header and Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checklist Systems</h2>
            <p className="text-gray-600">Manage complete checklist systems that combine rental ready and customer checklists</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New System
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search checklist systems..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              {filteredSystems.length} of {systems.length} systems
            </div>
          </div>
        </div>

        {/* Systems List */}
        <div className="space-y-4">
          {filteredSystems.map(system => (
            <div key={system.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{system.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      system.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {system.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Rental Ready:</span>
                      <span className="font-medium">{system.rentalReadyQuestionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{system.customerQuestionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(system.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium">{new Date(system.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditSystem(system.id)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicateSystem(system.id)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteSystem(system.id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSystems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No systems found' : 'No checklist systems yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Create your first checklist system to get started with equipment management.'
              }
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First System
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistMasterDashboard;