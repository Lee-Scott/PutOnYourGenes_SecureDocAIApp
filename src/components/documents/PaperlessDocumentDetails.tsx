import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetDocumentQuery, useGetDocumentFileQuery, useUpdateDocumentMutation } from '../../service/PaperlessService';
import DocumentViewer from './DocumentViewer';
import DocumentLoader from './DocumentLoader';

const PaperlessDocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div className="alert alert-danger">No document ID provided.</div>;
  }
  const documentId = id;

  const { data: document, error: docError, isLoading: docIsLoading } = useGetDocumentQuery(documentId, { skip: !documentId });
  const { data: documentBlob, error: fileError, isLoading: fileIsLoading } = useGetDocumentFileQuery(documentId, { skip: !documentId });
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
      {document && document.viewableId && (
        <Link
          to={`/viewdoc/${document.viewableId}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors mb-3"
          style={{ width: 'fit-content' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span>View Document</span>
        </Link>
      )}
      <DocumentViewer
        document={document}
        documentBlob={documentBlob}
        onSave={handleSave}
      />
    </div>
  );
};

export default PaperlessDocumentDetails;