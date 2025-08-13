# PureInsight Integration Prompt

**Your Role:** You are a senior frontend engineer specializing in React and healthcare applications. Your task is to create a complete, developer-ready implementation plan for integrating PureInsight into the existing patient onboarding web application.

**Primary Objective:** Generate a single markdown document that outlines the entire frontend plan for this integration. The plan must be detailed enough for another frontend developer to implement the feature without needing additional architectural guidance.

**Project Context**

*   **Application:** A patient onboarding web application.
*   **Frontend Stack:** React, Redux Toolkit, TypeScript.
*   **Existing User Flow:**
    1.  A patient completes a questionnaire.
    2.  After submission, they are directed to an `IntegrationHub` page.
    3.  The `IntegrationHub` currently offers a simple redirect to Fullscript and a manual file upload option.

**Key Integration Details**

*   **PureInsight QR Code:** The integration will feature a QR code that allows patients to easily access the PureInsight platform. The QR code is located at `public/practice-qr-code.png`.
*   **Sample Reports:** To inform the UI design, you have access to two sample reports:
    *   `public/pationt-report-example.pdf`: A sample report for patients.
    *   `public/Practicioners-report-example.pdf`: A sample report for practitioners.

**Requirements for the Implementation Plan**

Your generated document must cover the following sections in detail:

**1. UI Implementation**

*   **Update `IntegrationHub.tsx`:**
    *   Add a new section for the PureInsight integration.
    *   This section should display the QR code from `public/practice-qr-code.png`.
    *   Include clear, user-friendly instructions on how to use the QR code (e.g., "Scan the QR code with your mobile device to connect to PureInsight").
    *   Provide a fallback link for users who cannot scan the QR code.

*   **Design a `ReportViewer.tsx` Component:**
    *   Create a new component that can display the sample PDF reports.
    *   This component should be able to dynamically load and render a PDF from a given URL.
    *   Include controls for zooming and navigating through the PDF.

**2. Step-by-Step Implementation Guide**

*   Provide a numbered list of tasks for a developer to follow.
*   Include detailed code snippets for each step, including:
    *   The updated `IntegrationHub.tsx` component.
    *   The new `ReportViewer.tsx` component.
    *   Any necessary updates to the application's routing in `src/main.tsx`.

**3. User Journey and UI Flow**

*   Create a text-based or Mermaid diagram illustrating the updated user journey:
    1.  Patient completes the questionnaire.
    2.  Navigates to the `IntegrationHub`.
    3.  Scans the PureInsight QR code or clicks the fallback link.
    4.  (Optional) Views a sample report in the `ReportViewer` component.

**4. Final Document Structure**

Your final output should be a single, well-structured markdown file with the following sections:

*   **Overview:** A brief summary of the integration plan.
*   **Implementation Plan:** The detailed, step-by-step guide with code snippets.
*   **User Flow:** The user journey diagram and route changes.
*   **Task Breakdown:** A table of tasks with estimated effort (in hours) and priority.


Combined Fullscript + PureInsight Frontend Integration Plan
1. Overview
This plan implements a frontend-only integration of Fullscript and PureInsight in the patient onboarding app. It provides a simple working prototype with:

Fullscript: Button to view dashboard (no OAuth backend yet)

PureInsight: QR code access, fallback link, and PDF viewer

Centralized state management using Redux

2. Implementation Plan
2.1 Redux Updates
Fullscript Slice (simplified, frontend-only)
ts
Copy
Edit
// src/store/slices/fullscriptSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FullscriptState {
  isAuthenticated: boolean;
}

const initialState: FullscriptState = {
  isAuthenticated: false,
};

const fullscriptSlice = createSlice({
  name: 'fullscript',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setAuthenticated } = fullscriptSlice.actions;
export default fullscriptSlice.reducer;
PureInsight Slice
ts
Copy
Edit
// src/store/slices/pureInsightSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PureInsightState {
  selectedReport: string | null;
}

const initialState: PureInsightState = {
  selectedReport: null,
};

const pureInsightSlice = createSlice({
  name: 'pureInsight',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<string>) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
});

export const { setSelectedReport, clearSelectedReport } = pureInsightSlice.actions;
export default pureInsightSlice.reducer;
Store Configuration
ts
Copy
Edit
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import fullscriptReducer from './slices/fullscriptSlice';
import pureInsightReducer from './slices/pureInsightSlice';

