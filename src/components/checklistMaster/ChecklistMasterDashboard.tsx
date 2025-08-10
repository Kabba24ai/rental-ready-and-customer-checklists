import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Archive, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Settings, 
  FileText, 
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Download,
  Upload,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  Activity,
  ClipboardList,
  Database
} from 'lucide-react';
import { ChecklistMasterSystemWithCounts } from '../../types/checklistMaster';
import { mockChecklistMasterSystems } from '../../data/checklistMasterMockData';
import { mockChecklistTemplates } from '../../data/adminMockData';
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
  const [systems, setSystems] = useState<ChecklistMasterSystemWithCounts[]>(() => {
    return mockChecklistMasterSystems.map(system => {
      const rentalReadyTemplate = mockChecklistTemplates.find(t => t.id === system.rentalReadyTemplateId);
      const customerTemplate = mockCustomerChecklistTemplates.find(t => t.id === system.customerTemplateId);
      
      return {
        ...system,
        rentalReadyQuestionCount: rentalReadyTemplate?.questions.length || 0,
        customerQuestionCount: customerTemplate?.questions.length || 0
      };
    });
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'questions' | 'completion'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);

  const statuses = ['Active', 'Inactive'];

  const filteredSystems = systems
    .filter(system => {
      const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'Active' && system.isActive) ||
        (selectedStatus === 'Inactive' && !system.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'modified':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'questions':
          aValue = a.rentalReadyQuestionCount + a.customerQuestionCount;
          bValue = b.rentalReadyQuestionCount + b.customerQuestionCount;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive 
      ? <CheckCircle className="w-4 h-4" />
      : <Clock className="w-4 h-4" />;
  };

  const toggleSystemSelection = (systemId: string) => {
    setSelectedSystems(prev => 
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
  };

  const handleDuplicateSystem = (systemId: string) => {
    const systemToDuplicate = systems.find(s => s.id === systemId);
    if (systemToDuplicate) {
      const newSystem: ChecklistMasterSystemWithCounts = {
        ...systemToDuplicate,
        id: `cms-${Date.now()}`,
        name: `${systemToDuplicate.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSystems(prev => [...prev, newSystem]);
    }
  };

  const stats = {
    total: systems.length,
    active: systems.filter(s => s.isActive).length,
    inactive: systems.filter(s => !s.isActive).length,
    totalRentalReadyQuestions: systems.reduce((sum, s) => sum + s.rentalReadyQuestionCount, 0),
    totalCustomerQuestions: systems.reduce((sum, s) => sum + s.customerQuestionCount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checklist Master</h1>
                <p className="text-sm text-gray-600">Manage and organize your checklist systems</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Import</span>
              </button>
              <button 
                onClick={onCreateNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Navigation */}
        <AdminNavigation
          currentView="checklist-master"
          onNavigateToChecklistMaster={() => {}}
          onNavigateToRentalReadyAdmin={onNavigateToRentalReady}
          onNavigateToCustomerAdmin={onNavigateToCustomerAdmin}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-green-600 font-medium">{stats.active} Active</span>
              <span className="text-gray-600 font-medium">{stats.inactive} Inactive</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rental Ready Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRentalReadyQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Across all systems</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomerQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Delivery/return questions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Systems</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.active / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search checklist systems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="modified-desc">Recently Modified</option>
                <option value="modified-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="questions-desc">Most Questions</option>
                <option value="questions-asc">Fewest Questions</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Any Count</option>
                    <option value="small">1-20 Questions</option>
                    <option value="medium">21-40 Questions</option>
                    <option value="large">40+ Questions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Types</option>
                    <option value="both">Both Templates</option>
                    <option value="rental-only">Rental Ready Only</option>
                    <option value="customer-only">Customer Only</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchTerm || selectedStatus) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded">
                      ×
                    </button>
                  </span>
                )}
                {selectedStatus && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                    Status: {selectedStatus}
                    <button onClick={() => setSelectedStatus('')} className="hover:bg-purple-200 rounded">
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredSystems.length} of {systems.length} checklist systems
          </div>
          {selectedSystems.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedSystems.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button 
                  onClick={() => selectedSystems.forEach(handleDuplicateSystem)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Systems Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSystems.map((system) => (
              <div
                key={system.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                        📋
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {system.name}
                        </h3>
                        <p className="text-sm text-gray-600">Checklist System</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(system.isActive)}`}>
                      {getStatusIcon(system.isActive)}
                      {system.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-900">{system.rentalReadyQuestionCount}</div>
                      <div className="text-xs text-green-700">Rental Ready</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-900">{system.customerQuestionCount}</div>
                      <div className="text-xs text-purple-700">Customer</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(system.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditSystem(system.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button 
                      onClick={() => handleDuplicateSystem(system.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSystems(filteredSystems.map(s => s.id));
                          } else {
                            setSelectedSystems([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      System
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rental Ready
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSystems.map((system) => (
                    <tr key={system.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSystems.includes(system.id)}
                          onChange={() => toggleSystemSelection(system.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">
                            📋
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{system.name}</div>
                            <div className="text-sm text-gray-500">Checklist System</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(system.isActive)}`}>
                          {getStatusIcon(system.isActive)}
                          {system.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {system.rentalReadyQuestionCount} questions
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {system.customerQuestionCount} questions
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(system.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onEditSystem(system.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDuplicateSystem(system.id)}
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredSystems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No checklist systems found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStatus
                ? "No systems match your current filters. Try adjusting your search criteria."
                : "Get started by creating your first checklist system."
              }
            </p>
            {(searchTerm || selectedStatus) ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear Filters
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