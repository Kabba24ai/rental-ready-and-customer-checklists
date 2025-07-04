import React from 'react';
import { ChecklistItem, Equipment, Inspector, AnswerOption } from '../types/equipment';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

/**
 * ChecklistForm Component
 * 
 * Main inspection interface for rental ready checklists. Provides a mobile-optimized
 * form with radio button selection, progress tracking, and status validation.
 * 
 * Features:
 * - Compact single-row radio button layout optimized for iPad/iPhone
 * - Real-time progress tracking with visual indicators
 * - Status-based validation (Rental Ready, Maint. Hold, Damaged)
 * - Inspector assignment and equipment hour tracking
 * - Conditional notes for maintenance and damage items
 * 
 * @param equipment - Selected equipment for inspection
 * @param items - Checklist items with answer options
 * @param onUpdateItem - Callback for updating individual checklist items
 * @param inspectorName - Currently selected inspector name
 * @param onInspectorNameChange - Callback for inspector selection
 * @param notes - General inspection notes
 * @param onNotesChange - Callback for notes updates
 * @param equipmentHours - Current equipment hours
 * @param onEquipmentHoursChange - Callback for hours updates
 * @param inspectors - Available inspectors list
 * @param onMarkRentalReady - Callback for marking equipment as rental ready
 * @param onMarkDamaged - Callback for marking equipment as damaged
 * @param onSaveDraft - Callback for saving inspection draft
 */
