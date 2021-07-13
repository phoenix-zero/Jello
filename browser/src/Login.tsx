import axios from 'axios';
import { FC, useEffect, useState } from 'react';

const Login: FC = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        withCredentials: true,
      })
      .then(res => {
        setUser(res.data);
      });
  }, []);

  return (
    <button
      onClick={() => {
        window.location.assign(`${import.meta.env.VITE_API_URL}/auth/`);
      }}>
      {user ? `Hi, ${JSON.stringify(user)}` : 'Login'}
    </button>
  );
};

export default Login;
