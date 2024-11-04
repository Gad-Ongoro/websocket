import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../services/utils';
import api from '../../services/api';

interface Participant {
  id: string;
  name: string;
}

interface Room {
  room_id: string;
  name: string;
  room_type: 'DM' | 'GROUP';
  participants: Participant[];
}

interface ChatRoomListProps {
  onSelectRoom: (room: Room) => void;
  onCreateGroup: () => void;
  setSelectedUserId: (userId: string | null) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onSelectRoom, onCreateGroup, setSelectedUserId }) => {
  const { user } = useAppContext();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    api.get('chat/rooms/list/')
      .then(response => 
        { 
          setRooms(response.data); 
        }
      )
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  return (
    <div className="p-4 bg-gray-100 h-full">
      <h2 className="text-lg font-semibold mb-2">Chat Rooms</h2>
      <button
        onClick={onCreateGroup}
        className="mb-4 bg-cyan-500 text-white p-2 rounded-md w-full"
      >
        Create Group
      </button>

      {rooms.map((room) => (
        <div
          key={room.room_id}
          onClick={() => onSelectRoom(room)}
          className="cursor-pointer p-3 bg-cyan-100 mb-2 rounded shadow-sm hover:bg-gray-200"
        >
          {
            room.room_type === 'DM' ? 
              <NavLink to={`/chat/${room.name}`} onClick={() => setSelectedUserId(room.participants[1].id)}>DM: {room.participants[0].name} and {room.participants[1].name}</NavLink>
              : 
              <NavLink to={`/chat/${room.name}`}>Group: {room.name}</NavLink>
          }
        </div>
      ))}

    </div>
  );
};

export default ChatRoomList;
