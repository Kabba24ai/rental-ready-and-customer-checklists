import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, DollarSign, Folder, FolderPlus, GripVertical, ChevronUp, ChevronDown, CheckCircle, Copy, Link, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { CustomerQuestion, CustomerQuestionCategory, CustomerAnswerOption } from '../../types/customerAdmin';
import { mockCustomerQuestions, mockCustomerQuestionCategories } from '../../data/customerAdminMockData';

const CustomerQuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<CustomerQuestion[]>(mockCustomerQuestions);
  const [categories, setCategories] = useState<CustomerQuestionCategory[]>(mockCustomerQuestionCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<CustomerQuestion | null>(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomerQuestionCategory | null>(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'categories'>('questions');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.deliveryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.returnText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || question.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if all filtered questions are expanded
  const allFilteredExpanded = filteredQuestions.length > 0 && 
    filteredQuestions.every(q => expandedQuestions.has(q.id));

  const toggleAllAnswers = () => {
    if (allFilteredExpanded) {
      // Hide all filtered questions
      const filteredIds = new Set(filteredQuestions.map(q => q.id));
      setExpandedQuestions(prev => {
        const newSet = new Set(prev);
        filteredIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      // Show all filtered questions
      const filteredIds = new Set(filteredQuestions.map(q => q.id));
      setExpandedQuestions(prev => new Set([...prev, ...filteredIds]));
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleSaveQuestion = (questionData: Partial<CustomerQuestion>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
          : q
      ));
      showSuccessMessage('Customer question updated successfully!');
    } else {
      const newQuestion: CustomerQuestion = {
        id: `cq-${Date.now()}`,
        name: questionData.name || '',
        categoryId: questionData.categoryId || '',
        required: questionData.required || false,
        deliveryText: questionData.deliveryText || '',
        returnText: questionData.returnText || '',
        syncTexts: questionData.syncTexts || false,
        deliveryAnswers: questionData.deliveryAnswers || [],
        returnAnswers: questionData.returnAnswers || [],
        answerSyncMap: questionData.answerSyncMap || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setQuestions(prev => [...prev, newQuestion]);
      showSuccessMessage('Customer question created successfully!');
    }
    
    setEditingQuestion(null);
    setShowNewQuestionForm(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this customer question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      showSuccessMessage('Customer question deleted successfully!');
    }
  };

  const handleSaveCategory = (categoryData: Partial<CustomerQuestionCategory>) => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData, updatedAt: new Date().toISOString() }
          : cat
      ));
      showSuccessMessage('Category updated successfully!');
    } else {
      const newCategory: CustomerQuestionCategory = {
        id: `ccat-${Date.now()}`,
        name: categoryData.name || '',
        description: categoryData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCategory]);
      showSuccessMessage('Category created successfully!');
    }
    
    setEditingCategory(null);
    setShowNewCategoryForm(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const questionsInCategory = questions.filter(q => q.categoryId === categoryId);
    if (questionsInCategory.length > 0) {
      alert(`Cannot delete category. ${questionsInCategory.length} question(s) are assigned to this category.`);
      return;
    }
    
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      showSuccessMessage('Category deleted successfully!');
    }
  };

  // FIXED: Calculate cost correctly - Return value minus delivery value
  const calculateCost = (deliveryValue: number, returnValue: number) => {
    return returnValue - deliveryValue;
  };

  const renderQuestionsTab = () => (
    <div className="space-y-6">
      {/* Questions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Questions</h3>
          <p className="text-gray-600">Create delivery/return questions with cost calculation (Return Value - Delivery Value = Customer Charge)</p>
        </div>
        <button
          onClick={() => setShowNewQuestionForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Customer Question
        </button>
      </div>

      {/* Questions Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by question name or text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer Visibility</label>
            <button
              onClick={toggleAllAnswers}
              disabled={filteredQuestions.length === 0}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border w-full justify-center ${
                filteredQuestions.length === 0
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : allFilteredExpanded
                    ? 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200'
              }`}
            >
              {allFilteredExpanded ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide All Answers
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show All Answers
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map(question => {
          const syncedAnswersCount = Object.values(question.answerSyncMap).filter(Boolean).length;
          const totalAnswersCount = Math.max(question.deliveryAnswers.length, question.returnAnswers.length);
          const isExpanded = expandedQuestions.has(question.id);
          
          return (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{question.name}</h4>
                    {question.required && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        Required
                      </span>
                    )}
                    {question.syncTexts && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        Synced Texts
                      </span>
                    )}
                    {syncedAnswersCount > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {syncedAnswersCount}/{totalAnswersCount} Answers Synced
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Category: {getCategoryName(question.categoryId)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">📤 Delivery Text:</p>
                      <p className="text-sm text-blue-700">{question.deliveryText}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-900">📥 Return Text:</p>
                      <p className="text-sm text-green-700">{question.returnText}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleQuestionExpansion(question.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Hide Answers
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4" />
                        Show Answers ({totalAnswersCount})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Accordion Content - Answer Options */}
              {isExpanded && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Answers */}
                    <div>
                      <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        📤 Delivery Answer Options:
                      </h5>
                      <div className="space-y-2">
                        {question.deliveryAnswers
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((option, index) => (
                            <div key={option.id} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="flex-1 text-sm font-medium">{option.description}</span>
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                                <DollarSign className="w-3 h-3 text-green-600" />
                                <span className={`text-sm font-medium ${
                                  option.dollarValue > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {option.dollarValue}
                                </span>
                              </div>
                              {question.answerSyncMap[index] && (
                                <Link className="w-4 h-4 text-blue-600" title="Synced with return answer" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Return Answers */}
                    <div>
                      <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                        📥 Return Answer Options:
                      </h5>
                      <div className="space-y-2">
                        {question.returnAnswers
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((option, index) => {
                            const deliveryOption = question.deliveryAnswers[index];
                            const cost = deliveryOption ? calculateCost(deliveryOption.dollarValue, option.dollarValue) : 0;
                            
                            return (
                              <div key={option.id} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span className="flex-1 text-sm font-medium">{option.description}</span>
                                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                                  <DollarSign className="w-3 h-3 text-green-600" />
                                  <span className={`text-sm font-medium ${
                                    option.dollarValue > 0 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {option.dollarValue}
                                  </span>
                                </div>
                                {deliveryOption && (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs border border-yellow-200">
                                    <span className="text-gray-600">Charge:</span>
                                    <span className={`font-medium ${cost > 0 ? 'text-red-600' : cost < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                      ${cost}
                                    </span>
                                  </div>
                                )}
                                {question.answerSyncMap[index] && (
                                  <Link className="w-4 h-4 text-green-600" title="Synced with delivery answer" />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      {/* Categories Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Question Categories</h3>
          <p className="text-gray-600">Organize customer questions into logical categories</p>
        </div>
        <button
          onClick={() => setShowNewCategoryForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const questionCount = questions.filter(q => q.categoryId === category.id).length;
          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Folder className="w-8 h-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{questionCount} question{questionCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Customer Questions & Categories</h2>
          <p className="text-gray-600">Manage delivery/return questions with cost calculation (Return Value - Delivery Value = Customer Charge)</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'questions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories ({categories.length})
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'questions' ? renderQuestionsTab() : renderCategoriesTab()}
        </div>
      </div>

      {/* Question Form Modal */}
      {(editingQuestion || showNewQuestionForm) && (
        <CustomerQuestionForm
          question={editingQuestion}
          categories={categories}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setEditingQuestion(null);
            setShowNewQuestionForm(false);
          }}
        />
      )}

      {/* Category Form Modal */}
      {(editingCategory || showNewCategoryForm) && (
        <CustomerCategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setEditingCategory(null);
            setShowNewCategoryForm(false);
          }}
        />
      )}
    </div>
  );
};

interface CustomerQuestionFormProps {
  question: CustomerQuestion | null;
  categories: CustomerQuestionCategory[];
  onSave: (question: Partial<CustomerQuestion>) => void;
  onCancel: () => void;
}

const CustomerQuestionForm: React.FC<CustomerQuestionFormProps> = ({ question, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: question?.name || '',
    categoryId: question?.categoryId || '',
    required: question?.required || false,
    deliveryText: question?.deliveryText || '',
    returnText: question?.returnText || '',
    syncTexts: question?.syncTexts || true,
    deliveryAnswers: question?.deliveryAnswers?.sort((a, b) => a.sortOrder - b.sortOrder) || [
      { id: `cans-d-${Date.now()}-1`, description: '', dollarValue: 0, sortOrder: 1 }
    ],
    returnAnswers: question?.returnAnswers?.sort((a, b) => a.sortOrder - b.sortOrder) || [
      { id: `cans-r-${Date.now()}-1`, description: '', dollarValue: 0, sortOrder: 1 }
    ],
    answerSyncMap: question?.answerSyncMap || { 0: true }
  });

  // Sync return text with delivery text when syncTexts is enabled
  React.useEffect(() => {
    if (formData.syncTexts) {
      setFormData(prev => ({
        ...prev,
        returnText: prev.deliveryText.replace('Delivered', 'Returned').replace('delivered', 'returned')
      }));
    }
  }, [formData.syncTexts, formData.deliveryText]);

  // Sync individual answers when their sync checkbox is enabled
  React.useEffect(() => {
    const updatedReturnAnswers = [...formData.returnAnswers];
    
    Object.entries(formData.answerSyncMap).forEach(([indexStr, isSync]) => {
      const index = parseInt(indexStr);
      if (isSync && formData.deliveryAnswers[index] && updatedReturnAnswers[index]) {
        updatedReturnAnswers[index] = {
          ...updatedReturnAnswers[index],
          description: formData.deliveryAnswers[index].description
        };
      }
    });
    
    setFormData(prev => ({
      ...prev,
      returnAnswers: updatedReturnAnswers
    }));
  }, [formData.answerSyncMap, formData.deliveryAnswers]);

  const ensureAnswerParity = () => {
    const maxLength = Math.max(formData.deliveryAnswers.length, formData.returnAnswers.length);
    const newDeliveryAnswers = [...formData.deliveryAnswers];
    const newReturnAnswers = [...formData.returnAnswers];
    const newSyncMap = { ...formData.answerSyncMap };

    // Add missing delivery answers
    while (newDeliveryAnswers.length < maxLength) {
      newDeliveryAnswers.push({
        id: `cans-d-${Date.now()}-${newDeliveryAnswers.length}`,
        description: '',
        dollarValue: 0,
        sortOrder: newDeliveryAnswers.length + 1
      });
    }

    // Add missing return answers
    while (newReturnAnswers.length < maxLength) {
      newReturnAnswers.push({
        id: `cans-r-${Date.now()}-${newReturnAnswers.length}`,
        description: '',
        dollarValue: 0,
        sortOrder: newReturnAnswers.length + 1
      });
    }

    // Add missing sync map entries (default to true)
    for (let i = 0; i < maxLength; i++) {
      if (!(i in newSyncMap)) {
        newSyncMap[i] = true;
      }
    }

    setFormData(prev => ({
      ...prev,
      deliveryAnswers: newDeliveryAnswers,
      returnAnswers: newReturnAnswers,
      answerSyncMap: newSyncMap
    }));
  };

  const addAnswerPair = () => {
    const newIndex = Math.max(formData.deliveryAnswers.length, formData.returnAnswers.length);
    
    const newDeliveryAnswer: CustomerAnswerOption = {
      id: `cans-d-${Date.now()}`,
      description: '',
      dollarValue: 0,
      sortOrder: newIndex + 1
    };

    const newReturnAnswer: CustomerAnswerOption = {
      id: `cans-r-${Date.now()}`,
      description: '',
      dollarValue: 0,
      sortOrder: newIndex + 1
    };

    setFormData(prev => ({
      ...prev,
      deliveryAnswers: [...prev.deliveryAnswers, newDeliveryAnswer],
      returnAnswers: [...prev.returnAnswers, newReturnAnswer],
      answerSyncMap: { ...prev.answerSyncMap, [newIndex]: true }
    }));
  };

  const updateDeliveryAnswer = (index: number, updates: Partial<CustomerAnswerOption>) => {
    setFormData(prev => ({
      ...prev,
      deliveryAnswers: prev.deliveryAnswers.map((option, i) => 
        i === index ? { ...option, ...updates } : option
      )
    }));
  };

  const updateReturnAnswer = (index: number, updates: Partial<CustomerAnswerOption>) => {
    setFormData(prev => ({
      ...prev,
      returnAnswers: prev.returnAnswers.map((option, i) => 
        i === index ? { ...option, ...updates } : option
      )
    }));
  };

  const toggleAnswerSync = (index: number) => {
    setFormData(prev => ({
      ...prev,
      answerSyncMap: {
        ...prev.answerSyncMap,
        [index]: !prev.answerSyncMap[index]
      }
    }));
  };

  const removeAnswerPair = (index: number) => {
    const newDeliveryAnswers = formData.deliveryAnswers.filter((_, i) => i !== index);
    const newReturnAnswers = formData.returnAnswers.filter((_, i) => i !== index);
    
    // Update sort orders
    const updatedDeliveryAnswers = newDeliveryAnswers.map((option, i) => ({
      ...option,
      sortOrder: i + 1
    }));
    
    const updatedReturnAnswers = newReturnAnswers.map((option, i) => ({
      ...option,
      sortOrder: i + 1
    }));

    // Update sync map
    const newSyncMap: Record<number, boolean> = {};
    Object.entries(formData.answerSyncMap).forEach(([key, value]) => {
      const keyIndex = parseInt(key);
      if (keyIndex < index) {
        newSyncMap[keyIndex] = value;
      } else if (keyIndex > index) {
        newSyncMap[keyIndex - 1] = value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      deliveryAnswers: updatedDeliveryAnswers,
      returnAnswers: updatedReturnAnswers,
      answerSyncMap: newSyncMap
    }));
  };

  React.useEffect(() => {
    ensureAnswerParity();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const maxAnswers = Math.max(formData.deliveryAnswers.length, formData.returnAnswers.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {question ? 'Edit Customer Question' : 'New Customer Question'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Equipment Keys"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Fields with Sync */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="syncTexts"
                  checked={formData.syncTexts}
                  onChange={(e) => setFormData(prev => ({ ...prev, syncTexts: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="syncTexts" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Link className="w-4 h-4" />
                  Sync Delivery & Return Text
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📤 Delivery Text *
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryText}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Keys Delivered"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📥 Return Text *
                  </label>
                  <input
                    type="text"
                    value={formData.returnText}
                    onChange={(e) => setFormData(prev => ({ ...prev, returnText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Keys Returned"
                    disabled={formData.syncTexts}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                Required Question
              </label>
            </div>

            {/* Answer Options with Individual Sync */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Answer Options</h4>
                  <p className="text-sm text-gray-600">Customer Charge = Return Value - Delivery Value</p>
                </div>
                <button
                  type="button"
                  onClick={addAnswerPair}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Answer Pair
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: maxAnswers }, (_, index) => {
                  const deliveryAnswer = formData.deliveryAnswers[index];
                  const returnAnswer = formData.returnAnswers[index];
                  const isSync = formData.answerSyncMap[index] || false;
                  // FIXED: Return value minus delivery value (what customer owes)
                  const cost = deliveryAnswer && returnAnswer ? returnAnswer.dollarValue - deliveryAnswer.dollarValue : 0;

                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Answer {index + 1}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`sync-${index}`}
                              checked={isSync}
                              onChange={() => toggleAnswerSync(index)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`sync-${index}`} className="text-xs text-gray-600 flex items-center gap-1">
                              <Link className="w-3 h-3" />
                              Sync
                            </label>
                          </div>
                          {deliveryAnswer && returnAnswer && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs border border-yellow-200">
                              <span className="text-gray-600">Charge:</span>
                              <span className={`font-medium ${cost > 0 ? 'text-red-600' : cost < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                ${cost}
                              </span>
                            </div>
                          )}
                          {maxAnswers > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAnswerPair(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Delivery Answer */}
                        <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                          <label className="block text-sm font-medium text-blue-900 mb-2">📤 Delivery</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={deliveryAnswer?.description || ''}
                              onChange={(e) => updateDeliveryAnswer(index, { description: e.target.value })}
                              placeholder="Answer description..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                            />
                            <div className="flex items-center gap-1 bg-white px-2 py-2 rounded-md border border-gray-300">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <input
                                type="number"
                                value={deliveryAnswer?.dollarValue || 0}
                                onChange={(e) => updateDeliveryAnswer(index, { dollarValue: Number(e.target.value) })}
                                placeholder="0"
                                className="w-16 border-0 focus:ring-0 p-0 text-sm"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Return Answer */}
                        <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                          <label className="block text-sm font-medium text-green-900 mb-2">
                            📥 Return {isSync && <span className="text-xs">(Synced)</span>}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={returnAnswer?.description || ''}
                              onChange={(e) => updateReturnAnswer(index, { description: e.target.value })}
                              placeholder="Answer description..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              disabled={isSync}
                              required
                            />
                            <div className="flex items-center gap-1 bg-white px-2 py-2 rounded-md border border-gray-300">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <input
                                type="number"
                                value={returnAnswer?.dollarValue || 0}
                                onChange={(e) => updateReturnAnswer(index, { dollarValue: Number(e.target.value) })}
                                placeholder="0"
                                className="w-16 border-0 focus:ring-0 p-0 text-sm"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Customer Question
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface CustomerCategoryFormProps {
  category: CustomerQuestionCategory | null;
  onSave: (category: Partial<CustomerQuestionCategory>) => void;
  onCancel: () => void;
}

const CustomerCategoryForm: React.FC<CustomerCategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {category ? 'Edit Category' : 'New Category'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Optional description..."
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Category
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuestionManager;