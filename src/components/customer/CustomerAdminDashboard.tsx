import React, { useState } from 'react';
import { Database, FileText } from 'lucide-react';
import CustomerQuestionManager from './CustomerQuestionManager';
import CustomerChecklistTemplateManager from './CustomerChecklistTemplateManager';

type CustomerAdminView = 'overview' | 'questions' | 'templates';

const CustomerAdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<CustomerAdminView>('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'questions':
        return <CustomerQuestionManager />;
      case 'templates':
        return <CustomerChecklistTemplateManager />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Questions & Categories</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage customer checklist questions with delivery/return text variations and pricing.
              </p>
              <button
                onClick={() => setCurrentView('questions')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Customer Questions
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Checklist Templates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Build delivery/return checklist templates for different equipment categories with pricing.
              </p>
              <button
                onClick={() => setCurrentView('templates')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Customer Templates
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Checklist Management</h2>
          <p className="text-gray-600">Manage delivery/return checklists with cost calculations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('questions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'questions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Questions & Categories
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'templates'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Templates
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerAdminDashboard;