# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start development server (Vite dev server on localhost:5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build

### Testing and Quality
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run coverage` - Generate test coverage report
- `npm run lint` - Run ESLint on all files
- `npx playwright test` - Run end-to-end tests (Playwright)

## Architecture Overview

### Core Technology Stack
- **Frontend Framework**: React 19 with TypeScript in strict mode
- **Build Tool**: Vite with React plugin
- **State Management**: Redux Toolkit with RTK Query for API state
- **Routing**: React Router v7 with nested routes
- **Styling**: Component-scoped CSS files with utility classes
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **API Communication**: RTK Query with custom base query authentication

### Application Domain
This is a secure healthcare document AI application that handles:
- **Document Management**: Upload, view, and manage medical documents
- **AI Chat**: Chat interface for discussing documents with AI
- **Health Questionnaires**: Builder and form system for patient questionnaires
- **User Management**: Authentication, profiles, and role-based access control
- **Report Generation**: Generate and view patient reports

### State Management Architecture
- **Redux Store**: Configured with RTK Query APIs and feature slices
- **API Services**: Each domain has its own RTK Query service (UserService, DocumentService, ChatRoomService, QuestionnaireService)
- **Authentication**: Uses `BaseQueryWithAuth` for authenticated API calls
- **Caching Strategy**: RTK Query handles caching with appropriate tags and keepUnusedDataFor settings

### Routing Structure
- **Public Routes**: Homepage, login, registration, questionnaire access
- **Protected Routes**: Document management, chat, user dashboard (requires authentication)
- **Restricted Routes**: Admin features like user management (requires specific roles)
- **Profile Routes**: Nested user profile management routes

### Component Architecture Patterns
- **Service Layer**: RTK Query APIs with typed hooks (e.g., `useGetDocumentsQuery`)
- **Component Structure**: Standard pattern with hooks at top, handlers in middle, early returns for loading/error, main render at bottom
- **Error Handling**: Try-catch with toast notifications using `ToastUtils`
- **Type Safety**: All interfaces prefixed with `I` (e.g., `IUser`, `IDocument`)

### Security Considerations
- All API calls use authenticated base query
- Role-based route protection with `ProtectedRoute` and `Restricted` components
- Input validation using Zod schemas
- Sensitive operations require proper authorization checks

### Testing Strategy
- Unit tests focus on components and services
- E2E tests cover critical user journeys (auth, document management, chat)
- Coverage excludes utilities, models, and test files
- MSW (Mock Service Worker) for API mocking in tests

### Code Organization
- **Components**: Feature-based folders (`chat/`, `documents/`, `questionnaire/`, etc.)
- **Services**: RTK Query APIs with standardized patterns
- **Models**: TypeScript interfaces for data structures
- **Utils**: Shared utilities (PDF handling, request processing, toast notifications)
- **Store**: Redux configuration and feature slices

The codebase follows comprehensive coding standards documented in `Cline/CodingStandard.md` including component structure, TypeScript conventions, error handling patterns, and styling guidelines.