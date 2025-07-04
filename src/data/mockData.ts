/*
 * Mock Data for Equipment and Inspection System
 * 
 * Provides realistic test data for development and demonstration purposes.
 * Includes equipment inventory, inspector assignments, and checklist templates.
 */
import { Equipment, ChecklistItem, Inspector, AnswerOption } from '../types/equipment';

export const mockEquipment: Equipment[] = [
  {
    id: 'EQ001',
    name: 'Excavator 320D',
    category: 'Heavy Equipment',
    model: 'CAT 320D',
    serialNumber: 'CAT320D001',
    status: 'Maint. Hold',
    lastInspection: '2024-01-15',
    hours: 1250
  },
  {
    id: 'EQ002',
    name: 'Skid Steer S570',
    category: 'Compact Equipment',
    model: 'Bobcat S570',
    serialNumber: 'BOB570002',
    status: 'Maint. Hold',
    lastInspection: '2024-01-10',
    hours: 875
  },
  {
    id: 'EQ003',
    name: 'Generator 20kW',
    category: 'Power Equipment',
    model: 'Generac 20kW',
    serialNumber: 'GEN20K003',
    status: 'Available',
    lastInspection: '2024-01-20',
    hours: 450
  },
  {
    id: 'EQ004',
    name: 'Bulldozer D6T',
    category: 'Heavy Equipment',
    model: 'CAT D6T',
    serialNumber: 'CATD6T004',
    status: 'Maint. Hold',
    lastInspection: '2024-01-12',
    hours: 2100
  },
  {
    id: 'EQ005',
    name: 'Compactor CS56',
    category: 'Compact Equipment',
    model: 'CAT CS56',
    serialNumber: 'CATCS56005',
    status: 'Damaged',
    lastInspection: '2024-01-08',
    hours: 1680
  },
  {
    id: 'EQ006',
    name: 'Air Compressor 185CFM',
    category: 'Power Equipment',
    model: 'Atlas Copco 185',
    serialNumber: 'AC185006',
    status: 'Maint. Hold',
    lastInspection: '2024-01-18',
    hours: 320
  },
  {
    id: 'EQ007',
    name: 'Loader 950M',
    category: 'Heavy Equipment',
    model: 'CAT 950M',
    serialNumber: 'CAT950M007',
    status: 'Available',
    lastInspection: '2024-01-22',
    hours: 1890
  },
  {
    id: 'EQ008',
    name: 'Mini Excavator 305E2',
    category: 'Compact Equipment',
    model: 'CAT 305E2',
    serialNumber: 'CAT305E008',
    status: 'Maint. Hold',
    lastInspection: '2024-01-14',
    hours: 750
  },
  {
    id: 'EQ009',
    name: 'Backhoe 420F2',
    category: 'Heavy Equipment',
    model: 'CAT 420F2',
    serialNumber: 'CAT420F009',
    status: 'Rented',
    lastInspection: '2024-01-25',
    hours: 1450
  },
  {
    id: 'EQ010',
    name: 'Forklift 2.5T',
    category: 'Compact Equipment',
    model: 'Toyota 8FGU25',
    serialNumber: 'TOY25010',
    status: 'Damaged',
    lastInspection: '2024-01-05',
    hours: 2200
  }
];

export const mockInspectors: Inspector[] = [
  { id: 'INS001', name: 'John Smith', active: true },
  { id: 'INS002', name: 'Sarah Johnson', active: true },
  { id: 'INS003', name: 'Mike Rodriguez', active: true },
  { id: 'INS004', name: 'Emily Chen', active: true },
  { id: 'INS005', name: 'David Wilson', active: true },
  { id: 'INS006', name: 'Lisa Anderson', active: false },
];

