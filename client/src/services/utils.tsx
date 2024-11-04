import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import api from "./api";

interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  full_name?: string;
}

interface AppContextProps {
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  navigate: (path: string) => void;
  refreshToken: string | null;
  scrollToTop: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  googleLogin: (credential: any) => Promise<void>;
  user_id: string | null;
  user: User;
  searchUsers: (searchTerm: string) => Promise<User[]>;
  searchedUsers: User[];
  setUser: React.Dispatch<React.SetStateAction<User>>;
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  userRegister: (data: any) => Promise<void>;
  userLogin: (data: any) => Promise<void>;
  fetchUser: () => Promise<void>;
  createRoom: (data: any) => Promise<void>;
  
}

const appContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error("useAppContext must be used within a GOFoodsAppContext provider");
  }
  return context;
};

const WebSocketContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [ socket, setSocket ] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<User>({});
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');
  const user_id = accessToken ? jwtDecode<{ user_id: string }>(accessToken).user_id : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Google Login
  const googleLogin = async (credential: any): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post("google/javascriptOAuthCallBack/", { credentials: credential });

      if (response.status === 200) {
        const user_id: string = jwtDecode<{ user_id: string }>(response.data.access).user_id;
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setAuth(true);
        navigate(`/account/${user_id}/dashview`);
      } else {
        throw new Error("Error logging in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // User Registration
  const userRegister = async (data: any): Promise<void> => {
    try {
      const res = await api.post("auth/users/", data);
      if (res.status === 201) {
        navigate("/auth/signin");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // User Login
  const userLogin = async (data: any): Promise<void> => {
    try {
      const res = await api.post("token/", data);
      if (res.status === 200) {
        const user_id: string = jwtDecode<{ user_id: string }>(res.data.access).user_id;
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        setAuth(true);
        navigate(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch user
  const fetchUser = async (): Promise<void> => {
    if (user_id) {
      try {
        const res = await api.get(`auth/users/${user_id}/`);
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // search users
  const searchUsers = async (searchTerm: string): Promise<User[]> => {
    try {
      const res = await api.get(`auth/users/?search=${searchTerm}`);
      if (res.status === 200) {
        setSearchedUsers(res.data);
        return res.data;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  // create rooms/groups
  const createRoom = async (data: any): Promise<void> => {
    try {
      const res = await api.post("chat/rooms/", data);
      if (res.status === 201) {
        navigate(`/chat/${res.data.name}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Auth check
  useEffect(() => {
    if (accessToken) {
      setAuth(true);
      fetchUser();
    } else {
      setAuth(false);
    }
  }, [accessToken]);

  const contextValues: AppContextProps = {
    navigate, 
    socket, setSocket,
    refreshToken,
    scrollToTop,
    userRegister,
    userLogin,
    loading,
    setLoading,
    googleLogin,
    user_id,
    user, setUser, searchUsers, searchedUsers,
    auth,
    setAuth,
    fetchUser,
    createRoom
  };

  return (
    <appContext.Provider value={contextValues}>
      {children}
    </appContext.Provider>
  );
};

export default WebSocketContext;
