import React, { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfLibViewer: React.FC = () => {
  const [pdfSrc, setPdfSrc] = useState<string>('');
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState<Uint8Array | null>(null);

  const modifyPdf = async () => {
    try {
      const pdfUrl = '/pationt-report-example.pdf';
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages;

      firstPage.drawText('This text was added with JavaScript!', {
        x: 5,
        y: firstPage.getHeight() / 2 + 250,
        size: 50,
      });

      const pdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(pdfBytes);
    } catch (error) {
      console.error('Error modifying PDF:', error);
    }
  };

  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (modifiedPdfBytes) {
          const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
          const dataUri = URL.createObjectURL(blob);
          setPdfSrc(dataUri);
        } else {
          const pdfUrl = '/pationt-report-example.pdf';
          const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const dataUri = URL.createObjectURL(blob);
          setPdfSrc(dataUri);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [modifiedPdfBytes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={modifyPdf}>Modify PDF</button>
      {pdfSrc && (
        <iframe
          src={pdfSrc}
          width="100%"
          height="100%"
          title="PDF Viewer"
        ></iframe>
      )}
    </div>
  );
};

export default PdfLibViewer;