# Complete Project Export for Claude Repairs

## Project Overview
This is a Rental Ready Checklist System built with React, TypeScript, and Tailwind CSS. The system provides inspection checklists, customer delivery/return processes, and administrative management tools.

## Current Issues to Fix
1. Navigation prop name mismatches between components
2. Missing import statements or incorrect import paths
3. Function reference errors in AdminNavigation component
4. Potential type mismatches in component props

## Project Structure

### Package.json
```json
{
  "name": "rental-ready-checklist-system",
  "private": true,
  "version": "1.2.0",
  "type": "module",
  "description": "Equipment rental management system with inspection checklists and customer delivery/return processes",
  "keywords": ["equipment", "rental", "checklist", "inspection", "mobile", "react", "typescript"],
  "author": "Kabba 2 Rental System",
  "license": "PROPRIETARY",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging", 
    "build:prod": "tsc && vite build --mode production",
    "build:analyze": "vite build --mode production && npx vite-bundle-analyzer dist",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "test": "echo \"Tests will be added in future version\" && exit 0"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### Main App Component (src/App.tsx)
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
import AdminNavigation from './components/admin/AdminNavigation';
import { ClipboardList, Settings, Users, Truck, Package } from 'lucide-react';

type AppView = 'checklist' | 'admin' | 'customer-admin' | 'customer-delivery' | 'customer-return' | 'checklist-master' | 'create-checklist-master' | 'edit-checklist-master' | 'rental-ready' | 'guided-workflow';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('rental-ready');
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
      onNavigateToCustomerAdmin={() => setCurrentView('customer-admin')}
      onNavigateToChecklistMaster={() => setCurrentView('checklist-master')}
      onNavigateToRentalReady={() => setCurrentView('admin')}
      onNavigateToEquipmentManagement={() => setCurrentView('rental-ready')}
    />;
  }

  if (currentView === 'customer-admin') {
    return <CustomerAdminDashboard 
      onNavigateToRentalReady={() => setCurrentView('admin')}
      onNavigateToChecklistMaster={() => setCurrentView('checklist-master')}
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
}

export default App;
```

### Type Definitions

#### src/types/equipment.ts
```tsx
/**
 * Equipment and Checklist Type Definitions
 * 
 * Core types for the rental ready checklist system including equipment
 * management, inspection checklists, and status tracking.
 */
export interface Equipment {
  /**
   * Equipment Status Lifecycle:
   * Damaged → Maint. Hold → Available → Rented → [Return] → Available
   */
  id: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  status: 'Damaged' | 'Maint. Hold' | 'Rented' | 'Available';
  lastInspection?: string;
  hours?: number;
}

export interface AnswerOption {
  id: string;
  description: string;
  status: 'Rental Ready' | 'Maint. Hold' | 'Damaged';
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  answerOptions: AnswerOption[];
  selectedAnswerId?: string;
  required: boolean;
  notes?: string;
}

export interface RentalReadyChecklist {
  equipmentId: string;
  inspectorName: string;
  inspectionDate: string;
  items: ChecklistItem[];
  overallStatus: 'Incomplete' | 'Complete' | 'Damaged';
  notes?: string;
  equipmentHours?: number;
}

export interface Inspector {
  id: string;
  name: string;
  active: boolean;
}
```

#### src/types/admin.ts
```tsx
/**
 * Admin System Type Definitions
 * 
 * Types for the administrative management system including question
 * management, category organization, and checklist template building.
 */
export interface QuestionCategory {
  /**
   * Question categories for organizing inspection items
   */
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  name: string;
  categoryId: string;
  required: boolean;
  answerOptions: AnswerOption[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: string;
  description: string;
  status: 'Rental Ready' | 'Maint. Hold' | 'Damaged';
  sortOrder: number;
  dollarValue?: number; // Added for customer pricing
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  equipmentCategory: string;
  questions: ChecklistTemplateQuestion[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistTemplateQuestion {
  id: string;
  questionId: string;
  sortOrder: number;
  required: boolean;
}

export interface DragItem {
  id: string;
  type: 'question';
  questionId: string;
  name: string;
  category: string;
  required: boolean;
}
```

#### src/types/customerAdmin.ts
```tsx
/**
 * Customer Admin System Type Definitions
 * 
 * Types for customer-facing checklist system including delivery/return
 * checklists, cost calculations, and rental period management.
 */
export interface CustomerQuestionCategory {
  /**
   * Customer question categories for delivery/return items
   */
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerQuestion {
  id: string;
  name: string;
  categoryId: string;
  required: boolean;
  deliveryText: string;  // e.g., "Keys Delivered"
  returnText: string;    // e.g., "Keys Returned"
  syncTexts: boolean;    // If true, delivery and return texts are synced
  deliveryAnswers: CustomerAnswerOption[];
  returnAnswers: CustomerAnswerOption[];
  answerSyncMap: Record<number, boolean>; // Maps answer index to sync status
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAnswerOption {
  id: string;
  description: string;
  dollarValue: number;  // Single value - calculation is delivery value minus return value
  sortOrder: number;
}

export interface CustomerChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  equipmentCategory: string;
  questions: CustomerChecklistTemplateQuestion[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerChecklistTemplateQuestion {
  id: string;
  questionId: string;
  sortOrder: number;
  required: boolean;
}

export interface CustomerDragItem {
  id: string;
  type: 'question';
  questionId: string;
  name: string;
  category: string;
  required: boolean;
}

export interface RentalPeriod {
  id: string;
  name: string;
  allowedHours: number;
  overageRatePerHour: number;
}

export interface CustomerChecklistData {
  inspectorName: string;
  startHours: number;
  endHours?: number;
  rentalPeriod: RentalPeriod;
  responses: CustomerChecklistResponse[];
}

export interface CustomerChecklistResponse {
  questionId: string;
  deliveryAnswerId?: string;
  returnAnswerId?: string;
  deliveryNotes?: string;
  returnNotes?: string;
}
```

