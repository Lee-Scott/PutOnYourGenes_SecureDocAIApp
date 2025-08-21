import React from 'react';
import NutrientDocumentEditor from './NutrientDocumentEditor';
import GenericFileViewer from './GenericFileViewer';
import { IDocument } from '../../models/IDocument';

type DocumentViewerType = IDocument & {
  id: string;
  title: string;
  original_file_name: string;
};

interface DocumentViewerProps {
  document: DocumentViewerType;
  documentBlob: Blob;
  onSave: (editedBlob: Blob) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, documentBlob, onSave }) => {
  // In the future, we can add logic here to determine which viewer to use
  // based on the document's file type.
  const isPdf = document.original_file_name.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <NutrientDocumentEditor
        document={document}
        documentBlob={documentBlob}
        onSave={onSave}
      />
    );
  }

  return <GenericFileViewer document={document} documentBlob={documentBlob} />;
};

export default DocumentViewer;