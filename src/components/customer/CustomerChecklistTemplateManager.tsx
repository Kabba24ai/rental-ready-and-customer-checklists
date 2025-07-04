import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, GripVertical, Search, CheckCircle, DollarSign } from 'lucide-react';
import { CustomerChecklistTemplate, CustomerQuestion, CustomerQuestionCategory, CustomerChecklistTemplateQuestion, CustomerDragItem } from '../../types/customerAdmin';
import { mockCustomerChecklistTemplates, mockCustomerQuestions, mockCustomerQuestionCategories } from '../../data/customerAdminMockData';

const CustomerChecklistTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<CustomerChecklistTemplate[]>(mockCustomerChecklistTemplates);
  const [questions, setQuestions] = useState<CustomerQuestion[]>(mockCustomerQuestions);
  const [categories, setCategories] = useState<CustomerQuestionCategory[]>(mockCustomerQuestionCategories);
  const [editingTemplate, setEditingTemplate] = useState<CustomerChecklistTemplate | null>(null);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.equipmentCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTemplate = (templateData: Partial<CustomerChecklistTemplate>) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
          : t
      ));
      showSuccessMessage('Customer template updated successfully!');
    } else {
      const newTemplate: CustomerChecklistTemplate = {
        id: `ctemplate-${Date.now()}`,
        name: templateData.name || '',
        description: templateData.description || '',
        equipmentCategory: templateData.equipmentCategory || '',
        questions: templateData.questions || [],
        isActive: templateData.isActive || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
      showSuccessMessage('Customer template created successfully!');
    }
    
    setEditingTemplate(null);
    setShowNewTemplateForm(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this customer template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      showSuccessMessage('Customer template deleted successfully!');
    }
  };

  const getQuestionName = (questionId: string) => {
    return questions.find(q => q.id === questionId)?.name || 'Unknown Question';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Checklist Templates</h2>
          <p className="text-gray-600">Create delivery/return checklist templates for different equipment categories</p>
        </div>
        <button
          onClick={() => setShowNewTemplateForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Customer Template
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{template.description}</p>
                <p className="text-sm text-gray-600">Equipment Category: {template.equipmentCategory}</p>
                <p className="text-sm text-gray-600">{template.questions.length} questions</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Questions in Template:</h4>
              <div className="space-y-1">
                {template.questions
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((tq, index) => {
                    const question = questions.find(q => q.id === tq.questionId);
                    return (
                      <div key={tq.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium">{getQuestionName(tq.questionId)}</span>
                          {question && (
                            <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                              <div className="text-blue-600">📤 {question.deliveryText}</div>
                              <div className="text-green-600">📥 {question.returnText}</div>
                            </div>
                          )}
                        </div>
                        {question && (
                          <span className="text-xs text-gray-500">
                            {getCategoryName(question.categoryId)}
                          </span>
                        )}
                        {tq.required && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Form Modal */}
      {(editingTemplate || showNewTemplateForm) && (
        <CustomerTemplateForm
          template={editingTemplate}
          questions={questions}
          categories={categories}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setEditingTemplate(null);
            setShowNewTemplateForm(false);
          }}
        />
      )}
    </div>
  );
};

interface CustomerTemplateFormProps {
  template: CustomerChecklistTemplate | null;
  questions: CustomerQuestion[];
  categories: CustomerQuestionCategory[];
  onSave: (template: Partial<CustomerChecklistTemplate>) => void;
  onCancel: () => void;
}

const CustomerTemplateForm: React.FC<CustomerTemplateFormProps> = ({ template, questions, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    equipmentCategory: template?.equipmentCategory || '',
    isActive: template?.isActive ?? true,
    questions: template?.questions || []
  });

  const [availableQuestions, setAvailableQuestions] = useState<CustomerQuestion[]>(questions);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<CustomerDragItem | null>(null);

  const filteredAvailableQuestions = availableQuestions.filter(question => {
    const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.deliveryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.returnText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || question.categoryId === selectedCategory;
    const notInTemplate = !formData.questions.some(tq => tq.questionId === question.id);
    return matchesSearch && matchesCategory && notInTemplate;
  });

  const handleDragStart = (e: React.DragEvent, question: CustomerQuestion) => {
    const dragItem: CustomerDragItem = {
      id: question.id,
      type: 'question',
      questionId: question.id,
      name: question.name,
      category: getCategoryName(question.categoryId),
      required: question.required
    };
    setDraggedItem(dragItem);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const newTemplateQuestion: CustomerChecklistTemplateQuestion = {
        id: `ctq-${Date.now()}`,
        questionId: draggedItem.questionId,
        sortOrder: formData.questions.length + 1,
        required: draggedItem.required
      };
      
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newTemplateQuestion]
      }));
    }
    setDraggedItem(null);
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(tq => tq.questionId !== questionId)
    }));
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...formData.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    
    const updatedQuestions = newQuestions.map((tq, index) => ({
      ...tq,
      sortOrder: index + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const toggleRequired = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(tq => 
        tq.questionId === questionId 
          ? { ...tq, required: !tq.required }
          : tq
      )
    }));
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getQuestionName = (questionId: string) => {
    return questions.find(q => q.id === questionId)?.name || 'Unknown Question';
  };

  const getQuestion = (questionId: string) => {
    return questions.find(q => q.id === questionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {template ? 'Edit Customer Template' : 'New Customer Template'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex">
            {/* Left Panel - Template Details */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Category *
                  </label>
                  <select
                    value={formData.equipmentCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, equipmentCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Heavy Equipment">Heavy Equipment</option>
                    <option value="Compact Equipment">Compact Equipment</option>
                    <option value="Power Equipment">Power Equipment</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Template
                  </label>
                </div>
              </div>
            </div>

            {/* Middle Panel - Available Questions */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-4">Available Customer Questions</h4>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {filteredAvailableQuestions.map(question => (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, question)}
                    className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{question.name}</span>
                      {question.required && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="ml-6 space-y-1 text-xs">
                      <div className="text-blue-600">📤 {question.deliveryText}</div>
                      <div className="text-green-600">📥 {question.returnText}</div>
                      <div className="text-gray-500">{getCategoryName(question.categoryId)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Template Questions */}
            <div className="w-1/3 p-6 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-4">
                Template Questions ({formData.questions.length})
              </h4>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`min-h-[200px] border-2 border-dashed rounded-lg p-4 ${
                  formData.questions.length === 0 
                    ? 'border-gray-300 bg-gray-50' 
                    : 'border-transparent bg-transparent'
                }`}
              >
                {formData.questions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Drag customer questions here to build your template</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.questions
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((tq, index) => {
                        const question = getQuestion(tq.questionId);
                        return (
                          <div
                            key={tq.id}
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="flex-1 font-medium text-sm">{getQuestionName(tq.questionId)}</span>
                              <button
                                type="button"
                                onClick={() => removeQuestion(tq.questionId)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {question && (
                              <div className="ml-8 space-y-1 text-xs mb-2">
                                <div className="text-blue-600">📤 {question.deliveryText}</div>
                                <div className="text-green-600">📥 {question.returnText}</div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 ml-8">
                              <input
                                type="checkbox"
                                checked={tq.required}
                                onChange={() => toggleRequired(tq.questionId)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="text-xs text-gray-600">Required</label>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-8 mt-1">
                              <button
                                type="button"
                                onClick={() => moveQuestion(index, Math.max(0, index - 1))}
                                disabled={index === 0}
                                className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                              >
                                ↑ Up
                              </button>
                              <button
                                type="button"
                                onClick={() => moveQuestion(index, Math.min(formData.questions.length - 1, index + 1))}
                                disabled={index === formData.questions.length - 1}
                                className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                              >
                                ↓ Down
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Customer Template
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerChecklistTemplateManager;