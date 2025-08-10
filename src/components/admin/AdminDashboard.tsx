import React, { useState } from 'react';
import { Settings, Database, FileText, Plus, Search, Users, ArrowRight, ClipboardList } from 'lucide-react';
import QuestionManager from './QuestionManager';
import ChecklistTemplateManager from './ChecklistTemplateManager';
import AdminNavigation from './AdminNavigation';

interface AdminDashboardProps {
  onNavigateToCustomerAdmin?: () => void;
  onNavigateToChecklistMaster?: () => void;
  onNavigateToRentalReady?: () => void;
  onNavigateToEquipmentManagement?: () => void;
}

type AdminView = 'overview' | 'questions' | 'templates';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateToCustomerAdmin, 
  onNavigateToChecklistMaster, 
  onNavigateToRentalReady,
  onNavigateToEquipmentManagement 
}) => {
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
          </div>
          </>
        );
    }
    setCurrentView('admin');
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
                  onClick={onNavigateToChecklistMaster}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  title="Go to Checklist Master Dashboard"
                >
                  <ClipboardList className="w-4 h-4" />
                  Checklist Master
                </button>
                <button
                  onClick={onNavigateToRentalReady}
                  className="flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                  title="Go to Rental Ready Management"
                >
                  <ClipboardList className="w-4 h-4" />
                  Rental Ready Mgt.
                </button>
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
        {/* Admin Navigation */}
        <AdminNavigation
          currentView="rental-ready-admin"
          onNavigateToChecklistMaster={onNavigateToChecklistMaster || (() => {})}
          onNavigateToRentalReadyAdmin={() => {}} // Already on this screen
          onNavigateToCustomerAdmin={onNavigateToCustomerAdmin || (() => {})}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement || (() => {})}
        />

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;