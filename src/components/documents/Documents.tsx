import React from 'react';
import { documentAPI } from '../../service/DocumentService';
import { Query } from '../../models/IDocument';
import DocumentLoader from './DocumentLoader';
import Document from './Document';

//TODO: make per page size dynamic

const Documents = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState<Query>({ page: 0, size: 4, name: '' });

  const { data: documentData, isLoading } = documentAPI.useFetchDocumentsQuery(query);
  const [uploadDocuments] = documentAPI.useUploadDocumentsMutation();

  const selectDocuments = () => inputRef.current?.click();

  const goToPage = async (direction: string) => {
    if (direction === 'back') {
      setQuery((prev: Query) => ({ ...prev, page: prev.page - 1 }));
    } else {
      setQuery((prev: Query) => ({ ...prev, page: prev.page + 1 }));
    }
  }

  const onUploadDocuments = async (documents: FileList) => {
    if(documents){
      const formData = new FormData();
      Array.from(documents).forEach((document) => {
        formData.append('files', document, document.name);
      });
      await uploadDocuments(formData);
    }
  }
  if(isLoading){
    return <DocumentLoader />
  }
  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-lg-12">
          <div className="align-items-center row">
            <div className="col-lg-4">
              <div className="mb-3 mb-lg-0">
                { (documentData?.data.documents.content?.length ?? 0) > 0 &&
                <h6 className="fs-16 mb-0">{`Showing ${((documentData?.data?.documents?.number ?? 0) * (documentData?.data?.documents?.size ?? 0)) + 1} - ${((documentData?.data?.documents?.number ?? 0) * (documentData?.data?.documents?.size ?? 0)) + (documentData?.data.documents.content?.length ?? 0)} of ${documentData?.data?.documents?.totalElements ?? 0} results`}</h6>}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="candidate-list-widgets">
                <div className="row">
                  <div className="col-lg-6 mb-2">
                    <div className="selection-widget">
                      <input type="search" onChange={(event) => setQuery((prev) => { return { ...prev, page: 0, name: event.target.value } })} name='name' className='form-control' id="email" placeholder="Search documents" required />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="selection-widget">
                      <select onChange={(event) => setQuery((prev) => { return { ...prev, size: +event.target.value } })} className="form-select" data-trigger="true" name="size" aria-label="Select page size">
                        <option value="4">Per page (4)</option>
                        <option value="6">6</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="selection-widget mt-2 mt-lg-0">
                      <button type="button" onClick={selectDocuments} className="btn btn-primary w-100" style={{ display: 'inline-block' }}>
                        <i className="bi bi-upload upload-icon"></i>
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="candidate-list">
            {documentData?.data.documents.content?.length === 0 && <h4 className='card mt-4 align-items-center row' style={{border: 'none', boxShadow: 'none'}}>No documents found</h4>}
            {documentData?.data.documents.content.map(document => <Document {...document} key={document.id} />)}
          </div>
        </div>
      </div>
      {(documentData?.data.documents.content?.length ?? 0) > 0 && (documentData?.data?.documents.totalPages ?? 0) > 1 &&
        <div className="row">
          <div className="mt-4 pt-2 col-lg-12">
            <nav aria-label="Page navigation example">
              <div className="pagination job-pagination mb-0 justify-content-center">
                <li className="page-item">
                  <button onClick={() => goToPage('back')} className={`page-link ' ${0 === query.page ? 'disabled' : undefined}`} style={{ background: 'none', border: 'none' }}>
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                {[...Array(documentData?.data?.documents.totalPages).keys()].map((page) =>
                  <li key={page} className='page-item'>
                    <button onClick={() => setQuery((prev) => { return { ...prev, page } })} className={`page-link ' ${page === query.page ? 'active' : undefined}`} style={{ background: 'none', border: 'none' }}>{page + 1}</button>
                  </li>
                )}
                <li className="page-item">
                  <button onClick={() => goToPage('forward')} className={`page-link ' ${documentData?.data?.documents.totalPages === query.page + 1 ? 'disabled' : undefined}`} style={{ background: 'none', border: 'none' }}>
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </div>
            </nav>
          </div>
        </div>}
      <div style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => { if (event.target.files) onUploadDocuments(event.target.files); }} name='file' accept='*' multiple />
      </div>
    </div>
  )
}

export default Documents;
