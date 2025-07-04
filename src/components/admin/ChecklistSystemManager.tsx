import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, CheckCircle, Package, Link2, Settings } from 'lucide-react';
import { ChecklistSystem, ChecklistSystemWithTemplates } from '../../types/checklistSystem';
import { ChecklistTemplate } from '../../types/admin';
import { CustomerChecklistTemplate } from '../../types/customerAdmin';
import { mockChecklistSystems } from '../../data/checklistSystemMockData';
import { mockChecklistTemplates } from '../../data/adminMockData';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';

const ChecklistSystemManager: React.FC = () => {
  const [systems, setSystems] = useState<ChecklistSystem[]>(mockChecklistSystems);
  const [rentalReadyTemplates] = useState<ChecklistTemplate[]>(mockChecklistTemplates);
  const [customerTemplates] = useState<CustomerChecklistTemplate[]>(mockCustomerChecklistTemplates);
  const [editingSystem, setEditingSystem] = useState<ChecklistSystem | null>(null);
  const [showNewSystemForm, setShowNewSystemForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getSystemWithTemplates = (system: ChecklistSystem): ChecklistSystemWithTemplates | null => {
    const rentalReadyTemplate = rentalReadyTemplates.find(t => t.id === system.rentalReadyTemplateId);
    const customerTemplate = customerTemplates.find(t => t.id === system.customerChecklistTemplateId);
    
    if (!rentalReadyTemplate || !customerTemplate) return null;
    
    return {
      ...system,
      rentalReadyTemplate,
      customerChecklistTemplate: customerTemplate
    };
  };

  const handleSaveSystem = (systemData: Partial<ChecklistSystem>) => {
    if (editingSystem) {
      setSystems(prev => prev.map(s => 
        s.id === editingSystem.id 
          ? { ...s, ...systemData, updatedAt: new Date().toISOString() }
          : s
      ));
      showSuccessMessage('Checklist System updated successfully!');
    } else {
      const newSystem: ChecklistSystem = {
        id: `cs-${Date.now()}`,
        name: systemData.name || '',
        description: systemData.description || '',
        equipmentCategory: systemData.equipmentCategory || '',
        rentalReadyTemplateId: systemData.rentalReadyTemplateId || '',
        customerChecklistTemplateId: systemData.customerChecklistTemplateId || '',
        isActive: systemData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSystems(prev => [...prev, newSystem]);
      showSuccessMessage('Checklist System created successfully!');
    }
    
    setEditingSystem(null);
    setShowNewSystemForm(false);
  };

  const handleDeleteSystem = (systemId: string) => {
    if (confirm('Are you sure you want to delete this checklist system?')) {
      setSystems(prev => prev.filter(s => s.id !== systemId));
      showSuccessMessage('Checklist System deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Checklist Systems</h2>
          <p className="text-gray-600">Unified checklist systems combining Rental Ready and Customer Checklists</p>
        </div>
        <button
          onClick={() => setShowNewSystemForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Checklist System
        </button>
      </div>

      {/* Systems List */}
      <div className="space-y-4">
        {systems.map(system => {
          const systemWithTemplates = getSystemWithTemplates(system);
          
          return (
            <div key={system.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{system.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      system.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {system.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{system.description}</p>
                  <p className="text-sm text-gray-600">Equipment Category: {system.equipmentCategory}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSystem(system)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSystem(system.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template Information */}
              {systemWithTemplates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  {/* Rental Ready Template */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Rental Ready Template</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-1">{systemWithTemplates.rentalReadyTemplate.name}</p>
                    <p className="text-xs text-blue-700">{systemWithTemplates.rentalReadyTemplate.questions.length} questions</p>
                  </div>

                  {/* Customer Template */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Customer Checklist Template</h4>
                    </div>
                    <p className="text-sm text-purple-800 mb-1">{systemWithTemplates.customerChecklistTemplate.name}</p>
                    <p className="text-xs text-purple-700">{systemWithTemplates.customerChecklistTemplate.questions.length} questions</p>
                  </div>
                </div>
              )}

              {!systemWithTemplates && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">⚠️ One or more templates are missing or invalid</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* System Form Modal */}
      {(editingSystem || showNewSystemForm) && (
        <ChecklistSystemForm
          system={editingSystem}
          rentalReadyTemplates={rentalReadyTemplates}
          customerTemplates={customerTemplates}
          onSave={handleSaveSystem}
          onCancel={() => {
            setEditingSystem(null);
            setShowNewSystemForm(false);
          }}
        />
      )}
    </div>
  );
};

interface ChecklistSystemFormProps {
  system: ChecklistSystem | null;
  rentalReadyTemplates: ChecklistTemplate[];
  customerTemplates: CustomerChecklistTemplate[];
  onSave: (system: Partial<ChecklistSystem>) => void;
  onCancel: () => void;
}

const ChecklistSystemForm: React.FC<ChecklistSystemFormProps> = ({ 
  system, 
  rentalReadyTemplates, 
  customerTemplates, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: system?.name || '',
    description: system?.description || '',
    equipmentCategory: system?.equipmentCategory || '',
    rentalReadyTemplateId: system?.rentalReadyTemplateId || '',
    customerChecklistTemplateId: system?.customerChecklistTemplateId || '',
    isActive: system?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const availableRentalReadyTemplates = rentalReadyTemplates.filter(t => 
    !formData.equipmentCategory || t.equipmentCategory === formData.equipmentCategory
  );

  const availableCustomerTemplates = customerTemplates.filter(t => 
    !formData.equipmentCategory || t.equipmentCategory === formData.equipmentCategory
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {system ? 'Edit Checklist System' : 'New Checklist System'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Heavy Equipment Complete System"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Description of this checklist system..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Category *
              </label>
              <select
                value={formData.equipmentCategory}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  equipmentCategory: e.target.value,
                  rentalReadyTemplateId: '',
                  customerChecklistTemplateId: ''
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Heavy Equipment">Heavy Equipment</option>
                <option value="Compact Equipment">Compact Equipment</option>
                <option value="Power Equipment">Power Equipment</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Ready Template *
                </label>
                <select
                  value={formData.rentalReadyTemplateId}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalReadyTemplateId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!formData.equipmentCategory}
                >
                  <option value="">Select Template</option>
                  {availableRentalReadyTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.questions.length} questions)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Checklist Template *
                </label>
                <select
                  value={formData.customerChecklistTemplateId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerChecklistTemplateId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!formData.equipmentCategory}
                >
                  <option value="">Select Template</option>
                  {availableCustomerTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.questions.length} questions)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active System
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Checklist System
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSystemManager;