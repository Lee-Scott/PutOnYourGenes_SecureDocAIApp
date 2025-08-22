import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../service/UserService';
import { chatRoomAPI } from '../../service/ChatRoomService';
import { IChatRoomRequest } from '../../models/IChatRoomRequest';

/**
 * CreateChatModal Component
 * 
 * Modal component for creating new chat rooms with user search functionality.
 * 
 * Features:
 * - Real-time user search with debounced input
 * - Filtered user list (excludes current user and disabled accounts)
 * - User selection with visual feedback
 * - Automatic navigation to new chat room upon creation
 * - Loading states and error handling
 * - Mobile-responsive design
 * 
 * Usage:
 * ```tsx
 * <CreateChatModal 
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 * />
 * ```
 * 
 * Future Enhancements:
 * - Group chat creation (multiple user selection)
 * - Chat room name and description setting
 * - User role assignment (admin, member, etc.)
 * - Recent contacts quick selection
 * - Bulk invite functionality
 */

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserData = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  imageUrl: string;
  role: string;
  enabled: boolean;
};

const CreateChatModal = ({ isOpen, onClose }: CreateChatModalProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get current user
  const { data: currentUser } = userAPI.useFetchUserQuery();
  
  // Get all users for search
  const { data: usersData, isLoading: usersLoading } = userAPI.useGetUsersQuery();
  
  // Create chat room mutation
  const [createChatRoom] = chatRoomAPI.useCreateChatRoomMutation();

  // Filter users based on search term and exclude current user
  const filteredUsers = (usersData?.data?.users as unknown as UserData[])?.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isNotCurrentUser = user.userId !== currentUser?.data?.user?.userId;
    const isEnabled = user.enabled;
    
    return matchesSearch && isNotCurrentUser && isEnabled;
  }) || [];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedUser(null);
      setIsCreating(false);
    }
  }, [isOpen]);

  // Handle user selection
  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
  };

  // Handle creating chat room
  const handleCreateChat = async () => {
    if (!selectedUser || !currentUser?.data?.user) return;

    setIsCreating(true);
    try {
      const chatRoomRequest: IChatRoomRequest = {
        user1: { userId: currentUser.data.user.userId },
        user2: { userId: selectedUser.userId }
      };

      const result = await createChatRoom(chatRoomRequest).unwrap();
      // Defensive: check both chatRoomId and chatRoom existence
      const chatRoomId = result?.data?.chatRoom?.chatRoomId;
      if (chatRoomId) {
        navigate(`/chat/${chatRoomId}`);
        onClose();
      } else {
        // Optionally show error/toast if chatRoomId is missing
        console.error('Chat room creation succeeded but no chatRoomId returned:', result);
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <button
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040, background: 'none', border: 'none' }}
      />
      
      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ zIndex: 1050 }}
        aria-labelledby="createChatModalLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="createChatModalLabel">
                <i className="bi bi-chat-plus me-2"></i>
                Start New Chat
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Search Input */}
              <div className="mb-3">
                <label htmlFor="userSearch" className="form-label">
                  Search for a user to chat with:
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="userSearch"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Selected User Display */}
              {selectedUser && (
                <div className="alert alert-info">
                  <div className="d-flex align-items-center">
                    <img
                      src={selectedUser.imageUrl || 'https://via.placeholder.com/40'}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
                      <br />
                      <small className="text-muted">{selectedUser.email}</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Users List */}
              <div className="border rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {usersLoading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading users...</span>
                    </div>
                    Loading users...
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {(filteredUsers as UserData[]).map((user) => (
                      <button
                        key={user.userId}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex align-items-center p-3 ${
                          selectedUser?.userId === user.userId ? 'active' : ''
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <img
                          src={user.imageUrl || 'https://via.placeholder.com/40'}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="rounded-circle me-3"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1 text-start">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
                            <span className="badge bg-secondary">{user.role}</span>
                          </div>
                          <p className="mb-1 small text-muted">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="text-center text-muted p-4">
                    <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2 mb-0">No users found matching &quot;{searchTerm}&quot;</p>
                  </div>
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2 mb-0">Start typing to search for users</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleCreateChat}
                disabled={!selectedUser || isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Chat...
                  </>
                ) : (
                  <>
                    <i className="bi bi-chat-plus me-2"></i>
                    Start Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChatModal;
