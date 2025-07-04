import React, { useState } from 'react';
import { Settings, Database, FileText, Users, ArrowRight } from 'lucide-react';
import CustomerQuestionManager from './CustomerQuestionManager';
import CustomerChecklistTemplateManager from './CustomerChecklistTemplateManager';

interface CustomerAdminDashboardProps {
  onNavigateToRentalReady?: () => void;
}

type CustomerAdminView = 'overview' | 'questions' | 'templates';

const CustomerAdminDashboard: React.FC<CustomerAdminDashboardProps> = ({ onNavigateToRentalReady }) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Customer Checklist Admin</h1>
                <p className="text-sm text-gray-600">Delivery & Return Checklist Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-1">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'overview'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCurrentView('questions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'questions'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Questions & Categories
                </button>
                <button
                  onClick={() => setCurrentView('templates')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'templates'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Templates
                </button>
              </nav>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <button
                  onClick={onNavigateToRentalReady}
                  className="flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                  title="Go to Rental Ready Admin Dashboard"
                >
                  <Settings className="w-4 h-4" />
                  Rental Ready Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomerAdminDashboard;