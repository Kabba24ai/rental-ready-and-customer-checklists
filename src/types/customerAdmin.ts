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