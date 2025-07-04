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
  }
];