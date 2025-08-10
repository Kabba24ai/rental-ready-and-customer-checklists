import React, { useState } from 'react';
import { Plus, CheckCircle, FileText, Search, Users } from 'lucide-react';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';
import CustomerChecklistTemplateManager from '../customer/CustomerChecklistTemplateManager';

interface CustomerTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onCancelToCreateTemplate?: () => void;
}

const CustomerTemplateSelector: React.FC<CustomerTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onCancelToCreateTemplate
}) => {
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = mockCustomerChecklistTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.equipmentCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showCreateNew) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create New Customer Template</h3>
          <button
            onClick={() => setShowCreateNew(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Back to Selection
          </button>
        </div>
        <CustomerChecklistTemplateManager />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Customer Template</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customer templates..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.equipmentCategory}</p>
                </div>
              </div>
              {selectedTemplate === template.id && (
                <CheckCircle className="w-6 h-6 text-indigo-500" />
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{template.questions.length} questions</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No templates match your search.' : 'No customer templates available.'}
          </p>
          <button
            onClick={() => setShowCreateNew(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Template
          </button>
        </div>
      )}

      {selectedTemplate && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">
              Template Selected: {mockCustomerChecklistTemplates.find(t => t.id === selectedTemplate)?.name}
            </span>
          </div>
          <p className="text-sm text-indigo-800 mt-1">
            This template will be assigned to your checklist system for customer delivery/return checklists.
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        {onCancelToCreateTemplate && (
          <button
            onClick={onCancelToCreateTemplate}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel New Checklist and Create Customer Checklist Template
          </button>
        )}
        <div className="flex-1"></div>
      )}
    </div>
  );
};

export default CustomerTemplateSelector;