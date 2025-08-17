import React, { useEffect, useRef, useState } from 'react';
import NutrientViewer from '@nutrient-sdk/viewer';

interface NutrientDocumentEditorProps {
  document: {
    title: string;
    original_file_name: string;
  };
  documentBlob: Blob;
  onSave: (editedBlob: Blob) => void;
}

const NutrientDocumentEditor: React.FC<NutrientDocumentEditorProps> = ({ documentBlob, onSave }) => {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentBlob || !viewerContainerRef.current) {
      return;
    }

    const container = viewerContainerRef.current;
    let instance: any = null;

    const initializeViewer = async () => {
      try {
        setError(null);
        const documentAsArrayBuffer = await documentBlob.arrayBuffer();
        
        instance = await NutrientViewer.load({
          container,
          document: documentAsArrayBuffer,
        });

        viewerInstanceRef.current = instance;
      } catch (err) {
        console.error('NutrientDocumentEditor: Failed to initialize Nutrient Viewer:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Could not load the document. Please try again. Error: ${errorMessage}`);
      }
    };

    const animationFrameId = requestAnimationFrame(() => {
      initializeViewer();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (viewerInstanceRef.current) {
        NutrientViewer.unload(container);
        viewerInstanceRef.current = null;
      }
    };
  }, [documentBlob]);

  const handleAddText = async () => {
    if (!viewerInstanceRef.current) return;
    try {
      setError(null);
      // Example: Add a text annotation. The exact API may vary.
      await viewerInstanceRef.current.addAnnotation({
        type: 'text',
        text: 'New Text Annotation',
        pageNumber: 1,
        rect: { x: 100, y: 100, width: 200, height: 50 },
      });
    } catch (err) {
      console.error('Failed to add text:', err);
      setError('An error occurred while adding text.');
    }
  };

  const handleSave = async () => {
    if (!viewerInstanceRef.current) return;

    setIsSaving(true);
    setError(null);
    try {
      const editedBlob = await viewerInstanceRef.current.save();
      onSave(editedBlob);
    } catch (err) {
      console.error('Failed to save document:', err);
      setError('Failed to save the document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div ref={viewerContainerRef} style={{ height: '70vh', width: '100%' }} />
      <div className="mt-2">
        <button className="btn btn-secondary" onClick={handleAddText} disabled={isSaving}>
          Add Text
        </button>
        <button className="btn btn-primary ms-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Document'}
        </button>
      </div>
    </div>
  );
};

export default NutrientDocumentEditor;