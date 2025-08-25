{{-- Customer Questions Tab Content - Laravel Blade Template --}}
{{-- This partial contains the Customer Questions tab functionality from the React component --}}

@php
    // Mock data - replace with actual data from your Laravel models
    $questions = [
        [
            'id' => 'cq-keys',
            'name' => 'Equipment Keys',
            'categoryId' => 'ccat-keys',
            'required' => true,
            'deliveryText' => 'Keys Delivered',
            'returnText' => 'Keys Returned',
            'syncTexts' => true,
            'deliveryAnswers' => [
                ['id' => 'cans-1', 'description' => 'Yes', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-2', 'description' => 'No', 'dollarValue' => 0, 'sortOrder' => 2]
            ],
            'returnAnswers' => [
                ['id' => 'cans-3', 'description' => 'Yes', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-4', 'description' => 'No', 'dollarValue' => 150, 'sortOrder' => 2]
            ],
            'answerSyncMap' => [0 => true, 1 => true],
            'createdAt' => '2024-01-01T00:00:00Z',
            'updatedAt' => '2024-01-01T00:00:00Z'
        ],
        [
            'id' => 'cq-remote',
            'name' => 'Remote Control',
            'categoryId' => 'ccat-keys',
            'required' => false,
            'deliveryText' => 'Remote Control Delivered',
            'returnText' => 'Remote Control Returned',
            'syncTexts' => true,
            'deliveryAnswers' => [
                ['id' => 'cans-5', 'description' => 'Yes', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-6', 'description' => 'No', 'dollarValue' => 0, 'sortOrder' => 2],
                ['id' => 'cans-7', 'description' => 'N/A - Not Applicable', 'dollarValue' => 0, 'sortOrder' => 3]
            ],
            'returnAnswers' => [
                ['id' => 'cans-8', 'description' => 'Yes', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-9', 'description' => 'No', 'dollarValue' => 300, 'sortOrder' => 2],
                ['id' => 'cans-10', 'description' => 'N/A - Not Applicable', 'dollarValue' => 0, 'sortOrder' => 3]
            ],
            'answerSyncMap' => [0 => true, 1 => true, 2 => true],
            'createdAt' => '2024-01-01T00:00:00Z',
            'updatedAt' => '2024-01-01T00:00:00Z'
        ],
        [
            'id' => 'cq-bucket',
            'name' => 'Standard Bucket',
            'categoryId' => 'ccat-attachments',
            'required' => true,
            'deliveryText' => 'Standard Bucket Delivered',
            'returnText' => 'Standard Bucket Returned',
            'syncTexts' => true,
            'deliveryAnswers' => [
                ['id' => 'cans-11', 'description' => 'Good Condition', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-12', 'description' => 'Minor Wear', 'dollarValue' => 0, 'sortOrder' => 2],
                ['id' => 'cans-13', 'description' => 'Not Delivered', 'dollarValue' => 0, 'sortOrder' => 3]
            ],
            'returnAnswers' => [
                ['id' => 'cans-14', 'description' => 'Good Condition', 'dollarValue' => 0, 'sortOrder' => 1],
                ['id' => 'cans-15', 'description' => 'Minor Damage', 'dollarValue' => 200, 'sortOrder' => 2],
                ['id' => 'cans-16', 'description' => 'Major Damage', 'dollarValue' => 800, 'sortOrder' => 3],
                ['id' => 'cans-17', 'description' => 'Missing', 'dollarValue' => 1500, 'sortOrder' => 4]
            ],
            'answerSyncMap' => [0 => true, 1 => false, 2 => false],
            'createdAt' => '2024-01-01T00:00:00Z',
            'updatedAt' => '2024-01-01T00:00:00Z'
        ]
    ];

    $categories = [
        ['id' => 'ccat-keys', 'name' => 'Keys & Access'],
        ['id' => 'ccat-attachments', 'name' => 'Attachments & Accessories']
    ];

    // Filter logic
    $searchTerm = request('search', '');
    $selectedCategory = request('category', '');
    
    $filteredQuestions = collect($questions)->filter(function($question) use ($searchTerm, $selectedCategory) {
        $matchesSearch = empty($searchTerm) || 
            str_contains(strtolower($question['name']), strtolower($searchTerm)) ||
            str_contains(strtolower($question['deliveryText']), strtolower($searchTerm)) ||
            str_contains(strtolower($question['returnText']), strtolower($searchTerm));
        
        $matchesCategory = empty($selectedCategory) || $question['categoryId'] === $selectedCategory;
        
        return $matchesSearch && $matchesCategory;
    });

    // Helper function to get category name
    function getCategoryName($categoryId, $categories) {
        $category = collect($categories)->firstWhere('id', $categoryId);
        return $category ? $category['name'] : 'Unknown';
    }

    // Helper function to calculate cost
    function calculateCost($deliveryValue, $returnValue) {
        return $returnValue - $deliveryValue;
    }
@endphp

{{-- Success Message --}}
@if(session('success'))
<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-green-800 font-medium">{{ session('success') }}</span>
    </div>
</div>
@endif

{{-- Questions Header --}}
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h3 class="text-lg font-semibold text-gray-900">Customer Questions</h3>
            <p class="text-gray-600">Create delivery/return questions with cost calculation (Return Value - Delivery Value = Customer Charge)</p>
        </div>
        <button 
            onclick="openNewQuestionModal()"
            class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Customer Question
        </button>
    </div>

    {{-- Questions Filters --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
                <input
                    type="text"
                    name="search"
                    value="{{ $searchTerm }}"
                    placeholder="Search by question name or text..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onchange="this.form.submit()"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                    name="category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onchange="this.form.submit()"
                >
                    <option value="">All Categories</option>
                    @foreach($categories as $category)
                        <option value="{{ $category['id'] }}" {{ $selectedCategory === $category['id'] ? 'selected' : '' }}>
                            {{ $category['name'] }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Answer Visibility</label>
                <button
                    type="button"
                    onclick="toggleAllAnswers()"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border w-full justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                    id="toggleAllBtn"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="eyeIcon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span id="toggleAllText">Show All Answers</span>
                </button>
            </div>
        </form>
    </div>

    {{-- Questions List --}}
    <div class="space-y-4">
        @forelse($filteredQuestions as $question)
            @php
                $syncedAnswersCount = collect($question['answerSyncMap'])->filter()->count();
                $totalAnswersCount = max(count($question['deliveryAnswers']), count($question['returnAnswers']));
            @endphp
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-question-id="{{ $question['id'] }}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h4 class="text-lg font-semibold text-gray-900">{{ $question['name'] }}</h4>
                            @if($question['required'])
                                <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Required
                                </span>
                            @endif
                            @if($question['syncTexts'])
                                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    Synced Texts
                                </span>
                            @endif
                            @if($syncedAnswersCount > 0)
                                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    {{ $syncedAnswersCount }}/{{ $totalAnswersCount }} Answers Synced
                                </span>
                            @endif
                        </div>
                        <p class="text-sm text-gray-600 mb-2">Category: {{ getCategoryName($question['categoryId'], $categories) }}</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <p class="text-sm font-medium text-blue-900">📤 Delivery Text:</p>
                                <p class="text-sm text-blue-700">{{ $question['deliveryText'] }}</p>
                            </div>
                            <div class="bg-green-50 p-3 rounded-lg">
                                <p class="text-sm font-medium text-green-900">📥 Return Text:</p>
                                <p class="text-sm text-green-700">{{ $question['returnText'] }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            onclick="toggleQuestionExpansion('{{ $question['id'] }}')"
                            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            id="toggleBtn-{{ $question['id'] }}"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="chevron-{{ $question['id'] }}">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                            <span id="toggleText-{{ $question['id'] }}">Show Answers ({{ $totalAnswersCount }})</span>
                        </button>
                        <button
                            onclick="editQuestion('{{ $question['id'] }}')"
                            class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button
                            onclick="deleteQuestion('{{ $question['id'] }}')"
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {{-- Accordion Content - Answer Options --}}
                <div class="border-t border-gray-200 pt-4 mt-4 hidden" id="answers-{{ $question['id'] }}">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {{-- Delivery Answers --}}
                        <div>
                            <h5 class="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                📤 Delivery Answer Options:
                            </h5>
                            <div class="space-y-2">
                                @foreach(collect($question['deliveryAnswers'])->sortBy('sortOrder') as $index => $option)
                                    <div class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <span class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                                            {{ $index + 1 }}
                                        </span>
                                        <span class="flex-1 text-sm font-medium">{{ $option['description'] }}</span>
                                        <div class="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                                            <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                            </svg>
                                            <span class="text-sm font-medium {{ $option['dollarValue'] > 0 ? 'text-red-600' : 'text-green-600' }}">
                                                {{ $option['dollarValue'] }}
                                            </span>
                                        </div>
                                        @if(isset($question['answerSyncMap'][$index]) && $question['answerSyncMap'][$index])
                                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="Synced with return answer">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                            </svg>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        {{-- Return Answers --}}
                        <div>
                            <h5 class="font-medium text-green-900 mb-3 flex items-center gap-2">
                                📥 Return Answer Options:
                            </h5>
                            <div class="space-y-2">
                                @foreach(collect($question['returnAnswers'])->sortBy('sortOrder') as $index => $option)
                                    @php
                                        $deliveryOption = isset($question['deliveryAnswers'][$index]) ? $question['deliveryAnswers'][$index] : null;
                                        $cost = $deliveryOption ? calculateCost($deliveryOption['dollarValue'], $option['dollarValue']) : 0;
                                    @endphp
                                    
                                    <div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <span class="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium">
                                            {{ $index + 1 }}
                                        </span>
                                        <span class="flex-1 text-sm font-medium">{{ $option['description'] }}</span>
                                        <div class="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                                            <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                            </svg>
                                            <span class="text-sm font-medium {{ $option['dollarValue'] > 0 ? 'text-red-600' : 'text-green-600' }}">
                                                {{ $option['dollarValue'] }}
                                            </span>
                                        </div>
                                        
                                        @if($deliveryOption)
                                            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs border border-yellow-200">
                                                <span class="text-gray-600">Charge:</span>
                                                <span class="font-medium {{ $cost > 0 ? 'text-red-600' : ($cost < 0 ? 'text-green-600' : 'text-gray-600') }}">
                                                    ${{ $cost }}
                                                </span>
                                            </div>
                                        @endif
                                        
                                        @if(isset($question['answerSyncMap'][$index]) && $question['answerSyncMap'][$index])
                                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="Synced with delivery answer">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                            </svg>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Customer Questions Found</h3>
                <p class="text-gray-600 mb-4">
                    @if($searchTerm || $selectedCategory)
                        No questions match your search criteria.
                    @else
                        Get started by creating your first customer question.
                    @endif
                </p>
                @if(!$searchTerm && !$selectedCategory)
                    <button
                        onclick="openNewQuestionModal()"
                        class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create First Question
                    </button>
                @endif
            </div>
        @endforelse
    </div>
</div>

{{-- JavaScript for Interactive Functionality --}}
<script>
// Track expanded questions
let expandedQuestions = new Set();

// Toggle individual question expansion
function toggleQuestionExpansion(questionId) {
    const answersDiv = document.getElementById(`answers-${questionId}`);
    const chevronIcon = document.getElementById(`chevron-${questionId}`);
    const toggleText = document.getElementById(`toggleText-${questionId}`);
    
    if (expandedQuestions.has(questionId)) {
        // Hide answers
        answersDiv.classList.add('hidden');
        chevronIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>';
        toggleText.textContent = `Show Answers ({{ $totalAnswersCount }})`;
        expandedQuestions.delete(questionId);
    } else {
        // Show answers
        answersDiv.classList.remove('hidden');
        chevronIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';
        toggleText.textContent = 'Hide Answers';
        expandedQuestions.add(questionId);
    }
    
    updateToggleAllButton();
}

// Toggle all questions
function toggleAllAnswers() {
    const allQuestions = document.querySelectorAll('[data-question-id]');
    const allExpanded = allQuestions.length > 0 && Array.from(allQuestions).every(q => {
        const questionId = q.getAttribute('data-question-id');
        return expandedQuestions.has(questionId);
    });
    
    allQuestions.forEach(questionDiv => {
        const questionId = questionDiv.getAttribute('data-question-id');
        if (allExpanded) {
            // Hide all
            if (expandedQuestions.has(questionId)) {
                toggleQuestionExpansion(questionId);
            }
        } else {
            // Show all
            if (!expandedQuestions.has(questionId)) {
                toggleQuestionExpansion(questionId);
            }
        }
    });
}

// Update toggle all button text
function updateToggleAllButton() {
    const allQuestions = document.querySelectorAll('[data-question-id]');
    const allExpanded = allQuestions.length > 0 && Array.from(allQuestions).every(q => {
        const questionId = q.getAttribute('data-question-id');
        return expandedQuestions.has(questionId);
    });
    
    const toggleBtn = document.getElementById('toggleAllBtn');
    const eyeIcon = document.getElementById('eyeIcon');
    const toggleText = document.getElementById('toggleAllText');
    
    if (allExpanded) {
        eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>';
        toggleText.textContent = 'Hide All Answers';
        toggleBtn.className = toggleBtn.className.replace('text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200', 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200');
    } else {
        eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
        toggleText.textContent = 'Show All Answers';
        toggleBtn.className = toggleBtn.className.replace('text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200', 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200');
    }
}

// Modal functions (you'll need to implement these based on your modal system)
function openNewQuestionModal() {
    // Open your Laravel modal for creating new customer questions
    console.log('Opening new customer question modal');
    // Example: $('#newQuestionModal').modal('show');
}

function editQuestion(questionId) {
    // Open edit modal with question data
    console.log('Editing question:', questionId);
    // Example: loadQuestionData(questionId) then show modal
}

function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this customer question?')) {
        // Send DELETE request to your Laravel route
        fetch(`/admin/customer-questions/${questionId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Reload page or remove element
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting question');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateToggleAllButton();
});
</script>

{{-- CSS Styles (if not using Tailwind in your Laravel app) --}}
<style>
/* Add these styles if you're not using Tailwind CSS */
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.hover\:shadow-sm:hover {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.focus\:ring-2:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5);
}

.focus\:border-transparent:focus {
    border-color: transparent;
}
</style>

{{-- Laravel Integration Notes --}}
{{--
To integrate this template into your Laravel application:

1. Replace the mock data with actual Eloquent models:
   - $questions = CustomerQuestion::with('category')->get();
   - $categories = CustomerQuestionCategory::all();

2. Add these routes to your web.php:
   Route::get('/admin/customer-questions', [CustomerQuestionController::class, 'index']);
   Route::post('/admin/customer-questions', [CustomerQuestionController::class, 'store']);
   Route::put('/admin/customer-questions/{id}', [CustomerQuestionController::class, 'update']);
   Route::delete('/admin/customer-questions/{id}', [CustomerQuestionController::class, 'destroy']);

3. Create the CustomerQuestionController with CRUD methods

4. Add CSRF token to your layout:
   <meta name="csrf-token" content="{{ csrf_token() }}">

5. Include this partial in your main admin layout:
   @include('customer.questions-tab')

6. Implement modal forms for create/edit functionality using your preferred modal system
   (Bootstrap Modal, Alpine.js, Livewire, etc.)

7. Add form validation and error handling as needed

8. Consider using Laravel's pagination for large datasets:
   $questions = CustomerQuestion::paginate(20);
--}}