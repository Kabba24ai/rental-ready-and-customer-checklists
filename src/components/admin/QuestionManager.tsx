import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, AlertTriangle, CheckCircle, Clock, Folder, FolderPlus, GripVertical, ChevronUp, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Question, QuestionCategory, AnswerOption } from '../../types/admin';
import { mockQuestions, mockQuestionCategories } from '../../data/adminMockData';

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [categories, setCategories] = useState<QuestionCategory[]>(mockQuestionCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<QuestionCategory | null>(null);
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
    const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStatusIcon = (status: AnswerOption['status']) => {
    switch (status) {
      case 'Rental Ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Maint. Hold':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'Damaged':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: AnswerOption['status']) => {
    switch (status) {
      case 'Rental Ready':
        return 'bg-green-100 text-green-800';
      case 'Maint. Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Damaged':
        return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleSaveQuestion = (questionData: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
          : q
      ));
      showSuccessMessage('Question updated successfully!');
    } else {
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        name: questionData.name || '',
        categoryId: questionData.categoryId || '',
        required: questionData.required || false,
        answerOptions: questionData.answerOptions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setQuestions(prev => [...prev, newQuestion]);
      showSuccessMessage('Question created successfully!');
    }
    
    setEditingQuestion(null);
    setShowNewQuestionForm(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      showSuccessMessage('Question deleted successfully!');
    }
  };

  const handleSaveCategory = (categoryData: Partial<QuestionCategory>) => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData, updatedAt: new Date().toISOString() }
          : cat
      ));
      showSuccessMessage('Category updated successfully!');
    } else {
      const newCategory: QuestionCategory = {
        id: `cat-${Date.now()}`,
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

  const renderQuestionsTab = () => (
    <div className="space-y-6">
      {/* Questions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
          <p className="text-gray-600">Create and manage inspection questions and answer options</p>
        </div>
        <button
          onClick={() => setShowNewQuestionForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Question
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
              placeholder="Search by question name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200'
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
                  </div>
                  <p className="text-sm text-gray-600">Category: {getCategoryName(question.categoryId)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleQuestionExpansion(question.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Hide Answers
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4" />
                        Show Answers ({question.answerOptions.length})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  <h5 className="font-medium text-gray-900 mb-3">Answer Options:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.answerOptions
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {getStatusIcon(option.status)}
                          <span className="flex-1 text-sm font-medium">{option.description}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(option.status)}`}>
                            {option.status}
                          </span>
                        </div>
                      ))}
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
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          <p className="text-gray-600">Organize questions into logical categories</p>
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
                  <Folder className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{questionCount} question{questionCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
          <h2 className="text-2xl font-bold text-gray-900">Question & Categories Mgt</h2>
          <p className="text-gray-600">Manage inspection questions, answers, and categories</p>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
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
        <QuestionForm
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
        <CategoryForm
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

interface QuestionFormProps {
  question: Question | null;
  categories: QuestionCategory[];
  onSave: (question: Partial<Question>) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: question?.name || '',
    categoryId: question?.categoryId || '',
    required: question?.required || false,
    answerOptions: question?.answerOptions?.sort((a, b) => a.sortOrder - b.sortOrder) || [
      { id: `ans-${Date.now()}-1`, description: '', status: 'Rental Ready' as const, sortOrder: 1 }
    ]
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addAnswerOption = () => {
    const newOption: AnswerOption = {
      id: `ans-${Date.now()}`,
      description: '',
      status: 'Rental Ready',
      sortOrder: formData.answerOptions.length + 1
    };
    setFormData(prev => ({
      ...prev,
      answerOptions: [...prev.answerOptions, newOption]
    }));
  };

  const updateAnswerOption = (index: number, updates: Partial<AnswerOption>) => {
    setFormData(prev => ({
      ...prev,
      answerOptions: prev.answerOptions.map((option, i) => 
        i === index ? { ...option, ...updates } : option
      )
    }));
  };

  const removeAnswerOption = (index: number) => {
    const newOptions = formData.answerOptions.filter((_, i) => i !== index);
    // Update sort orders after removal
    const updatedOptions = newOptions.map((option, i) => ({
      ...option,
      sortOrder: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      answerOptions: updatedOptions
    }));
  };

  const moveAnswerOption = (fromIndex: number, toIndex: number) => {
    const newOptions = [...formData.answerOptions];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);
    
    // Update sort orders
    const updatedOptions = newOptions.map((option, i) => ({
      ...option,
      sortOrder: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      answerOptions: updatedOptions
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveAnswerOption(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {question ? 'Edit Question' : 'New Question'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                Required Question
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options * <span className="text-xs text-gray-500">(Drag to reorder)</span>
                </label>
                <button
                  type="button"
                  onClick={addAnswerOption}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.answerOptions.map((option, index) => (
                  <div
                    key={option.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                      draggedIndex === index 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Order Number */}
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    </div>

                    {/* Answer Input */}
                    <input
                      type="text"
                      value={option.description}
                      onChange={(e) => updateAnswerOption(index, { description: e.target.value })}
                      placeholder="Answer description..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />

                    {/* Status Select */}
                    <select
                      value={option.status}
                      onChange={(e) => updateAnswerOption(index, { status: e.target.value as AnswerOption['status'] })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Rental Ready">Rental Ready</option>
                      <option value="Maint. Hold">Maint. Hold</option>
                      <option value="Damaged">Damaged</option>
                    </select>

                    {/* Move Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveAnswerOption(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveAnswerOption(index, Math.min(formData.answerOptions.length - 1, index + 1))}
                        disabled={index === formData.answerOptions.length - 1}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    {formData.answerOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswerOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Question
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

interface CategoryFormProps {
  category: QuestionCategory | null;
  onSave: (category: Partial<QuestionCategory>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default QuestionManager;