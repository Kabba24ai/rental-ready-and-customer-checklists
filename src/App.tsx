import React, { useState, useEffect } from 'react';

/**
 * Main Application Component
 * 
 * Root component implementing the IndexController pattern for the Rental Ready
 * Checklist System. Manages application-wide state, routing between different
 * views, and coordinates data flow between components.
 * 
 * Architecture:
 * - Follows Domain Driven Architecture with clear separation of concerns
 * - Implements Single Responsibility Controllers pattern
 * - Mobile-first design optimized for iPad/iPhone usage
 * 
 * Views:
 * - checklist: Main rental ready inspection interface
 * - admin: Administrative management dashboard
 * - customer-admin: Customer checklist management
 * - customer-delivery: Customer delivery checklist
 * - customer-return: Customer return checklist
 * 
 * State Management:
 * - Equipment inventory with status tracking
 * - Checklist progress and validation
 * - Inspector assignments and notes
 * - Success/error message handling
 */
import { Equipment, ChecklistItem, RentalReadyChecklist } from './types/equipment';
import { mockEquipment, getChecklistTemplate, mockInspectors } from './data/mockData';
import EquipmentSelector from './components/EquipmentSelector';
import ChecklistForm from './components/ChecklistForm';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerAdminDashboard from './components/customer/CustomerAdminDashboard';
import CustomerDeliveryChecklist from './components/customer/CustomerDeliveryChecklist';
import { ClipboardList, Settings, Users, Truck, Package } from 'lucide-react';

type AppView = 'checklist' | 'admin' | 'customer-admin' | 'customer-delivery' | 'customer-return';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('checklist');
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checklist, setChecklist] = useState<RentalReadyChecklist | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedEquipment) {
      const checklistItems = getChecklistTemplate(selectedEquipment.category);
      setChecklist({
        equipmentId: selectedEquipment.id,
        inspectorName: '',
        inspectionDate: new Date().toISOString().split('T')[0],
        items: checklistItems,
        overallStatus: 'Incomplete',
        notes: '',
        equipmentHours: selectedEquipment.hours || 0
      });
    }
  }, [selectedEquipment]);

  const handleUpdateItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    if (!checklist) return;
    
    setChecklist(prev => ({
      ...prev!,
      items: prev!.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  const handleInspectorNameChange = (name: string) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, inspectorName: name }));
  };

  const handleNotesChange = (notes: string) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, notes }));
  };

  const handleEquipmentHoursChange = (hours: number) => {
    if (!checklist) return;
    setChecklist(prev => ({ ...prev!, equipmentHours: hours }));
    
    // Also update the equipment hours in the equipment list
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment?.id ? { ...eq, hours } : eq
    ));
  };

  const handleMarkRentalReady = () => {
    if (!selectedEquipment || !checklist) return;
    
    // Update equipment status
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment.id 
        ? { 
            ...eq, 
            status: 'Available', 
            lastInspection: new Date().toISOString().split('T')[0],
            hours: checklist.equipmentHours || eq.hours
          }
        : eq
    ));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSelectedEquipment(null);
    setChecklist(null);
  };

  const handleMarkDamaged = () => {
    if (!selectedEquipment || !checklist) return;
    
    // Update equipment status
    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment.id 
        ? { 
            ...eq, 
            status: 'Damaged', 
            lastInspection: new Date().toISOString().split('T')[0],
            hours: checklist.equipmentHours || eq.hours
          }
        : eq
    ));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSelectedEquipment(null);
    setChecklist(null);
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to a database
    console.log('Saving draft:', checklist);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCustomerChecklistComplete = (responses: any[], totalCost: number) => {
    console.log('Customer checklist completed:', { responses, totalCost });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  if (currentView === 'customer-admin') {
    return <CustomerAdminDashboard />;
  }

  if (currentView === 'customer-delivery') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Customer Delivery Checklist</h1>
                  <p className="text-sm text-gray-600">Equipment Delivery Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('checklist')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Main</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <CustomerDeliveryChecklist 
          mode="delivery" 
          onComplete={handleCustomerChecklistComplete}
        />
      </div>
    );
  }

  if (currentView === 'customer-return') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Customer Return Checklist</h1>
                  <p className="text-sm text-gray-600">Equipment Return Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('checklist')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Main</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <CustomerDeliveryChecklist 
          mode="return" 
          onComplete={handleCustomerChecklistComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rental Ready Checklist</h1>
                <p className="text-sm text-gray-600">Equipment Maintenance & Inspection System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('customer-delivery')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">Customer Delivery</span>
              </button>
              <button
                onClick={() => setCurrentView('customer-return')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Customer Return</span>
              </button>
              <button
                onClick={() => setCurrentView('customer-admin')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Customer Admin</span>
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Rental Ready Admin</span>
              </button>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Kabba 2 Rental System</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-green-800 font-medium">
                Equipment status updated successfully!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Selector */}
          <div className="lg:col-span-1">
            <EquipmentSelector
              equipment={equipment}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={setSelectedEquipment}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Checklist Form */}
          <div className="lg:col-span-2">
            {selectedEquipment && checklist ? (
              <ChecklistForm
                equipment={selectedEquipment}
                items={checklist.items}
                onUpdateItem={handleUpdateItem}
                inspectorName={checklist.inspectorName}
                onInspectorNameChange={handleInspectorNameChange}
                notes={checklist.notes || ''}
                onNotesChange={handleNotesChange}
                equipmentHours={checklist.equipmentHours || 0}
                onEquipmentHoursChange={handleEquipmentHoursChange}
                inspectors={mockInspectors}
                onMarkRentalReady={handleMarkRentalReady}
                onMarkDamaged={handleMarkDamaged}
                onSaveDraft={handleSaveDraft}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select Equipment to Begin
                </h3>
                <p className="text-gray-600">
                  Choose equipment from the list to start the rental ready inspection process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;