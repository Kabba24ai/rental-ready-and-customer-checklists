import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, DollarSign, FileText, User, Calendar, Truck, Package, ArrowRight, ArrowLeft, Clock, Gauge } from 'lucide-react';
import { CustomerQuestion, CustomerChecklistTemplate, RentalPeriod, CustomerChecklistResponse } from '../../types/customerAdmin';
import { Inspector } from '../types/equipment';
import { mockCustomerQuestions, mockCustomerChecklistTemplates, mockCustomerInspectors, mockRentalPeriods } from '../../data/customerAdminMockData';

/**
 * CustomerDeliveryChecklist Component
 * 
 * Customer-facing delivery and return checklist interface with cost calculation
 * and hour tracking capabilities. Supports both single-column delivery mode
 * and two-column return comparison mode.
 * 
 * Features:
 * - Delivery Mode: Single column layout for confirming delivered items
 * - Return Mode: Two-column comparison (delivery vs return status)
 * - Cost Calculation: Return Value - Delivery Value = Customer Charge
 * - Hour Tracking: Equipment usage monitoring with overage calculations
 * - Inspector Assignment: Track who performed the inspection
 * - Progress Tracking: Visual completion indicators
 * 
 * Cost Calculation Logic:
 * - Base Cost = Return Value - Delivery Value
 * - Overage Cost = (Hours Used - Allowed Hours) × Overage Rate
 * - Total Cost = Base Cost + Overage Cost
 * 
 * @param mode - 'delivery' for single column, 'return' for comparison
 * @param equipmentName - Name of equipment being processed
 * @param customerName - Customer company name
 * @param rentalPeriod - Rental period with allowed hours and overage rates
 * @param startHours - Equipment hours at delivery
 * @param deliveryResponses - Previous delivery responses (for return mode)
 * @param onComplete - Callback fired when checklist is completed
 */
interface CustomerDeliveryChecklistProps {
  mode: 'delivery' | 'return';
  equipmentName?: string;
  customerName?: string;
  rentalPeriod?: RentalPeriod;
  startHours?: number;
  deliveryResponses?: CustomerChecklistResponse[]; // For return mode
  onComplete?: (responses: CustomerChecklistResponse[], totalCost: number, overageCost?: number) => void;
}

