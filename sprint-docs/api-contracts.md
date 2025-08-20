# API Contracts & Integration Specifications

This document outlines the technical specifications for integrating with external partner APIs and the manual upload workflow.

## Fullscript Integration (Redirect MVP)

### 1. Redirect Implementation
- **Action:** A button labeled "Continue to Fullscript" will be displayed to the user after the questionnaire.
- **Link:** The button will link to a hardcoded URL stored in an environment variable: `VITE_FULLSCRIPT_PRACTITIONER_URL`.
- **Behavior:** The link should open in a new browser tab (`target="_blank"`).
- **Data Flow:** This is a one-way redirect. No data is passed to Fullscript, and no data is received directly back. The user is expected to return to the application manually to upload documents.

### 2. Future API Integration (Post-MVP)
- **Authentication:** OAuth2 will be implemented as per Fullscript's documentation.
- **Integration:** The Embeddable UI will be prioritized for a seamless in-app experience.
- **Webhooks:** A webhook endpoint will be configured to listen for events like `recommendation.accepted` to automate data synchronization.

## Pure Insight Integration (Redirect MVP)

### 1. Redirect Implementation
- **Action:** A button labeled "Continue to Pure Insight" will be displayed alongside the Fullscript button.
- **Link:** The button will link to a hardcoded URL: `https://www.pureencapsulationspro.com/`. This can be stored in `VITE_PUREINSIGHT_URL`.
- **Behavior:** The link will open in a new browser tab.
- **Data Flow:** This is a simple redirect. The user logs into their Pure Insight account, downloads their report, and returns to our application to use the manual upload feature.

### 2. Future API Integration (Post-MVP)
- **Action Item:** Contact Pure Insight / Pure Encapsulations to inquire about the availability of a partner program or public API for automated ordering and result retrieval.
- **Contingency:** If no API is available, this will remain a manual redirect-and-upload flow.

## Manual Upload Flow

### 1. File Format Specifications
- **Allowed Formats:** `PDF`, `JPEG`, `PNG`
- **MIME Types:** `application/pdf`, `image/jpeg`, `image/png`
- **Max File Size:** 10 MB (enforced on the client-side)
- **File Naming:** Files will be renamed on upload to a UUID to prevent collisions. The original filename will be stored as metadata.

### 2. Validation Requirements
- **Client-Side:**
    - Check file extension and MIME type before upload.
    - Check file size before upload.
    - Provide immediate feedback to the user if validation fails.
- **Server-Side:**
    - Re-validate MIME type and file size.
    - Use a virus scanner on the uploaded file before storing.
    - **TODO:** Implement OCR (Optical Character Recognition) to extract text from PDFs and images for easier processing (future enhancement).

### 3. Upload Component Implementation
- **Component:** `ManualUpload.tsx`
- **Logic:**
    - Use `react-dropzone` for a user-friendly drag-and-drop interface.
    - On file selection, perform client-side validation.
    - If valid, call the `documentAPI.useUploadDocumentsMutation`.
    - Display a progress bar during upload.
    - On success, show a confirmation message and update the `integrationSlice` in Redux.
    - On error, display a `toastError` message.
