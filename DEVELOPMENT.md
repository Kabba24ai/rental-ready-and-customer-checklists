# Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd rental-ready-checklist

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📁 Project Structure Deep Dive

### Component Organization
```
src/components/
├── admin/                     # Admin Domain Components
│   ├── AdminDashboard.tsx    # Main admin interface
│   ├── QuestionManager.tsx   # Question CRUD operations
│   └── ChecklistTemplateManager.tsx # Template builder
├── customer/                  # Customer Domain Components
│   ├── CustomerAdminDashboard.tsx
│   ├── CustomerQuestionManager.tsx
│   ├── CustomerChecklistTemplateManager.tsx
│   └── CustomerDeliveryChecklist.tsx
├── ChecklistForm.tsx         # Core inspection form
└── EquipmentSelector.tsx     # Equipment browsing
```

### Data Layer Organization
```
src/data/
├── mockData.ts              # Equipment, inspectors, base data
├── adminMockData.ts         # Admin questions, templates
└── customerAdminMockData.ts # Customer questions, rental periods
```

### Type System Organization
```
src/types/
├── equipment.ts             # Core equipment and checklist types
├── admin.ts                 # Admin system types
└── customerAdmin.ts         # Customer system types
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--blue-600: #2563eb;    /* Primary actions, links */
--green-600: #16a34a;   /* Success, rental ready */
--red-600: #dc2626;     /* Errors, damaged items */
--orange-600: #ea580c;  /* Warnings, maintenance */
--purple-600: #9333ea;  /* Customer features */

/* Status Colors */
--rental-ready: #16a34a;
--maint-hold: #ea580c;
--damaged: #dc2626;
--rented: #2563eb;
```

### Typography Scale
```css
/* Headings */
text-2xl: 1.5rem;      /* Page titles */
text-xl: 1.25rem;      /* Section headers */
text-lg: 1.125rem;     /* Subsection headers */

/* Body Text */
text-base: 1rem;       /* Default body text */
text-sm: 0.875rem;     /* Secondary text */
text-xs: 0.75rem;      /* Labels, badges */
```

### Spacing System (8px Grid)
```css
/* Spacing Scale */
p-1: 4px;    p-2: 8px;    p-3: 12px;   p-4: 16px;
p-5: 20px;   p-6: 24px;   p-8: 32px;   p-12: 48px;

/* Margins follow same scale */
m-1: 4px;    m-2: 8px;    m-3: 12px;   m-4: 16px;
```

## 🧩 Component Development Patterns

### Component Structure Template
```tsx
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { TypeName } from '../types/typeName';

interface ComponentNameProps {
  // Required props
  requiredProp: string;
  // Optional props with defaults
  optionalProp?: boolean;
  // Event handlers
  onAction?: (data: TypeName) => void;
}

/**
 * ComponentName - Brief description of component purpose
 * 
 * @param requiredProp - Description of required prop
 * @param optionalProp - Description of optional prop (default: false)
 * @param onAction - Callback fired when action occurs
 */
const ComponentName: React.FC<ComponentNameProps> = ({
  requiredProp,
  optionalProp = false,
  onAction
}) => {
  // State management
  const [localState, setLocalState] = useState<TypeName | null>(null);
  
  // Effects
  useEffect(() => {
    // Effect logic with cleanup
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);

  // Event handlers
  const handleAction = (data: TypeName) => {
    // Local logic
    setLocalState(data);
    // Emit to parent
    onAction?.(data);
  };

  // Render helpers
  const renderSubComponent = () => (
    <div className="component-specific-styles">
      {/* Sub-component content */}
    </div>
  );

  return (
    <div className="main-container-styles">
      {/* Component content */}
      {renderSubComponent()}
    </div>
  );
};

export default ComponentName;
```

### State Management Patterns

#### Local State (useState)
```tsx
// Simple state
const [isLoading, setIsLoading] = useState(false);

// Complex state with type safety
const [formData, setFormData] = useState<FormData>({
  name: '',
  category: '',
  required: false
});

// State updates (immutable)
const updateFormData = (updates: Partial<FormData>) => {
  setFormData(prev => ({ ...prev, ...updates }));
};
```

#### Effect Patterns
```tsx
// Data fetching
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getData();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchData();
}, [dependencies]);

// Cleanup pattern
useEffect(() => {
  const subscription = subscribe(callback);
  return () => subscription.unsubscribe();
}, []);
```

## 📱 Mobile Development Guidelines

### Touch Target Sizing
```tsx
// Minimum touch target: 44px x 44px
<button className="min-h-[44px] min-w-[44px] p-3">
  Touch Target
</button>

// Radio buttons and checkboxes
<input 
  type="radio" 
  className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
/>
```

### Responsive Breakpoints
```tsx
// Mobile-first approach
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                 // Tablet: half width
  lg:w-1/3                 // Desktop: third width
  p-4                      // Mobile: 16px padding
  md:p-6                   // Tablet: 24px padding
  lg:p-8                   // Desktop: 32px padding
">
```

### Performance Optimization
```tsx
// Lazy loading for large components
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));

// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Callback memoization
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

## 🧪 Testing Patterns

### Component Testing Template
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    requiredProp: 'test-value'
  };

  it('renders correctly with required props', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockHandler = jest.fn();
    render(<ComponentName {...defaultProps} onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledWith(expectedData);
  });

  it('displays loading state', () => {
    render(<ComponentName {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## 🔧 Development Tools

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "prefer-const": "error",
    "no-unused-vars": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Git Hooks (Husky)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🚀 Build and Deployment

### Development Build
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development

# .env.production
VITE_API_URL=https://api.kabba.ai
VITE_APP_ENV=production
```

### Performance Monitoring
```tsx
// Performance measurement
const startTime = performance.now();
// ... expensive operation
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);

// Bundle analysis
npm run build -- --analyze
```

## 📝 Code Style Guidelines

### Naming Conventions
```tsx
// Components: PascalCase
const EquipmentSelector = () => {};

// Functions: camelCase
const handleSubmit = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 50;

// Types/Interfaces: PascalCase
interface EquipmentData {}
type StatusType = 'active' | 'inactive';
```

### File Organization
```
ComponentName/
├── index.ts                 # Export barrel
├── ComponentName.tsx        # Main component
├── ComponentName.test.tsx   # Tests
├── ComponentName.stories.tsx # Storybook stories
└── types.ts                 # Component-specific types
```

### Import Organization
```tsx
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';

// 2. Internal utilities and types
import { TypeName } from '../types/typeName';
import { utilityFunction } from '../utils/utilities';

// 3. Relative imports
import { SubComponent } from './SubComponent';
```

## 🐛 Debugging Guidelines

### Common Issues and Solutions

#### State Not Updating
```tsx
// ❌ Mutating state directly
setState(state.push(newItem));

// ✅ Immutable update
setState(prev => [...prev, newItem]);
```

#### Effect Dependencies
```tsx
// ❌ Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Complete dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

#### Performance Issues
```tsx
// ❌ Creating objects in render
<Component style={{ margin: 10 }} />

// ✅ Stable references
const styles = { margin: 10 };
<Component style={styles} />
```

### Development Tools
- **React DevTools**: Component inspection and profiling
- **Redux DevTools**: State management debugging
- **Network Tab**: API call monitoring
- **Performance Tab**: Runtime performance analysis
- **Lighthouse**: Performance and accessibility auditing

---

Happy coding! 🚀