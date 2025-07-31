export interface IChatUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  role: {
    name: string;
  };
}
