import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { RootState } from '../../store/store';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReportViewer: React.FC = () => {
  const navigate = useNavigate();
  const { selectedReport } = useSelector((state: RootState) => state.integration);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!selectedReport) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No Report Selected</h2>
        <p>Please go back and select a report to view.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h2>Report Viewer</h2>
      <div style={{ margin: '1rem 0' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Document file={selectedReport} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      {numPages && (
        <div style={{ marginTop: '1rem' }}>
          <button className="btn" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
            Previous
          </button>
          <span style={{ margin: '0 1rem' }}>
            Page {pageNumber} of {numPages}
          </span>
          <button className="btn" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
