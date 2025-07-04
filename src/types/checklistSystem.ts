/**
 * Unified Checklist System Type Definitions
 * 
 * Combines Rental Ready and Customer Checklists under one system
 * for unified assignment to equipment while maintaining separate operations.
 */

import { ChecklistTemplate } from './admin';
import { CustomerChecklistTemplate } from './customerAdmin';

export interface ChecklistSystem {
  id: string;
  name: string;
  description?: string;
  equipmentCategory: string;
  
  // References to existing templates - no operational changes
  rentalReadyTemplateId: string;
  customerChecklistTemplateId: string;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistSystemWithTemplates extends ChecklistSystem {
  rentalReadyTemplate: ChecklistTemplate;
  customerChecklistTemplate: CustomerChecklistTemplate;
}

export interface EquipmentChecklistAssignment {
  equipmentId: string;
  checklistSystemId: string;
  assignedAt: string;
  assignedBy: string;
}