import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetDocumentQuery, useGetDocumentFileQuery, useUpdateDocumentMutation } from '../../service/PaperlessService';
import DocumentViewer from './DocumentViewer';
import DocumentLoader from './DocumentLoader';

/**
 * @component PaperlessDocumentDetails
 * @description This component is responsible for fetching and displaying the details of a single document
 * from a locally running Paperless-ngx instance. It allows for editing and saving the document.
 * This component is intended to integrate with a locally running Paperless-ngx instance via its API.
 *
 * @returns {React.ReactElement} The rendered component.
 */
const PaperlessDocumentDetails: React.FC = () => {
  /**
   * @hook useParams
   * @description Extracts the document ID from the URL parameters.
   */
  const { id } = useParams<{ id: string }>();

  // Early return if no ID is found in the URL
  if (!id) {
    return <div className="alert alert-danger">No document ID provided.</div>;
  }
  const documentId = id;

  /**
   * @hook useGetDocumentQuery
   * @description Fetches the metadata for the document with the specified ID.
   * Manages loading and error states for the document metadata request.
   */
  const { data: document, error: docError, isLoading: docIsLoading } = useGetDocumentQuery(documentId);
  
  /**
   * @hook useGetDocumentFileQuery
   * @description Fetches the actual file content (as a Blob) for the document.
   * Manages loading and error states for the file content request.
   */
  const { data: documentBlob, error: fileError, isLoading: fileIsLoading } = useGetDocumentFileQuery(documentId);
  
  /**
   * @hook useUpdateDocumentMutation
   * @description Provides a function to update the document on the server.
   */
  const [updateDocument] = useUpdateDocumentMutation();

  /**
   * @function handleSave
   * @description Handles the save operation when the user finishes editing the document.
   * It creates a FormData object with the edited blob and other document properties
   * and sends it to the server via the `updateDocument` mutation.
   * @param {Blob} editedBlob - The edited document content as a Blob.
   */
  const handleSave = async (editedBlob: Blob) => {
    const formData = new FormData();
    formData.append('document', editedBlob, document.original_file_name);
    
    try {
<<<<<<< Updated upstream
      // The updateDocument mutation expects a specific object shape.
      // We are not sending the title and content in this version,
      // so we will send them as empty strings to satisfy the type.
      await updateDocument({
        id: documentId,
        title: document.title,
        content: ''
      }).unwrap();
=======
      await updateDocument({ id: documentId, document: formData }).unwrap();
>>>>>>> Stashed changes
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Failed to save document:', error);
      alert('Failed to save document.');
    }
  };

  /**
   * @description Loading state: If either the document metadata or the file content is loading,
   * display a loading indicator.
   */
  if (docIsLoading || fileIsLoading) {
    return <DocumentLoader />;
  }

  /**
   * @description Error state: If there's an error fetching either the document metadata or the file content,
   * display an error message.
   */
  if (docError || fileError) {
    return <div className="alert alert-danger">Error loading document.</div>;
  }

  /**
   * @description Not found state: If the document or its content is not found after loading,
   * display a "not found" message.
   */
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