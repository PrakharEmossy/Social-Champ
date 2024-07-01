import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SocialAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post('http://localhost:3001/auth/linkedin', { code })
        .then(response => {
          const accessToken = response.data.accessToken;
          if (accessToken) {
            console.log('Storing access token:', accessToken);
            localStorage.setItem('linkedin_access_token', accessToken);
            navigate('/publish');
          } else {
            console.error('No access token found in response');
          }
        })
        .catch(error => {
          console.error('Error during token exchange:', error);
        });
    } else {
      console.error('Authorization code not found in URL');
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Authentication Callback</h2>
      <p>Authenticating, please wait...</p>
    </div>
  );
};

export default SocialAuthCallback;
