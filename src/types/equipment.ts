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