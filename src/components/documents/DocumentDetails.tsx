import React from 'react'
import { useParams } from 'react-router-dom'
import { userAPI } from '../../services/UserService';
import { documentAPI } from '../../services/DocumentService';
import { useForm } from 'react-hook-form';
import { DocumentForm } from '../../models/IDocument';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  documentId: z.string().min(3, 'Document ID is required'),
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  uri: z.string(),
  formattedSize: z.string(),
  updaterName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const DocumentDetails = () => {
  const { documentId } = useParams();
  const { register, handleSubmit, formState: form, getFieldState } = useForm<DocumentForm>({ resolver: zodResolver(schema), mode: 'onTouched'});
  const { data: userData } = userAPI.useFetchUserQuery();
  const { data: documentData, isLoading, error,  isSuccess } = documentAPI.useFetchDocumentQuery(documentId);
  const [updateDocument, {data: updateData, isLoading: updateLoading, error: updateError, isSuccess: updateSuccess }] = documentAPI.useUpdateDocumentMutation();
  const [downloadDocument, {data: downloadData, isLoading: downloadLoading, error: downloadError, isSuccess: downloadSuccess }] = documentAPI.useDownloadDocumentMutation();

  const isFieldValid = (fieldName: keyof DocumentForm): boolean => getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  const onUpdateDocument = async (form: DocumentForm) => await updateDocument(form);

  const onDownloadDocument = async (documentName: string) => {
    const resource = await downloadDocument(documentName).unwrap();
    const url = URL.createObjectURL(new Blob([resource]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', documentName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //URL.revokeObjectURL(link.href);
  };

  if (isLoading) {
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
  
  if (isSuccess) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="text-center border-end">
                      <img src={documentData.data.document.icon} className="avatar-xxl" alt={documentData.data.document.name} />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="ms-3 text-lg-start text-sm-center text-xs-center">
                      <h4 className="card-title mb-2 mt-sm-3">{documentData.data.document.name}</h4>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <button type="button" onClick={() => onDownloadDocument(documentData.data.document.name)} className="btn btn-primary downloadb"><i className="bi bi-download"></i> Download</button>
                          {userData.data.user.authorities.includes('document:delete') && <button type="button" className="btn btn-danger"><i className="bi bi-trash"></i> Delete</button>}
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
                            <input type="hidden" {...register('documentId')} name='documentId' className='disabled' defaultValue={documentData.data.document.documentId} required />
                            <label htmlFor="firstName" className="form-label">Name</label><div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-file-earmark-text-fill"></i></span>
                              <input type="text" {...register('name')} name='name' className={`form-control ' ${form.errors.name ? 'is-invalid' : ''} ${isFieldValid('name') ? 'is-valid' : ''}`} placeholder="Document name" defaultValue={documentData.data.document.name} required disabled={!userData.data.user.authorities.includes('document:update')} />
                              <div className="invalid-feedback">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="lastName" className="form-label">Size</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-database"></i></span>
                              <input type="text" {...register('formattedSize')} name='size' className="form-control disabled" defaultValue={documentData.data.document.formattedSize} placeholder="Size" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">Last Updated By</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                              <input type="text" {...register('updaterName')} className="form-control disabled" defaultValue={documentData.data.document.updaterName} placeholder="updaterName" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="firstName" className="form-label">Created At</label><div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                              <input type="text" {...register('createdAt')} defaultValue={new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(documentData.data.document.createdAt))} className="form-control disabled" placeholder="Document name" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="lastName" className="form-label">Last Updated At</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                              <input type="text" {...register('updatedAt')} defaultValue={new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(documentData.data.document.updatedAt))} className="form-control disabled" placeholder="Size" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">URI</label>
                            <div className="input-group has-validation">
                              <span className="input-group-text"><i className="bi bi-usb"></i></span>
                              <input type="text" {...register("uri")} name='uri' defaultValue={documentData.data.document.uri} className="form-control disabled" placeholder="URI" required readOnly />
                              <div className="">{form.errors?.name?.message}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea {...register('description')} name='description' defaultValue={documentData.data.document.description} className={`form-control ' ${form.errors.description ? 'is-invalid' : ''} ${isFieldValid('description') ? 'is-valid' : ''}`} placeholder="Description" rows={3} required disabled={!userData.data.user.authorities.includes('document:update')}></textarea>
                            <div className="invalid-feedback">{form.errors?.description?.message}</div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="col">
                          <button disabled={form.isSubmitting || isLoading || !userData.data.user.authorities.includes('document:update')} className="btn btn-primary btn-block" type="submit" >
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
                  <p>{documentData.data.document.description}</p>
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
                          <td>{documentData.data.document.ownerName}</td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>{documentData.data.document.ownerEmail}</td>
                        </tr>
                        <tr>
                          <th scope="row">Phone</th>
                          <td>{documentData.data.document.ownerPhone}</td>
                        </tr>
                        <tr>
                          <th scope="row">Last Login</th>
                          <td>{new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(documentData.data.document.createdAt))}</td>
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
  }
}

export default DocumentDetails;