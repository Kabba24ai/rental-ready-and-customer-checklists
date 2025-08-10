# Rollback2 - Working Navigation System Backup

This file contains the complete working state of the Rental Ready Checklist System with properly functioning navigation between all admin screens.

## Status: ✅ WORKING
- Navigation between all screens works correctly
- AdminNavigation component has proper TypeScript types
- All functionality preserved (Questions, Templates, Customer Admin)
- Consistent prop naming throughout

## Key Files - Working State

### src/App.tsx
```tsx
import React, { useState, useEffect } from 'react';

/**
 * Main Application Component
 * 
 * Root component implementing the IndexController pattern for the Rental Ready
 * Checklist System. Manages application-wide state, routing between different
 * views, and coordinates data flow between components.
 * 
 * Architecture:
 * - Follows Domain Driven Architecture with clear separation of concerns
 * - Implements Single Responsibility Controllers pattern
 * - Mobile-first design optimized for iPad/iPhone usage
 * 
 * Views:
 * - checklist: Main rental ready inspection interface
 * - admin: Administrative management dashboard
 * - customer-admin: Customer checklist management
 * - customer-delivery: Customer delivery checklist
 * - customer-return: Customer return checklist
 * 
 * State Management:
 * - Equipment inventory with status tracking
 * - Checklist progress and validation
 * - Inspector assignments and notes
 * - Success/error message handling
 */
import { Equipment, ChecklistItem, RentalReadyChecklist } from './types/equipment';
import { mockEquipment, getChecklistTemplate, mockInspectors } from './data/mockData';
import EquipmentSelector from './components/EquipmentSelector';
import ChecklistForm from './components/ChecklistForm';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerAdminDashboard from './components/customer/CustomerAdminDashboard';
import CustomerDeliveryChecklist from './components/customer/CustomerDeliveryChecklist';
import ChecklistMasterDashboard from './components/checklistMaster/ChecklistMasterDashboard';
import CreateChecklistMasterForm from './components/checklistMaster/CreateChecklistMasterForm';
import EditChecklistMasterForm from './components/checklistMaster/EditChecklistMasterForm';
import GuidedChecklistWorkflow from './components/checklistMaster/GuidedChecklistWorkflow';
import Navigation from './components/Navigation';
import { ClipboardList, Settings, Users, Truck, Package } from 'lucide-react';

type AppView = 'navigation' | 'checklist' | 'admin' | 'customer-admin' | 'customer-delivery' | 'customer-return' | 'checklist-master' | 'create-checklist-master' | 'edit-checklist-master' | 'rental-ready' | 'guided-workflow';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('navigation');
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checklist, setChecklist] = useState<RentalReadyChecklist | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentChecklistMasterName, setCurrentChecklistMasterName] = useState('');
  const [editingSystemId, setEditingSystemId] = useState<string>('');

  useEffect(() => {
    if (selectedEquipment) {
      const checklistItems = getChecklistTemplate(selectedEquipment.category);
      setChecklist({
        equipmentId: selectedEquipment.id,
        inspectorName: '',
        inspectionDate: new Date().toISOString().split('T')[0],
        items: checklistItems,
        overallStatus: 'Incomplete',
        notes: '',
        equipmentHours: selectedEquipment.hours || 0
      });
    }
  }, [selectedEquipment]);

  const handleUpdateItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    if (!checklist) return;
    
    setChecklist(prev => ({
      ...prev!,
      items: prev!.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  const handleInspectorNameChange = (name: string) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, inspectorName: name }));
  };

  const handleNotesChange = (notes: string) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, notes }));
  };

  const handleEquipmentHoursChange = (hours: number) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, equipmentHours: hours }));
    
    // Also update the equipment hours in the equipment list
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment?.id ? { ...eq, hours } : eq
    ));
  };

  const handleMarkRentalReady = () => {
    if (!selectedEquipment || !checklist) return;
    
    // Update equipment status
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment.id 
        ? { 
            ...eq, 
            status: 'Available', 
            lastInspection: new Date().toISOString().split('T')[0],
            hours: checklist.equipmentHours || eq.hours
          }
        : eq
    ));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSelectedEquipment(null);
    setChecklist(null);
  };

  const handleMarkDamaged = () => {
    if (!selectedEquipment || !checklist) return;
    
    // Update equipment status
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment.id 
        ? { 
            ...eq, 
            status: 'Damaged', 
            lastInspection: new Date().toISOString().split('T')[0],
            hours: checklist.equipmentHours || eq.hours
          }
        : eq
    ));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSelectedEquipment(null);
    setChecklist(null);
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to a database
    console.log('Saving draft:', checklist);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateChecklistMaster = (name: string) => {
    setCurrentChecklistMasterName(name);
    setCurrentView('admin');
  };

  const handleEditChecklistMaster = (systemId: string) => {
    setEditingSystemId(systemId);
    setCurrentView('edit-checklist-master');
  };

  const handleUpdateChecklistMaster = (name: string) => {
    // In a real app, this would update the system name in the database
    console.log('Updating system', editingSystemId, 'to name:', name);
    setCurrentView('checklist-master');
  };

  const handleNavigateToRentalReady = () => {
    setCurrentView('admin');
  };

  const handleNavigateToCustomerAdmin = () => {
    setCurrentView('customer-admin');
  };

  const handleCustomerChecklistComplete = (responses: any[], totalCost: number) => {
    console.log('Customer checklist completed:', { responses, totalCost });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (currentView === 'navigation') {
    return (
      <Navigation
        onNavigateToChecklistMaster={() => setCurrentView('checklist-master')}
        onNavigateToRentalReadyAdmin={() => setCurrentView('admin')}
        onNavigateToCustomerAdmin={() => setCurrentView('customer-admin')}
        onNavigateToEquipmentManagement={() => setCurrentView('rental-ready')}
      />
    );
  }

  if (currentView === 'checklist-master') {
    return (
      <ChecklistMasterDashboard
        onCreateNew={() => setCurrentView('create-checklist-master')}
        onEditSystem={handleEditChecklistMaster}
        onNavigateToRentalReady={handleNavigateToRentalReady}
        onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
        onNavigateToEquipmentManagement={() => setCurrentView('rental-ready')}
      />
    );
  }

  if (currentView === 'create-checklist-master') {
    return (
      <GuidedChecklistWorkflow
        onComplete={handleCreateChecklistMaster}
        onCancel={() => setCurrentView('checklist-master')}
      />
    );
  }

  if (currentView === 'edit-checklist-master') {
    return (
      <EditChecklistMasterForm
        systemId={editingSystemId}
        onSave={handleUpdateChecklistMaster}
        onCancel={() => setCurrentView('checklist-master')}
      />
    );
  }

  if (currentView === 'rental-ready') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Rental Ready Management</h1>
                  <p className="text-sm text-gray-600">Equipment Inspection & Status Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('customer-delivery')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer Delivery</span>
                </button>
                <button
                  onClick={() => setCurrentView('customer-return')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer Return</span>
                </button>
                <button
                  onClick={() => setCurrentView('rental-ready')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Equipment Mgt</span>
                </button>
                <button
                  onClick={() => setCurrentView('checklist-master')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Checklist Mgt.</span>
                </button>
                <button
                  onClick={() => setCurrentView('customer-admin')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-green-800 font-medium">
                  Equipment status updated successfully!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Selector */}
            <div className="lg:col-span-1">
              <EquipmentSelector
                equipment={equipment}
                selectedEquipment={selectedEquipment}
                onSelectEquipment={setSelectedEquipment}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Checklist Form */}
            <div className="lg:col-span-2">
              {selectedEquipment && checklist ? (
                <ChecklistForm
                  equipment={selectedEquipment}
                  items={checklist.items}
                  onUpdateItem={handleUpdateItem}
                  inspectorName={checklist.inspectorName}
                  onInspectorNameChange={handleInspectorNameChange}
                  notes={checklist.notes || ''}
                  onNotesChange={handleNotesChange}
                  equipmentHours={checklist.equipmentHours || 0}
                  onEquipmentHoursChange={handleEquipmentHoursChange}
                  inspectors={mockInspectors}
                  onMarkRentalReady={handleMarkRentalReady}
                  onMarkDamaged={handleMarkDamaged}
                  onSaveDraft={handleSaveDraft}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Equipment to Begin
                  </h3>
                  <p className="text-gray-600">
                    Choose equipment from the list to start the rental ready inspection process.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return <AdminDashboard 
      onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
      onNavigateToChecklistMaster={() => setCurrentView('checklist-master')}
      onNavigateToRentalReady={() => setCurrentView('admin')}
      onNavigateToEquipmentManagement={() => setCurrentView('rental-ready')}
    />;
  }

  if (currentView === 'customer-admin') {
    return <CustomerAdminDashboard 
      onNavigateToChecklistMaster={() => setCurrentView('checklist-master')}
      onNavigateToRentalReady={() => setCurrentView('admin')}
      onNavigateToEquipmentManagement={() => setCurrentView('rental-ready')}
    />;
  }

  if (currentView === 'customer-delivery') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Customer Delivery Checklist</h1>
                  <p className="text-sm text-gray-600">Equipment Delivery Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('checklist')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Main</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-green-800 font-medium">
                  Equipment status updated successfully!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Selector */}
            <div className="lg:col-span-1">
              <EquipmentSelector
                equipment={equipment}
                selectedEquipment={selectedEquipment}
                onSelectEquipment={setSelectedEquipment}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Checklist Form */}
            <div className="lg:col-span-2">
              {selectedEquipment && checklist ? (
                <ChecklistForm
                  equipment={selectedEquipment}
                  items={checklist.items}
                  onUpdateItem={handleUpdateItem}
                  inspectorName={checklist.inspectorName}
                  onInspectorNameChange={handleInspectorNameChange}
                  notes={checklist.notes || ''}
                  onNotesChange={handleNotesChange}
                  equipmentHours={checklist.equipmentHours || 0}
                  onEquipmentHoursChange={handleEquipmentHoursChange}
                  inspectors={mockInspectors}
                  onMarkRentalReady={handleMarkRentalReady}
                  onMarkDamaged={handleMarkDamaged}
                  onSaveDraft={handleSaveDraft}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Equipment to Begin
                  </h3>
                  <p className="text-gray-600">
                    Choose equipment from the list to start the rental ready inspection process.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'customer-return') {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerDeliveryChecklist
          mode="return"
          equipmentName="Excavator 320D"
          customerName="John Smith Construction"
          startHours={1250}
          onComplete={handleCustomerChecklistComplete}
        />
      </div>
    );
  }
}

export default App;
```

