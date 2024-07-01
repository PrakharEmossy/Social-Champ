import React from 'react';
import './AddSocialAccount.css'; // Make sure to create and import the CSS file

const AddSocialAccount = () => {
  const socialPlatforms = {
    LinkedIn: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      params: {
        response_type: 'code',
        client_id: '78t4jtm2fhnqr5',
        redirect_uri: 'http://localhost:3001/auth/linkedin/callback',
        scope: 'email,profile'
      }
    },
    Facebook: {
      url: 'https://www.facebook.com/v10.0/dialog/oauth',
      params: {
        client_id: 'YOUR_FACEBOOK_CLIENT_ID',
        redirect_uri: 'YOUR_FACEBOOK_CALLBACK_URL',
        response_type: 'code',
        scope: 'email,public_profile'
      }
    },
    Instagram: {
      url: 'https://api.instagram.com/oauth/authorize',
      params: {
        client_id: 'YOUR_INSTAGRAM_CLIENT_ID',
        redirect_uri: 'YOUR_INSTAGRAM_CALLBACK_URL',
        response_type: 'code',
        scope: 'user_profile,user_media'
      }
    }
    // Add more platforms here
  };

  const handleConnect = (platform) => {
    const { url, params } = socialPlatforms[platform];
    const queryString = new URLSearchParams(params).toString();
    window.location.href = `${url}?${queryString}`;
  };

  return (
    <div className="add-social-account-container">
      <div className="header">
        <h2>Add Social Account</h2>
        
      </div>
      
      <div className="social-platforms">
        {Object.keys(socialPlatforms).map((platform) => (
          <div key={platform} className="platform-card" onClick={() => handleConnect(platform)}>
            <div className="platform-icon">
              <img src={`/${platform.toLowerCase()}.png`} alt={`${platform} icon`} />
            </div>
            <p className="platform-name">{platform} Profile</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddSocialAccount;
