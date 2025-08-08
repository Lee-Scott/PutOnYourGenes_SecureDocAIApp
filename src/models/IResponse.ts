export interface IResponse<T> {
    time: string;
    code: number;
    path: string;
    status: string; // enum in backend
    message: string;
    data: T; // replaced with actual type
    timeStamp?: string;
}