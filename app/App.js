import React, { useState } from 'react';
import { registerUser, loginUser, uploadFile, getFile, getPublicFile, deleteFile/*, invalidateCache*/ } from './api';
import './App.css';
import MediaPreview from './MediaPreview';

function App() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [file, setFile] = useState(null);
const [key, setKey] = useState('');
const [token, setToken] = useState('');
const [message, setMessage] = useState('');
const [retrievedFile, setRetrievedFile] = useState(null);
// const [pattern, setPattern] = useState('');
const [userId, setUserId] = useState('');
const [contentFolder, setContentFolder] = useState('');

const handleRegister = async () => {
    try {
        await registerUser(username, password);
        setMessage("User registered");
    } catch(error)
    {
        setMessage(error.message)
    }
}
  const handleLogin = async () => {
    try {
        const token = await loginUser(username, password);
      setToken(token);
      setMessage("Logged in!");
    } catch (error) {
        setMessage(error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  // const handlePatternChange = (e) => {
  //   setPattern(e.target.value);
  // };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    };
    
    const handleContentFolderChange = (e) => {
    setContentFolder(e.target.value);
    };

  const handleUpload = async () => {
    if (!file || !key || !userId || !contentFolder) {
    setMessage('Please select a file, enter a key, a userId, and a content folder');
    return;
    }
    try {
    await uploadFile(key, file, token, userId, contentFolder);
    setMessage('File uploaded successfully.');
    } catch (error) {
    setMessage('Error uploading file: ' + error.message);
    }
    };

  const handleGetFile = async () => {
    if (!key || !userId || !contentFolder) {
    setMessage('Please enter a key, a userId, and a content folder to retrieve a file.');
    return;
    }
    try {
    const response = await getFile(key, token, userId, contentFolder);
    const fileUrl = URL.createObjectURL(response.data);
    setRetrievedFile(fileUrl);
    setMessage('File retrieved successfully.');
    } catch (error) {
    setMessage('Error getting file: ' + error.message);
    }
    };

    const handleGetPublicFile = async () => {
      if (!key || !userId || !contentFolder) {
      setMessage('Please enter a key, a userId, and a content folder to retrieve a file.');
      return;
      }
      try {
      const response = await getPublicFile(key, token, userId, contentFolder);
      const fileUrl = URL.createObjectURL(response.data);
      setRetrievedFile(fileUrl);
      setMessage('File retrieved successfully.');
      } catch (error) {
      setMessage('Error getting file: ' + error.message);
      }
    };

  const handleDeleteFile = async () => {
    if (!key || !userId || !contentFolder)
    {
    setMessage("Please enter a key, a userId, and a content folder to delete the file");
    return;
    }
    try {
    await deleteFile(key, token, userId, contentFolder);
    setRetrievedFile(null);
    setMessage('File deleted successfully.');
    } catch (error) {
    setMessage('Error deleting file: ' + error.message);
    }
    };

  //   const handleInvalidateCache = async () => {
  //     if (!pattern || !userId || !contentFolder) {
  //       setMessage('Please enter a pattern, a userId, and a content folder to invalidate the cache.');
  //         return;
  //     }
  //     try
  //     {
  //          await invalidateCache(pattern, token, userId, contentFolder);
  //       setMessage('Cache invalidation successful');
  //     } catch (error)
  //     {
  //          setMessage('Error invalidating cache: ' + error.message);
  //     }
  // }

  return (
    <div className="container">
    <div className='auth-container'>
    <h2>Authentication</h2>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    {/* <button onClick={handleRegister}>Register</button> */}
    <button onClick={handleLogin}>Login</button>
    </div>
    <div className='file-container'>
    <h2>File Operations</h2>
    <input type="text" placeholder="User Id" value={userId} onChange={handleUserIdChange}/>
    <input type="text" placeholder="Content Folder" value={contentFolder} onChange={handleContentFolderChange}/>
    <input type="text" placeholder="File key" value={key} onChange={handleKeyChange} />
    <input type="file" onChange={handleFileChange} />
    <button onClick={handleUpload} >Upload</button>
    <button onClick={handleGetFile}>Get File</button>
    <button onClick={handleGetPublicFile}>Get Public File</button>
    <button onClick={handleDeleteFile}>Delete File</button>
    <MediaPreview retrievedFile={retrievedFile} fileKey={key}/>
    </div>
    

    {/* <div className='cache-container'>
    <h2>Cache Invalidation</h2>
    <input type="text" placeholder="Pattern" value={pattern} onChange={handlePatternChange} />
    <button onClick={handleInvalidateCache}>Invalidate Cache</button>
    </div> */}
    {message && <p>{message}</p>}
    </div>
    );
    
}
export default App;