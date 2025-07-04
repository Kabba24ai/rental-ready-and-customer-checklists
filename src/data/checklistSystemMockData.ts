import { ChecklistSystem, EquipmentChecklistAssignment } from '../types/checklistSystem';

export const mockChecklistSystems: ChecklistSystem[] = [
  {
    id: 'cs-heavy-equipment',
    name: 'Heavy Equipment Complete System',
    description: 'Complete checklist system for heavy equipment including rental ready and customer checklists',
    equipmentCategory: 'Heavy Equipment',
    rentalReadyTemplateId: 'template-heavy-equipment',
    customerChecklistTemplateId: 'ctemplate-heavy',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cs-compact-equipment',
    name: 'Compact Equipment Complete System',
    description: 'Complete checklist system for compact equipment including rental ready and customer checklists',
    equipmentCategory: 'Compact Equipment',
    rentalReadyTemplateId: 'template-compact-equipment',
    customerChecklistTemplateId: 'ctemplate-compact',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cs-power-equipment',
    name: 'Power Equipment Complete System',
    description: 'Complete checklist system for power equipment including rental ready and customer checklists',
    equipmentCategory: 'Power Equipment',
    rentalReadyTemplateId: 'template-power-equipment',
    customerChecklistTemplateId: 'ctemplate-power',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockEquipmentChecklistAssignments: EquipmentChecklistAssignment[] = [
  {
    equipmentId: 'EQ001',
    checklistSystemId: 'cs-heavy-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ002',
    checklistSystemId: 'cs-compact-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ003',
    checklistSystemId: 'cs-power-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ004',
    checklistSystemId: 'cs-heavy-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ005',
    checklistSystemId: 'cs-compact-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ006',
    checklistSystemId: 'cs-power-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ007',
    checklistSystemId: 'cs-heavy-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ008',
    checklistSystemId: 'cs-compact-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ009',
    checklistSystemId: 'cs-heavy-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  },
  {
    equipmentId: 'EQ010',
    checklistSystemId: 'cs-compact-equipment',
    assignedAt: '2024-01-01T00:00:00Z',
    assignedBy: 'Admin User'
  }
];