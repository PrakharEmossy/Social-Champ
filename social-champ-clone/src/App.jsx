import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PublishPage from './pages/PublishPage';
import SocialAuthCallback from './components/SocialAuthCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
         <Route path="/publish" element={<PublishPage/>} />
        <Route path="/auth/linkedin/callback" element={<SocialAuthCallback/>} /> 
      </Routes>
    </Router>
  );
};

export default App;
