import React, { useEffect, useRef, useState } from 'react';
import { documentAPI } from '../../service/DocumentService';
import { toast } from 'react-toastify';

interface NutrientDocumentEditorProps {
  document: {
    id: string;
    title: string;
    original_file_name: string;
  };
  documentBlob: Blob;
  onSave: (editedBlob: Blob) => void;
}

const NutrientDocumentEditor: React.FC<NutrientDocumentEditorProps> = ({ document, documentBlob, onSave }) => {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  interface NutrientViewerInstance {
    addAnnotation(annotation: { type: string; text: string; pageNumber: number; rect: { x: number; y: number; width: number; height: number; }; }): Promise<void>;
    save(): Promise<Blob>;
  }
  const viewerInstanceRef = useRef<NutrientViewerInstance | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockId, setLockId] = useState<string | null>(null);
  const [baseVersion, setBaseVersion] = useState<number>(0);
  type Version = { version: number; timestamp: string };
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
 
   const [checkoutDocument, { isLoading: _isCheckingOut }] = documentAPI.useCheckoutDocumentMutation();
   const [checkinDocument, { isLoading: _isCheckingIn }] = documentAPI.useCheckinDocumentMutation();
  const { data: status, error: _statusError, isLoading: isStatusLoading } = documentAPI.useGetDocumentStatusQuery(document.id, { pollingInterval: 30000 });
  const { data: versions, error: _versionsError, isLoading: isVersionsLoading } = documentAPI.useGetVersionsQuery(document.id);
 
   useEffect(() => {
     const checkout = async () => {
       try {
         const response = await checkoutDocument(document.id).unwrap();
         if (response.data) {
           setLockId(response.data.lockId);
           setBaseVersion(response.data.version);
         }
       } catch (_err) {
         toast.error('Failed to checkout document for editing.');
         setError('Could not obtain an exclusive lock for editing.');
       }
     };
 
     checkout();
   }, [document.id, checkoutDocument]);

  useEffect(() => {
    if (!documentBlob || !viewerContainerRef.current) {
      return;
    }

    const container = viewerContainerRef.current;
    let instance: unknown = null;

    const initializeViewer = async () => {
      if (window.NutrientViewer) {
        try {
          setError(null);
          const blobUrl = URL.createObjectURL(documentBlob);
          
          instance = await window.NutrientViewer.load({
            container,
            document: blobUrl,
          });

          viewerInstanceRef.current = instance as NutrientViewerInstance;
        } catch (err) {
          console.error('NutrientDocumentEditor: Failed to initialize Nutrient Viewer:', err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(`Could not load the document. Please try again. Error: ${errorMessage}`);
        }
      }
    };

    const animationFrameId = requestAnimationFrame(() => {
      initializeViewer();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (viewerInstanceRef.current && window.NutrientViewer) {
        window.NutrientViewer.unload(container);
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
      if (lockId) {
        await checkinDocument({
          documentId: document.id,
          file: new File([editedBlob], document.original_file_name),
          baseVersion,
          lockId,
        }).unwrap();
      } else {
        throw new Error('No lock ID found for this document.');
      }
      onSave(editedBlob);
      toast.success('Document saved successfully!');
    } catch (err) {
      console.error('Failed to save document:', err);
      if ((err as { data: { message: string } }).data?.message?.includes('conflict')) {
       setShowConflictModal(true);
      } else {
       setError('Failed to save the document. Please try again.');
       toast.error('Failed to save document.');
      }
    } finally {
      setIsSaving(false);
    }
  };

 const handleConflictResolution = async (resolution: 'keep' | 'discard' | 'both') => {
   setShowConflictModal(false);
   if (resolution === 'discard') {
     toast.info('Your changes have been discarded.');
     return;
   }

   setIsSaving(true);
   try {
     if (!viewerInstanceRef.current) return;
     const editedBlob = await viewerInstanceRef.current.save();
     
     if (resolution === 'keep') {
       if (status?.data && lockId) {
        await checkinDocument({
          documentId: document.id,
          file: new File([editedBlob], document.original_file_name),
          baseVersion: status.data.version, // Force overwrite with the latest version
          lockId,
        }).unwrap();
        toast.success('Your version has been saved.');
       }
     } else if (resolution === 'both') {
       // This would typically involve a more complex API call to save a new version
       // For now, we'll just log it and save the current version
       console.log('Saving both versions - implementation needed on backend');
       if (lockId) {
        await checkinDocument({
          documentId: document.id,
          file: new File([editedBlob], document.original_file_name),
          baseVersion,
          lockId,
        }).unwrap();
        toast.success('Both versions have been saved.');
       }
     }
     onSave(editedBlob);
   } catch (err) {
     console.error('Failed to resolve conflict:', err);
     setError('Failed to resolve the conflict. Please try again.');
     toast.error('Failed to resolve conflict.');
   } finally {
     setIsSaving(false);
   }
 };

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        {error && <div className="alert alert-danger">{error}</div>}
        {isStatusLoading && <p>Loading document status...</p>}
        {status?.data && (
          <div className="alert alert-info">
            Document Status: {status.data.lockStatus} by {status.data.lockedBy}
          </div>
        )}
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
      <div className="ms-3" style={{ width: '250px' }}>
        <h5>Version History</h5>
        {isVersionsLoading && <p>Loading versions...</p>}
        <ul className="list-group">
          {versions?.data?.map((version: Version) => (
            <button
              key={version.version}
              className={`list-group-item ${selectedVersion?.version === version.version ? 'active' : ''}`}
              onClick={() => setSelectedVersion(version)} style={{ background: 'none', border: 'none' }}
            >
              Version {version.version} ({new Date(version.timestamp).toLocaleString()})
            </button>
          ))}
        </ul>
      </div>
      {showConflictModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Conflict Detected</h5>
              </div>
              <div className="modal-body">
                <p>Another version of this document has been saved. How would you like to proceed?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => handleConflictResolution('discard')}>Discard My Changes</button>
                <button className="btn btn-primary" onClick={() => handleConflictResolution('keep')}>Keep My Version</button>
                <button className="btn btn-info" onClick={() => handleConflictResolution('both')}>Save Both as New Versions</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default NutrientDocumentEditor;