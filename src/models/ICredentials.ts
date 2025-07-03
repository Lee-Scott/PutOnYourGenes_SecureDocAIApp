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