const CustomerDeliveryChecklist: React.FC<CustomerDeliveryChecklistProps> = ({
  mode = 'delivery',
  equipmentName = 'Excavator 320D',
  customerName = 'John Smith Construction',
  rentalPeriod = mockRentalPeriods[2], // Default to Weekly
  startHours = 1250,
  deliveryResponses = [],
  onComplete
}) => {
  // Mock delivery responses for demo purposes when in return mode
  const mockDeliveryResponses: CustomerChecklistResponse[] = [
    {
      questionId: 'cq-keys',
      deliveryAnswerId: 'cans-1', // Yes
      deliveryNotes: 'All keys provided in good condition'
    },
    {
      questionId: 'cq-remote',
      deliveryAnswerId: 'cans-5', // Yes
      deliveryNotes: 'Remote control included with fresh batteries'
    },
    {
      questionId: 'cq-bucket',
      deliveryAnswerId: 'cans-11', // Good Condition
      deliveryNotes: 'Standard bucket in excellent condition'
    }
  ];

  const [responses, setResponses] = useState<CustomerChecklistResponse[]>(
    mode === 'return' ? mockDeliveryResponses : []
  );
  const [inspectorName, setInspectorName] = useState('');
  const [equipmentStartHours, setEquipmentStartHours] = useState(startHours);
  const [equipmentEndHours, setEquipmentEndHours] = useState<number>(
    mode === 'return' ? startHours + 35 : 0 // Mock 35 hours used for return demo
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Get the template and questions for Heavy Equipment
  const template = mockCustomerChecklistTemplates.find(t => t.equipmentCategory === 'Heavy Equipment');
  const templateQuestions = template?.questions.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const questions = templateQuestions
    .map(tq => mockCustomerQuestions.find(q => q.id === tq.questionId))
    .filter(Boolean) as CustomerQuestion[];

  const getResponse = (questionId: string): CustomerChecklistResponse => {
    return responses.find(r => r.questionId === questionId) || { questionId };
  };

  const updateResponse = (questionId: string, updates: Partial<CustomerChecklistResponse>) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, ...updates } : r);
      } else {
        return [...prev, { questionId, ...updates }];
      }
    });
  };

  const calculateTotalCost = (): number => {
    let total = 0;
    
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) return;

      if (mode === 'delivery' && response.deliveryAnswerId) {
        const answer = question.deliveryAnswers.find(a => a.id === response.deliveryAnswerId);
        if (answer) total += answer.dollarValue;
      } else if (mode === 'return' && response.returnAnswerId && response.deliveryAnswerId) {
        const deliveryAnswer = question.deliveryAnswers.find(a => a.id === response.deliveryAnswerId);
        const returnAnswer = question.returnAnswers.find(a => a.id === response.returnAnswerId);
        if (deliveryAnswer && returnAnswer) {
          // FIXED: Return value minus delivery value (what they owe us)
          // If they got something (delivery value 0) but didn't return it (return value 150), they owe 150
          total += (returnAnswer.dollarValue - deliveryAnswer.dollarValue);
        }
      }
    });

    return total;
  };

  const calculateOverageCost = (): number => {
    if (mode !== 'return' || !equipmentEndHours) return 0;
    
    const hoursUsed = equipmentEndHours - equipmentStartHours;
    const overageHours = Math.max(0, hoursUsed - rentalPeriod.allowedHours);
    return overageHours * rentalPeriod.overageRatePerHour;
  };

  const getRequiredQuestions = () => {
    return templateQuestions.filter(tq => tq.required).map(tq => tq.questionId);
  };

  const getCompletedRequiredQuestions = () => {
    const required = getRequiredQuestions();
    return required.filter(qId => {
      const response = getResponse(qId);
      if (mode === 'delivery') {
        return response.deliveryAnswerId;
      } else {
        return response.deliveryAnswerId && response.returnAnswerId;
      }
    });
  };

  const getCompletedAllQuestions = () => {
    return questions.filter(question => {
      const response = getResponse(question.id);
      if (mode === 'delivery') {
        return response.deliveryAnswerId;
      } else {
        return response.deliveryAnswerId && response.returnAnswerId;
      }
    });
  };
  const canComplete = () => {
    const required = getRequiredQuestions();
    const completed = getCompletedRequiredQuestions();
    const hasInspector = inspectorName.trim() !== '';
    
    if (mode === 'delivery') {
      return required.length === completed.length && hasInspector;
    } else {
      return required.length === completed.length && hasInspector && equipmentEndHours > 0;
    }
  };

  const handleComplete = () => {
    if (canComplete()) {
      const totalCost = calculateTotalCost();
      const overageCost = calculateOverageCost();
      setIsComplete(true);
      onComplete?.(responses, totalCost, overageCost);
    }
  };

  const getAnswerText = (question: CustomerQuestion, answerId: string, isDelivery: boolean) => {
    const answers = isDelivery ? question.deliveryAnswers : question.returnAnswers;
    return answers.find(a => a.id === answerId)?.description || '';
  };

  const getAnswerValue = (question: CustomerQuestion, answerId: string, isDelivery: boolean) => {
    const answers = isDelivery ? question.deliveryAnswers : question.returnAnswers;
    return answers.find(a => a.id === answerId)?.dollarValue || 0;
  };

  if (isComplete) {
    const totalCost = calculateTotalCost();
    const overageCost = calculateOverageCost();
    const grandTotal = totalCost + overageCost;
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'delivery' ? 'Delivery' : 'Return'} Checklist Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the {mode} checklist for {equipmentName}.
          </p>
          
          {/* Cost Breakdown */}
          {(totalCost !== 0 || overageCost > 0) && (
            <div className="space-y-3">
              {totalCost !== 0 && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  totalCost > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  <DollarSign className="w-5 h-5" />
                  Equipment/Items: ${Math.abs(totalCost)}
                  {totalCost > 0 ? ' (Charge)' : ' (Credit)'}
                </div>
              )}
              
              {overageCost > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-orange-100 text-orange-800">
                  <Clock className="w-5 h-5" />
                  Hour Overage: ${overageCost}
                </div>
              )}
              
              {grandTotal !== totalCost && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-800 border-2 border-gray-300">
                  <DollarSign className="w-5 h-5" />
                  Total: ${grandTotal}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A copy of this checklist has been sent to your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Single column layout for delivery mode
  if (mode === 'delivery') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Equipment Delivery Checklist</h1>
              <p className="text-gray-600">
                Please confirm the condition and items delivered with your equipment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Equipment:</span>
              <span className="font-medium">{equipmentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Rental Period:</span>
              <span className="font-medium">{rentalPeriod.name}</span>
            </div>
          </div>

        </div>

        {/* Inspector and Hours Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspector Name *
              </label>
              <select
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Inspector</option>
                {mockCustomerInspectors.filter(inspector => inspector.active).map(inspector => (
                  <option key={inspector.id} value={inspector.name}>
                    {inspector.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Hours - Start *
              </label>
              <input
                type="number"
                value={equipmentStartHours}
                onChange={(e) => setEquipmentStartHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter starting hours"
                min="0"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Period
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {rentalPeriod.name}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const templateQuestion = templateQuestions.find(tq => tq.questionId === question.id);
            const response = getResponse(question.id);
            const isRequired = templateQuestion?.required || false;
            
            return (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{question.name}</h3>
                      {isRequired && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 ml-10">{question.deliveryText}</p>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    {question.deliveryAnswers.map(answer => (
                      <label key={answer.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                        <input
                          type="radio"
                          name={`delivery-${question.id}`}
                          value={answer.id}
                          checked={response.deliveryAnswerId === answer.id}
                          onChange={(e) => updateResponse(question.id, { deliveryAnswerId: e.target.value })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1 font-medium">{answer.description}</span>
                        {answer.dollarValue > 0 && (
                          <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            <DollarSign className="w-3 h-3" />
                            {answer.dollarValue}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={response.deliveryNotes || ''}
                    onChange={(e) => updateResponse(question.id, { deliveryNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Add any additional comments or observations..."
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary and Complete */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Summary</h3>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Progress</span>
              <span className="text-sm text-gray-600">
                {getCompletedAllQuestions().length} of {questions.length} items completed
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(getCompletedAllQuestions().length / questions.length) * 100}%` 
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {getCompletedRequiredQuestions().length}/{getRequiredQuestions().length}
              </div>
              <div className="text-sm text-gray-600">Required Items</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {getCompletedAllQuestions().length}/{questions.length}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${
                calculateTotalCost() > 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                ${Math.abs(calculateTotalCost())}
              </div>
              <div className="text-sm text-gray-600">
                {calculateTotalCost() > 0 ? 'Additional Charges' : 'No Additional Costs'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {canComplete() ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Ready to complete delivery checklist
                </span>
              ) : (
                <span className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  Please complete all required items and inspector information
                </span>
              )}
            </div>
            
            <button
              onClick={handleComplete}
              disabled={!canComplete()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                canComplete()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Delivery Checklist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Two-column layout for return mode
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Package className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment Return Checklist</h1>
            <p className="text-gray-600">
              Compare delivery status with return condition and confirm any changes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Equipment:</span>
            <span className="font-medium">{equipmentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Return Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

      </div>

      {/* Inspector and Hours Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspector Name *
            </label>
            <select
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Inspector</option>
              {mockCustomerInspectors.filter(inspector => inspector.active).map(inspector => (
                <option key={inspector.id} value={inspector.name}>
                  {inspector.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Hours
            </label>
            <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 font-medium">
              {equipmentStartHours.toLocaleString()}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Hours *
            </label>
            <input
              type="number"
              value={equipmentEndHours}
              onChange={(e) => setEquipmentEndHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter ending hours"
              min={equipmentStartHours}
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Used
            </label>
            <div className={`px-3 py-2 rounded-lg font-medium border ${
              equipmentEndHours > 0 && (equipmentEndHours - equipmentStartHours) > rentalPeriod.allowedHours
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-gray-50 border-gray-300 text-gray-800'
            }`}>
              {equipmentEndHours > 0 ? (equipmentEndHours - equipmentStartHours).toFixed(1) : '0'} / {rentalPeriod.allowedHours}
            </div>
          </div>
        </div>
        
        {/* Overage Warning */}
        {equipmentEndHours > 0 && (equipmentEndHours - equipmentStartHours) > rentalPeriod.allowedHours && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Hour Overage Detected</span>
            </div>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                Overage: {((equipmentEndHours - equipmentStartHours) - rentalPeriod.allowedHours).toFixed(1)} hours 
                × ${rentalPeriod.overageRatePerHour}/hour = 
                <span className="font-medium"> ${calculateOverageCost()}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Questions Layout */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const templateQuestion = templateQuestions.find(tq => tq.questionId === question.id);
          const response = getResponse(question.id);
          const isRequired = templateQuestion?.required || false;
          
          // Calculate cost difference - FIXED CALCULATION
          let costDifference = 0;
          if (response.deliveryAnswerId && response.returnAnswerId) {
            const deliveryAnswer = question.deliveryAnswers.find(a => a.id === response.deliveryAnswerId);
            const returnAnswer = question.returnAnswers.find(a => a.id === response.returnAnswerId);
            if (deliveryAnswer && returnAnswer) {
              // FIXED: Return value minus delivery value (what customer owes)
              costDifference = returnAnswer.dollarValue - deliveryAnswer.dollarValue;
            }
          }
          
          return (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{question.name}</h3>
                    {isRequired && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Cost Impact Display */}
                {response.returnAnswerId && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                    costDifference > 0 ? 'bg-red-100 text-red-800' : 
                    costDifference < 0 ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <DollarSign className="w-4 h-4" />
                    {costDifference > 0 ? `+$${costDifference}` : 
                     costDifference < 0 ? `-$${Math.abs(costDifference)}` : 
                     '$0'}
                    <span className="text-xs">
                      {costDifference > 0 ? 'Charge' : 
                       costDifference < 0 ? 'Credit' : 
                       'No Change'}
                    </span>
                  </div>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Delivery Status (Read-only) */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">📤 Delivery Status</h4>
                    <span className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-blue-800 mb-3">{question.deliveryText}</p>
                  
                  <div className="space-y-2">
                    {question.deliveryAnswers.map(answer => {
                      const isSelected = response.deliveryAnswerId === answer.id;
                      return (
                        <div key={answer.id} className={`p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-blue-200 border-blue-300 shadow-sm' 
                            : 'bg-white border-blue-200 opacity-60'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className={`flex-1 font-medium ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}>
                              {answer.description}
                            </span>
                            {answer.dollarValue > 0 && (
                              <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                <DollarSign className="w-3 h-3" />
                                {answer.dollarValue}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {response.deliveryNotes && (
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 mb-1">Delivery Notes:</p>
                      <p className="text-sm text-blue-800">{response.deliveryNotes}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Return Status (Interactive) */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">📥 Return Status</h4>
                    <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                  
                  <p className="text-sm text-green-800 mb-3">{question.returnText}</p>
                  
                  <div className="space-y-2">
                    {question.returnAnswers.map(answer => {
                      const isSelected = response.returnAnswerId === answer.id;
                      
                      // Calculate cost for this specific answer - FIXED CALCULATION
                      let answerCost = 0;
                      if (response.deliveryAnswerId) {
                        const deliveryAnswer = question.deliveryAnswers.find(a => a.id === response.deliveryAnswerId);
                        if (deliveryAnswer) {
                          // FIXED: Return value minus delivery value (what customer owes)
                          answerCost = answer.dollarValue - deliveryAnswer.dollarValue;
                        }
                      }
                      
                      return (
                        <label key={answer.id} className={`block p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          isSelected 
                            ? 'bg-green-200 border-green-300 shadow-sm' 
                            : 'bg-white border-green-200 hover:bg-green-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`return-${question.id}`}
                              value={answer.id}
                              checked={isSelected}
                              onChange={(e) => updateResponse(question.id, { returnAnswerId: e.target.value })}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="flex-1 font-medium text-green-900">
                              {answer.description}
                            </span>
                            
                            {/* Show cost impact for this answer */}
                            {response.deliveryAnswerId && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                answerCost > 0 ? 'bg-red-100 text-red-800' : 
                                answerCost < 0 ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                <DollarSign className="w-3 h-3" />
                                {answerCost > 0 ? `+${answerCost}` : answerCost}
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  
                  {/* Return Notes */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-green-900 mb-2">
                      Return Notes (Optional)
                    </label>
                    <textarea
                      value={response.returnNotes || ''}
                      onChange={(e) => updateResponse(question.id, { returnNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      rows={2}
                      placeholder="Add any additional comments about the return condition..."
                    />
                  </div>
                </div>
              </div>

              {/* Comparison Arrow */}
              <div className="flex items-center justify-center mt-4 lg:hidden">
                <div className="flex items-center gap-2 text-gray-500">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Compare</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {getCompletedRequiredQuestions().length}/{getRequiredQuestions().length}
            </div>
            <div className="text-sm text-gray-600">Required Items</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {getCompletedAllQuestions().length}/{questions.length}
            </div>
            <div className="text-sm text-gray-600">Items Processed</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">
              {responses.filter(r => r.deliveryAnswerId).length}
            </div>
            <div className="text-sm text-blue-700">Items Delivered</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${
              equipmentEndHours > 0 && (equipmentEndHours - equipmentStartHours) > rentalPeriod.allowedHours
                ? 'text-orange-600'
                : 'text-gray-900'
            }`}>
              {equipmentEndHours > 0 ? (equipmentEndHours - equipmentStartHours).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">Hours Used</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${
              (calculateTotalCost() + calculateOverageCost()) > 0 ? 'text-red-600' : 
              (calculateTotalCost() + calculateOverageCost()) < 0 ? 'text-green-600' : 
              'text-gray-900'
            }`}>
              ${Math.abs(calculateTotalCost() + calculateOverageCost())}
            </div>
            <div className="text-sm text-gray-600">
              {(calculateTotalCost() + calculateOverageCost()) > 0 ? 'Total Charges' : 
               (calculateTotalCost() + calculateOverageCost()) < 0 ? 'Credits Applied' : 
               'No Additional Costs'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {canComplete() ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Ready to complete return checklist
              </span>
            ) : (
              <span className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                Please complete all required items, inspector, and end hours
              </span>
            )}
          </div>
          
          <button
            onClick={handleComplete}
            disabled={!canComplete()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              canComplete()
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Return Checklist
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeliveryChecklist;