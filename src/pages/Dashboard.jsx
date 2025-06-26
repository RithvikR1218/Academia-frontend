import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FileInput } from '@mantine/core';
import UploadedFilesList from '../components/UploadedFiles';
import UserProfTable from '../components/UserProfTable';

const baseURL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

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

  const handleUpload = async () => {
    if(!file){
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseURL}/api/auth/files/create`, {
        method: 'POST',
        body: formData,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(response.status);
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('File uploaded successfully:', data.url);
      alert('Upload success!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error uploading file.');
    }
    finally {
      setUploading(false);
      setFile(null); 
      setRefresh(prev => !prev);
    }
  };


  if (!user) return <div>Loading or not authenticated...</div>;

  return (
    <div>
      <h2>Welcome, {user.displayName}</h2>
      <Button onClick={handleLogout} color="red">
        Logout
      </Button>

      <FileInput 
        accept="application/pdf" 
        label="Upload files" 
        placeholder="Upload files" 
        value={file}
        onChange={setFile} 
      />
      <Button 
        onClick={handleUpload} 
        color="blue" 
        disabled={uploading || !file}
        loading={uploading}
      >
        Upload
      </Button>
      <h2>Uploaded Files</h2>
      <UploadedFilesList uploadedFiles={user.uploadedFiles} />
      <h2>My Professors</h2>
      <UserProfTable userId={user._id}/>
    </div>
  );
}

export default Dashboard;