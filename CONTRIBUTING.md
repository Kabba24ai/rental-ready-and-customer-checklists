# Contributing Guidelines

Thank you for your interest in contributing to the Rental Ready Checklist System! This document provides guidelines and best practices for contributing to the project.

## 🏗️ Architecture Principles

### Domain Driven Architecture
This project follows a **Domain Driven Architecture** pattern. Please ensure your contributions align with this structure:

```
Domains:
├── kabba.ai (Frontend Domain)
├── admin.kabba.ai (Admin Operations)
├── customer.kabba.ai (Customer Operations)
└── api.kabba.ai (Backend Services)
```

### Single Responsibility Controllers
All components should follow the **Single Responsibility Controller** pattern:
- `IndexController` - Routing and navigation
- `StoreController` - Data creation operations
- `EditController` - Data modification interfaces
- `UpdateController` - State updates
- `DeleteController` - Data removal operations

## 📝 Code Standards

### TypeScript Requirements
- **100% TypeScript Coverage**: All new code must be written in TypeScript
- **Strict Type Safety**: Use strict TypeScript configuration
- **Interface Definitions**: Define interfaces for all data structures
- **Generic Types**: Use generics where appropriate for reusability

```tsx
// ✅ Good: Proper TypeScript with interface
interface ComponentProps {
  data: Equipment[];
  onSelect: (item: Equipment) => void;
}

const Component: React.FC<ComponentProps> = ({ data, onSelect }) => {
  // Implementation
};

// ❌ Bad: Any types or missing interfaces
const Component = ({ data, onSelect }: any) => {
  // Implementation
};
```

### Component Structure
```tsx
/**
 * Component documentation with purpose and usage
 */
import React, { useState, useEffect } from 'react';
import { TypeDefinitions } from '../types/module';

interface ComponentProps {
  // Props with documentation
}

/**
 * Component description
 * @param prop1 - Description
 * @param prop2 - Description
 */
const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2
}) => {
  // State management
  const [state, setState] = useState<Type>(initialValue);
  
  // Effects with cleanup
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleEvent = (data: Type) => {
    // Handler logic
  };

  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Naming Conventions
- **Components**: PascalCase (`EquipmentSelector`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`EquipmentData`)
- **Files**: PascalCase for components, camelCase for utilities

### CSS and Styling
- **Tailwind CSS Only**: Use Tailwind utility classes
- **Mobile First**: Design for mobile, enhance for desktop
- **8px Grid System**: Use consistent spacing (p-1, p-2, p-3, etc.)
- **Semantic Colors**: Use status-appropriate colors

```tsx
// ✅ Good: Mobile-first responsive design
<div className="
  w-full p-4           // Mobile: full width, 16px padding
  md:w-1/2 md:p-6     // Tablet: half width, 24px padding
  lg:w-1/3 lg:p-8     // Desktop: third width, 32px padding
">

// ❌ Bad: Desktop-first or inconsistent spacing
<div className="w-1/3 p-5 sm:w-full">
```

## 🚀 Development Workflow

### Branch Strategy
```
main                    # Production-ready code
├── develop            # Integration branch
├── feature/feature-name   # New features
├── bugfix/bug-name       # Bug fixes
└── hotfix/urgent-fix     # Critical production fixes
```

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(checklist): add mobile-optimized radio button layout

- Convert dropdown selections to horizontal radio buttons
- Optimize touch targets for iPad/iPhone usage
- Improve visual hierarchy with status indicators

Closes #123
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/mobile-optimization
   ```

2. **Make Changes**
   - Follow coding standards
   - Add appropriate tests
   - Update documentation

3. **Test Thoroughly**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

4. **Create Pull Request**
   - Use descriptive title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Request appropriate reviewers

5. **Code Review**
   - Address all feedback
   - Ensure CI/CD passes
   - Maintain clean commit history

## 🧪 Testing Requirements

### Test Coverage
- **Unit Tests**: All utility functions and hooks
- **Component Tests**: Critical user interactions
- **Integration Tests**: End-to-end workflows
- **Mobile Testing**: Test on actual devices

### Testing Patterns
```tsx
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    data: mockData,
    onSelect: jest.fn()
  };

  it('renders correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<ComponentName {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });
});
```

## 📱 Mobile Development Guidelines

### Touch Targets
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: Adequate spacing between touch targets
- **Visual Feedback**: Clear hover and active states

### Performance
- **Bundle Size**: Keep components under 200 lines
- **Lazy Loading**: Use React.lazy for large components
- **Memoization**: Use useMemo and useCallback appropriately

### Responsive Design
```tsx
// Mobile-first breakpoints
const breakpoints = {
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px'   // Desktops
};
```

## 🔒 Security Guidelines

### Input Validation
- **Client-Side**: Validate all user inputs
- **Type Safety**: Use TypeScript for compile-time validation
- **Sanitization**: Sanitize data before processing

### State Management
- **Immutable Updates**: Never mutate state directly
- **Secure Defaults**: Use secure default values
- **Error Handling**: Implement comprehensive error boundaries

## 📚 Documentation Requirements

### Code Documentation
- **JSDoc Comments**: Document all public functions and components
- **Type Definitions**: Include comprehensive type documentation
- **Usage Examples**: Provide clear usage examples

### README Updates
- Update README.md for new features
- Include setup instructions for new dependencies
- Document breaking changes

## 🎨 Design Guidelines

### Visual Consistency
- **Apple-Level Aesthetics**: Maintain premium design quality
- **Micro-Interactions**: Add thoughtful animations and transitions
- **Color System**: Use consistent color palette
- **Typography**: Follow established type scale

### Accessibility
- **WCAG 2.1 AA**: Meet accessibility standards
- **Keyboard Navigation**: Support keyboard-only users
- **Screen Readers**: Provide appropriate ARIA labels
- **Color Contrast**: Ensure sufficient contrast ratios

## 🚫 What Not to Do

### Code Anti-Patterns
```tsx
// ❌ Don't mutate state directly
state.items.push(newItem);

// ❌ Don't use any types
const data: any = getData();

// ❌ Don't create objects in render
<Component style={{ margin: 10 }} />

// ❌ Don't use inline styles
<div style={{ color: 'red' }}>

// ❌ Don't ignore TypeScript errors
// @ts-ignore
const result = unsafeOperation();
```

### Architecture Violations
- Don't mix domain concerns in components
- Don't bypass the controller pattern
- Don't create circular dependencies
- Don't ignore the mobile-first approach

## 🎯 Review Criteria

Pull requests will be evaluated on:

### Code Quality
- [ ] TypeScript compliance
- [ ] Component structure
- [ ] Error handling
- [ ] Performance considerations

### Design
- [ ] Mobile optimization
- [ ] Visual consistency
- [ ] Accessibility compliance
- [ ] User experience

### Architecture
- [ ] Domain separation
- [ ] Controller pattern adherence
- [ ] Single responsibility principle
- [ ] Maintainability

### Testing
- [ ] Test coverage
- [ ] Mobile device testing
- [ ] Edge case handling
- [ ] Performance testing

## 🤝 Getting Help

### Resources
- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Development Setup**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Communication
- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Code Review**: Tag appropriate reviewers for your domain

### Mentorship
New contributors are welcome! Don't hesitate to:
- Ask questions in pull request comments
- Request code review from experienced team members
- Participate in architecture discussions

---

Thank you for contributing to the Rental Ready Checklist System! Your efforts help make equipment rental management more efficient and user-friendly. 🚀