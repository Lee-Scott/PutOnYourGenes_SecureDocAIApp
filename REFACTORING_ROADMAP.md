# Refactoring Roadmap

This document outlines a refactoring roadmap for the application. The goal is to improve the codebase's quality, maintainability, and performance before implementing new major features.

## Phase 1: Codebase Refactoring & Cleanup

### 1. Testing

*   **Restructure Test Files:** Relocate all test files to a `__tests__` subfolder within their respective component or service directory to improve organization and clarity.
*   **Create a Central Test Setup File:** Create a `vitest.setup.ts` file to centralize test configuration and global setup/teardown logic.
*   **Improve Test Coverage:** Increase test coverage for the application, especially for critical parts of the codebase.
*   **Implement End-to-End Testing:** Introduce end-to-end testing to ensure that the application works as expected from the user's perspective.

### 2. Component & State Management

*   **Abstract Reusable Form Components:** Create a set of reusable form components to handle common form elements, such as input fields, labels, and validation messages.
*   **Consolidate Profile Components:** Refactor the components in the `src/components/profile` directory to use the new reusable form components and eliminate redundant logic.
*   **Create a UI Component Library:** Establish a centralized library of reusable UI components to ensure a consistent look and feel across the application.
*   **Create a User Slice:** Introduce a dedicated slice for managing user-related state, such as the user's profile, authentication status, and preferences.
*   **Expand Homepage State:** Expand the `homepageSlice` to include other homepage-related state, such as the list of featured documents or the status of the document upload process.
*   **Leverage RTK Query for Caching:** Ensure that RTK Query is being used effectively to cache user data and other API responses.

### 3. API Layer

*   **Implement Specific Error Handling:** Add specific error handling logic to the API endpoints to provide more informative error messages to the user.
*   **Add Loading and Error States:** Implement loading and error states in the components that use the API hooks to provide a better user experience.
*   **Use Granular Cache Invalidation:** Use a more granular approach to cache invalidation to avoid unnecessary re-fetches of data.

### 4. Performance

*   **Implement Code Splitting and Lazy Loading:** Use code splitting and lazy loading to reduce the initial bundle size and improve load times.
*   **Optimize Images:** Optimize images in the `assets/` directory for the web.
*   **Optimize Components for Performance:** Use `React.memo` and other optimization techniques to prevent unnecessary re-renders.
*   **Analyze Bundle Size:** Use a bundle analyzer to identify large dependencies and opportunities for optimization.

## Phase 2: Feature: Advanced Document Viewer/Editor

### 1. Research & Prototyping

*   **Research Libraries:** Investigate and evaluate alternative libraries for PDF viewing and manipulation, as `pdf-lib` was found to be insufficient.
*   **Prototype Solutions:** Create small prototypes to test the capabilities of the most promising libraries.

### 2. Implementation

*   **Integrate Selected Library:** Integrate the chosen library into the application.
*   **Develop Viewer Component:** Build a new document viewer component with the required features (e.g., zooming, panning, text selection).
*   **Develop Editor Features:** Implement document editing features as required (e.g., annotations, form filling).
