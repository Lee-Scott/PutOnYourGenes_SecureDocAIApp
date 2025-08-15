# PureInsight Frontend Integration Plan

## 1. Overview

This document outlines the frontend-only implementation plan for integrating PureInsight into the patient onboarding application. The plan details the necessary changes to introduce PureInsight as a new integration option, including UI updates, a new component for viewing PDF reports, state management, and routing.

The primary goal is to create a functional, developer-ready prototype that allows a patient to:
- See the PureInsight integration option on the `IntegrationHub` page.
- Access PureInsight via a QR code or a fallback link.
- View sample patient and practitioner reports within the application.

## 2. Implementation Plan

### 2.1. Redux State Updates (integrationSlice)

We will update the existing `integrationSlice` to manage the state of the selected PDF report for the `ReportViewer`.

**File:** `src/store/slices/integrationSlice.ts`

```typescript
// src/store/slices/integrationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IntegrationState {
  selectedPartner: 'fullscript' | 'pure_insight' | 'manual' | null;
  uploadedFiles: string[];
  processingStatus: 'idle' | 'processing' | 'complete' | 'error';
  selectedReport: string | null; // Add this line
}

const initialState: IntegrationState = {
  selectedPartner: null,
  uploadedFiles: [],
  processingStatus: 'idle',
  selectedReport: null, // Add this line
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    setSelectedPartner: (state, action: PayloadAction<'fullscript' | 'pure_insight' | 'manual' | null>) => {
      state.selectedPartner = action.payload;
    },
    addUploadedFile: (state, action: PayloadAction<string>) => {
      state.uploadedFiles.push(action.payload);
    },
    setProcessingStatus: (state, action: PayloadAction<'idle' | 'processing' | 'complete' | 'error'>) => {
      state.processingStatus = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<string | null>) => { // Add this reducer
      state.selectedReport = action.payload;
    },
    resetIntegrationState: (state) => {
      state.selectedPartner = null;
      state.uploadedFiles = [];
      state.processingStatus = 'idle';
      state.selectedReport = null; // Add this line
    }
  },
});

export const { 
  setSelectedPartner, 
  addUploadedFile, 
  setProcessingStatus, 
  setSelectedReport, // Export the new action
  resetIntegrationState 
} = integrationSlice.actions;

export const selectIntegration = (state: RootState) => state.integration;

export default integrationSlice.reducer;
```

### 2.2. Update `IntegrationHub` Component

We will add a new section to the `IntegrationHub` component for the PureInsight integration. This section will display the QR code, a fallback link, and buttons to view the sample reports.

**File:** `src/components/IntegrationHub/IntegrationHub.tsx`

```tsx
// src/components/IntegrationHub/IntegrationHub.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedReport } from '../../store/slices/integrationSlice';

const IntegrationHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullscriptUrl = import.meta.env.VITE_FULLSCRIPT_PRACTITIONER_URL;

  const handleNavigate = (url: string) => {
    window.open(url, '_blank');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleViewReport = (reportUrl: string) => {
    dispatch(setSelectedReport(reportUrl));
    navigate('/report-viewer');
  };

  return (
    <div className="integration-hub-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Connect with Our Partners</h2>
      <p>Please choose one of the following options to proceed.</p>

      {/* PureInsight Section */}
      <div className="pureinsight-section" style={{ margin: '2rem 0' }}>
        <h3>PureInsight</h3>
        <p>Scan the QR code with your mobile device to access PureInsight.</p>
        <img src="/practice-qr-code.png" alt="PureInsight QR Code" style={{ maxWidth: '200px', margin: '1rem auto' }} />
        <p>
          Or, <a href="https://www.pureinsight.com" target="_blank" rel="noopener noreferrer">click here</a> if you cannot scan the code.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => handleViewReport('/patient-report-example.pdf')}>
            View Sample Patient Report
          </button>
          <button className="btn btn-secondary" style={{ marginLeft: '1rem' }} onClick={() => handleViewReport('/practitioner-report-example.pdf')}>
            View Sample Practitioner Report
          </button>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>Fullscript</h3>
        <p>Click the button below to open Fullscript in a new tab.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate(fullscriptUrl)}>
          Continue to Fullscript
        </button>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <div className="manual-upload-section">
        <h3>Manual Upload</h3>
        <p>If you have a JSON or CSV file of your questionnaire results, you can upload it here.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".json,.csv"
        />
        <button className="btn btn-outline" onClick={handleUploadClick}>
          Select File
        </button>
        {selectedFile && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Selected file:</strong> {selectedFile.name}</p>
            <button className="btn btn-primary" onClick={() => navigate('/documents')}>
              Upload and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationHub;
```

### 2.3. Create `ReportViewer` Component

We will create a new component to display the PDF reports. This component will use `react-pdf` to render the PDF.

First, we need to install `react-pdf`:
```bash
npm install react-pdf
```

**File:** `src/components/ReportViewer/ReportViewer.tsx` (New File)
```tsx
// src/components/ReportViewer/ReportViewer.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { RootState } from '../../store/store';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReportViewer: React.FC = () => {
  const navigate = useNavigate();
  const { selectedReport } = useSelector((state: RootState) => state.integration);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!selectedReport) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No Report Selected</h2>
        <p>Please go back and select a report to view.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h2>Report Viewer</h2>
      <div style={{ margin: '1rem 0' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Document file={selectedReport} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      {numPages && (
        <div style={{ marginTop: '1rem' }}>
          <button className="btn" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
            Previous
          </button>
          <span style={{ margin: '0 1rem' }}>
            Page {pageNumber} of {numPages}
          </span>
          <button className="btn" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
```

### 2.4. Update Routing

We will add a new route for the `ReportViewer` component in the main routing file.

**File:** `src/main.tsx`
```tsx
// Add the following import
import ReportViewer from './components/ReportViewer/ReportViewer.tsx';

// Add the following route within the public routes
<Route path='report-viewer' element={<ReportViewer />} />
```

The updated `createBrowserRouter` call will look like this:
```tsx
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    {/* Public Routes */}
    <Route index element={<Homepage />} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='resetpassword' element={<ResetPassword />} />
    <Route path='user/verify' element={<VerifyAccount />} />
    <Route path='verify/password' element={<VerifyPassword />} />
    <Route path='integrations' element={<IntegrationHub />} />
    <Route path='report-viewer' element={<ReportViewer />} />
    <Route path='questionnaires' element={<Questionnaires />} />
    <Route path='questionnaires/builder' element={<QuestionnaireBuilder />} />
    <Route path='questionnaires/:id' element={<QuestionnaireDetails />} />
    <Route path='questionnaires/:id/form' element={<QuestionnaireForm />} />
    <Route path='questionnaires/results/:responseId' element={<QuestionnaireResults />} />

    {/* ... rest of the routes */}
  </Route>
));
```

## 3. User Flow

1.  **Patient completes the questionnaire.**
2.  **Navigates to the `IntegrationHub` page (`/integrations`).**
3.  **The patient sees three options:** PureInsight, Fullscript, and Manual Upload.
4.  **For PureInsight, the patient can:**
    *   Scan the QR code to access PureInsight on their mobile device.
    *   Click the fallback link to open the PureInsight website in a new tab.
    *   Click "View Sample Patient Report" or "View Sample Practitioner Report".
5.  **If a sample report is clicked:**
    *   The application navigates to the `/report-viewer` route.
    *   The `ReportViewer` component displays the selected PDF.
    *   The patient can navigate through the pages of the PDF and go back to the `IntegrationHub`.

## 4. Task Breakdown

| Task                                      | Estimated Effort (hours) | Priority |
| ----------------------------------------- | ------------------------ | -------- |
| Update `integrationSlice` in Redux        | 1                        | High     |
| Update `IntegrationHub.tsx` component     | 2                        | High     |
| Install `react-pdf` dependency            | 0.5                      | High     |
| Create `ReportViewer.tsx` component       | 3                        | High     |
| Update routing in `src/main.tsx`          | 0.5                      | High     |
| Test the end-to-end user flow             | 1                        | Medium   |
| **Total**                                 | **8**                    |          |
