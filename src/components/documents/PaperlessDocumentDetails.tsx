import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetDocumentQuery, useGetDocumentFileQuery, useUpdateDocumentMutation } from '../../service/PaperlessService';
import DocumentViewer from './DocumentViewer';
import DocumentLoader from './DocumentLoader';

const PaperlessDocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="alert alert-danger">No document ID provided.</div>;
  }
  const documentId = id;

  const { data: document, error: docError, isLoading: docIsLoading } = useGetDocumentQuery(documentId);
  const { data: documentBlob, error: fileError, isLoading: fileIsLoading } = useGetDocumentFileQuery(documentId);
  const [updateDocument] = useUpdateDocumentMutation();

  const handleSave = async (editedBlob: Blob) => {
    const formData = new FormData();
    formData.append('document', editedBlob, document.original_file_name);
    formData.append('title', document.title);
    
    try {
      await updateDocument({ id: documentId, document: formData }).unwrap();
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Failed to save document:', error);
      alert('Failed to save document.');
    }
  };

  if (docIsLoading || fileIsLoading) {
    return <DocumentLoader />;
  }

  if (docError || fileError) {
    return <div className="alert alert-danger">Error loading document.</div>;
  }

  if (!document || !documentBlob) {
    return <div className="alert alert-warning">Document not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{document.title}</h2>
      <p>Original file: {document.original_file_name}</p>
      <DocumentViewer
        document={document}
        documentBlob={documentBlob}
        onSave={handleSave}
      />
    </div>
  );
};

export default PaperlessDocumentDetails;