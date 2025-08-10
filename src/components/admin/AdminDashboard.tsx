import React, { useState } from 'react';
import { Settings, Database, FileText, ClipboardList, Users } from 'lucide-react';
import AdminNavigation, { AdminNavView } from './AdminNavigation';
import QuestionManager from './QuestionManager';
import ChecklistTemplateManager from './ChecklistTemplateManager';

interface AdminDashboardProps {
  onNavigateToCustomerAdmin: () => void;
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReady?: () => void;
  onNavigateToEquipmentManagement: () => void;
}

type AdminView = 'overview' | 'questions' | 'templates';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateToCustomerAdmin, 
  onNavigateToChecklistMaster,
  onNavigateToRentalReady,
  onNavigateToEquipmentManagement
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const currentNavView: AdminNavView = 'rental-ready-admin';

  const renderContent = () => {
    switch (currentView) {
      case 'questions':
        return <QuestionManager />;
      case 'templates':
        return <ChecklistTemplateManager />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Question & Categories Mgt</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage inspection questions organized by categories.
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
                Build custom checklist templates for different equipment categories.
              </p>
              <button
                onClick={() => setCurrentView('templates')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Templates
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
              <Settings className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rental Ready Admin</h1>
                <p className="text-sm text-gray-600">Manage rental ready questions and templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <AdminNavigation
          currentView={currentNavView}
          onNavigateToChecklistMaster={onNavigateToChecklistMaster}
          onNavigateToRentalReady={onNavigateToRentalReady || (() => {})}
          onNavigateToCustomerAdmin={onNavigateToCustomerAdmin}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'overview'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('questions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'questions'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Questions & Categories
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'templates'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Templates
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;