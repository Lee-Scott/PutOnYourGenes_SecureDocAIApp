import React, { useEffect, useState } from 'react';

interface UriPdfViewerProps {
  uri: string;
}

const UriPdfViewer: React.FC<UriPdfViewerProps> = ({ uri }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log('UriPdfViewer component mounted');

    const fetchPdf = async () => {
      if (!uri) {
        console.log('No URI provided, skipping fetch.');
        return;
      }

      console.log(`Initiating fetch for PDF from URI: ${uri}`);
      try {
        const response = await fetch(uri, { credentials: 'include' });
        console.log('Fetch response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);

        console.log('Object URL created:', objectUrl);
        setPdfUrl(objectUrl);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();

    // Cleanup function to revoke the object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        console.log('Object URL revoked:', pdfUrl);
      }
    };
  }, [uri, pdfUrl]); // Rerun effect if uri changes

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="PDF Viewer"
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default UriPdfViewer;