export const getChecklistTemplate = (category: string): ChecklistItem[] => {
  const baseItems: ChecklistItem[] = [
    {
      id: 'safety-1',
      name: 'Safety Equipment Present',
      category: 'Safety',
      required: true,
      answerOptions: [
        { id: 'safety-1-1', description: 'All Present & Functional', status: 'Rental Ready' },
        { id: 'safety-1-2', description: 'Present but Needs Cleaning', status: 'Rental Ready' },
        { id: 'safety-1-3', description: 'Missing Non-Critical Items', status: 'Maint. Hold' },
        { id: 'safety-1-4', description: 'Missing Critical Items', status: 'Damaged' },
        { id: 'safety-1-5', description: 'Equipment Damaged/Non-Functional', status: 'Damaged' }
      ]
    },
    {
      id: 'safety-2',
      name: 'Warning Labels Visible',
      category: 'Safety',
      required: true,
      answerOptions: [
        { id: 'safety-2-1', description: 'All Labels Clear & Visible', status: 'Rental Ready' },
        { id: 'safety-2-2', description: 'Labels Present but Faded', status: 'Rental Ready' },
        { id: 'safety-2-3', description: 'Some Labels Missing', status: 'Maint. Hold' },
        { id: 'safety-2-4', description: 'Critical Labels Missing', status: 'Damaged' }
      ]
    },
    {
      id: 'engine-1',
      name: 'Engine Oil Level',
      category: 'Engine',
      required: true,
      answerOptions: [
        { id: 'engine-1-1', description: 'Full', status: 'Rental Ready' },
        { id: 'engine-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'engine-1-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'engine-1-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'engine-1-5', description: 'Low/Empty', status: 'Damaged' },
        { id: 'engine-1-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'engine-2',
      name: 'Coolant Level',
      category: 'Engine',
      required: true,
      answerOptions: [
        { id: 'engine-2-1', description: 'Full', status: 'Rental Ready' },
        { id: 'engine-2-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'engine-2-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'engine-2-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'engine-2-5', description: 'Low/Empty', status: 'Damaged' },
        { id: 'engine-2-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'hydraulic-1',
      name: 'Hydraulic Fluid Level',
      category: 'Hydraulics',
      required: true,
      answerOptions: [
        { id: 'hydraulic-1-1', description: 'Full', status: 'Rental Ready' },
        { id: 'hydraulic-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'hydraulic-1-3', description: '1/2 Full', status: 'Maint. Hold' },
        { id: 'hydraulic-1-4', description: 'Empty', status: 'Maint. Hold' },
        { id: 'hydraulic-1-5', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'hydraulic-2',
      name: 'Hydraulic Hoses Condition',
      category: 'Hydraulics',
      required: true,
      answerOptions: [
        { id: 'hydraulic-2-1', description: 'Excellent Condition', status: 'Rental Ready' },
        { id: 'hydraulic-2-2', description: 'Good Condition', status: 'Rental Ready' },
        { id: 'hydraulic-2-3', description: 'Minor Wear/Scuffs', status: 'Rental Ready' },
        { id: 'hydraulic-2-4', description: 'Significant Wear', status: 'Maint. Hold' },
        { id: 'hydraulic-2-5', description: 'Cracked/Damaged', status: 'Damaged' },
        { id: 'hydraulic-2-6', description: 'Leaking', status: 'Damaged' }
      ]
    },
    {
      id: 'fuel-1',
      name: 'Fuel Level',
      category: 'Fuel',
      required: true,
      answerOptions: [
        { id: 'fuel-1-1', description: 'Full Tank', status: 'Rental Ready' },
        { id: 'fuel-1-2', description: '3/4 Full', status: 'Rental Ready' },
        { id: 'fuel-1-3', description: '1/2 Full', status: 'Rental Ready' },
        { id: 'fuel-1-4', description: '1/4 Full', status: 'Maint. Hold' },
        { id: 'fuel-1-5', description: 'Low/Empty', status: 'Maint. Hold' }
      ]
    },
    {
      id: 'electrical-1',
      name: 'Battery Condition',
      category: 'Electrical',
      required: true,
      answerOptions: [
        { id: 'electrical-1-1', description: 'Excellent - Full Charge', status: 'Rental Ready' },
        { id: 'electrical-1-2', description: 'Good - Holds Charge', status: 'Rental Ready' },
        { id: 'electrical-1-3', description: 'Fair - Weak Charge', status: 'Maint. Hold' },
        { id: 'electrical-1-4', description: 'Poor - Won\'t Hold Charge', status: 'Damaged' },
        { id: 'electrical-1-5', description: 'Dead/Corroded', status: 'Damaged' }
      ]
    },
    {
      id: 'electrical-2',
      name: 'Lights Functioning',
      category: 'Electrical',
      required: true,
      answerOptions: [
        { id: 'electrical-2-1', description: 'All Lights Working', status: 'Rental Ready' },
        { id: 'electrical-2-2', description: 'Most Lights Working', status: 'Rental Ready' },
        { id: 'electrical-2-3', description: 'Some Lights Out', status: 'Maint. Hold' },
        { id: 'electrical-2-4', description: 'Many Lights Out', status: 'Damaged' },
        { id: 'electrical-2-5', description: 'No Lights Working', status: 'Damaged' }
      ]
    },
    {
      id: 'general-1',
      name: 'Overall Cleanliness',
      category: 'General',
      required: false,
      answerOptions: [
        { id: 'general-1-1', description: 'Spotless', status: 'Rental Ready' },
        { id: 'general-1-2', description: 'Clean', status: 'Rental Ready' },
        { id: 'general-1-3', description: 'Needs Light Cleaning', status: 'Rental Ready' },
        { id: 'general-1-4', description: 'Needs Deep Cleaning', status: 'Maint. Hold' },
        { id: 'general-1-5', description: 'Extremely Dirty', status: 'Maint. Hold' }
      ]
    }
  ];

  // Add category-specific items
  if (category === 'Heavy Equipment') {
    baseItems.push(
      {
        id: 'tracks-1',
        name: 'Track Condition',
        category: 'Tracks',
        required: true,
        answerOptions: [
          { id: 'tracks-1-1', description: 'Excellent - Like New', status: 'Rental Ready' },
          { id: 'tracks-1-2', description: 'Good - Normal Wear', status: 'Rental Ready' },
          { id: 'tracks-1-3', description: 'Fair - Moderate Wear', status: 'Rental Ready' },
          { id: 'tracks-1-4', description: 'Poor - Heavy Wear', status: 'Maint. Hold' },
          { id: 'tracks-1-5', description: 'Damaged/Missing Pads', status: 'Damaged' }
        ]
      },
      {
        id: 'bucket-1',
        name: 'Bucket/Attachment Condition',
        category: 'Attachments',
        required: true,
        answerOptions: [
          { id: 'bucket-1-1', description: 'Excellent Condition', status: 'Rental Ready' },
          { id: 'bucket-1-2', description: 'Good - Minor Wear', status: 'Rental Ready' },
          { id: 'bucket-1-3', description: 'Worn Cutting Edge', status: 'Maint. Hold' },
          { id: 'bucket-1-4', description: 'Cracked/Damaged', status: 'Damaged' },
          { id: 'bucket-1-5', description: 'Missing/Broken', status: 'Damaged' }
        ]
      }
    );
  }

  if (category === 'Power Equipment') {
    baseItems.push(
      {
        id: 'power-1',
        name: 'Power Output Test',
        category: 'Power',
        required: true,
        answerOptions: [
          { id: 'power-1-1', description: 'Full Power Output', status: 'Rental Ready' },
          { id: 'power-1-2', description: 'Good Power Output', status: 'Rental Ready' },
          { id: 'power-1-3', description: 'Reduced Power', status: 'Maint. Hold' },
          { id: 'power-1-4', description: 'Poor Power Output', status: 'Damaged' },
          { id: 'power-1-5', description: 'No Power Output', status: 'Damaged' }
        ]
      },
      {
        id: 'power-2',
        name: 'Cord/Cable Condition',
        category: 'Power',
        required: true,
        answerOptions: [
          { id: 'power-2-1', description: 'Excellent - No Damage', status: 'Rental Ready' },
          { id: 'power-2-2', description: 'Good - Minor Scuffs', status: 'Rental Ready' },
          { id: 'power-2-3', description: 'Worn but Functional', status: 'Maint. Hold' },
          { id: 'power-2-4', description: 'Frayed/Exposed Wire', status: 'Damaged' },
          { id: 'power-2-5', description: 'Broken/Cut', status: 'Damaged' }
        ]
      }
    );
  }

  return baseItems;
}