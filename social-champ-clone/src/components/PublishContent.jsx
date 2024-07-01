import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PublishContent.css';
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { AiOutlineShareAlt } from "react-icons/ai";
import { LuSendHorizonal } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";


const PublishContent = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  const [content, setContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }, []);

  const handlePublish = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('accessToken', accessToken);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post(`http://localhost:3001/publish?platform=${selectedPlatform.toLowerCase()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Publish response:', response.data);
      alert('Data posted successfully');
    } catch (error) {
      console.error('Error publishing content:', error.response?.data || error.message);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setPreviewContent(e.target.value);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddSocialAccount = () => {
    window.location.href = '/';
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  return (
    <div className="publish-content-container">
      <div className="publish-content-left">
        <h2>Publish Content</h2>
        <div className="platform-select-container">
          <span className="publish-to-label">Publish to</span>
          <div className="custom-dropdown">
            <div className="selected-platform" onClick={handleDropdownToggle}>
              <img src="/path/to/linkedin-avatar.png" alt="LinkedIn Avatar" />
              <span>Prakhar Khare</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <img src="/path/to/linkedin-avatar.png" alt="LinkedIn Avatar" />
                  <span>Prakhar Khare</span>
                </div>
                <div className="add-social-account">
                  <button onClick={handleAddSocialAccount}>Add Social Account(s) +</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='icon-section'>
        <textarea
          className="content-textarea"
          value={content}
          onChange={handleContentChange}
          placeholder=   "Write your content here..."
          style={{outline:'none',border:'none'}}
        ></textarea>
        <div>
          <button><HiOutlineEmojiHappy /></button>
        </div>
        </div>
        <div className="platform-options">
          <h3>LinkedIn Options</h3>
          <textarea
            className="first-comment"
            placeholder="First comment with the post (Optional)"
          ></textarea>
          <div className="privacy-status">
            <span>Privacy Status</span>
            <label>
              <input type="radio" name="privacy" value="Public" /> Public
            </label>
            <label>
              <input type="radio" name="privacy" value="Connections" /> Connections
            </label>
          </div>
          <div className="document-upload">
            <span>Document Upload (Carousel)</span>
            <button className="upload-button" onClick={handleUploadButtonClick}>Upload Document</button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <div className="video-title">
            <span>Video Title</span>
            <input type="text" placeholder="Enter video title" />
          </div>
        </div>
        <div className="post-timing">
          <span>When to post</span>
          <select>
            <option value="post-now">Post Now</option>
            <option value="schedule">Schedule</option>
          </select>
        </div>
        <button className="publish-button" onClick={handlePublish}>Post Now</button>
      </div>
      <div className="publish-content-right">
        <h3>Preview</h3>
        <div className="preview-container">
          <div className="preview-header">
            <img src="/path/to/linkedin-logo.png" alt="LinkedIn Logo" />
          </div>
          <div className="preview-body">
            <div className="user-info">
              <img src="/path/to/user-avatar.png" alt="User Avatar" />
              <div className="user-details">
                <span>Prakhar Khare</span>
                <span>Now</span>
              </div>
            </div>
            <div className="preview-content">
              {previewContent}
            </div>
            <div className="preview-actions">
             <BiLike /> Like
              <FaRegCommentDots /> Comment
              <AiOutlineShareAlt /> Share
              <LuSendHorizonal /> Send
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishContent;
