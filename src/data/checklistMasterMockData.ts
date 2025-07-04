import { ChecklistMasterSystem } from '../types/checklistMaster';

export const mockChecklistMasterSystems: ChecklistMasterSystem[] = [
  {
    id: 'cms-heavy-001',
    name: 'Heavy Equipment Complete System',
    equipmentCategory: 'Heavy Equipment',
    rentalReadyTemplateId: 'template-heavy-equipment',
    customerTemplateId: 'ctemplate-heavy',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-compact-001',
    name: 'Compact Equipment Complete System',
    equipmentCategory: 'Compact Equipment',
    rentalReadyTemplateId: 'template-compact-equipment',
    customerTemplateId: 'ctemplate-compact',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'cms-power-001',
    name: 'Power Equipment Complete System',
    equipmentCategory: 'Power Equipment',
    rentalReadyTemplateId: 'template-power-equipment',
    customerTemplateId: 'ctemplate-power',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];