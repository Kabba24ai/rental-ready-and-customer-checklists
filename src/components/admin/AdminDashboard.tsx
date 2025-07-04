import React, { useState } from 'react';
import { Database, FileText, Package } from 'lucide-react';
import QuestionManager from './QuestionManager';
import ChecklistTemplateManager from './ChecklistTemplateManager';
import ChecklistSystemManager from './ChecklistSystemManager';

type AdminView = 'overview' | 'systems' | 'questions' | 'templates';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'systems':
        return <ChecklistSystemManager />;
      case 'questions':
        return <QuestionManager />;
      case 'templates':
        return <ChecklistTemplateManager />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Checklist Systems</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Manage unified checklist systems that combine Rental Ready and Customer Checklists for equipment categories.
              </p>
              <button
                onClick={() => setCurrentView('systems')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Checklist Systems
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Rental Ready Questions</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage rental ready inspection questions organized by categories with status mappings.
              </p>
              <button
                onClick={() => setCurrentView('questions')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Rental Ready Questions
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Rental Ready Templates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Build custom rental ready checklist templates by selecting and ordering questions for equipment categories.
              </p>
              <button
                onClick={() => setCurrentView('templates')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Rental Ready Templates
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
          <h2 className="text-2xl font-bold text-gray-900">Master Checklist System</h2>
          <p className="text-gray-600">Unified management of Rental Ready and Customer Checklist systems</p>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('systems')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'systems'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Checklist Systems
            </button>
            <button
              onClick={() => setCurrentView('questions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rental Ready Questions
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rental Ready Templates
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

export default AdminDashboard;