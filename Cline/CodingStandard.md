# SecureDocAI App - Coding Standards

## Overview
This document defines the coding standards and conventions for the SecureDocAI application. These standards ensure consistency, maintainability, and readability across the codebase.

## Project Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Styling**: CSS with component-scoped styles
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Toastify

### Folder Structure
```
src/
├── components/           # Reusable UI components
│   ├── chat/            # Chat-related components
│   ├── documents/       # Document management components
│   ├── profile/         # User profile components
│   ├── questionnaire/   # Health questionnaire components
│   └── users/           # User management components
├── enum/                # TypeScript enums
├── models/              # TypeScript interfaces
├── service/             # RTK Query API services
├── store/               # Redux store configuration
└── utils/               # Utility functions
```

## TypeScript Standards

### Interface Naming
- Use `I` prefix for interfaces: `IUser`, `IResponse`, `IQuestionnaire`
- Use descriptive names that clearly indicate the data structure
- Group related interfaces in the same file

### Type Definitions
```typescript
// Preferred: Clear, descriptive interface
interface IQuestionnaireResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  responses: IQuestionResponse[];
  isCompleted: boolean;
  completedAt?: string;
  totalScore?: number;
}

// Request interfaces for API calls
interface IQuestionnaireResponseRequest {
  questionnaireId: string;
  responses: IQuestionResponseRequest[];
  isCompleted: boolean;
}
```

## React Component Standards

### Component Structure
```typescript
import React from 'react';
import { useQuery, useMutation } from '@reduxjs/toolkit/query/react';
import { SomeService } from '../../service/SomeService';
import { toastSuccess, toastError } from '../../utils/ToastUtils';
import type { ISomeInterface } from '../../models/ISomeInterface';

/**
 * ComponentName Component
 * 
 * Brief description of what the component does:
 * - Key functionality 1
 * - Key functionality 2
 * - Key functionality 3
 */
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: (data: ISomeInterface) => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  onAction
}) => {
  // 1. Hooks (queries, mutations, state)
  const { data, isLoading, error } = useQuery();
  const [mutation] = useMutation();
  const [localState, setLocalState] = useState<string>('');

  // 2. Event handlers
  const handleSubmit = async () => {
    try {
      await mutation(data).unwrap();
      toastSuccess('Operation completed successfully!');
    } catch (error) {
      console.error('Operation failed:', error);
      toastError('Operation failed. Please try again.');
    }
  };

  // 3. Early returns for loading/error states
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error loading data</div>;
  }

  // 4. Main render
  return (
    <div className="component-name-container">
      <div className="component-name-header">
        <h1>Component Title</h1>
      </div>
      
      <div className="component-name-content">
        {/* Component content */}
      </div>
      
      <div className="component-name-actions">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Action
        </button>
      </div>
    </div>
  );
};

export default ComponentName;
```

### Component Documentation
- Every component must have a JSDoc comment explaining its purpose
- List key functionalities as bullet points
- Document complex props and their expected values
- Include examples for complex components

## Service Layer Standards

### RTK Query Services
```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse } from '../utils/RequestUtils';
import { Http } from '../enum/http.method';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';

// API base URL
const serviceApiBaseUrl = 'http://localhost:8085/api/endpoint';

/**
 * Service API Documentation
 * 
 * RTK Query service for managing [feature] operations including:
 * - Feature 1 description
 * - Feature 2 description
 * - Feature 3 description
 * 
 * Features:
 * - Security features
 * - Caching strategy
 * - Error handling approach
 */
export const serviceAPI = createApi({
  reducerPath: 'serviceAPI',
  baseQuery: createBaseQueryWithAuth(serviceApiBaseUrl, isJsonContentType),
  tagTypes: ['EntityName', 'EntityList'],
  endpoints: (builder) => ({
    getEntities: builder.query<IResponse<EntityType[]>, QueryParams>({
      query: (params) => ({
        url: `?param=${params.value}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 300, // 5 minutes
      transformResponse: processResponse<EntityType[]>,
      transformErrorResponse: processError,
      providesTags: ['EntityList']
    })
  })
});

export const {
  useGetEntitiesQuery,
  // Export other hooks
} = serviceAPI;

export default serviceAPI;
```

### Service Documentation Requirements
- Document the purpose and scope of the API service
- List all major operations
- Explain security considerations
- Document caching strategies
- Include transformation logic explanations

## State Management

### Redux Store Structure
- Use Redux Toolkit for state management
- Implement RTK Query for API state
- Keep local component state for UI-only concerns
- Use typed hooks throughout the application

### Query/Mutation Patterns
```typescript
// Query usage
const { 
  data, 
  isLoading, 
  error,
  refetch 
} = useGetDataQuery(params);

