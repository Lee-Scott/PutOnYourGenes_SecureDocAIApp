import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { documentAPI } from '../DocumentService';
import { setupStore } from '../../store/store';
import { server } from '../../mocks/server';
import 'whatwg-fetch';

const store = setupStore();

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('DocumentService', () => {
  it('should have the correct endpoints', () => {
    expect(documentAPI.endpoints.fetchDocuments).toBeDefined();
    expect(documentAPI.endpoints.fetchDocument).toBeDefined();
    expect(documentAPI.endpoints.uploadDocuments).toBeDefined();
    expect(documentAPI.endpoints.deleteDocument).toBeDefined();
    expect(documentAPI.endpoints.updateDocument).toBeDefined();
    expect(documentAPI.endpoints.downloadDocument).toBeDefined();
  });

  it('fetchDocuments should return a list of documents', async () => {
    const { data } = await store.dispatch(
      documentAPI.endpoints.fetchDocuments.initiate({ page: 0, size: 10, name: '' })
    );
    expect(data?.data.documents.content).toHaveLength(2);
    expect(data?.data.documents.content[0].name).toBe('Test Document 1');
  });

  it('uploadDocuments should upload a document', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['test']), 'test.pdf');
    const { data } = await store.dispatch(
      documentAPI.endpoints.uploadDocuments.initiate(formData)
    );
    expect(data?.data.documents[0].name).toBe('new-document.pdf');
  });

  it('fetchDocument should return a single document', async () => {
    const { data } = await store.dispatch(
      documentAPI.endpoints.fetchDocument.initiate('1')
    );
    expect(data?.data.name).toBe('Test Document 1');
  });

  it('updateDocument should update a document', async () => {
    const doc = { documentId: '1', name: 'updated-document.pdf', description: 'updated description' };
    const { data } = await store.dispatch(
      documentAPI.endpoints.updateDocument.initiate(doc)
    );
    expect(data?.data.name).toBe('updated-document.pdf');
  });

  it('downloadDocument should download a document', async () => {
    const { data } = await store.dispatch(
      documentAPI.endpoints.downloadDocument.initiate('1')
    );
    expect(data?.type).toBe('application/pdf');
    expect(data?.size).toBe(13);
  });

  it('deleteDocument should delete a document', async () => {
    const { data } = await store.dispatch(
      documentAPI.endpoints.deleteDocument.initiate('1')
    );
    expect(data?.message).toBe('Document 1 deleted successfully');
  });
});
