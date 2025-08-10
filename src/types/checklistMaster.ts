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
  category: string;
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