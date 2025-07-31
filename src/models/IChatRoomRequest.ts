// Import the IChatRoom interface
import { IChatRoom } from './IChatRoom';

export interface IChatRoomRequest {
  user1: {
    userId: string;
  };
  user2: {
    userId: string;
  };
}
