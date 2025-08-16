import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDocumentQuery, useUploadDocumentMutation, useGetDocumentFileQuery } from '../../service/PaperlessService';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/assets/pdf.worker.min.mjs`;

const PaperlessDocumentDetails: React.FC = () => {
  console.log('Rendering PaperlessDocumentDetails');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = parseInt(id || '0', 10);

  const { data: document, isLoading: isLoadingDocument } = useGetDocumentQuery(documentId, { skip: !documentId });
  const { data: pdfBlob, isLoading: isLoadingPdf, isError } = useGetDocumentFileQuery(documentId, { skip: !documentId });
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();

  const [numPages, setNumPages] = useState(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    console.log('pdfBlob:', pdfBlob);
    const renderPdf = async () => {
      if (pdfBlob) {
        try {
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          setNumPages(pdf.numPages);

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
        } catch (error) {
          console.error('Error rendering PDF:', error);
        }
      }
    };
    renderPdf();
  }, [pdfBlob, isLoadingPdf, isError]);

  const handleAddText = async () => {
    if (pdfBlob) {
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText('This is a new text!', {
        x: 5,
        y: firstPage.getHeight() / 2,
        size: 50,
      });
      const pdfBytes = await pdfDoc.save();
      const newPdfBlob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
      // You might want to re-render the PDF here, or handle the blob differently
    }
  };

  const handleSave = async () => {
    if (pdfBlob && document) {
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const newPdfBlob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('document', newPdfBlob, document.original_file_name);
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
  if (isError || !document) return <p>Document not found.</p>;

  console.log('Rendering PaperlessDocumentDetails');
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
        {Array.from({ length: numPages }).map((_, index) => (
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
