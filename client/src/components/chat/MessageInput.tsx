import React, { useState } from 'react';
import { useAppContext } from '../../services/utils';

interface MessageInputProps {
  selectedRoom: {
    room_id?: string
  };
}

const MessageInput: React.FC<MessageInputProps> = ({ selectedRoom }) => {
  const { user_id, socket, user } = useAppContext();
  const [message, setMessage] = useState('');

  // Send message through WebSocket
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === '') return;

    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        message: message,
        room: selectedRoom.room_id,
        sender: {
          id: user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      };

      socket.send(JSON.stringify(messageData));

      setMessage('');
    }
  };

  return (
    <div className="flex">
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
