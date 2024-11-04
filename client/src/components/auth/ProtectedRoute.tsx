import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import { useState, useEffect } from "react";

interface DecodedToken {
  exp: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }
    try {
      const res = await api.post("token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode<DecodedToken>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className='flex gap-x-6 justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
