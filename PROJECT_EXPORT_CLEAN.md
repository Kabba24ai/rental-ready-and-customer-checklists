# Complete Project Export - Rental Ready Checklist System

## Installation Instructions
```bash
npm create vite@latest rental-ready-checklist -- --template react-ts
cd rental-ready-checklist
npm install
npm add lucide-react@latest
npm run dev
```

## package.json
```json
{
  "name": "rental-ready-checklist-system",
  "private": true,
  "version": "1.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
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

## index.html
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

## src/main.tsx
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

## src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## tailwind.config.js
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

## postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

## src/App.tsx
```tsx
import React, { useState } from 'react';
import ChecklistSystemsPage from './components/checklistSystems/ChecklistSystemsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerAdminDashboard from './components/customer/CustomerAdminDashboard';

type AppView = 'checklist-master' | 'rental-ready-admin' | 'customer-admin';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('checklist-master');

  const handleNavigateToChecklistMaster = () => {
    setCurrentView('checklist-master');
  };

  const handleNavigateToRentalReadyAdmin = () => {
    setCurrentView('rental-ready-admin');
  };

  const handleNavigateToCustomerAdmin = () => {
    setCurrentView('customer-admin');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rental-ready-admin':
        return (
          <AdminDashboard
            onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
            onNavigateToChecklistMaster={handleNavigateToChecklistMaster}
          />
        );
      case 'customer-admin':
        return (
          <CustomerAdminDashboard
            onNavigateToRentalReady={handleNavigateToRentalReadyAdmin}
            onNavigateToChecklistMaster={handleNavigateToChecklistMaster}
          />
        );
      case 'checklist-master':
      default:
        return (
          <ChecklistSystemsPage
            onNavigateToRentalReadyAdmin={handleNavigateToRentalReadyAdmin}
            onNavigateToCustomerAdmin={handleNavigateToCustomerAdmin}
          />
        );
    }
  };

  return renderCurrentView();
}

export default App;
```

## src/types/equipment.ts
```tsx
export interface Equipment {
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

export interface Inspector {
  id: string;
  name: string;
  active: boolean;
}
```

## src/types/admin.ts
```tsx
export interface QuestionCategory {
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

## src/types/customerAdmin.ts
```tsx
export interface CustomerQuestionCategory {
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
  deliveryText: string;
  returnText: string;
  syncTexts: boolean;
  deliveryAnswers: CustomerAnswerOption[];
  returnAnswers: CustomerAnswerOption[];
  answerSyncMap: Record<number, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAnswerOption {
  id: string;
  description: string;
  dollarValue: number;
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

## src/data/mockData.ts
```tsx
import { Equipment, Inspector } from '../types/equipment';

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
  }
];

