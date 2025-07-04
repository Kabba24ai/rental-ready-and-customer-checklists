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