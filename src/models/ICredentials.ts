import { IUser } from "./IUser";

export interface IUserRequest {
    email: string;
    password?: string; // not required incase we want to just access the email

};

export interface IRegisterRequest extends IUserRequest {
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
};

export type EmailAddress = Pick<IUserRequest, 'email'>;
export type UpdatePassword = Pick<IUserRequest, 'password'> & { newPassword: string; confirmNewPassword: string };
export type UpdateNewPassword = Pick<IUser, 'userId'> & UpdatePassword;
