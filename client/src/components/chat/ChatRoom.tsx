import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import MessageInput from './MessageInput';
import { useAppContext } from '../../services/utils';

interface Message {
  id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  message: string;
  timestamp: string;
  edited: boolean;
}

interface ChatRoomProps {
  selectedUserId: string | null;
  selectedRoom: { 
    room_id?: string,
    name?: string,
    room_type?: 'DM' | 'GROUP',
  };
}

const ChatRoom: React.FC<ChatRoomProps> = ({ selectedRoom, selectedUserId }) => {
  const { user, user_id, socket, setSocket } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // websocket connection
  useEffect(() => {
    // baseUrl/chat/<str:room_type>/<str:room_name>/
    const ws = new WebSocket(`${process.env.REACT_APP_WS_API_URL}chat/${selectedRoom.room_type}/${selectedRoom.name}/?user_id=${user_id}`);
    setSocket(ws);

    // fetch initial messages from the API
    api.get(`chat/rooms/${selectedRoom.room_id}/messages/view/`)
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // incoming WebSocket messages
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      if (newMessage.sender) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.error("Error: WebSocket message lacks user information.");
      }
    };

    // clean up on unmount
    return () => {
      ws.close();
    };
  }, [selectedRoom.room_id, user_id, setSocket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`p-2 rounded shadow max-w-xs ${
                msg.sender.id === user.id ? 'bg-emerald-400 text-gray-900 text-right' : 'bg-gray-400 text-gray-900 text-left'
              }`}
            >
              <small>{`${msg.sender.first_name} ${msg.sender.last_name}`}</small>
              <p>{msg.message}</p>
              <small className="text-gray-600 text-xs">
                {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput selectedRoom={selectedRoom}/>
    </div>
  );
};

export default ChatRoom;
