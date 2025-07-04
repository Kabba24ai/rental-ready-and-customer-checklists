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