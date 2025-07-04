# System Architecture Documentation

## 🏗️ Domain Driven Architecture

This system follows a **Domain Driven Architecture** pattern with clear separation of concerns across multiple domains.

## 🌐 Domain Structure

### Primary Domains
```
kabba.ai/                    # Frontend Domain (Customer-facing)
├── admin.kabba.ai/         # Admin Operations Domain
├── api.kabba.ai/           # API Domain (Backend Services)
└── customer.kabba.ai/      # Customer Operations Domain
```

### Domain Responsibilities

#### `kabba.ai` - Frontend Domain
- **Purpose**: Main customer-facing interface
- **Responsibilities**: 
  - Equipment browsing and selection
  - Rental ready checklist completion
  - Public-facing information
- **Components**: `EquipmentSelector`, `ChecklistForm`, main `App`

#### `admin.kabba.ai` - Admin Operations Domain
- **Purpose**: Administrative management and configuration
- **Responsibilities**:
  - Question and category management
  - Checklist template creation
  - System configuration
- **Components**: `AdminDashboard`, `QuestionManager`, `ChecklistTemplateManager`

#### `customer.kabba.ai` - Customer Operations Domain
- **Purpose**: Customer-specific operations and workflows
- **Responsibilities**:
  - Delivery and return checklists
  - Customer-specific question management
  - Cost calculations and billing
- **Components**: `CustomerAdminDashboard`, `CustomerDeliveryChecklist`

#### `api.kabba.ai` - API Domain
- **Purpose**: Backend services and data management
- **Responsibilities**:
  - Data persistence
  - Business logic processing
  - Authentication and authorization
- **Implementation**: Node.js/Express backend (future implementation)

## 🎮 Controller Pattern

The system implements **Single Responsibility Controllers** for clear separation of operations:

### Controller Types

#### `IndexController`
- **Responsibility**: Main application routing and navigation
- **Operations**: Route handling, view switching, initial data loading
- **Location**: Main `App.tsx` component

#### `StoreController`
- **Responsibility**: Data creation and storage operations
- **Operations**: Creating new questions, templates, equipment records
- **Examples**: Adding new checklist items, creating templates

#### `EditController`
- **Responsibility**: Data modification interfaces
- **Operations**: Form handling, validation, user input processing
- **Examples**: Question editing forms, template builders

#### `UpdateController`
- **Responsibility**: State updates and data synchronization
- **Operations**: Real-time updates, status changes, progress tracking
- **Examples**: Equipment status updates, checklist progress

#### `DeleteController`
- **Responsibility**: Data removal and cleanup operations
- **Operations**: Safe deletion, cascade handling, confirmation workflows
- **Examples**: Removing questions, deleting templates

## 📊 Data Flow Architecture

### Unidirectional Data Flow
```
User Action → Controller → State Update → Component Re-render → UI Update
```

### State Management Pattern
```
Local State (useState) → Component State → Global Context → Persistent Storage
```

### Data Validation Flow
```
User Input → Client Validation → Type Checking → Business Logic → State Update
```

## 🔄 Component Architecture

### Hierarchical Component Structure
```
App (Root Controller)
├── EquipmentSelector (Index Controller)
├── ChecklistForm (Edit/Update Controller)
├── AdminDashboard (Index Controller)
│   ├── QuestionManager (Store/Edit/Delete Controllers)
│   └── ChecklistTemplateManager (Store/Edit/Delete Controllers)
└── CustomerAdminDashboard (Index Controller)
    ├── CustomerQuestionManager (Store/Edit/Delete Controllers)
    ├── CustomerChecklistTemplateManager (Store/Edit/Delete Controllers)
    └── CustomerDeliveryChecklist (Edit/Update Controllers)
```

### Component Responsibilities

#### **Container Components** (Controllers)
- Manage state and business logic
- Handle data fetching and updates
- Coordinate between child components
- Implement controller patterns

#### **Presentation Components** (Views)
- Pure UI rendering
- Receive data via props
- Emit events to parent controllers
- No direct state management

#### **Utility Components** (Services)
- Reusable functionality
- Cross-cutting concerns
- Helper functions and utilities
- Type definitions and interfaces

## 🗄️ Data Architecture

### Type System Hierarchy
```
Base Types (equipment.ts)
├── Equipment, Inspector, ChecklistItem
├── Admin Types (admin.ts)
│   ├── Question, QuestionCategory
│   └── ChecklistTemplate, AnswerOption
└── Customer Types (customerAdmin.ts)
    ├── CustomerQuestion, CustomerQuestionCategory
    └── CustomerChecklistTemplate, RentalPeriod
```

### Data Layer Separation
```
Mock Data Layer (Development)
├── mockData.ts (Equipment data)
├── adminMockData.ts (Admin system data)
└── customerAdminMockData.ts (Customer system data)

Future API Layer (Production)
├── Equipment Service
├── Admin Service
└── Customer Service
```

## 🔐 Security Architecture

### Authentication Flow
```
User Login → JWT Token → Role-Based Access → Domain Routing
```

### Authorization Levels
- **Public**: Equipment browsing, basic information
- **Customer**: Delivery/return checklists, customer portal
- **Inspector**: Rental ready checklists, equipment inspection
- **Admin**: Full system management, configuration

### Data Protection
- **Input Sanitization**: All user inputs validated and sanitized
- **Type Safety**: TypeScript prevents runtime type errors
- **State Immutability**: Prevents accidental data corruption
- **Error Boundaries**: Graceful error handling and recovery

## 📱 Mobile-First Architecture

### Responsive Design Strategy
```
Mobile First (320px+) → Tablet (768px+) → Desktop (1024px+)
```

### Touch-Optimized Components
- **Large Touch Targets**: Minimum 44px touch areas
- **Gesture Support**: Swipe, pinch, and tap interactions
- **Keyboard Optimization**: Virtual keyboard considerations
- **Performance**: Optimized for mobile hardware

### Progressive Enhancement
- **Core Functionality**: Works on all devices
- **Enhanced Features**: Additional features for larger screens
- **Offline Support**: Service worker for offline functionality
- **Performance**: Lazy loading and code splitting

## 🚀 Deployment Architecture

### Multi-Environment Strategy
```
Development → Staging → Production
├── Local Development (Vite dev server)
├── Staging Environment (Preview deployments)
└── Production Environment (CDN + API)
```

### Infrastructure Components
- **Frontend**: Static site hosting (Netlify, Vercel)
- **API**: Containerized Node.js services
- **Database**: PostgreSQL with read replicas
- **CDN**: Global content delivery network
- **Monitoring**: Application performance monitoring

## 🔄 Future Scalability

### Microservices Migration Path
```
Current Monolith → Domain Services → Microservices
├── Equipment Service
├── Inspection Service
├── Customer Service
└── Admin Service
```

### Performance Optimization
- **Code Splitting**: Domain-based bundle splitting
- **Lazy Loading**: Route-based component loading
- **Caching Strategy**: Multi-layer caching approach
- **Database Optimization**: Query optimization and indexing

---

This architecture ensures **maintainability**, **scalability**, and **clear separation of concerns** while following industry best practices for modern web applications.