export const mockInspectors: Inspector[] = [
  { id: 'INS001', name: 'John Smith', active: true },
  { id: 'INS002', name: 'Sarah Johnson', active: true },
  { id: 'INS003', name: 'Mike Rodriguez', active: true }
];
```

## src/data/adminMockData.ts
```tsx
import { QuestionCategory, Question, ChecklistTemplate } from '../types/admin';

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
      { id: 'ans-2', description: 'Missing Critical Items', status: 'Damaged', sortOrder: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: 'template-heavy-equipment',
    name: 'Heavy Equipment Standard',
    description: 'Standard checklist for heavy equipment',
    equipmentCategory: 'Heavy Equipment',
    isActive: true,
    questions: [
      { id: 'tq-1', questionId: 'q-safety-equipment', sortOrder: 1, required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

## src/data/customerAdminMockData.ts
```tsx
import { CustomerQuestionCategory, CustomerQuestion, CustomerChecklistTemplate } from '../types/customerAdmin';
import { Inspector } from '../types/equipment';

export const mockCustomerInspectors: Inspector[] = [
  { id: 'CINS001', name: 'Mike Thompson', active: true },
  { id: 'CINS002', name: 'Sarah Davis', active: true }
];

export const mockRentalPeriods = [
  { id: 'daily', name: 'Daily', allowedHours: 8, overageRatePerHour: 25 },
  { id: 'weekly', name: 'Weekly', allowedHours: 40, overageRatePerHour: 15 }
];

export const mockCustomerQuestionCategories: CustomerQuestionCategory[] = [
  {
    id: 'ccat-keys',
    name: 'Keys & Access',
    description: 'Keys, remotes, and access items',
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
    answerSyncMap: { 0: true, 1: true },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCustomerChecklistTemplates: CustomerChecklistTemplate[] = [
  {
    id: 'ctemplate-heavy',
    name: 'Heavy Equipment Customer Checklist',
    description: 'Standard delivery/return checklist for heavy equipment',
    equipmentCategory: 'Heavy Equipment',
    isActive: true,
    questions: [
      { id: 'ctq-1', questionId: 'cq-keys', sortOrder: 1, required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

## src/components/checklistSystems/ChecklistSystemsPage.tsx
```tsx
import React, { useState } from 'react';
import { FileText, Settings, Users, Edit, Trash2 } from 'lucide-react';

interface ChecklistSystem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
}

interface ChecklistSystemsPageProps {
  onNavigateToRentalReadyAdmin?: () => void;
  onNavigateToCustomerAdmin?: () => void;
}

const mockChecklistSystems: ChecklistSystem[] = [
  {
    id: 'cs-001',
    name: 'Heavy Equipment Standard',
    description: 'Comprehensive checklist for excavators, bulldozers, and large machinery',
    category: 'Heavy Equipment',
    status: 'Active'
  },
  {
    id: 'cs-002',
    name: 'Compact Equipment Pro',
    description: 'Optimized checklist for skid steers, mini excavators, and compact loaders',
    category: 'Compact Equipment',
    status: 'Active'
  }
];

const ChecklistSystemsPage: React.FC<ChecklistSystemsPageProps> = ({
  onNavigateToRentalReadyAdmin,
  onNavigateToCustomerAdmin
}) => {
  const [systems] = useState<ChecklistSystem[]>(mockChecklistSystems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checklist Management</h1>
                <p className="text-sm text-gray-600">Manage checklist systems</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
              >
                Checklist Master
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Equipment Mgt.
              </button>
              <button
                onClick={onNavigateToRentalReadyAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Rental Ready Admin
              </button>
              <button
                onClick={onNavigateToCustomerAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Customer Checklist Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Checklist Systems</h2>
            <div className="space-y-3">
              {systems.map((system) => (
                <div key={system.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-600">{system.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSystemsPage;
```

## src/components/admin/AdminDashboard.tsx
```tsx
import React, { useState } from 'react';
import { Settings, Database, FileText, ClipboardList, Users } from 'lucide-react';
import QuestionManager from './QuestionManager';
import ChecklistTemplateManager from './ChecklistTemplateManager';

interface AdminDashboardProps {
  onNavigateToCustomerAdmin?: () => void;
  onNavigateToChecklistMaster?: () => void;
}

type AdminView = 'overview' | 'questions' | 'templates';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateToCustomerAdmin, 
  onNavigateToChecklistMaster
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
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToChecklistMaster}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Checklist Master
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Equipment Mgt.
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
              >
                Rental Ready Admin
              </button>
              <button
                onClick={onNavigateToCustomerAdmin}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Customer Checklist Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

## src/components/customer/CustomerAdminDashboard.tsx
```tsx
import React, { useState } from 'react';
import { Users, Database, FileText, ClipboardList, Settings } from 'lucide-react';
import CustomerQuestionManager from './CustomerQuestionManager';
import CustomerChecklistTemplateManager from './CustomerChecklistTemplateManager';

interface CustomerAdminDashboardProps {
  onNavigateToRentalReady?: () => void;
  onNavigateToChecklistMaster?: () => void;
}

type CustomerAdminView = 'overview' | 'questions' | 'templates';

const CustomerAdminDashboard: React.FC<CustomerAdminDashboardProps> = ({ 
  onNavigateToRentalReady, 
  onNavigateToChecklistMaster
}) => {
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
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToChecklistMaster}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Checklist Master
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Equipment Mgt.
              </button>
              <button
                onClick={onNavigateToRentalReady}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Rental Ready Admin
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
              >
                Customer Checklist Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

## src/components/admin/QuestionManager.tsx
```tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Question, QuestionCategory } from '../../types/admin';
import { mockQuestions, mockQuestionCategories } from '../../data/adminMockData';

const QuestionManager: React.FC = () => {
  const [questions] = useState<Question[]>(mockQuestions);
  const [categories] = useState<QuestionCategory[]>(mockQuestionCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question & Categories Mgt</h2>
          <p className="text-gray-600">Manage inspection questions, answers, and categories</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Question
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
        <div className="space-y-3">
          {questions.map(question => (
            <div key={question.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{question.name}</h4>
                <p className="text-sm text-gray-600">
                  Category: {categories.find(c => c.id === question.categoryId)?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
```

## src/components/admin/ChecklistTemplateManager.tsx
```tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { ChecklistTemplate } from '../../types/admin';
import { mockChecklistTemplates } from '../../data/adminMockData';

const ChecklistTemplateManager: React.FC = () => {
  const [templates] = useState<ChecklistTemplate[]>(mockChecklistTemplates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Checklist Templates</h2>
          <p className="text-gray-600">Create and manage checklist templates</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
        <div className="space-y-3">
          {templates.map(template => (
            <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
                <p className="text-sm text-gray-600">Category: {template.equipmentCategory}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistTemplateManager;
```

## src/components/customer/CustomerQuestionManager.tsx
```tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { CustomerQuestion, CustomerQuestionCategory } from '../../types/customerAdmin';
import { mockCustomerQuestions, mockCustomerQuestionCategories } from '../../data/customerAdminMockData';

const CustomerQuestionManager: React.FC = () => {
  const [questions] = useState<CustomerQuestion[]>(mockCustomerQuestions);
  const [categories] = useState<CustomerQuestionCategory[]>(mockCustomerQuestionCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Questions & Categories</h2>
          <p className="text-gray-600">Manage delivery/return questions with cost calculation</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Customer Question
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Questions</h3>
        <div className="space-y-3">
          {questions.map(question => (
            <div key={question.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{question.name}</h4>
                <p className="text-sm text-gray-600">
                  Category: {categories.find(c => c.id === question.categoryId)?.name}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                  <div className="text-blue-600">📤 {question.deliveryText}</div>
                  <div className="text-green-600">📥 {question.returnText}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-purple-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerQuestionManager;
```

## src/components/customer/CustomerChecklistTemplateManager.tsx
```tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { CustomerChecklistTemplate } from '../../types/customerAdmin';
import { mockCustomerChecklistTemplates } from '../../data/customerAdminMockData';

const CustomerChecklistTemplateManager: React.FC = () => {
  const [templates] = useState<CustomerChecklistTemplate[]>(mockCustomerChecklistTemplates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Checklist Templates</h2>
          <p className="text-gray-600">Create delivery/return checklist templates</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Customer Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Templates</h3>
        <div className="space-y-3">
          {templates.map(template => (
            <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
                <p className="text-sm text-gray-600">Category: {template.equipmentCategory}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-indigo-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerChecklistTemplateManager;
```

---

Copy this entire file and paste it into your other system. This is the clean, working version with proper navigation.