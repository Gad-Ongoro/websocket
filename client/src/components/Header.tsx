import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../services/utils';

const Header: React.FC = () => {
  const { auth, user, navigate } = useAppContext();
  // console.log(user);
  return (
    <header className="bg-cyan-600 p-4 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-white text-2xl font-bold">Chat & Vote App</NavLink>
        <nav>
          <ul className="flex space-x-4">
            {
              auth && (
                <li>
                  <p className="text-white">Welcome, {user.first_name} {user.last_name}</p>
                </li>
              )
            }
            <li>
              {
                !auth && (
                  <Link
                    to="/auth/signup"
                    className="text-white hover:text-blue-300 transition duration-200"
                  >
                    Sign Up
                  </Link>
                )
              }
            </li>
            <li>
              {
                !auth && (
                  <Link
                    to="/auth/signin"
                    className="text-white hover:text-blue-300 transition duration-200"
                  >
                    Sign In
                  </Link>
                )
              }
            </li>
            {
              auth && (
                <button
                  type='button'
                  onClick={
                    () => {
                      localStorage.clear();
                      navigate('/auth/signin');
                    }
                  }
                  className="text-white hover:text-blue-300 transition duration-200"
                >
                  Logout
                </button>
              )
            }
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
