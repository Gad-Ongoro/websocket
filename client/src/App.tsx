import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import './App.css';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/chat/*" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
