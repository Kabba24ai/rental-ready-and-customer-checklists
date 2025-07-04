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