interface ChecklistFormProps {
  equipment: Equipment;
  items: ChecklistItem[];
  onUpdateItem: (itemId: string, updates: Partial<ChecklistItem>) => void;
  inspectorName: string;
  onInspectorNameChange: (name: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  equipmentHours: number;
  onEquipmentHoursChange: (hours: number) => void;
  inspectors: Inspector[];
  onMarkRentalReady: () => void;
  onMarkDamaged: () => void;
  onSaveDraft: () => void;
}

const ChecklistForm: React.FC<ChecklistFormProps> = ({
  equipment,
  items,
  onUpdateItem,
  inspectorName,
  onInspectorNameChange,
  notes,
  onNotesChange,
  equipmentHours,
  onEquipmentHoursChange,
  inspectors,
  onMarkRentalReady,
  onMarkDamaged,
  onSaveDraft
}) => {
  const getStatusIcon = (status: AnswerOption['status']) => {
    switch (status) {
      case 'Rental Ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Maint. Hold':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'Damaged':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AnswerOption['status']) => {
    switch (status) {
      case 'Rental Ready':
        return 'border-green-200 bg-green-50';
      case 'Maint. Hold':
        return 'border-orange-200 bg-orange-50';
      case 'Damaged':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSelectedAnswerStatus = (item: ChecklistItem): AnswerOption['status'] | null => {
    if (!item.selectedAnswerId) return null;
    const selectedAnswer = item.answerOptions.find(option => option.id === item.selectedAnswerId);
    return selectedAnswer?.status || null;
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const completedItems = items.filter(item => item.selectedAnswerId).length;
  const progressPercentage = (completedItems / items.length) * 100;

  // Status calculations for action buttons
  const requiredItems = items.filter(item => item.required);
  const completedRequiredItems = requiredItems.filter(item => item.selectedAnswerId);
  const damagedItems = items.filter(item => {
    const status = getSelectedAnswerStatus(item);
    return status === 'Damaged';
  });
  const maintHoldItems = items.filter(item => {
    const status = getSelectedAnswerStatus(item);
    return status === 'Maint. Hold';
  });
  
  const allRequiredCompleted = completedRequiredItems.length === requiredItems.length;
  const hasInspectorName = inspectorName.trim() !== '';
  const canMarkRentalReady = allRequiredCompleted && hasInspectorName && damagedItems.length === 0 && maintHoldItems.length === 0;
  const hasDamagedItems = damagedItems.length > 0;

  // Filter active inspectors
  const activeInspectors = inspectors.filter(inspector => inspector.active);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Rental Ready Checklist - {equipment.name}
          </h2>
          <div className="text-sm text-gray-600">
            {completedItems} of {items.length} items completed
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspector Name *
            </label>
            <select
              value={inspectorName}
              onChange={(e) => onInspectorNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Inspector</option>
              {activeInspectors.map(inspector => (
                <option key={inspector.id} value={inspector.name}>
                  {inspector.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Hours
            </label>
            <input
              type="number"
              value={equipmentHours}
              onChange={(e) => onEquipmentHoursChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter hours"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspection Date
            </label>
            <input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              {category}
              <span className="text-sm text-gray-500">
                ({categoryItems.filter(item => item.selectedAnswerId).length}/{categoryItems.length})
              </span>
            </h3>
            
            <div className="space-y-4">
              {categoryItems.map((item) => {
                const selectedStatus = getSelectedAnswerStatus(item);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStatus ? getStatusColor(selectedStatus) : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {selectedStatus ? getStatusIcon(selectedStatus) : <Clock className="w-4 h-4 text-gray-400" />}
                        <span className="font-medium text-gray-900">
                          {item.name}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                      {selectedStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedStatus === 'Rental Ready' ? 'bg-green-100 text-green-800' :
                          selectedStatus === 'Maint. Hold' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedStatus}
                        </span>
                      )}
                    </div>
                    
                    {/* Radio Button Options */}
                    <div className="space-y-1 mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">Select Condition:</div>
                      {item.answerOptions.map(option => (
                        <label key={option.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name={`answer-${item.id}`}
                            value={option.id}
                            checked={item.selectedAnswerId === option.id}
                            onChange={(e) => onUpdateItem(item.id, { selectedAnswerId: e.target.value })}
                            className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                          />
                          <span className="flex-1 font-medium text-gray-900 text-sm">{option.description}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(option.status)}
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              option.status === 'Rental Ready' ? 'bg-green-100 text-green-800' :
                              option.status === 'Maint. Hold' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {option.status}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {(selectedStatus === 'Maint. Hold' || selectedStatus === 'Damaged') && (
                      <textarea
                        value={item.notes || ''}
                        onChange={(e) => onUpdateItem(item.id, { notes: e.target.value })}
                        placeholder="Add notes about the issue..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          General Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Add any additional notes or observations..."
        />
      </div>

      {/* Action Buttons at Bottom */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Inspection Summary</h4>
          
          {/* Progress Bar - First item in summary section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedItems} of {items.length} items completed ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Required Items Completed:</span>
              <span className={`font-medium ${allRequiredCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                {completedRequiredItems.length}/{requiredItems.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Items Requiring Maintenance:</span>
              <span className={`font-medium ${maintHoldItems.length > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                {maintHoldItems.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Damaged Items:</span>
              <span className={`font-medium ${hasDamagedItems ? 'text-red-600' : 'text-gray-600'}`}>
                {damagedItems.length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onMarkRentalReady}
            disabled={!canMarkRentalReady}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              canMarkRentalReady
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Rental Ready
          </button>

          <button
            onClick={onMarkDamaged}
            disabled={!hasInspectorName || damagedItems.length === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              hasInspectorName && hasDamagedItems
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            Mark as Damaged
          </button>

          <button
            onClick={onSaveDraft}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all shadow-sm"
          >
            <Clock className="w-5 h-5" />
            Save Draft
          </button>
        </div>

        {/* Validation Messages */}
        <div className="mt-4 space-y-2">
          {!hasInspectorName && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              Inspector name is required to complete the checklist.
            </div>
          )}
          
          {!allRequiredCompleted && hasInspectorName && (
            <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              All required items must be checked before marking as rental ready.
            </div>
          )}
          
          {maintHoldItems.length > 0 && !hasDamagedItems && (
            <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              {maintHoldItems.length} item(s) require maintenance before rental ready status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistForm;