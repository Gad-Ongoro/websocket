import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';
import UserSearch from '../components/chat/UserSearch';
import CreateGroupModal from '../components/chat/CreateGroupModal';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAppContext } from '../services/utils';

interface Room {
  name: string;
  room_type: 'DM' | 'GROUP';
  // participants: string[];
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

const ChatPage: React.FC = () => {
  const { user_id, user, createRoom } = useAppContext();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const  [ selectedUserId, setSelectedUserId ] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);

  const handleUserSelect = (otherUser: User) => {
    const roomName = `${user.first_name}_${otherUser.first_name}`;
    const room: {name: string, room_type: 'DM', participants: string[]} = { name: roomName, room_type: 'DM',  participants: [user_id as string, otherUser.id] };
    createRoom(room);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <aside className="w-1/4 bg-gray-100 p-4">
          <UserSearch onUserSelect={handleUserSelect} />
          <ChatRoomList
            onSelectRoom={(room) => setSelectedRoom(room)}
            onCreateGroup={() => setIsCreatingGroup(true)}
            setSelectedUserId={setSelectedUserId}
          />
        </aside>

        <Routes>
          {
            selectedRoom && (
              <Route
                path={`/${selectedRoom.name}`}
                element={
                  <ChatRoom 
                    selectedRoom={selectedRoom} 
                    selectedUserId={selectedUserId} 
                  />
                }
              />
            )
          }
        </Routes>

        {isCreatingGroup && (
          <CreateGroupModal
            onClose={() => setIsCreatingGroup(false)}
            onGroupCreated={(newRoom) => setSelectedRoom(newRoom)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
