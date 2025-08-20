export interface IDocument {
    icon: string;
    name: string;
    description: string;
    id: number;
    size: number;
    extension: string;
    uri: string;
    formattedSize: string;
    referenceId: string;
    ownerLastLogin: string;
    updaterName: string;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
}

export type Document = IDocument;

export type DocumentForm = {
    documentId: string;
    name: string;
    description: string;
    uri?: string;
    formattedSize?: string;
    updaterName?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type Documents = {
    documents: IDocument[];
};

export type Query = {
    page: number;
    size: number;
    name: string;
};
