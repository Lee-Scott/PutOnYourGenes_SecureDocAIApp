# Technical Plan: Replacing pdf-lib with Nutrient SDK

## 1. Introduction

This document outlines the technical plan for replacing the `pdf-lib` library with the Nutrient SDK for document editing within the application. The goal is to improve performance, enhance functionality, and standardize our document processing workflow. This plan focuses on the integration within the `PaperlessDocumentDetails.tsx` component.

## 2. Current Implementation Analysis

The `pdf-lib` library is currently used in [`src/components/documents/PaperlessDocumentDetails.tsx`](src/components/documents/PaperlessDocumentDetails.tsx) for the following functionalities:

- **Loading PDFs:** PDFs are loaded from a blob into a `PDFDocument` object.
- **Adding Text:** The `drawText` method is used to add text to the first page of the document.
- **Saving Documents:** The modified `PDFDocument` is saved as a byte array, converted to a blob, and then uploaded to the server.

The component also uses `pdfjs-dist` to render the PDF pages onto `<canvas>` elements for display.

## 3. Proposed Architecture with Nutrient SDK

The proposed architecture will introduce a new component, `NutrientDocumentEditor`, which will encapsulate all interactions with the Nutrient SDK. This component will be responsible for rendering the document and handling all editing functions.

### Key Components:

- **`NutrientDocumentEditor`:** A new React component that will use the Nutrient SDK to render and edit the document. It will expose methods for adding text, saving the document, and other editing functionalities.
- **`PaperlessDocumentDetails.tsx`:** This component will be modified to use the `NutrientDocumentEditor` instead of the current canvas-based rendering and `pdf-lib` functions.

### Data Flow:

1.  `PaperlessDocumentDetails.tsx` fetches the PDF blob.
2.  The blob is passed as a prop to the `NutrientDocumentEditor`.
3.  The `NutrientDocumentEditor` loads the document using the Nutrient SDK.
4.  User interactions (e.g., clicking "Add Text") trigger methods within the `NutrientDocumentEditor`.
5.  When "Save" is clicked, the `NutrientDocumentEditor` exports the modified document as a blob, which is then passed back to `PaperlessDocumentDetails.tsx` to be uploaded.

## 4. Step-by-Step Integration Plan

### Step 1: Install Nutrient SDK

Add the Nutrient SDK as a project dependency.

```bash
npm install @nutrient/sdk
```

### Step 2: Create `NutrientDocumentEditor` Component

Create a new file: `src/components/documents/NutrientDocumentEditor.tsx`. This component will handle the document rendering and editing.

```tsx
// src/components/documents/NutrientDocumentEditor.tsx
import React, 'react';
import { NutrientSDK } from '@nutrient/sdk';

interface NutrientDocumentEditorProps {
  documentBlob: Blob;
  onSave: (editedBlob: Blob) => void;
}

const NutrientDocumentEditor: React.FC<NutrientDocumentEditorProps> = ({ documentBlob, onSave }) => {
  // SDK initialization and document loading logic here

  const handleAddText = () => {
    // Logic to add text using Nutrient SDK
  };

  const handleSave = () => {
    // Logic to save and export the document, then call onSave
  };

  return (
    <div>
      {/* Nutrient SDK's viewer and editor UI */}
      <button onClick={handleAddText}>Add Text</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default NutrientDocumentEditor;
```

### Step 3: Modify `PaperlessDocumentDetails.tsx`

Update [`src/components/documents/PaperlessDocumentDetails.tsx`](src/components/documents/PaperlessDocumentDetails.tsx) to use the new `NutrientDocumentEditor`.

- Remove the `pdf-lib` and `pdfjs-dist` imports.
- Remove the canvas rendering logic and the `useEffect` hook for rendering.
- Replace the existing `handleAddText` and `handleSave` functions with logic to interact with the `NutrientDocumentEditor` component.

```tsx
// src/components/documents/PaperlessDocumentDetails.tsx (simplified)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDocumentQuery, useUploadDocumentMutation, useGetDocumentFileQuery } from '../../service/PaperlessService';
import NutrientDocumentEditor from './NutrientDocumentEditor';

const PaperlessDocumentDetails: React.FC = () => {
  // ... existing hooks and logic ...
  const { data: pdfBlob, isLoading: isLoadingPdf } = useGetDocumentFileQuery(documentId, { skip: !documentId });
  const [uploadDocument] = useUploadDocumentMutation();

  const handleSave = async (editedBlob: Blob) => {
    if (document) {
      const formData = new FormData();
      formData.append('document', editedBlob, document.original_file_name);
      formData.append('title', document.title);
      
      try {
        await uploadDocument(formData).unwrap();
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to upload document: ', err);
      }
    }
  };

  if (isLoadingDocument || isLoadingPdf) return <p>Loading document...</p>;
  if (!document || !pdfBlob) return <p>Document not found.</p>;

  return (
    <div className="container mtb">
      <h2>Edit Document: {document.title}</h2>
      <NutrientDocumentEditor documentBlob={pdfBlob} onSave={handleSave} />
    </div>
  );
};

export default PaperlessDocumentDetails;
```

### Step 4: Remove `pdf-lib`

Once the integration is complete and tested, remove `pdf-lib` from the project's dependencies.

```bash
npm uninstall pdf-lib
```

## 5. Potential Challenges and Mitigations

- **API Differences:** The Nutrient SDK will have a different API from `pdf-lib`.
  - **Mitigation:** Thoroughly review the Nutrient SDK documentation and create wrapper functions if necessary to simplify its use within the application.
- **Complex PDF Operations:** If more complex operations than adding text are needed in the future, the Nutrient SDK's capabilities must be assessed.
  - **Mitigation:** For this initial integration, the scope is limited to text addition. A separate investigation will be conducted if more advanced features are required.
- **Testing:** The new implementation will require thorough testing to ensure that the document editing and saving processes work correctly.
  - **Mitigation:** Create a comprehensive test plan that covers different document types, sizes, and editing scenarios.

## 6. Conclusion

Migrating from `pdf-lib` to the Nutrient SDK will provide a more robust and feature-rich document editing experience. By encapsulating the SDK's functionality in a dedicated component, we can create a clean and maintainable architecture that can be easily extended in the future.
