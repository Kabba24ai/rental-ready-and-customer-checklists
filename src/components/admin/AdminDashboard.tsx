import React, { useState } from 'react';
import { Settings, Database, FileText, Plus, Search, Users, ArrowRight } from 'lucide-react';
import QuestionManager from './QuestionManager';
import ChecklistTemplateManager from './ChecklistTemplateManager';

interface AdminDashboardProps {
  onNavigateToCustomerAdmin?: () => void;
}

type AdminView = 'overview' | 'questions' | 'templates';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToCustomerAdmin }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'questions':
        return <QuestionManager />;
      case 'templates':
        return <ChecklistTemplateManager />;
      default:
        return (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Question & Categories Mgt</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage inspection questions organized by categories. Define answer options with status mappings.
              </p>
              <button
                onClick={() => setCurrentView('questions')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Questions & Categories
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Checklist Templates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Build custom checklist templates by selecting and ordering questions for different equipment categories.
              </p>
              <button
                onClick={() => setCurrentView('templates')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Templates
              </button>
            </div>
            
            {/* Helper Text */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-center">
                <strong>Getting Started:</strong> Start by creating a new template from existing questions & answers or create a new set of questions & answers and then add them into your template
              </p>
            </div>
          </div>
          
          {/* Navigation to Customer Admin */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-purple-900">Ready for Customer Checklists?</h3>
                <p className="text-sm text-purple-700">Set up delivery and return checklists for customers</p>
              </div>
              <button onClick={onNavigateToCustomerAdmin} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Users className="w-4 h-4" />
                Customer Admin <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
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
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rental Ready Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Rental Ready Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-1">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'overview'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCurrentView('questions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'questions'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Questions & Categories
                </button>
                <button
                  onClick={() => setCurrentView('templates')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'templates'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Templates
                </button>
              </nav>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <button
                  onClick={onNavigateToCustomerAdmin}
                  className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
                  title="Go to Customer Admin Dashboard"
                >
                  <Users className="w-4 h-4" />
                  Customer Admin
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

export default AdminDashboard;