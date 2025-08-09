import React, { useState } from 'react';
import { Save, X, ClipboardList } from 'lucide-react';

interface CreateChecklistMasterFormProps {
  onSave: (name: string) => void;
  onCancel: () => void;
  isWorkflowMode?: boolean;
}

const CreateChecklistMasterForm: React.FC<CreateChecklistMasterFormProps> = ({
  onSave,
  onCancel,
  isWorkflowMode = false
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
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
                <h1 className="text-xl font-semibold text-gray-900">Create New Checklist System</h1>
                <p className="text-sm text-gray-600">Set up a complete checklist system for equipment</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Cancel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <ClipboardList className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Name Your Checklist System</h2>
            <p className="text-gray-600">
              This will create a complete checklist system that includes both rental ready and customer checklists. 
              The system can be assigned to multiple equipment items later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Checklist System Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Standard Heavy Equipment System"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Choose a descriptive name that identifies this checklist system. You can assign it to multiple equipment items later.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Create or select rental ready checklist questions</li>
                <li>2. Build your rental ready template</li>
                <li>3. Create or select customer checklist questions</li>
                <li>4. Build your customer checklist template</li>
                <li>5. Your complete system will be ready to assign to equipment</li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📋 System Assignment</h3>
              <p className="text-sm text-gray-600">
                Once created, this checklist system can be assigned to multiple equipment items (3, 5, 12, or more) 
                through the Equipment Profile screen in a separate module.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={!name.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors flex-1 justify-center ${
                  name.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                {isWorkflowMode ? 'Continue to Questions' : 'Create Checklist System'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
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

export default CreateChecklistMasterForm;