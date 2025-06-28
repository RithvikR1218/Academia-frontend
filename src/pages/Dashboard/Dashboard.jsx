import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FileInput } from '@mantine/core';
import UploadedFilesList from '../../components/UploadedFiles/UploadedFiles';
import SummaryFilesList from '../../components/SummaryFiles/SummaryFiles';
import UserProfTable from '../../components/UserProfTable/UserProfTable';
import { notifications } from '@mantine/notifications';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('email'); 
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
  
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/dashboard');
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/login')
      return;
    }
  
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error(`Invalid token: ${err}`);
      localStorage.removeItem('token');
      navigate('/')
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
        navigate('/')
      });
  }, [refresh, navigate]);

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
      navigate('/login')
    }
  };

  const handleUpload = async () => {
    if(!file){
      notifications.show({
        title: 'Error!',
        message: 'Please select a file to upload.',
        color: 'red',
      });
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
      notifications.show({
        title: 'Success!',
        message: 'File Uploaded Successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Upload failed:', error);
      notifications.show({
        title: 'Error!',
        message: 'File Upload Failed',
        color: 'red',
      });
    }
    finally {
      setUploading(false);
      setFile(null); 
      setRefresh(prev => !prev);
    }
  };

  if (!user) return <div></div>;


  return (
    <div className='dashboard-container'>
      <div className="gradient-blob-top"></div>
      <div className="gradient-blob-bottom"></div>
      <div className="gradient-blob-footer"></div>
      <div className='welcome-container'>
        <h2>Welcome, {user.displayName}</h2>
        <button onClick={handleLogout} className='logout-button' >
          <i class="fas fa-sign-out"></i>&nbsp;
          Logout
        </button>
      </div>    
      <div className="dash-flex">
        <div className='dash-upload'>
            <h2>Uploaded Files</h2>
            <UploadedFilesList uploadedFiles={user.uploadedFiles} />
            <div className='upload-container'>
                <FileInput 
                accept="application/pdf" 
                placeholder="Add File" 
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
            </div>  
        </div>
        <div className="dash-summary">
            <h2>Summary Files</h2>
            <SummaryFilesList uploadedFiles={user.uploadedFiles} />
        </div>
      </div>
      <h2 className="heading-title">My Professors</h2>
      <UserProfTable userId={user._id}/>
    </div>
  );
}

export default Dashboard;