export const store = configureStore({
  reducer: {
    fullscript: fullscriptReducer,
    pureInsight: pureInsightReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
2.2 IntegrationHub Component
tsx
Copy
Edit
// src/components/IntegrationHub/IntegrationHub.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedReport } from '../../store/slices/pureInsightSlice';
import { setAuthenticated } from '../../store/slices/fullscriptSlice';

const IntegrationHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFullscriptAuthenticated = useSelector((state: RootState) => state.fullscript.isAuthenticated);

  const handleFullscript = () => {
    // For prototype: toggle auth state
    dispatch(setAuthenticated(true));
    navigate('/documents');
  };

  const handlePureInsightReport = (report: string) => {
    dispatch(setSelectedReport(report));
    navigate('/report-viewer');
  };

  return (
    <div className="integration-hub-container">
      <h2>Connect with Our Partners</h2>

      {/* Fullscript Section */}
      <div className="fullscript-section" style={{ marginBottom: '2rem' }}>
        <h3>Fullscript</h3>
        {isFullscriptAuthenticated ? (
          <button onClick={() => navigate('/documents')}>View Fullscript Dashboard</button>
        ) : (
          <button onClick={handleFullscript}>Connect to Fullscript</button>
        )}
      </div>

      {/* PureInsight Section */}
      <div className="pureinsight-section">
        <h3>PureInsight Access</h3>
        <p>Scan the QR code below with your mobile device to connect:</p>
        <img
          src="/practice-qr-code.png"
          alt="PureInsight QR Code"
          style={{ maxWidth: '300px', width: '100%' }}
        />
        <p>Or click this <a href="https://www.pureinsight.com/" target="_blank" rel="noopener noreferrer">fallback link</a> if you cannot scan the QR code.</p>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => handlePureInsightReport('/patient-report-example.pdf')}>
            View Sample Patient Report
          </button>
          <button onClick={() => handlePureInsightReport('/practitioner-report-example.pdf')} style={{ marginLeft: '1rem' }}>
            View Sample Practitioner Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
2.3 ReportViewer Component
tsx
Copy
Edit
// src/components/ReportViewer/ReportViewer.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const ReportViewer: React.FC = () => {
  const navigate = useNavigate();
  const file = useSelector((state: RootState) => state.pureInsight.selectedReport);

  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Report Viewer</h2>
      <button onClick={() => navigate(-1)}>Back</button>
      {file ? (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      ) : (
        <p>No report selected.</p>
      )}

      {numPages && (
        <div style={{ marginTop: '1rem' }}>
          <button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>Previous</button>
          <span style={{ margin: '0 1rem' }}>Page {pageNumber} of {numPages}</span>
          <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
2.4 Documents Component (Fullscript Dashboard placeholder)
tsx
Copy
Edit
// src/components/documents/Documents.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Documents: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.fullscript.isAuthenticated);

  return (
    <div>
      <h2>Fullscript Dashboard</h2>
      {isAuthenticated ? (
        <p>Fullscript dashboard content goes here (prototype).</p>
      ) : (
        <p>Please connect to Fullscript to view your documents.</p>
      )}
    </div>
  );
};

export default Documents;
2.5 Routing Updates (src/main.tsx)
tsx
Copy
Edit
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import IntegrationHub from './components/IntegrationHub/IntegrationHub';
import ReportViewer from './components/ReportViewer/ReportViewer';
import Documents from './components/documents/Documents';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/integration-hub" element={<IntegrationHub />} />
        <Route path="/report-viewer" element={<ReportViewer />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
3. User Journey and UI Flow
mermaid
Copy
Edit
graph TD
    A[Patient completes questionnaire] --> B[IntegrationHub Page]
    B --> C[Click Fullscript Connect / Dashboard]
    C --> D[Documents Page (Fullscript Dashboard placeholder)]
    B --> E[Scan PureInsight QR Code or click fallback]
    B --> F[Click "View Sample Report"]
    F --> G[ReportViewer Component (Redux)]
4. Task Breakdown
Task	Estimated Effort (hours)	Priority
Create Fullscript slice	1	High
Create PureInsight slice	1	High
Update IntegrationHub.tsx	3	High
Create ReportViewer.tsx	2	High
Update Documents.tsx	1	Medium
Update routing (main.tsx)	1	High
Test UI flows	2	Medium
Total	11	

This combined integration keeps things frontend-only, prototype-friendly, and centralized in Redux. Later, backend calls for Fullscript and PureInsight can be added without touching the UI flow.