// Mutation usage
const [submitData, { 
  isLoading: isSubmitting 
}] = useSubmitDataMutation();

const handleSubmit = async () => {
  try {
    await submitData(formData).unwrap();
    toastSuccess('Success message');
  } catch (error) {
    console.error('Error context:', error);
    toastError('User-friendly error message');
  }
};
```

## Error Handling Standards

### API Error Handling
```typescript
// Service layer error transformation
transformErrorResponse: processError,

// Component error handling
try {
  await mutation(data).unwrap();
  toastSuccess('Operation completed successfully!');
} catch (error) {
  console.error('Context for debugging:', error);
  toastError('User-friendly error message');
}
```

### Loading States
```typescript
if (isLoading) {
  return <div className="loading">Loading descriptive message...</div>;
}

if (error) {
  return <div className="error">Descriptive error message</div>;
}
```

## Styling Standards

### CSS Class Naming
- Use kebab-case for CSS classes
- Follow BEM methodology when appropriate
- Component-scoped classes: `component-name-element`
- Modifier classes: `component-name-element--modifier`

### Component Styling Structure
```css
/* Component container */
.component-name-container {
  /* Container styles */
}

/* Header section */
.component-name-header {
  /* Header styles */
}

/* Content section */
.component-name-content {
  /* Content styles */
}

/* Actions section */
.component-name-actions {
  /* Actions styles */
}
```

### Button Classes
- Primary actions: `btn btn-primary`
- Secondary actions: `btn btn-secondary`
- Outlined buttons: `btn btn-outline`
- Success actions: `btn btn-success`
- Danger actions: `btn btn-danger`

## File Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `QuestionnaireForm.tsx`)
- Services: `PascalCase.ts` (e.g., `QuestionnaireService.ts`)
- Models: `IPascalCase.ts` (e.g., `IQuestionnaire.ts`)
- Utils: `PascalCase.ts` (e.g., `RequestUtils.ts`)
- CSS: `PascalCase.css` (e.g., `Questionnaire.css`)

### Folders
- Use lowercase with hyphens for multi-word folders
- Keep folder names descriptive and focused
- Group related components in feature folders

## Code Quality Standards

### General Principles
1. **Readability**: Code should be self-documenting
2. **Consistency**: Follow established patterns throughout the codebase
3. **Maintainability**: Write code that's easy to modify and extend
4. **Performance**: Consider performance implications, especially for queries
5. **Security**: Always validate inputs and handle sensitive data properly

### Comments and Documentation
```typescript
/**
 * Function/Component description
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return description
 */

// Single-line comments for complex logic
// TODO: Specific actionable item
// FIXME: Known issue that needs fixing
```

### Import Organization
```typescript
// 1. React and external libraries
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 2. Internal services and hooks
import { useGetDataQuery, useSubmitMutation } from '../../service/DataService';

// 3. Components
import ComponentName from './ComponentName';

// 4. Types and interfaces
import type { IDataType } from '../../models/IDataType';

// 5. Utils
import { toastSuccess, toastError } from '../../utils/ToastUtils';
```

## Testing Standards

### Component Testing
- Test component rendering
- Test user interactions
- Test error states
- Mock API calls appropriately

### Service Testing
- Test API endpoint configurations
- Test response transformations
- Test error handling
- Test caching behavior

## Security Standards

### Authentication
- All API calls use authenticated base query
- Handle token expiration gracefully
- Secure sensitive operations behind proper authorization

### Data Validation
- Validate inputs on both client and server
- Use Zod schemas for form validation
- Sanitize user inputs appropriately

### Error Messages
- Don't expose sensitive information in error messages
- Log detailed errors for debugging
- Show user-friendly messages to users

## Performance Standards

### Caching
- Configure appropriate `keepUnusedDataFor` values
- Use proper cache tags for invalidation
- Implement optimistic updates where appropriate

### Bundle Size
- Import only what's needed from libraries
- Use code splitting for large components
- Optimize images and assets

## Accessibility Standards

### ARIA Labels
- Add appropriate aria-labels for interactive elements
- Use semantic HTML elements
- Ensure proper keyboard navigation

### Color and Contrast
- Maintain adequate color contrast ratios
- Don't rely solely on color for information
- Support dark/light mode preferences

## Version Control Standards

### Commit Messages
```
type(scope): brief description

- Detailed explanation of changes
- Why the change was made
- Any breaking changes or migration notes
```

### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`

## Environment Configuration

### Development Setup
- Use TypeScript strict mode
- Enable all relevant ESLint rules
- Configure Prettier for consistent formatting
- Set up pre-commit hooks for quality checks

This coding standard should be reviewed and updated regularly as the project evolves and new patterns emerge.
