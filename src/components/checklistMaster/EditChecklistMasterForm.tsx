import React, { useState } from 'react';
import { Save, X, ClipboardList } from 'lucide-react';
import { mockChecklistMasterSystems } from '../../data/checklistMasterMockData';

interface EditChecklistMasterFormProps {
  systemId: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const EditChecklistMasterForm: React.FC<EditChecklistMasterFormProps> = ({
  systemId,
  onSave,
  onCancel
}) => {
  const system = mockChecklistMasterSystems.find(s => s.id === systemId);
  const [name, setName] = useState(system?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  if (!system) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Not Found</h2>
          <p className="text-gray-600 mb-4">The checklist system you're trying to edit could not be found.</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Checklist System</h1>
                <p className="text-sm text-gray-600">Update the name of your checklist system</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit System Name</h2>
            <p className="text-gray-600">
              Update the name of this checklist system. This change will be reflected wherever this system is used.
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
                Choose a descriptive name that identifies this checklist system.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">System Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>System ID:</strong> {system.id}</p>
                <p><strong>Created:</strong> {new Date(system.createdAt).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(system.updatedAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {system.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📋 System Assignment</h3>
              <p className="text-sm text-gray-600">
                This checklist system can be assigned to multiple equipment items through the Equipment Profile screen. 
                Changing the name will update it everywhere this system is used.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={!name.trim() || name.trim() === system.name}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors flex-1 justify-center ${
                  name.trim() && name.trim() !== system.name
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                Save Changes
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

export default EditChecklistMasterForm;