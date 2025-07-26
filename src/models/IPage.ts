import { IDocument } from "./IDocument";

// Represents a single page of documents from Spring Data
export interface IPage {
    content: IDocument[]; // Array of documents
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}

// API response shape for documents page
export interface Page {
    documents: {
        content: import('./IDocument').IDocument[];
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}