 const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Content = require('./models/content');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from this origin
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

mongoose.connect('mongodb://localhost:27017/socialMedia', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.get('/auth', async (req, res) => {
  try {
    const params = {
      response_type: 'code',
      client_id: '78t4jtm2fhnqr5',
      redirect_uri: 'http://localhost:3001/auth/linkedin/callback',
      scope: 'email profile'
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `https://www.linkedin.com/oauth/v2/authorization?${queryString}`;
    console.log(url);

    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  console.log("this is code", code);

  const clientId = '78t4jtm2fhnqr5';
  const clientSecret = 'WPL_AP1.LdGCbTqPr1WIvyMk.VOO8OQ==';
  const redirectUri = 'http://localhost:3001/auth/linkedin/callback';

  try {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token } = response.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    res.redirect(`http://localhost:3000/publish?access_token=${access_token}`); // Replace '/publish' with your desired frontend route
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    res.status(500).send('Failed to get access token');
  }
});

// Save content to the database
app.post('/publish', upload.single('document'), async (req, res) => {
  const { platform, content, accessToken } = req.body;
  const file = req.file; // Multer saves file information to req.file

  if (!content || !accessToken) {
    return res.status(400).json({ message: 'Content and access token are required' });
  }

  const newContent = new Content({
    platform: platform,
    content: content,
    accessToken: accessToken,
    document: file ? file.path : null, // Save the file path to the 'document' field
  });

  try {
   const savedata = await newContent.save();
    res.status(200).json({ message: 'Content saved successfully' });
    console.log("savedata",savedata);
  }
  
  catch (error) {
    res.status(500).json({ message: 'Failed to save content', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});