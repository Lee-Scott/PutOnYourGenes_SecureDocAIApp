import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDocumentsQuery, useUploadDocumentMutation, useGetDocumentFileQuery } from '../../service/PaperlessService';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PaperlessDocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = parseInt(id || '0', 10);

  const { data: documents, isLoading: isLoadingDocuments } = useGetDocumentsQuery();
  const { data: pdfBlob, isLoading: isLoadingPdf, isError } = useGetDocumentFileQuery(documentId, { skip: !documentId });
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();

  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const document = documents?.results.find((doc: any) => doc.id === documentId);

  useEffect(() => {
    const loadPdf = async () => {
      if (pdfBlob) {
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const loadedPdfDoc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(loadedPdfDoc);
      }
    };
    loadPdf();
  }, [pdfBlob]);

  useEffect(() => {
    const renderPdf = async () => {
      if (pdfBlob) {
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = canvasRefs.current[i];
          if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              await page.render(renderContext).promise;
            }
          }
        }
      }
    };
    renderPdf();
  }, [pdfBlob]);

  const handleAddText = async () => {
    if (pdfDoc) {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText('This is a new text!', {
        x: 5,
        y: firstPage.getHeight() / 2,
        size: 50,
      });
      // Re-render
      const pdfBytes = await pdfDoc.save();
      const newPdfDoc = await PDFDocument.load(pdfBytes);
      setPdfDoc(newPdfDoc);
    }
  };

  const handleSave = async () => {
    if (pdfDoc && document) {
      const pdfBytes = await pdfDoc.save();
      const newPdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('document', newPdfBlob, document.original_file_name);
      formData.append('title', document.title);
      // By sending the same title, paperless will overwrite the existing document
      
      try {
        await uploadDocument(formData).unwrap();
        navigate('/patient-dashboard');
      } catch (err) {
        console.error('Failed to upload document: ', err);
      }
    }
  };

  if (isLoadingDocuments || isLoadingPdf) return <p>Loading document...</p>;
  if (isError || !document) return <p>Document not found.</p>;

  return (
    <div className="container mtb">
      <h2>Edit Document: {document.title}</h2>
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={handleAddText}>Add Text to First Page</button>
        <button className="btn btn-primary ms-2" onClick={handleSave} disabled={isUploading}>
          {isUploading ? 'Saving...' : 'Save Document'}
        </button>
      </div>
      <div>
        {pdfDoc && Array.from({ length: pdfDoc.getPageCount() }).map((_, index) => (
          <canvas
            key={index}
            ref={(el) => {
              if (el) canvasRefs.current[index] = el;
            }}
            className="mb-2"
            style={{ border: '1px solid black' }}
          />
        ))}
      </div>
    </div>
  );
};

export default PaperlessDocumentDetails;
