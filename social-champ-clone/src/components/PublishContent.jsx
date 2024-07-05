import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublishContent.css';
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineShareAlt } from "react-icons/ai";
import { LuSendHorizonal } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FiCamera } from "react-icons/fi";
import { RiHashtag } from "react-icons/ri";
import { MdOutlineDrafts } from "react-icons/md";
import { GrIntegration } from "react-icons/gr";
import { FaPoll } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";
import Modal from 'react-modal';
import EmojiPicker from 'emoji-picker-react';

const PublishContent = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  const [content, setContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [firstComment, setFirstComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State to store image preview URL
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }, []);

  const clearState = () => {
    setContent('');
    setPreviewContent('');
    setFirstComment('');
    setSelectedFile(null);
    setFilePreview(null);
    setIsEmojiModalOpen(false);
  };

  const handlePublish = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('firstComment', firstComment);
      formData.append('accessToken', accessToken);
      if (selectedFile) {
        formData.append('document', selectedFile);
      }

      const response = await axios.post(`http://localhost:3001/publish?platform=${selectedPlatform.toLowerCase()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Publish response:', response.data);
      alert('Data posted successfully');
      clearState(); // Clear state after successful publish
    } catch (error) {
      console.error('Error publishing content:', error.response?.data || error.message);
      alert('Failed to publish content');
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setPreviewContent(e.target.value);
  };

  const handleFirstCommentChange = (e) => {
    setFirstComment(e.target.value);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddSocialAccount = () => {
    window.location.href = '/';
  };

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          if (width < 250 || height < 250 || width > 6000 || height > 6000) {
            alert('The image dimensions should be between 250px * 250px and 6000px * 6000px.');
            setSelectedFile(null);
            setFilePreview(null);
          } else {
            setSelectedFile(file);
            setFilePreview(reader.result);
          }
        };
        img.src = reader.result;
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file)); // Create a URL for video preview
      } else {
        setSelectedFile(file);
        setFilePreview(null); // Reset preview for non-image and non-video files
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setContent(prevContent => prevContent + emojiObject.emoji);
    setPreviewContent(prevContent => prevContent + emojiObject.emoji);
    setIsEmojiModalOpen(false);
  };

  const handleOpenEmojiModal = () => {
    setIsEmojiModalOpen(true);  
  };

  const handleCloseEmojiModal = () => {
    setIsEmojiModalOpen(false);
  };

  return (
    <div className="publish-content-container">
      <div className="publish-content-left">
        <h2>Publish Content</h2>
        <div className="platform-select-container">
          <span className="publish-to-label">Publish to</span>
          <div className="custom-dropdown">
            <div className="selected-platform" onClick={handleDropdownToggle}>
              <img src="https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg" alt="LinkedIn Avatar" />
              <span>Prakhar Khare</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <img src="https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg" alt="LinkedIn Avatar" />
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
            placeholder="Write your content here..."
          ></textarea>
          <div>
            <button className="addMore" title="Add Emojis" onClick={handleOpenEmojiModal}><HiOutlineEmojiHappy /></button>
            <button className="addMore" title="Add Media">
              <FiCamera onClick={() => document.getElementById('file-input').click()} />
            </button>
            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="addMore" title="Add HashTags"><RiHashtag /></button>
            <button className="addMore" title="Drafts"><MdOutlineDrafts /></button>
            <button className="addMore" title="Integrations"><GrIntegration /></button>
            <button className="addMore" title="Add Polls"><FaPoll /></button>
          </div>
        </div>
        <div className="platform-options">
          <h3>LinkedIn Options</h3>
          <textarea
            className="first-comment"
            value={firstComment}
            onChange={handleFirstCommentChange}
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
            {/* //<button className="upload-button">Upload Document</button> */}
            <input
              type="file"
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
            <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png" alt="LinkedIn Logo" />
          </div>
          <div className="preview-body">
            <div className="user-info">
              <img src="https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg" alt="User Avatar" />
              <div className="user-details">
                <span>Prakhar Khare</span>
                <span>Now</span><RiRadioButtonLine />
              </div>
            </div>
            <div className="preview-content">
              {previewContent}
              {firstComment && (
                <div className="comment-preview">
                  <div className="comment-user-info">
                    <img src="https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg" alt="Comment User Avatar" />
                    <div className="comment-user-details">
                      <span>Prakhar Khare</span>
                    </div>
                  </div>
                  <div className="comment-text">
                    {firstComment}
                  </div>
                </div>
              )}
              {filePreview && selectedFile && selectedFile.type.startsWith('image/') &&  (
                <div className="media-preview">
                  <img src={filePreview} alt="Selected File Preview" />
                  
                </div>
                    )}
                {filePreview && selectedFile && selectedFile.type.startsWith('video/') &&  (
                <div className="media-preview">
                  <video src={filePreview} controls className="file-preview" />
                  </div>     
            )}
            </div>
          </div>
          <div className="preview-actions">
            <BiLike /> Like
            <FaRegCommentDots /> Comment
            <AiOutlineShareAlt /> Share
            <LuSendHorizonal /> Send
          </div>
        </div>
      </div>
      <Modal
        isOpen={isEmojiModalOpen}
        onRequestClose={handleCloseEmojiModal}
        contentLabel="Emoji Picker Modal"
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Modal>
    </div>
  );
};

export default PublishContent;
