import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: (room: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<number[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    api.get('auth/users/').then(response => {
      setUserList(response.data);
    }).catch(error => console.error('Error fetching users:', error));
  }, []);

  const toggleParticipant = (userId: number) => {
    setParticipants((prev) =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    api.post('chat/rooms/', { name: groupName, room_type: 'GROUP', participants })
      .then(response => {
        onGroupCreated(response.data);
        onClose();
      })
      .catch(error => console.error('Error creating group:', error));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-2">Create Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="p-2 border mb-4 w-full rounded"
          placeholder="Group Name"
        />

        <h3 className="text-md font-semibold mb-2">Select Participants</h3>
        <div className="max-h-40 overflow-y-scroll mb-4 border rounded p-2">
          {userList.map(user => (
            <label key={user.id} className="block mb-2">
              <input
                type="checkbox"
                checked={participants.includes(user.id)}
                onChange={() => toggleParticipant(user.id)}
              />
              <span className="ml-2">{user.first_name} {user.last_name}</span>
            </label>
          ))}
        </div>

        <button onClick={handleCreateGroup} className="bg-cyan-500 text-white p-2 w-full rounded">
          Create Group
        </button>
        <button onClick={onClose} className="mt-2 text-red-500">Cancel</button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
