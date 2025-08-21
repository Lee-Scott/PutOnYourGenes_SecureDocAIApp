import { Key } from "../enum/catch.key";
import { type IResponse } from "../models/IResponse";
import { toastError, toastSuccess } from "./ToastUtils";

export const userApiBaseUrl = 'http://localhost:8085/user';
export const documentsApiBaseUrl = 'http://localhost:8085/documents';

export const isJsonContentType = (headers: Headers) => 
    ['application/vnd.api+json', 'application/json', 'application/vnd.hal+json', 'application/pdf', 'multipart/form-data']
    .includes(headers.get('content-type')?.trimEnd() ?? '');

export const processResponse = <T>(response: IResponse<T>, meta: any, arg: unknown): T => {
    const { request } = meta;
    if (request.url.includes('logout')) { localStorage.removeItem(Key.LOGGEDIN); }
    if (!request.url.includes('profile') && !request.url.includes('delete')) {
        toastSuccess(response.message || 'Operation successful');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (response?.data?.user || response?.data) as T;
};

export const processError = (error: { status: number; data: IResponse<void>}, meta: unknown, arg: unknown): { status: number; data: IResponse<void>} =>{
        if(error.data.code === 401 && error.data.status === 'UNAUTHORIZED' && error.data.message === 'You are not Logged in ') {
            localStorage.setItem(Key.LOGGEDIN, 'false');
           }
        toastError(error.data.message);
        console.log({ error: error.data  });
        return error;
    };

// Use when you need the full response wrapper (metadata + data)
export const processResponseRaw = <T>(response: IResponse<T>): IResponse<T> => response;