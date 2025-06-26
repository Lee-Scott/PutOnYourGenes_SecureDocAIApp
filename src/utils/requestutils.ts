import { Key } from "../enum/catch.key";
import { type IResponse } from "../models/IResponse";

export const baseURL = 'http://localhost:8085/user';

export const isJsonContentType = (headers: Headers) => 
    ['application/vnd.api+json', 'application/json', 'application/vnd.hal+json', 'application/pdf', 'multipart/form-data'] // if one of these is included in the header then thats a jsonContent type
    .includes(headers.get('content-type')?.trimEnd() ?? '');

export const processResponse = <T>(response: IResponse<T>, meta: any, arg: unknown): IResponse<T> => {
    const { request } = meta;
    if(request.url.includes('logout')) { localStorage.removeItem(Key.LOGGEDIN); }
    if(!request.url.includes('profile')) { 
        // show toast notification for profile update
     }
     console.log('processResponse', response);
     return response;
};

export const processError = (error: { status: number; data: IResponse<void>}, meta: unknown, arg: unknown): { status: number; data: IResponse<void>} =>{
        if(error.data.code === 401 && error.data.status === 'UNAUTHORIZED' && error.data.message === 'You are not Logged in ') { 
            localStorage.setItem(Key.LOGGEDIN, 'false');  
           }
           // Show Message to User
        console.log({ error: error.data  });
        return error;
    };