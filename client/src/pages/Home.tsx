import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-50">
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-cyan-800 text-3xl font-semibold mb-4">Welcome to GOChat!</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Connect with friends, start group chats, and enjoy real-time messaging.
        </p>
        <div className="flex space-x-4">
          <Link to="/chat" className="bg-cyan-600 text-white py-2 px-4 rounded shadow hover:bg-cyan-700 transition">
            Go to Chats
          </Link>
          <Link to="/chat" className="bg-cyan-600 text-white py-2 px-4 rounded shadow hover:bg-cyan-700 transition">
            Start a New Chat
          </Link>
        </div>
      </main>
      <footer className="w-full bg-cyan-600 p-4 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Chat App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
