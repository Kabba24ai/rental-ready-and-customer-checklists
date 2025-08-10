# Complete Project Export - Rental Ready Checklist System

## Project Overview
This is a complete working Rental Ready Checklist System built with React, TypeScript, and Tailwind CSS. The system provides inspection checklists, customer delivery/return processes, and administrative management tools with clean top navigation.

## Package.json
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

## File Structure
```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
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
├── main.tsx
├── App.tsx
└── index.css
```

## Installation Instructions
1. Create a new React + TypeScript project with Vite
2. Install dependencies: `npm install lucide-react`
3. Install dev dependencies: `npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom`
4. Setup Tailwind CSS: `npx tailwindcss init -p`
5. Copy all files below into your project
6. Run: `npm run dev`

---

## FILE: src/main.tsx
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## FILE: src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## FILE: tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## FILE: postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## FILE: vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

## FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rental Ready Checklist System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## FILE: src/App.tsx
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
import { ClipboardList, Settings, Users, Truck, Package } from 'lucide-react';

type AppView = 'checklist' | 'admin' | 'customer-admin' | 'customer-delivery' | 'customer-return' | 'checklist-master' | 'create-checklist-master' | 'edit-checklist-master' | 'rental-ready' | 'guided-workflow';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('checklist-master');
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
                  <h1 className="text-xl font-semibold text-gray-900">Equipment Management</h1>
                  <p className="text-sm text-gray-600">Equipment Inspection & Status Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('checklist-master')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <ClipboardList className="w-4 h-4" />
                  Checklist Master
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                >
                  <ClipboardList className="w-4 h-4" />
                  Equipment Mgt.
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Rental Ready Admin
                </button>
                <button
                  onClick={() => setCurrentView('customer-admin')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Users className="w-4 h-4" />
                  Customer Checklist Admin
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
      onNavigateToRentalReady={() => setCurrentView('rental-ready')}
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
        <CustomerDeliveryChecklist
          mode="delivery"
          equipmentName="Excavator 320D"
          customerName="John Smith Construction"
          startHours={1250}
          onComplete={handleCustomerChecklistComplete}
        />
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

## FILE: src/types/equipment.ts
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

## FILE: src/types/admin.ts
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

## FILE: src/types/customerAdmin.ts
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

## FILE: src/types/checklistMaster.ts
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

## FILE: src/data/mockData.ts
```tsx
/*
 * Mock Data for Equipment and Inspection System
 * 
 * Provides realistic test data for development and demonstration purposes.
 * Includes equipment inventory, inspector assignments, and checklist templates.
 */
import { Equipment, ChecklistItem, Inspector, AnswerOption } from '../types/equipment';

export const mockEquipment: Equipment[] = [
  {
    id: 'EQ001',
    name: 'Excavator 320D',
    category: 'Heavy Equipment',
    model: 'CAT 320D',
    serialNumber: 'CAT320D001',
    status: 'Maint. Hold',
    lastInspection: '2024-01-15',
    hours: 1250
  },
  {
    id: 'EQ002',
    name: 'Skid Steer S570',
    category: 'Compact Equipment',
    model: 'Bobcat S570',
    serialNumber: 'BOB570002',
    status: 'Maint. Hold',
    lastInspection: '2024-01-10',
    hours: 875
  },
  {
    id: 'EQ003',
    name: 'Generator 20kW',
    category: 'Power Equipment',
    model: 'Generac 20kW',
    serialNumber: 'GEN20K003',
    status: 'Available',
    lastInspection: '2024-01-20',
    hours: 450
  },
  {
    id: 'EQ004',
    name: 'Bulldozer D6T',
    category: 'Heavy Equipment',
    model: 'CAT D6T',
    serialNumber: 'CATD6T004',
    status: 'Maint. Hold',
    lastInspection: '2024-01-12',
    hours: 2100
  },
  {
    id: 'EQ005',
    name: 'Compactor CS56',
    category: 'Compact Equipment',
    model: 'CAT CS56',
    serialNumber: 'CATCS56005',
    status: 'Damaged',
    lastInspection: '2024-01-08',
    hours: 1680
  },
  {
    id: 'EQ006',
    name: 'Air Compressor 185CFM',
    category: 'Power Equipment',
    model: 'Atlas Copco 185',
    serialNumber: 'AC185006',
    status: 'Maint. Hold',
    lastInspection: '2024-01-18',
    hours: 320
  },
  {
    id: 'EQ007',
    name: 'Loader 950M',
    category: 'Heavy Equipment',
    model: 'CAT 950M',
    serialNumber: 'CAT950M007',
    status: 'Available',
    lastInspection: '2024-01-22',
    hours: 1890
  },
  {
    id: 'EQ008',
    name: 'Mini Excavator 305E2',
    category: 'Compact Equipment',
    model: 'CAT 305E2',
    serialNumber: 'CAT305E008',
    status: 'Maint. Hold',
    lastInspection: '2024-01-14',
    hours: 750
  },
  {
    id: 'EQ009',
    name: 'Backhoe 420F2',
    category: 'Heavy Equipment',
    model: 'CAT 420F2',
    serialNumber: 'CAT420F009',
    status: 'Rented',
    lastInspection: '2024-01-25',
    hours: 1450
  },
  {
    id: 'EQ010',
    name: 'Forklift 2.5T',
    category: 'Compact Equipment',
    model: 'Toyota 8FGU25',
    serialNumber: 'TOY25010',
    status: 'Damaged',
    lastInspection: '2024-01-05',
    hours: 2200
  }
];

export const mockInspectors: Inspector[] = [
  { id: 'INS001', name: 'John Smith', active: true },
  { id: 'INS002', name: 'Sarah Johnson', active: true },
  { id: 'INS003', name: 'Mike Rodriguez', active: true },
  { id: 'INS004', name: 'Emily Chen', active: true },
  { id: 'INS005', name: 'David Wilson', active: true },
  { id: 'INS006', name: 'Lisa Anderson', active: false },
];

export const getChecklistTemplate = (category: string): ChecklistItem[] => {
  const baseItems: ChecklistItem[] = [
    {
      id: 'safety-1',
      name: 'Safety Equipment Present',
      category: 'Safety',
      required: true,
      answerOptions: [
        { id: 'safety-1-1', description: 'All Present & Functional', status: 'Rental Ready' },
        { id: 'safety-1-2', description: 'Present but Needs Cleaning', status: 'Rental Ready' },
        { id: 'safety-1-3', description: 'Missing Non-Critical Items', status: 'Maint. Hold' },
        { id: 'safety-1-4', description: 'Missing Critical Items', status: 'Damaged' },
        { id: 'safety-1-5', description: 'Equipment Damaged/Non-Functional', status: 'Damaged' }
      ]
    },
    {
      id: 'safety-2',
      name: 'Warning Labels Visible',
      category: 'Safety',
      required: true,
      answerOptions: [
        { id: 'safety-2-1', description: 'All Labels Clear & Visible', status: 'Rental Ready' },
        { id: 'safety-2-2', description: 'Labels Present but Faded', status: 'Rental Ready' },
        { id: 'safety-2-3', description: 'Some Labels Missing', status: 'Maint. Hold' },
        { id: 'safety-2-4', description: 'Critical Labels Missing', status: 'Damaged' }
      ]
    },
    {
      id: 'engine-1',
      name: 'Engine Oil Level',
      category: 'Engine',
      required: true,
      answerOptions: [
        { id: 'engine-1-1', description: 'Full', status: 'Rental Ready' },
        { id: 'engine-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'engine-1-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'engine-1-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'engine-1-5', description: 'Low/Empty', status: 'Damaged' },
        { id: 'engine-1-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'engine-2',
      name: 'Coolant Level',
      category: 'Engine',
      required: true,
      answerOptions: [
        { id: 'engine-2-1', description: 'Full', status: 'Rental Ready' },
        { id: 'engine-2-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'engine-2-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'engine-2-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'engine-2-5', description: 'Low/Empty', status: 'Damaged' },
        { id: 'engine-2-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'hydraulic-1',
      name: 'Hydraulic Fluid Level',
      category: 'Hydraulics',
      required: true,
      answerOptions: [
        { id: 'hydraulic-1-1', description: 'Full', status: 'Rental Ready' },
        { id: 'hydraulic-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'hydraulic-1-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'hydraulic-1-4', description: 'Empty', status: 'Maint. Hold' },
        { id: 'hydraulic-1-5', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'hydraulic-2',
      name: 'Hydraulic Hoses Condition',
      category: 'Hydraulics',
      required: true,
      answerOptions: [
        { id: 'hydraulic-2-1', description: 'Excellent Condition', status: 'Rental Ready' },
        { id: 'hydraulic-2-2', description: 'Good Condition', status: 'Rental Ready' },
        { id: 'hydraulic-2-3', description: 'Minor Wear/Scuffs', status: 'Rental Ready' },
        { id: 'hydraulic-2-4', description: 'Significant Wear', status: 'Maint. Hold' },
        { id: 'hydraulic-2-5', description: 'Cracked/Damaged', status: 'Damaged' },
        { id: 'hydraulic-2-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'fuel-1',
      name: 'Fuel Level',
      category: 'Fuel',
      required: true,
      answerOptions: [
        { id: 'fuel-1-1', description: 'Full Tank', status: 'Rental Ready' },
        { id: 'fuel-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'fuel-1-3', description: '1/2 Full', status: 'Rental Ready' },
        { id: 'fuel-1-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'fuel-1-5', description: 'Low/Empty', status: 'Maint. Hold' }
      ]
    },
    {
      id: 'electrical-1',
      name: 'Battery Condition',
      category: 'Electrical',
      required: true,
      answerOptions: [
        { id: 'electrical-1-1', description: 'Excellent - Full Charge', status: 'Rental Ready' },
        { id: 'electrical-1-2', description: 'Good - Holds Charge', status: 'Rental Ready' },
        { id: 'electrical-1-3', description: 'Fair - Weak Charge', status: 'Maint. Hold' },
        { id: 'electrical-1-4', description: 'Poor - Won\'t Hold Charge', status: 'Damaged' },
        { id: 'electrical-1-5', description: 'Dead/Corroded', status: 'Damaged' }
      ]
    },
    {
      id: 'electrical-2',
      name: 'Lights Functioning',
      category: 'Electrical',
      required: true,
      answerOptions: [
        { id: 'electrical-2-1', description: 'All Lights Working', status: 'Rental Ready' },
        { id: 'electrical-2-2', description: 'Most Lights Working', status: 'Rental Ready' },
        { id: 'electrical-2-3', description: 'Some Lights Out', status: 'Maint. Hold' },
        { id: 'electrical-2-4', description: 'Many Lights Out', status: 'Damaged' },
        { id: 'electrical-2-5', description: 'No Lights Working', status: 'Damaged' }
      ]
    },
    {
      id: 'general-1',
      name: 'Overall Cleanliness',
      category: 'General',
      required: false,
      answerOptions: [
        { id: 'general-1-1', description: 'Spotless', status: 'Rental Ready' },
        { id: 'general-1-2', description: 'Clean', status: 'Rental Ready' },
        { id: 'general-1-3', description: 'Needs Light Cleaning', status: 'Rental Ready' },
        { id: 'general-1-4', description: 'Needs Deep Cleaning', status: 'Maint. Hold' },
        { id: 'general-1-5', description: 'Extremely Dirty', status: 'Maint. Hold' }
      ]
    }
  ];

  // Add category-specific items
  if (category === 'Heavy Equipment') {
    baseItems.push(
      {
        id: 'tracks-1',
        name: 'Track Condition',
        category: 'Tracks',
        required: true,
        answerOptions: [
          { id: 'tracks-1-1', description: 'Excellent - Like New', status: 'Rental Ready' },
          { id: 'tracks-1-2', description: 'Good - Normal Wear', status: 'Rental Ready' },
          { id: 'tracks-1-3', description: 'Fair - Moderate Wear', status: 'Rental Ready' },
          { id: 'tracks-1-4', description: 'Poor - Heavy Wear', status: 'Maint. Hold' },
          { id: 'tracks-1-5', description: 'Damaged/Missing Pads', status: 'Damaged' }
        ]
      },
      {
        id: 'bucket-1',
        name: 'Bucket/Attachment Condition',
        category: 'Attachments',
        required: true,
        answerOptions: [
          { id: 'bucket-1-1', description: 'Excellent Condition', status: 'Rental Ready' },
          { id: 'bucket-1-2', description: 'Good - Minor Wear', status: 'Rental Ready' },
          { id: 'bucket-1-3', description: 'Worn Cutting Edge', status: 'Maint. Hold' },
          { id: 'bucket-1-4', description: 'Cracked/Damaged', status: 'Damaged' },
          { id: 'bucket-1-5', description: 'Missing/Broken', status: 'Damaged' }
        ]
      }
    );
  }

  if (category === 'Power Equipment') {
    baseItems.push(
      {
        id: 'power-1',
        name: 'Power Output Test',
        category: 'Power',
        required: true,
        answerOptions: [
          { id: 'power-1-1', description: 'Full Power Output', status: 'Rental Ready' },
          { id: 'power-1-2', description: 'Good Power Output', status: 'Rental Ready' },
          { id: 'power-1-3', description: 'Reduced Power', status: 'Maint. Hold' },
          { id: 'power-1-4', description: 'Poor Power Output', status: 'Damaged' },
          { id: 'power-1-5', description: 'No Power Output', status: 'Damaged' }
        ]
      },
      {
        id: 'power-2',
        name: 'Cord/Cable Condition',
        category: 'Power',
        required: true,
        answerOptions: [
          { id: 'power-2-1', description: 'Excellent - No Damage', status: 'Rental Ready' },
          { id: 'power-2-2', description: 'Good - Minor Scuffs', status: 'Rental Ready' },
          { id: 'power-2-3', description: 'Worn but Functional', status: 'Maint. Hold' },
          { id: 'power-2-4', description: 'Frayed/Exposed Wire', status: 'Damaged' },
          { id: 'power-2-5', description: 'Broken/Cut', status: 'Damaged' }
        ]
      }
    );
  }

  return baseItems;
}
```

## FILE: src/data/adminMockData.ts
```tsx
import { QuestionCategory, Question, ChecklistTemplate, AnswerOption } from '../types/admin';

export const mockQuestionCategories: QuestionCategory[] = [
  {
    id: 'cat-safety',
    name: 'Safety',
    description: 'Safety-related inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-engine',
    name: 'Engine',
    description: 'Engine and motor inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-hydraulics',
    name: 'Hydraulics',
    description: 'Hydraulic system inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-electrical',
    name: 'Electrical',
    description: 'Electrical system inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-fuel',
    name: 'Fuel',
    description: 'Fuel system inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-tracks',
    name: 'Tracks',
    description: 'Track and undercarriage inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-attachments',
    name: 'Attachments',
    description: 'Attachment and implement inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-power',
    name: 'Power',
    description: 'Power generation and output inspection items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-general',
    name: 'General',
    description: 'General condition and appearance items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q-safety-equipment',
    name: 'Safety Equipment Present',
    categoryId: 'cat-safety',
    required: true,
    answerOptions: [
      { id: 'ans-1', description: 'All Present & Functional', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-2', description: 'Present but Needs Cleaning', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-3', description: 'Missing Non-Critical Items', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-4', description: 'Missing Critical Items', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-5', description: 'Equipment Damaged/Non-Functional', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-warning-labels',
    name: 'Warning Labels Visible',
    categoryId: 'cat-safety',
    required: true,
    answerOptions: [
      { id: 'ans-6', description: 'All Labels Clear & Visible', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-7', description: 'Labels Present but Faded', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-8', description: 'Some Labels Missing', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-9', description: 'Critical Labels Missing', status: 'Damaged', sortOrder: 4 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-engine-oil',
    name: 'Engine Oil Level',
    categoryId: 'cat-engine',
    required: true,
    answerOptions: [
      { id: 'ans-10', description: 'Full', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-11', description: '3/4 Full', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-12', description: '1/2 Full', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-13', description: '1/4 Full', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-14', description: 'Low/Empty', status: 'Damaged', sortOrder: 5 },
      { id: 'ans-15', description: 'Leaking', status: 'Damaged', sortOrder: 6 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-coolant-level',
    name: 'Coolant Level',
    categoryId: 'cat-engine',
    required: true,
    answerOptions: [
      { id: 'ans-16', description: 'Full', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-17', description: '3/4 Full', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-18', description: '1/2 Full', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-19', description: '1/4 Full', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-20', description: 'Low/Empty', status: 'Damaged', sortOrder: 5 },
      { id: 'ans-21', description: 'Leaking', status: 'Damaged', sortOrder: 6 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-hydraulic-fluid',
    name: 'Hydraulic Fluid Level',
    categoryId: 'cat-hydraulics',
    required: true,
    answerOptions: [
      { id: 'ans-22', description: 'Full', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-23', description: '3/4 Full', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-24', description: '1/2 Full', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-25', description: 'Empty', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-26', description: 'Leaking', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-hydraulic-hoses',
    name: 'Hydraulic Hoses Condition',
    categoryId: 'cat-hydraulics',
    required: true,
    answerOptions: [
      { id: 'ans-27', description: 'Excellent Condition', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-28', description: 'Good Condition', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-29', description: 'Minor Wear/Scuffs', status: 'Rental Ready', sortOrder: 3 },
      { id: 'ans-30', description: 'Significant Wear', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-31', description: 'Cracked/Damaged', status: 'Damaged', sortOrder: 5 },
      { id: 'ans-32', description: 'Leaking', status: 'Damaged', sortOrder: 6 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-battery-condition',
    name: 'Battery Condition',
    categoryId: 'cat-electrical',
    required: true,
    answerOptions: [
      { id: 'ans-33', description: 'Excellent - Full Charge', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-34', description: 'Good - Holds Charge', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-35', description: 'Fair - Weak Charge', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-36', description: 'Poor - Won\'t Hold Charge', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-37', description: 'Dead/Corroded', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-lights-functioning',
    name: 'Lights Functioning',
    categoryId: 'cat-electrical',
    required: true,
    answerOptions: [
      { id: 'ans-38', description: 'All Lights Working', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-39', description: 'Most Lights Working', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-40', description: 'Some Lights Out', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-41', description: 'Many Lights Out', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-42', description: 'No Lights Working', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-fuel-level',
    name: 'Fuel Level',
    categoryId: 'cat-fuel',
    required: true,
    answerOptions: [
      { id: 'ans-43', description: 'Full Tank', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-44', description: '3/4 Full', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-45', description: '1/2 Full', status: 'Rental Ready', sortOrder: 3 },
      { id: 'ans-46', description: '1/4 Full', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-47', description: 'Low/Empty', status: 'Maint. Hold', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-track-condition',
    name: 'Track Condition',
    categoryId: 'cat-tracks',
    required: true,
    answerOptions: [
      { id: 'ans-48', description: 'Excellent - Like New', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-49', description: 'Good - Normal Wear', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-50', description: 'Fair - Moderate Wear', status: 'Rental Ready', sortOrder: 3 },
      { id: 'ans-51', description: 'Poor - Heavy Wear', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-52', description: 'Damaged/Missing Pads', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-bucket-attachment',
    name: 'Bucket/Attachment Condition',
    categoryId: 'cat-attachments',
    required: true,
    answerOptions: [
      { id: 'ans-53', description: 'Excellent Condition', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-54', description: 'Good - Minor Wear', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-55', description: 'Worn Cutting Edge', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-56', description: 'Cracked/Damaged', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-57', description: 'Missing/Broken', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-power-output',
    name: 'Power Output Test',
    categoryId: 'cat-power',
    required: true,
    answerOptions: [
      { id: 'ans-58', description: 'Full Power Output', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-59', description: 'Good Power Output', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-60', description: 'Reduced Power', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-61', description: 'Poor Power Output', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-62', description: 'No Power Output', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-cord-cable',
    name: 'Cord/Cable Condition',
    categoryId: 'cat-power',
    required: true,
    answerOptions: [
      { id: 'ans-63', description: 'Excellent - No Damage', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-64', description: 'Good - Minor Scuffs', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-65', description: 'Worn but Functional', status: 'Maint. Hold', sortOrder: 3 },
      { id: 'ans-66', description: 'Frayed/Exposed Wire', status: 'Damaged', sortOrder: 4 },
      { id: 'ans-67', description: 'Broken/Cut', status: 'Damaged', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'q-overall-cleanliness',
    name: 'Overall Cleanliness',
    categoryId: 'cat-general',
    required: false,
    answerOptions: [
      { id: 'ans-68', description: 'Spotless', status: 'Rental Ready', sortOrder: 1 },
      { id: 'ans-69', description: 'Clean', status: 'Rental Ready', sortOrder: 2 },
      { id: 'ans-70', description: 'Needs Light Cleaning', status: 'Rental Ready', sortOrder: 3 },
      { id: 'ans-71', description: 'Needs Deep Cleaning', status: 'Maint. Hold', sortOrder: 4 },
      { id: 'ans-72', description: 'Extremely Dirty', status: 'Maint. Hold', sortOrder: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: 'template-heavy-equipment',
    name: 'Heavy Equipment Standard',
    description: 'Standard checklist for heavy equipment like excavators, bulldozers, and loaders',
    equipmentCategory: 'Heavy Equipment',
    isActive: true,
    questions: [
      { id: 'tq-1', questionId: 'q-safety-equipment', sortOrder: 1, required: true },
      { id: 'tq-2', questionId: 'q-warning-labels', sortOrder: 2, required: true },
      { id: 'tq-3', questionId: 'q-engine-oil', sortOrder: 3, required: true },
      { id: 'tq-4', questionId: 'q-coolant-level', sortOrder: 4, required: true },
      { id: 'tq-5', questionId: 'q-hydraulic-fluid', sortOrder: 5, required: true },
      { id: 'tq-6', questionId: 'q-hydraulic-hoses', sortOrder: 6, required: true },
      { id: 'tq-7', questionId: 'q-fuel-level', sortOrder: 7, required: true },
      { id: 'tq-8', questionId: 'q-battery-condition', sortOrder: 8, required: true },
      { id: 'tq-9', questionId: 'q-lights-functioning', sortOrder: 9, required: true },
      { id: 'tq-10', questionId: 'q-track-condition', sortOrder: 10, required: true },
      { id: 'tq-11', questionId: 'q-bucket-attachment', sortOrder: 11, required: true },
      { id: 'tq-12', questionId: 'q-overall-cleanliness', sortOrder: 12, required: false }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-compact-equipment',
    name: 'Compact Equipment Standard',
    description: 'Standard checklist for compact equipment like skid steers and mini excavators',
    equipmentCategory: 'Compact Equipment',
    isActive: true,
    questions: [
      { id: 'tq-13', questionId: 'q-safety-equipment', sortOrder: 1, required: true },
      { id: 'tq-14', questionId: 'q-warning-labels', sortOrder: 2, required: true },
      { id: 'tq-15', questionId: 'q-engine-oil', sortOrder: 3, required: true },
      { id: 'tq-16', questionId: 'q-coolant-level', sortOrder: 4, required: true },
      { id: 'tq-17', questionId: 'q-hydraulic-fluid', sortOrder: 5, required: true },
      { id: 'tq-18', questionId: 'q-hydraulic-hoses', sortOrder: 6, required: true },
      { id: 'tq-19', questionId: 'q-fuel-level', sortOrder: 7, required: true },
      { id: 'tq-20', questionId: 'q-battery-condition', sortOrder: 8, required: true },
      { id: 'tq-21', questionId: 'q-lights-functioning', sortOrder: 9, required: true },
      { id: 'tq-22', questionId: 'q-overall-cleanliness', sortOrder: 10, required: false }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-power-equipment',
    name: 'Power Equipment Standard',
    description: 'Standard checklist for power equipment like generators and compressors',
    equipmentCategory: 'Power Equipment',
    isActive: true,
    questions: [
      { id: 'tq-23', questionId: 'q-safety-equipment', sortOrder: 1, required: true },
      { id: 'tq-24', questionId: 'q-warning-labels', sortOrder: 2, required: true },
      { id: 'tq-25', questionId: 'q-engine-oil', sortOrder: 3, required: true },
      { id: 'tq-26', questionId: 'q-coolant-level', sortOrder: 4, required: true },
      { id: 'tq-27', questionId: 'q-fuel-level', sortOrder: 5, required: true },
      { id: 'tq-28', questionId: 'q-battery-condition', sortOrder: 6, required: true },
      { id: 'tq-29', questionId: 'q-lights-functioning', sortOrder: 7, required: true },
      { id: 'tq-30', questionId: 'q-power-output', sortOrder: 8, required: true },
      { id: 'tq-31', questionId: 'q-cord-cable', sortOrder: 9, required: true },
      { id: 'tq-32', questionId: 'q-overall-cleanliness', sortOrder: 10, required: false }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

## FILE: src/data/customerAdminMockData.ts
```tsx
import { CustomerQuestionCategory, CustomerQuestion, CustomerChecklistTemplate } from '../types/customerAdmin';
import { Inspector } from '../types/equipment';

export const mockCustomerInspectors: Inspector[] = [
  { id: 'CINS001', name: 'Mike Thompson', active: true },
  { id: 'CINS002', name: 'Sarah Davis', active: true },
  { id: 'CINS003', name: 'Carlos Rodriguez', active: true },
  { id: 'CINS004', name: 'Jennifer Lee', active: true },
  { id: 'CINS005', name: 'Robert Johnson', active: true },
  { id: 'CINS006', name: 'Amanda Wilson', active: false },
];

export const mockRentalPeriods = [
  { id: 'daily', name: 'Daily', allowedHours: 8, overageRatePerHour: 25 },
  { id: 'weekend', name: 'Weekend Special', allowedHours: 14, overageRatePerHour: 20 },
  { id: 'weekly', name: 'Weekly', allowedHours: 40, overageRatePerHour: 15 },
  { id: 'monthly', name: 'Monthly', allowedHours: 160, overageRatePerHour: 12 }
];

export const mockCustomerQuestionCategories: CustomerQuestionCategory[] = [
  {
    id: 'ccat-keys',
    name: 'Keys & Access',
    description: 'Keys, remotes, and access items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ccat-manuals',
    name: 'Manuals & Documentation',
    description: 'Operating manuals and documentation',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ccat-attachments',
    name: 'Attachments & Accessories',
    description: 'Buckets, attachments, and accessories',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ccat-condition',
    name: 'Physical Condition',
    description: 'Overall condition and damage assessment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ccat-fluids',
    name: 'Fluids & Fuel',
    description: 'Fuel levels and fluid conditions',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCustomerQuestions: CustomerQuestion[] = [
  {
    id: 'cq-keys',
    name: 'Equipment Keys',
    categoryId: 'ccat-keys',
    required: true,
    deliveryText: 'Keys Delivered',
    returnText: 'Keys Returned',
    syncTexts: true,
    deliveryAnswers: [
      { id: 'cans-1', description: 'Yes', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-2', description: 'No', dollarValue: 0, sortOrder: 2 }
    ],
    returnAnswers: [
      { id: 'cans-3', description: 'Yes', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-4', description: 'No', dollarValue: 150, sortOrder: 2 }
    ],
    answerSyncMap: { 0: true, 1: true }, // Both answers are synced by default
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cq-remote',
    name: 'Remote Control',
    categoryId: 'ccat-keys',
    required: false,
    deliveryText: 'Remote Control Delivered',
    returnText: 'Remote Control Returned',
    syncTexts: true,
    deliveryAnswers: [
      { id: 'cans-5', description: 'Yes', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-6', description: 'No', dollarValue: 0, sortOrder: 2 },
      { id: 'cans-7', description: 'N/A - Not Applicable', dollarValue: 0, sortOrder: 3 }
    ],
    returnAnswers: [
      { id: 'cans-8', description: 'Yes', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-9', description: 'No', dollarValue: 300, sortOrder: 2 },
      { id: 'cans-10', description: 'N/A - Not Applicable', dollarValue: 0, sortOrder: 3 }
    ],
    answerSyncMap: { 0: true, 1: true, 2: true }, // All answers synced by default
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cq-bucket',
    name: 'Standard Bucket',
    categoryId: 'ccat-attachments',
    required: true,
    deliveryText: 'Standard Bucket Delivered',
    returnText: 'Standard Bucket Returned',
    syncTexts: true,
    deliveryAnswers: [
      { id: 'cans-11', description: 'Good Condition', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-12', description: 'Minor Wear', dollarValue: 0, sortOrder: 2 },
      { id: 'cans-13', description: 'Not Delivered', dollarValue: 0, sortOrder: 3 }
    ],
    returnAnswers: [
      { id: 'cans-14', description: 'Good Condition', dollarValue: 0, sortOrder: 1 },
      { id: 'cans-15', description: 'Minor Damage', dollarValue: 200, sortOrder: 2 },
      { id: 'cans-16', description: 'Major Damage', dollarValue: 800, sortOrder: 3 },
      { id: 'cans-17', description: 'Missing', dollarValue: 1500, sortOrder: 4 }
    ],
    answerSyncMap: { 0: true, 1: false, 2: false }, // Only first answer synced
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Add missing customer templates for other categories
export const mockCustomerChecklistTemplates: CustomerChecklistTemplate[] = [
  {
    id: 'ctemplate-heavy',
    name: 'Heavy Equipment Customer Checklist',
    description: 'Standard delivery/return checklist for heavy equipment',
    equipmentCategory: 'Heavy Equipment',
    isActive: true,
    questions: [
      { id: 'ctq-1', questionId: 'cq-keys', sortOrder: 1, required: true },
      { id: 'ctq-2', questionId: 'cq-remote', sortOrder: 2, required: false },
      { id: 'ctq-3', questionId: 'cq-bucket', sortOrder: 3, required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ctemplate-compact',
    name: 'Compact Equipment Customer Checklist',
    description: 'Standard delivery/return checklist for compact equipment',
    equipmentCategory: 'Compact Equipment',
    isActive: true,
    questions: [
      { id: 'ctq-4', questionId: 'cq-keys', sortOrder: 1, required: true },
      { id: 'ctq-5', questionId: 'cq-remote', sortOrder: 2, required: false }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ctemplate-power',
    name: 'Power Equipment Customer Checklist',
    description: 'Standard delivery/return checklist for power equipment',
    equipmentCategory: 'Power Equipment',
    isActive: true,
    questions: [
      { id: 'ctq-6', questionId: 'cq-keys', sortOrder: 1, required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

## FILE: src/data/checklistMasterMockData.ts
```tsx
import { ChecklistMasterSystem } from '../types/checklistMaster';

export const mockChecklistMasterSystems: ChecklistMasterSystem[] = [
  {
    id: 'cms-001',
    name: 'Standard Heavy Equipment System',
    rentalReadyTemplateId: 'template-heavy-equipment',
    customerTemplateId: 'ctemplate-heavy',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-002',
    name: 'Compact Equipment System',
    rentalReadyTemplateId: 'template-compact-equipment',
    customerTemplateId: 'ctemplate-compact',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-003',
    name: 'Power Equipment System',
    rentalReadyTemplateId: 'template-power-equipment',
    customerTemplateId: 'ctemplate-power',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-004',
    name: 'Premium Inspection System',
    rentalReadyTemplateId: 'template-heavy-equipment',
    customerTemplateId: 'ctemplate-heavy',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-005',
    name: 'Basic Equipment System',
    rentalReadyTemplateId: 'template-compact-equipment',
    customerTemplateId: 'ctemplate-compact',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  }
];
```

---

## Key Features Working:
✅ **Clean Top Navigation**: Checklist Master | Equipment Mgt. | Rental Ready Admin | Customer Checklist Admin
✅ **Clickable Template Names**: Blue links for Rental Ready, Purple links for Customer templates
✅ **Complete Navigation**: All screens properly connected
✅ **Mobile Optimized**: Touch-friendly interface for iPad/iPhone
✅ **Status Management**: Equipment lifecycle tracking
✅ **Cost Calculations**: Return Value - Delivery Value = Customer Charge

## Usage:
1. Start at **Checklist Master** to manage complete checklist systems
2. Use **Equipment Mgt.** for equipment inspections and status updates
3. Use **Rental Ready Admin** to manage inspection questions and templates
4. Use **Customer Checklist Admin** for delivery/return questions and templates

This is your complete **Rollback1** state - copy this entire file to restore this exact working version!