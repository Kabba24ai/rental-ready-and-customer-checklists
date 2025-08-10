import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Circle, Save, X, ClipboardList } from 'lucide-react';
import CreateChecklistMasterForm from './CreateChecklistMasterForm';
import RentalReadyTemplateSelector from './RentalReadyTemplateSelector';
import CustomerTemplateSelector from './CustomerTemplateSelector';
import QuestionManager from '../admin/QuestionManager';
import ChecklistTemplateManager from '../admin/ChecklistTemplateManager';
import CustomerQuestionManager from '../customer/CustomerQuestionManager';
import CustomerChecklistTemplateManager from '../customer/CustomerChecklistTemplateManager';

interface GuidedChecklistWorkflowProps {
  onComplete: (systemName: string) => void;
  onCancel: () => void;
}

const GuidedChecklistWorkflow: React.FC<GuidedChecklistWorkflowProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [systemName, setSystemName] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [selectedRentalReadyTemplate, setSelectedRentalReadyTemplate] = useState<string>('');
  const [selectedCustomerTemplate, setSelectedCustomerTemplate] = useState<string>('');

  const steps = [
    { id: 1, title: 'Name Your Checklist', description: 'Create and name your checklist system' },
    { id: 2, title: 'Assign Rental Ready Template', description: 'Select rental ready checklist template' },
    { id: 3, title: 'Assign Customer Template', description: 'Select customer checklist template' },
    { id: 4, title: 'Complete & Save', description: 'Save and return to Equipment Mgt.' }
  ];

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (stepId < 6) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleSystemNameSave = (name: string) => {
    setSystemName(name);
    handleStepComplete(1);
  };

  const handleFinalComplete = () => {
    onComplete(systemName);
  };

  const canProceedToStep = (stepId: number) => {
    if (stepId === 1) return true;
    return completedSteps.has(stepId - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateChecklistMasterForm
            onSave={handleSystemNameSave}
            onCancel={onCancel}
            isWorkflowMode={true}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Step 2: Assign Rental Ready Template</h3>
              <p className="text-sm text-green-800">
                Select an existing rental ready template or create a new one. This template will be assigned to your checklist system for equipment inspections.
              </p>
            </div>
            <RentalReadyTemplateSelector 
              selectedTemplate={selectedRentalReadyTemplate}
              onTemplateSelect={setSelectedRentalReadyTemplate}
              onCancelToCreateTemplate={onCancel}
            />
            <div className="flex justify-end">
              <button
                onClick={() => selectedRentalReadyTemplate && handleStepComplete(2)}
                disabled={!selectedRentalReadyTemplate}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedRentalReadyTemplate
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Customer Template
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">Step 3: Assign Customer Template</h3>
              <p className="text-sm text-indigo-800">
                Select an existing customer template or create a new one. This template will be assigned to your checklist system for delivery and return processes.
              </p>
            </div>
            <CustomerTemplateSelector 
              selectedTemplate={selectedCustomerTemplate}
              onTemplateSelect={setSelectedCustomerTemplate}
              onCancelToCreateTemplate={onCancel}
            />
            <div className="flex justify-end">
              <button
                onClick={() => selectedCustomerTemplate && handleStepComplete(3)}
                disabled={!selectedCustomerTemplate}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCustomerTemplate
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Checklist System Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              Your checklist system "{systemName}" has been successfully created with both 
              rental ready and customer checklist templates.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-green-900 mb-4">✅ What You've Created:</h3>
              <div className="text-sm text-green-800 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Named checklist system: "{systemName}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Assigned rental ready template: "{selectedRentalReadyTemplate}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Assigned customer template: "{selectedCustomerTemplate}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete checklist system ready for assignment</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="font-medium text-blue-900 mb-2">📋 Next Steps</h3>
              <p className="text-sm text-blue-800">
                Your checklist system is now ready to be assigned to equipment items 
                through the Equipment Management screen.
              </p>
            </div>

            <button
              onClick={handleFinalComplete}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors mx-auto"
            >
              <Save className="w-5 h-5" />
              Save & Return to Equipment Mgt.
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentStep === 1) {
    return renderStepContent();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Create Checklist System: {systemName}
                </h1>
                <p className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                </p>
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

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <button
                    onClick={() => canProceedToStep(step.id) && setCurrentStep(step.id)}
                    disabled={!canProceedToStep(step.id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                      completedSteps.has(step.id)
                        ? 'bg-green-500 border-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : canProceedToStep(step.id)
                        ? 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500'
                        : 'border-gray-200 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </button>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      completedSteps.has(step.id) || currentStep === step.id
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      {currentStep > 1 && currentStep < 4 && (
        <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Step
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedChecklistWorkflow;