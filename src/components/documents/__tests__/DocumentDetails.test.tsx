import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import DocumentDetails from '../DocumentDetails';
import { documentAPI } from '../../../service/DocumentService';
import { userAPI } from '../../../service/UserService';

// Mock services
// No longer mocking the entire module

const mockDocument = {
  data: {
    document: {
      documentId: 'doc1',
      name: 'Test Document',
      description: 'A test document description.',
      uri: 'http://example.com/doc1',
      formattedSize: '15 KB',
      updaterName: 'Admin User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: '',
      ownerName: 'Test User',
      ownerEmail: 'test@example.com',
      ownerPhone: '123-456-7890',
    },
  },
};

const mockUser = {
  data: {
    user: {
      authorities: ['document:update', 'document:delete'],
    },
  },
};

describe('DocumentDetails', () => {
  const updateDocumentFn = vi.fn();
  const downloadDocumentFn = vi.fn();
  const deleteDocumentFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(documentAPI, 'useFetchDocumentQuery').mockReturnValue({ data: mockDocument, isLoading: false, isSuccess: true, refetch: vi.fn() });
    vi.spyOn(userAPI, 'useFetchUserQuery').mockReturnValue({ data: mockUser, refetch: vi.fn() });
    vi.spyOn(documentAPI, 'useUpdateDocumentMutation').mockReturnValue([updateDocumentFn, { reset: vi.fn() }]);
    vi.spyOn(documentAPI, 'useDownloadDocumentMutation').mockReturnValue([downloadDocumentFn, { reset: vi.fn() }]);
    vi.spyOn(documentAPI, 'useDeleteDocumentMutation').mockReturnValue([deleteDocumentFn, { reset: vi.fn() }]);
    
    updateDocumentFn.mockReturnValue({ unwrap: () => Promise.resolve() });
    downloadDocumentFn.mockReturnValue({ unwrap: () => Promise.resolve(new Blob()) });
    deleteDocumentFn.mockReturnValue({ unwrap: () => Promise.resolve() });
    
    window.confirm = vi.fn(() => true);
    window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:5173/mock-url');
    window.URL.revokeObjectURL = vi.fn();
  });

  test('renders document details', () => {
    render(<MemoryRouter initialEntries={['/documents/doc1']}><Routes><Route path="/documents/:documentId" element={<DocumentDetails />} /></Routes></MemoryRouter>);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A test document description.')).toBeInTheDocument();
  });

  test('handles document update', async () => {
    render(<MemoryRouter initialEntries={['/documents/doc1']}><Routes><Route path="/documents/:documentId" element={<DocumentDetails />} /></Routes></MemoryRouter>);
    fireEvent.change(screen.getByDisplayValue('A test document description.'), { target: { value: 'Updated description.' } });
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));
    await waitFor(() => {
      expect(updateDocumentFn).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Updated description.',
      }));
    });
  });

  test('handles document download', async () => {
    render(<MemoryRouter initialEntries={['/documents/doc1']}><Routes><Route path="/documents/:documentId" element={<DocumentDetails />} /></Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Download/i }));
    await waitFor(() => {
      expect(downloadDocumentFn).toHaveBeenCalledWith('doc1');
    });
  });

  test('handles document deletion', async () => {
    render(<MemoryRouter initialEntries={['/documents/doc1']}><Routes><Route path="/documents/:documentId" element={<DocumentDetails />} /></Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await waitFor(() => {
      expect(deleteDocumentFn).toHaveBeenCalledWith('doc1');
    });
  });
});
