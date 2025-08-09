import { describe, it, expect } from 'vitest';
import { chatRoomAPI } from '../ChatRoomService';

describe('ChatRoomService', () => {
  it('should have the correct endpoints', () => {
    expect(chatRoomAPI.endpoints.getChatRooms).toBeDefined();
    expect(chatRoomAPI.endpoints.getChatRoomsByUserId).toBeDefined();
    expect(chatRoomAPI.endpoints.getChatRoomById).toBeDefined();
    expect(chatRoomAPI.endpoints.createChatRoom).toBeDefined();
    expect(chatRoomAPI.endpoints.getChatMessages).toBeDefined();
    expect(chatRoomAPI.endpoints.sendMessage).toBeDefined();
  });
});
