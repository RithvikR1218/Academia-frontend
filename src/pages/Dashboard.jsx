import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Step 1: Check if token is in query params (from Google callback redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
  
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/';
      return;
    }
  
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error(`Invalid token: ${err}`);
      localStorage.removeItem('token');
      window.location.href = '/';
      return;
    }
  
    axios
      .get(`${baseURL}/api/auth/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${baseURL}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
    }
  };

  if (!user) return <div>Loading or not authenticated...</div>;

  return (
    <div>
      <h2>Welcome, {user.displayName}</h2>
      <Button onClick={handleLogout} color="red">
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