### src/components/admin/AdminNavigation.tsx
```tsx
import React from 'react';
import { ClipboardList, Settings, Users, FileText, Database } from 'lucide-react';

export type AdminNavView =
  | 'checklist-master'
  | 'rental-ready-admin'
  | 'customer-admin'
  | 'rental-ready';

interface AdminNavigationProps {
  currentView: AdminNavView;
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReady: () => void; // renamed for consistency
  onNavigateToCustomerAdmin: () => void;
  onNavigateToEquipmentManagement: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentView,
  onNavigateToChecklistMaster,
  onNavigateToRentalReady,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement,
}) => {
  const navItems = [
    {
      id: 'checklist-master',
      label: 'Checklist Master',
      description: 'Manage checklist systems',
      icon: ClipboardList,
      color: 'blue',
      onClick: onNavigateToChecklistMaster,
    },
    {
      id: 'rental-ready-admin',
      label: 'Rental Ready Admin',
      description: 'Questions & templates',
      icon: Settings,
      color: 'green',
      onClick: onNavigateToRentalReady,
    },
    {
      id: 'customer-admin',
      label: 'Customer Admin',
      description: 'Delivery & return checklists',
      icon: Users,
      color: 'purple',
      onClick: onNavigateToCustomerAdmin,
    },
    {
      id: 'rental-ready', // align with App view key
      label: 'Equipment Mgt.',
      description: 'Equipment inspections',
      icon: FileText,
      color: 'indigo',
      onClick: onNavigateToEquipmentManagement,
    },
  ] as const;

  const getButtonStyles = (itemId: string, color: string) => {
    const isActive = currentView === itemId;

    const colorStyles: Record<string, string> = {
      blue: isActive
        ? 'bg-blue-100 border-blue-300 text-blue-800'
        : 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
      green: isActive
        ? 'bg-green-100 border-green-300 text-green-800'
        : 'border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700',
      purple: isActive
        ? 'bg-purple-100 border-purple-300 text-purple-800'
        : 'border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700',
      indigo: isActive
        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
        : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700',
    };

    return `flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
      colorStyles[color]
    }`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-gray-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Admin Navigation</h3>
          <p className="text-sm text-gray-600">Navigate between admin screens</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              disabled={isActive}
              className={`${getButtonStyles(item.id, item.color)} ${
                isActive ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;
```

### src/components/admin/AdminDashboard.tsx
```tsx
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
```

### src/components/customer/CustomerAdminDashboard.tsx
```tsx
import React, { useState } from 'react';
import { Users, Database, FileText, ClipboardList, Settings } from 'lucide-react';
import AdminNavigation, { AdminNavView } from '../admin/AdminNavigation';
import CustomerQuestionManager from './CustomerQuestionManager';
import CustomerChecklistTemplateManager from './CustomerChecklistTemplateManager';

interface CustomerAdminDashboardProps {
  onNavigateToRentalReady: () => void;
  onNavigateToChecklistMaster: () => void;
  onNavigateToEquipmentManagement: () => void;
}

type CustomerAdminView = 'overview' | 'questions' | 'templates';

const CustomerAdminDashboard: React.FC<CustomerAdminDashboardProps> = ({ 
  onNavigateToRentalReady, 
  onNavigateToChecklistMaster,
  onNavigateToEquipmentManagement
}) => {
  const [currentView, setCurrentView] = useState<CustomerAdminView>('overview');
  const currentNavView: AdminNavView = 'customer-admin';

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
                Create and manage delivery/return questions with cost calculations.
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
                Build delivery/return checklist templates for different equipment categories.
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
                <p className="text-sm text-gray-600">Manage customer delivery/return questions and templates</p>
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
          onNavigateToRentalReady={onNavigateToRentalReady}
          onNavigateToCustomerAdmin={() => { /* already here */ }}
          onNavigateToEquipmentManagement={onNavigateToEquipmentManagement}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('questions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'questions'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Questions & Categories
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'templates'
                  ? 'bg-purple-100 text-purple-700'
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

export default CustomerAdminDashboard;
```

## What Was Fixed

1. **AdminNavigation Component**: 
   - Added proper TypeScript export for `AdminNavView`
   - Standardized prop names (`onNavigateToRentalReady`, `onNavigateToEquipmentManagement`)
   - Fixed button ID mapping to match actual view names

2. **AdminDashboard Component**:
   - Restored full Questions & Templates functionality
   - Added AdminNavigation with proper prop passing
   - Maintained all existing features

3. **CustomerAdminDashboard Component**:
   - Restored full Customer Questions & Templates functionality  
   - Added AdminNavigation with proper prop passing
   - Maintained all existing features

4. **ChecklistMasterDashboard Component**:
   - Updated to use the fixed AdminNavigation
   - Proper prop name consistency

## Navigation Flow
- Navigation page → Checklist Master → AdminNavigation works
- Navigation page → Rental Ready Admin → AdminNavigation works  
- Navigation page → Customer Admin → AdminNavigation works
- Navigation page → Equipment Mgt → Equipment management works

## Backup Created
This backup preserves the working state with:
- ✅ Fixed navigation between all screens
- ✅ Full admin functionality (Questions, Templates)
- ✅ Full customer admin functionality
- ✅ Proper TypeScript types
- ✅ Consistent prop naming

Use this backup if future changes break the navigation system.