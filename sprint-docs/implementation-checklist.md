# Developer Execution Guide & Implementation Checklist

This checklist provides a step-by-step guide for developers to implement the patient onboarding funnel. Follow the steps in order to ensure a smooth development process.

## 1. Environment Setup (1 hour)
- [ ] **Clone the repository** and run `npm install`.
- [ ] **Create a `.env` file** in the root directory.
- [ ] **Add environment variables** for API keys (leave blank for now, but add the keys).
  ```
  VITE_FULLSCRIPT_PRACTITIONER_URL=https://fullscript.com/practitioner/your-link
  VITE_PUREINSIGHT_URL=https://www.pureencapsulationspro.com/
  ```
- [ ] **Verify backend services** are running. You should be able to access:
  - `http://localhost:8085/api/questionnaires` (Questionnaire Service)
  - The Document Service (port may vary)
- [ ] **Confirm application runs** by executing `npm run dev`. The app should open at `http://localhost:5173`.

## 2. Redux State Setup (2 hours)
- [ ] **Create `homepageSlice.ts`** in `src/store/slices/`.
  - Define the `HomepageState` interface as specified in `homepage-spec.md`.
  - Create reducers for `setVisitMetrics` and `updateJourneyStep`.
- [ ] **Create `integrationSlice.ts`** in `src/store/slices/`.
  - Define state for `selectedPartner`, `uploadedFiles`, and `processingStatus`.
  - Create reducers to manage this state.
- [ ] **Add new slices to the root reducer** in `src/store/store.ts`.

## 3. Component Creation (8 hours)

### Homepage Components
- [ ] **Create a `Homepage` folder** in `src/components/`.
- [ ] **Create `Homepage.tsx`** as the main container component.
- [ ] **Create `HeroSection.tsx`**, `BenefitsSection.tsx`, and `ProcessSection.tsx`.
- [ ] **Style components** using CSS modules or your preferred styling solution.
- [ ] **Implement responsive design** as per `homepage-spec.md`.

### Integration Components
- [ ] **Create an `IntegrationHub` folder** in `src/components/`.
- [ ] **Create `IntegrationHub.tsx`** to manage integration choices.
- [ ] **Create `ManualUpload.tsx`** with `react-dropzone` for file uploads.
- [ ] **Create `PatientDashboard.tsx`** to display results.

## 4. Routing (1 hour)
- [ ] **Update `src/main.tsx`** with the new routes.
- [ ] **Add a new `Homepage` route** at the root path (`/`).
- [ ] **Add a new `PatientDashboard` route** at `/dashboard`.
- [ ] **Add a new `IntegrationHub` route** at `/integrations`.
- [ ] **Update `ProtectedRoute.tsx`** to redirect to `/dashboard` after login instead of `/documents`.

## 5. Connecting the Flow (6 hours)

### Questionnaire Connection
- [ ] In `Homepage.tsx`, add a `handleStartAssessment` function.
- [ ] This function should dispatch the `updateJourneyStep` action.
- [ ] It should then navigate to the hardcoded questionnaire URL: `/questionnaires/e873eb2a-2e29-d46f-1f85-8dc3ad0b2fb2/form`.

### Manual Upload Connection
- [ ] In `ManualUpload.tsx`, connect the dropzone to the `documentAPI.useUploadDocumentsMutation`.
- [ ] On successful upload, dispatch an action to update the `integrationSlice`.
- [ ] After questionnaire submission, navigate the user to the `/integrations` route.

### Dashboard Connection
- [ ] In `PatientDashboard.tsx`, fetch uploaded documents using `documentAPI.useFetchDocumentsQuery`.
- [ ] Display the list of uploaded documents and their processing status.

## 6. Integration Hub Implementation (4 hours)
- [ ] In `IntegrationHub.tsx`, add two buttons: "Continue to Fullscript" and "Continue to Pure Insight".
- [ ] The "Continue to Fullscript" button should link to the URL in `VITE_FULLSCRIPT_PRACTITIONER_URL` and open in a new tab.
- [ ] The "Continue to Pure Insight" button should link to the URL in `VITE_PUREINSIGHT_URL` and open in a new tab.
- [ ] Add a prominent section or component link to the manual file upload page (`/documents`) for when the user returns from the partner sites.

## 7. Testing and Quality Assurance (2 hours)
- [ ] **Write unit tests** for the new Redux slices (`homepageSlice` and `integrationSlice`).
- [ ] **Write basic render tests** for the new components (`Homepage`, `IntegrationHub`).
- [ ] **Manually test the end-to-end flow:**
  1. Start on the homepage.
  2. Click the CTA to start the questionnaire.
  3. Complete the questionnaire.
  4. Get redirected to the integration hub.
  5. Click the "Continue to Fullscript" button and verify it opens the correct link in a new tab.
  6. Click the "Continue to Pure Insight" button and verify it opens the correct link in a new tab.
  7. Navigate to the manual upload page and upload a PDF or image file.
  8. Verify the uploaded file appears on the patient dashboard.
- [ ] **Check for console errors** and warnings.
- [ ] **Verify accessibility** using a tool like Axe DevTools.

## Definition of Done Checklist
- [ ] All tasks in this checklist are complete.
- [ ] All acceptance criteria in `plan.md` are met.
- [ ] The code has been reviewed and approved by at least one other developer.
- [ ] The application is stable and deployable.
