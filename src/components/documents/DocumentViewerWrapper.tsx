import { useParams } from 'react-router-dom';
import { documentAPI } from '../../service/DocumentService';
import PdfLibViewer from './PdfLibViewer';
const DocumentViewerWrapper = () => {
  const { documentId } = useParams();
  const { data: document, isLoading: isFetchingDocument } = documentAPI.useFetchDocumentQuery({ documentId } as any);

  if (isFetchingDocument) {
    return <div>Loading...</div>;
  }

  if (!document?.data.document.uri) {
    return <div>Document not found.</div>;
  }

  return <PdfLibViewer pdfData={document.data.document.uri} />;
};

export default DocumentViewerWrapper;