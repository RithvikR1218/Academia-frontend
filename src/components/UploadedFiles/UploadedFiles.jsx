import React from 'react';
import { useState } from 'react';
import { List, Text, Loader, Modal, Button } from '@mantine/core';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import './UploadedFiles.css';
import SummariseBox from '../SummariseBox/SummariseBox';
const baseURL = import.meta.env.VITE_BACKEND_URL;

const UploadedFilesList = ({ uploadedFiles }) => {
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDelete = async (filename) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try{
      const response = await axios.delete(`${baseURL}/api/auth/files/delete/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      window.location.reload();
    }
    catch (err) {
      console.error('Failed to delete:', err);
      notifications.show({
        title: 'Error!',
        message: 'File Deletion Failed',
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  };

  const handleSummarise = (filename) => {
    setShowSummary(true);
    setSelectedFile(filename);
    console.log('Summarising ',filename);
  };
  const handleFileClick = async (filename) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try{
      const response = await axios.get(`${baseURL}/api/auth/files/get-one/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      const { url } = response.data;
      setFile(url);
      setOpened(true);
    }
    catch (err) {
      console.error('Failed to fetch file URL:', err);
      notifications.show({
        title: 'Error!',
        message: 'Unable to fetch file URL',
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  };

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return <Text>No uploaded files.</Text>;
  }

  return (
    <>
    <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    title="Preview File"
    size="xl"
    centered
    >
    {loading ? (
        <Loader />
    ) : (
        <iframe
        src={file}
        width="100%"
        height="600px"
        title="File Preview"
        style={{ border: 'none' }}
        />
    )}
    </Modal>


    <div className='list-container'>
    <List spacing="xs" size="sm" center>
      {uploadedFiles.map((file, index) => (
        <List.Item key={index} className='list-item'>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleFileClick(file);
            }}
            className="list-link"
          >
            {file}
          </a>
          <button
            className="delete-button"
            onClick={() => handleDelete(file)}
          >
          <i className="fas fa-trash-alt"></i>&nbsp;
            Delete
          </button>
          <button
            className="summarise-button"
            onClick={() => handleSummarise(file)}
          >
          <i className="fa-solid fa-file"></i>&nbsp;
            Summarise
          </button>
        </List.Item>
      ))}
    </List>
    </div>
    {showSummary && (
  <SummariseBox
    fileName={selectedFile}
    onClose={() => {
      setShowSummary(false);
      setSelectedFile(null);
    }}
  />
  )}
    </>
  );
};

export default UploadedFilesList;
