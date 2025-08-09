import { http, HttpResponse } from 'msw';
import { IQuestionnaireRequest } from '../models/IQuestionnaire';

export const handlers = [
  http.get('http://localhost:8085/api/questionnaires', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        questionnaires: [
          { id: '1', title: 'Test Questionnaire 1', description: 'This is a test questionnaire.' },
          { id: '2', title: 'Test Questionnaire 2', description: 'This is another test questionnaire.' },
        ],
        totalPages: 1,
        currentPage: 0,
        totalItems: 2,
      },
      message: 'Questionnaires fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/api/questionnaires',
    });
  }),
  http.get('http://localhost:8085/api/questionnaires/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      status: 'success',
      data: {
        questionnaire: { id, title: `Test Questionnaire ${id}`, description: `This is test questionnaire ${id}.`, pages: [] },
      },
      message: 'Questionnaire fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: `/api/questionnaires/${id}`,
    });
  }),
  http.post('http://localhost:8085/api/questionnaires', async ({ request }) => {
    const newQuestionnaire = await request.json() as IQuestionnaireRequest;
    return HttpResponse.json({
      status: 'success',
      data: {
        questionnaire: { ...newQuestionnaire, id: '3', pages: [] },
      },
      message: 'Questionnaire created successfully',
      timeStamp: new Date().toISOString(),
      code: 201,
      path: '/api/questionnaires',
    });
  }),
  http.patch('http://localhost:8085/api/questionnaires/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedQuestionnaire = await request.json() as Partial<IQuestionnaireRequest>;
    return HttpResponse.json({
      status: 'success',
      data: {
        questionnaire: { id, title: `Updated Questionnaire ${id}`, ...updatedQuestionnaire, pages: [] },
      },
      message: 'Questionnaire updated successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: `/api/questionnaires/${id}`,
    });
  }),
  http.delete('http://localhost:8085/api/questionnaires/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      status: 'success',
      data: null,
      message: `Questionnaire ${id} deleted successfully`,
      timeStamp: new Date().toISOString(),
      code: 200,
      path: `/api/questionnaires/${id}`,
    });
  }),
  http.get('http://localhost:8085/documents/search', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        documents: {
          content: [
            { id: '1', name: 'Test Document 1', url: 'http://example.com/doc1.pdf' },
            { id: '2', name: 'Test Document 2', url: 'http://example.com/doc2.pdf' },
          ],
          totalPages: 1,
          currentPage: 0,
          totalItems: 2,
        },
      },
      message: 'Documents fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/documents/search',
    });
  }),
  http.post('http://localhost:8085/documents/upload', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        documents: [{ id: '3', name: 'new-document.pdf', url: 'http://example.com/doc3.pdf' }],
      },
      message: 'Document uploaded successfully',
      timeStamp: new Date().toISOString(),
      code: 201,
      path: '/documents/upload',
    });
  }),
  http.get('http://localhost:8085/documents/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      status: 'success',
      data: { id, name: `Test Document ${id}`, url: `http://example.com/doc${id}.pdf` },
      message: 'Document fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: `/documents/${id}`,
    });
  }),
  http.patch('http://localhost:8085/documents', async ({ request }) => {
    const doc = await request.json() as { id: string, name: string };
    return HttpResponse.json({
      status: 'success',
      data: { document: { ...doc, url: `http://example.com/${doc.name}` } },
      message: 'Document updated successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/documents',
    });
  }),
  http.get('http://localhost:8085/documents/download/:name', () => {
    return new HttpResponse(new Blob(['test document']), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  }),
  http.delete('http://localhost:8085/documents/delete/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      status: 'success',
      data: null,
      message: `Document ${id} deleted successfully`,
      timeStamp: new Date().toISOString(),
      code: 200,
      path: `/documents/delete/${id}`,
    });
  }),
  http.get('http://localhost:8085/api/chatrooms', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        chatRooms: [
          { id: '1', name: 'Test Chat Room 1' },
          { id: '2', name: 'Test Chat Room 2' },
        ],
      },
      message: 'Chat rooms fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/api/chatrooms',
    });
  }),
  http.post('http://localhost:8085/user/login', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        user: { id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com' },
      },
      message: 'User logged in successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/user/login',
    });
  }),
  http.get('http://localhost:8085/user/profile', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        user: { id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com' },
      },
      message: 'User fetched successfully',
      timeStamp: new Date().toISOString(),
      code: 200,
      path: '/user/profile',
    });
  }),
];
