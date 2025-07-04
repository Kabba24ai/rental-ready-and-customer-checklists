import React from 'react';
import { Equipment } from '../types/equipment';
import { Search, Wrench, CheckCircle, AlertTriangle, Filter, Clock, Truck } from 'lucide-react';

/**
 * EquipmentSelector Component
 * 
 * Equipment browsing and selection interface with advanced filtering capabilities.
 * Displays equipment in a prioritized list based on status and provides comprehensive
 * search and filter options.
 * 
 * Features:
 * - Status-based sorting (Damaged → Maint. Hold → Rented → Available)
 * - Advanced filtering by category, status, and search terms
 * - Visual status indicators with appropriate icons and colors
 * - Equipment details including hours, serial numbers, and last inspection
 * - Mobile-optimized layout with touch-friendly interactions
 * 
 * Status Priority:
 * 1. Damaged (Red) - Requires immediate attention
 * 2. Maint. Hold (Orange) - Needs maintenance before rental
 * 3. Rented (Blue) - Currently out with customers
 * 4. Available (Green) - Ready for rental
 * 
 * @param equipment - Array of all equipment items
 * @param selectedEquipment - Currently selected equipment item
 * @param onSelectEquipment - Callback for equipment selection
 * @param searchTerm - Current search filter term
 * @param onSearchChange - Callback for search term updates
 */
interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  onSelectEquipment: (equipment: Equipment) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  equipment,
  selectedEquipment,
  onSelectEquipment,
  searchTerm,
  onSearchChange
}) => {
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Damaged':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Rented':
        return <Truck className="w-4 h-4 text-blue-500" />;
      default:
        return <Wrench className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Damaged':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Rented':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  // Define status priority for sorting (lower number = higher priority)
  const getStatusPriority = (status: Equipment['status']): number => {
    switch (status) {
      case 'Damaged': return 1;
      case 'Maint. Hold': return 2;
      case 'Rented': return 3;
      case 'Available': return 4;
      default: return 5;
    }
  };

  // Get unique categories and statuses for filter options
  const categories = Array.from(new Set(equipment.map(eq => eq.category))).sort();
  const statuses = Array.from(new Set(equipment.map(eq => eq.status))).sort();

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || eq.category === categoryFilter;
    const matchesStatus = !statusFilter || eq.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    // Primary sort: by status priority (Damaged, Maint. Hold, Rented, Available)
    const statusComparison = getStatusPriority(a.status) - getStatusPriority(b.status);
    if (statusComparison !== 0) {
      return statusComparison;
    }
    
    // Secondary sort: by name alphabetically
    return a.name.localeCompare(b.name);
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Select Equipment</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          {filteredEquipment.length} of {equipment.length}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category and Status Filters */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || categoryFilter || statusFilter) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Equipment List - Increased height to 1000px */}
      <div className="space-y-3 max-h-[1000px] overflow-y-auto">
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No equipment matches your filters</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredEquipment.map((eq) => (
            <div
              key={eq.id}
              onClick={() => onSelectEquipment(eq)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedEquipment?.id === eq.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{eq.name}</h3>
                    {getStatusIcon(eq.status)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Model: {eq.model}</div>
                    <div>Serial: {eq.serialNumber}</div>
                    <div>Category: {eq.category}</div>
                    {eq.hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hours: {eq.hours.toLocaleString()}
                      </div>
                    )}
                    {eq.lastInspection && (
                      <div>Last Inspection: {eq.lastInspection}</div>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(eq.status)}`}>
                  {eq.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EquipmentSelector;