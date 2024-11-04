import React, { useState } from 'react';
import { useAppContext } from '../../services/utils';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserSearchProps {
  onUserSelect: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({onUserSelect}) => {
  const { searchUsers, searchedUsers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      try {
        searchUsers(term);
      } catch (error) {
        console.error('Search Error:', error);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for users"
        value={searchTerm}
        onChange={handleSearchChange} 
        className="border p-2"
      />
      <ul>
        {searchedUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              if (user.id) {
                onUserSelect(user as User);
              }
            }}
            className="cursor-pointer bg-cyan-200 hover:bg-cyan-300 p-2"
          >
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