#### src/types/checklistMaster.ts
```tsx
/**
 * Checklist Master System Type Definitions
 * 
 * Types for the master checklist system that combines rental ready
 * and customer checklists under one unified entity. These systems
 * are independent and get assigned to Equipment IDs separately.
 */

export interface ChecklistMasterSystem {
  id: string;
  name: string;
  rentalReadyTemplateId?: string;
  customerTemplateId?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ChecklistMasterSystemWithCounts extends ChecklistMasterSystem {
  rentalReadyQuestionCount: number;
  customerQuestionCount: number;
}
```

## Key Components That Need Fixing

### AdminNavigation Component (src/components/admin/AdminNavigation.tsx)
```tsx
import React from 'react';
import { ClipboardList, Settings, Users, FileText, Database } from 'lucide-react';

interface AdminNavigationProps {
  currentView: 'checklist-master' | 'rental-ready-admin' | 'customer-admin' | 'rental-ready-management';
  onNavigateToChecklistMaster: () => void;
  onNavigateToRentalReadyAdmin: () => void;
  onNavigateToCustomerAdmin: () => void;
  onNavigateToEquipmentManagement: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentView,
  onNavigateToChecklistMaster,
  onNavigateToRentalReadyAdmin,
  onNavigateToCustomerAdmin,
  onNavigateToEquipmentManagement
}) => {
  const navItems = [
    {
      id: 'checklist-master',
      label: 'Checklist Master',
      description: 'Manage checklist systems',
      icon: ClipboardList,
      color: 'blue',
      onClick: onNavigateToChecklistMaster
    },
    {
      id: 'rental-ready-admin',
      label: 'Rental Ready Admin',
      description: 'Questions & templates',
      icon: Settings,
      color: 'green',
      onClick: onNavigateToRentalReadyAdmin
    },
    {
      id: 'customer-admin',
      label: 'Customer Admin',
      description: 'Delivery & return checklists',
      icon: Users,
      color: 'purple',
      onClick: onNavigateToCustomerAdmin
    },
    {
      id: 'rental-ready-management',
      label: 'Equipment Mgt.',
      description: 'Equipment inspections',
      icon: FileText,
      color: 'indigo',
      onClick: () => onNavigateToEquipmentManagement()
    }
  ];

  const getButtonStyles = (itemId: string, color: string) => {
    const isActive = currentView === itemId;
    
    const colorStyles = {
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
        : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
    };

    return `flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${colorStyles[color as keyof typeof colorStyles]}`;
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
              className={`${getButtonStyles(item.id, item.color)} ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
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

## Issues to Address

1. **Navigation Prop Mismatches**: The AdminNavigation component expects specific prop names that don't match what parent components are passing
2. **Missing Import Statements**: Some components may have missing or incorrect import paths
3. **Function Reference Errors**: onClick handlers may not be properly bound or passed
4. **Type Mismatches**: Component props may not match expected interfaces

## Instructions for Claude

Please analyze this project export and fix the following specific issues:

1. **Fix all navigation prop name mismatches** between parent components and AdminNavigation
2. **Ensure all import statements are correct** and point to existing files
3. **Fix any function reference errors** in onClick handlers
4. **Verify all component prop interfaces match** what's being passed

Focus on making the navigation system work properly so users can move between:
- Checklist Master Dashboard
- Rental Ready Admin
- Customer Admin  
- Equipment Management (Rental Ready)

The main error is that `onNavigateToEquipmentManagement is not a function` when clicking the Equipment Mgt. button in AdminNavigation.

## Project File Structure
```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminNavigation.tsx
│   │   ├── QuestionManager.tsx
│   │   └── ChecklistTemplateManager.tsx
│   ├── customer/
│   │   ├── CustomerAdminDashboard.tsx
│   │   ├── CustomerQuestionManager.tsx
│   │   ├── CustomerChecklistTemplateManager.tsx
│   │   └── CustomerDeliveryChecklist.tsx
│   ├── checklistMaster/
│   │   ├── ChecklistMasterDashboard.tsx
│   │   ├── CreateChecklistMasterForm.tsx
│   │   ├── EditChecklistMasterForm.tsx
│   │   ├── GuidedChecklistWorkflow.tsx
│   │   ├── RentalReadyTemplateSelector.tsx
│   │   └── CustomerTemplateSelector.tsx
│   ├── ChecklistForm.tsx
│   └── EquipmentSelector.tsx
├── data/
│   ├── mockData.ts
│   ├── adminMockData.ts
│   ├── customerAdminMockData.ts
│   └── checklistMasterMockData.ts
├── types/
│   ├── equipment.ts
│   ├── admin.ts
│   ├── customerAdmin.ts
│   └── checklistMaster.ts
└── App.tsx
```

Please fix these navigation issues so the admin navigation works properly throughout the application.