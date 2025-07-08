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
  Activity
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
  isFavorite: boolean;
  completionRate: number;
  tags: string[];
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
    createdBy: 'John Smith',
    isFavorite: true,
    completionRate: 94,
    tags: ['Standard', 'Safety', 'Hydraulics']
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
    createdBy: 'Sarah Johnson',
    isFavorite: false,
    completionRate: 87,
    tags: ['Compact', 'Quick', 'Mobile']
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
    createdBy: 'Mike Rodriguez',
    isFavorite: true,
    completionRate: 91,
    tags: ['Power', 'Electrical', 'Safety']
  },
  {
    id: 'cs-004',
    name: 'Specialty Equipment Advanced',
    description: 'Detailed inspection for specialized and high-value equipment',
    category: 'Specialty',
    status: 'Draft',
    questionsCount: 67,
    equipmentCount: 8,
    lastModified: '2024-01-22',
    createdBy: 'Emily Chen',
    isFavorite: false,
    completionRate: 0,
    tags: ['Advanced', 'Specialty', 'Detailed']
  },
  {
    id: 'cs-005',
    name: 'Quick Inspection Basic',
    description: 'Streamlined checklist for routine daily inspections',
    category: 'Heavy Equipment',
    status: 'Active',
    questionsCount: 15,
    equipmentCount: 42,
    lastModified: '2024-01-21',
    createdBy: 'David Wilson',
    isFavorite: false,
    completionRate: 98,
    tags: ['Quick', 'Daily', 'Basic']
  },
  {
    id: 'cs-006',
    name: 'Legacy System Archive',
    description: 'Archived checklist system from previous version',
    category: 'Heavy Equipment',
    status: 'Archived',
    questionsCount: 38,
    equipmentCount: 0,
    lastModified: '2024-01-15',
    createdBy: 'Lisa Anderson',
    isFavorite: false,
    completionRate: 85,
    tags: ['Legacy', 'Archived']
  }
];

const ChecklistSystemsPage: React.FC = () => {
  const [systems, setSystems] = useState<ChecklistSystem[]>(mockChecklistSystems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'questions' | 'completion'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const categories = ['Heavy Equipment', 'Compact Equipment', 'Power Equipment', 'Specialty'];
  const statuses = ['Active', 'Draft', 'Archived'];

  const filteredSystems = systems
    .filter(system => {
      const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           system.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           system.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || system.category === selectedCategory;
      const matchesStatus = !selectedStatus || system.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'modified':
          aValue = new Date(a.lastModified);
          bValue = new Date(b.lastModified);
          break;
        case 'questions':
          aValue = a.questionsCount;
          bValue = b.questionsCount;
          break;
        case 'completion':
          aValue = a.completionRate;
          bValue = b.completionRate;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Draft':
        return <Clock className="w-4 h-4" />;
      case 'Archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Heavy Equipment':
        return '🚜';
      case 'Compact Equipment':
        return '🚧';
      case 'Power Equipment':
        return '⚡';
      case 'Specialty':
        return '🔧';
      default:
        return '📋';
    }
  };

  const toggleFavorite = (systemId: string) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, isFavorite: !system.isFavorite }
        : system
    ));
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
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const stats = {
    total: systems.length,
    active: systems.filter(s => s.status === 'Active').length,
    draft: systems.filter(s => s.status === 'Draft').length,
    archived: systems.filter(s => s.status === 'Archived').length,
    totalQuestions: systems.reduce((sum, s) => sum + s.questionsCount, 0),
    totalEquipment: systems.reduce((sum, s) => sum + s.equipmentCount, 0),
    avgCompletion: Math.round(systems.reduce((sum, s) => sum + s.completionRate, 0) / systems.length)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checklist Systems</h1>
                <p className="text-sm text-gray-600">Manage and organize your inspection checklists</p>
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
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Create System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-green-600 font-medium">{stats.active} Active</span>
              <span className="text-yellow-600 font-medium">{stats.draft} Draft</span>
              <span className="text-gray-600 font-medium">{stats.archived} Archived</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Across all active systems</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Covered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Pieces of equipment</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletion}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.avgCompletion}%` }}
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
                  placeholder="Search systems, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

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
                <option value="completion-desc">Highest Completion</option>
                <option value="completion-asc">Lowest Completion</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Users</option>
                    <option value="john">John Smith</option>
                    <option value="sarah">Sarah Johnson</option>
                    <option value="mike">Mike Rodriguez</option>
                  </select>
                </div>
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
          {(searchTerm || selectedCategory || selectedStatus) && (
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
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="hover:bg-green-200 rounded">
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
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
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
                        {getCategoryIcon(system.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {system.name}
                        </h3>
                        <p className="text-sm text-gray-600">{system.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(system.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {system.isFavorite ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <div className="relative">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {system.description}
                  </p>

                  {/* Status and Completion */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(system.status)}`}>
                      {getStatusIcon(system.status)}
                      {system.status}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{system.completionRate}%</div>
                      <div className="text-xs text-gray-500">Completion</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          system.completionRate >= 90 ? 'bg-green-500' :
                          system.completionRate >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${system.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{system.questionsCount}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{system.equipmentCount}</div>
                      <div className="text-xs text-gray-600">Equipment</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {system.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {system.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{system.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {system.lastModified}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {system.createdBy}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
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
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
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
                            {getCategoryIcon(system.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">{system.name}</div>
                              {system.isFavorite && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{system.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{system.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(system.status)}`}>
                          {getStatusIcon(system.status)}
                          {system.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {system.questionsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {system.equipmentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div 
                              className={`h-2 rounded-full ${
                                system.completionRate >= 90 ? 'bg-green-500' :
                                system.completionRate >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${system.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900 w-8">{system.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {system.lastModified}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
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
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No checklist systems found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || selectedStatus
                ? "No systems match your current filters. Try adjusting your search criteria."
                : "Get started by creating your first checklist system."
              }
            </p>
            {(searchTerm || selectedCategory || selectedStatus) ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
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

export default ChecklistSystemsPage;