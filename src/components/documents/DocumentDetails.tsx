import { useParams, useNavigate, Link } from 'react-router-dom'
import { toastSuccess, toastError } from '../../utils/ToastUtils'; // Add this import

import { SubmitHandler, useForm } from 'react-hook-form';
import { DocumentForm } from '../../models/IDocument';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { documentAPI } from '../../service/DocumentService';
import { userAPI } from '../../service/UserService';
import { formatDate } from '../../utils/DateUtils';
import { skipToken } from '@reduxjs/toolkit/query/react';

const schema = z.object({
  documentId: z.string().min(3, 'Document ID is required'),
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(5, 'Description is required and must be 5 chars or more'),
  uri: z.string().optional(),
  formattedSize: z.string().optional(),
  updaterName: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()  
});


const DocumentDetails = () => {
  const { documentId } = useParams<{ documentId?: string }>();
  const navigate = useNavigate();
  console.log('documentId:', documentId);
  const { register, handleSubmit, formState: form, getFieldState } = useForm<DocumentForm>({ resolver: zodResolver(schema), mode: 'onTouched'});
  const { data: userData, isLoading: isUserLoading } = userAPI.useFetchUserQuery();
  const queryArg = documentId ?? skipToken;
  const { data: documentData, isLoading, error,  isSuccess } = documentAPI.useFetchDocumentQuery(queryArg, { refetchOnMountOrArgChange: true });
  const [updateDocument] = documentAPI.useUpdateDocumentMutation();
  const [downloadDocument] = documentAPI.useDownloadDocumentMutation();
  const [deleteDocument, { isLoading: deleteLoading }] = documentAPI.useDeleteDocumentMutation();

  const isFieldValid = (fieldName: keyof DocumentForm): boolean => getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  const onUpdateDocument: SubmitHandler<DocumentForm> = async (form) => {
    await updateDocument(form);
  };

  const onDownloadDocument = async (documentId: string, documentName: string) => {
    const resource = await downloadDocument(documentId).unwrap();
    const url = URL.createObjectURL(new Blob([resource]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', documentName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //URL.revokeObjectURL(link.href);
  };

  const onDeleteDocument = async () => {
  if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    if (!documentData?.documentId) return;
    try {
      await deleteDocument(documentData.documentId).unwrap();
      // Navigate immediately and show success message
      navigate('/documents', { replace: true });
      toastSuccess('Document deleted successfully');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toastError('Failed to delete document');
    }
  }
};

  console.log('documentData:', documentData);

  if (isLoading || isUserLoading) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess && documentData && userData && userData.data) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="text-center border-end">
                      <img src={documentData.icon} className="avatar-xxl" alt={documentData.name} />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="ms-3 text-lg-start text-sm-center text-xs-center">
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{documentData.name}</h1>
                        <Link
                          to={`/viewdoc/${documentData.documentId}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>View Document</span>
                        </Link>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <button type="button" onClick={() => onDownloadDocument(documentData.documentId, documentData.name)} className="btn btn-primary downloadb"><i className="bi bi-download"></i> Download</button>
                          {documentData.referenceId && (
                            <Link to={`/editdoc/${documentData.referenceId}`} className="btn btn-info"><i className="bi bi-pencil"></i> Open in Editor</Link>
                          )}
                          {userData && userData.data && userData.data.user.authorities.includes('document:delete') && (
                            <button type="button" onClick={onDeleteDocument} disabled={deleteLoading} className="btn btn-danger">
                              {deleteLoading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                              <i className="bi bi-trash"></i> {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane active show" id="tasks-tab" role="tabpanel">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card right-profile-card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onUpdateDocument)} className="needs-validation" noValidate>
                        <h4 className="mb-3">Document Details
                        </h4>
                        <hr />
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <input type="hidden" {...register('documentId')} name='documentId' className='disabled' defaultValue={documentData.documentId} required />
                            <label htmlFor="firstName" className="form-label">Name</label><div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-file-earmark-text-fill"></i></span>
                              <input type="text" {...register('name')} name='name' className={`form-control ' ${form.errors.name ? 'is-invalid' : ''} ${isFieldValid('name') ? 'is-valid' : ''}`} placeholder="Document name" defaultValue={documentData.name} required disabled={!userData?.data.user.authorities.includes('document:update')} />
                              <div className="invalid-feedback">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="lastName" className="form-label">Size</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-database"></i></span>
                              <input type="text" {...register('formattedSize')} name='size' className="form-control disabled" defaultValue={documentData.formattedSize} placeholder="Size" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">Last Updated By</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                              <input type="text" {...register('updaterName')} className="form-control disabled" defaultValue={documentData.updaterName} placeholder="updaterName" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="firstName" className="form-label">Created At</label><div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                              <input type="text" {...register('createdAt')} defaultValue={formatDate(documentData.createdAt)} className="form-control disabled" placeholder="Document name" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="lastName" className="form-label">Last Updated At</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                              <input type="text" {...register('updatedAt')} defaultValue={formatDate(documentData.updatedAt)} className="form-control disabled" placeholder="Size" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">URI</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-usb"></i></span>
                              <input type="text" {...register("uri")} name='uri' defaultValue={documentData.uri} className="form-control disabled" placeholder="URI" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea {...register('description')} name='description' defaultValue={documentData.description} className={`form-control ' ${form.errors.description ? 'is-invalid' : ''} ${isFieldValid('description') ? 'is-valid' : ''}`} placeholder="Description" rows={3} required disabled={!userData?.data.user.authorities.includes('document:update')}></textarea>
                            <div className="invalid-feedback">{form.errors?.description?.message}</div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="col">
                          <button disabled={form.isSubmitting || isLoading || !userData?.data.user.authorities.includes('document:update')} className="btn btn-primary btn-block" type="submit" >
                            {(form.isSubmitting || isLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                            <span role="status">{(form.isSubmitting || isLoading) ? 'Loading...' : 'Update'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <div className="pb-2">
                  <h4 className="card-title mb-3">Description</h4>
                  <hr />
                  <p>{documentData.description}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div>
                  <h4 className="card-title mb-4">Document Owner</h4>
                  <hr />
                  <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">Name</th>
                          <td>{documentData.ownerName}</td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>{documentData.ownerEmail}</td>
                        </tr>
                        <tr>
                          <th scope="row">Phone</th>
                          <td>{documentData.ownerPhone}</td>
                        </tr>
                        <tr>
                          <th scope="row">Last Login</th>
                          <td>{formatDate(documentData.createdAt)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (isLoading) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (error) {
    return <div className="container mtb">Error loading document details.</div>;
  } else if (!documentData) {
    return <div className="container mtb">Document not found or unavailable.</div>;
  } else {
    return <div className="container mtb">Document not found or unavailable.</div>;
  }
}

export default DocumentDetails;
