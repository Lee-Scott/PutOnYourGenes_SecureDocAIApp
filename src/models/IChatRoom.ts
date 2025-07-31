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

export interface IChatRoom {
  id: number;
  referenceId: string;
  chatRoomId: string;
  user1: IChatUser;
  user2: IChatUser;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
