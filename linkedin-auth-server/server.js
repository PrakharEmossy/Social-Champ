const express = require('express');
const mongoose = require('mongoose');
const Content = require('./models/content')
const axios = require('axios');

const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from this origin
}));


app.use(express.json());
mongoose.connect('mongodb://localhost:27017/socialMedia', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


  


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

app.get('/auth/linkedin/callback',async(req,res)=>{
  const {code} = req.query;
   console.log("this is code",code);

const clientId = '78t4jtm2fhnqr5';
  const clientSecret = 'WPL_AP1.LdGCbTqPr1WIvyMk.VOO8OQ==';
  const redirectUri = 'http://localhost:3001/auth/linkedin/callback';

  try {
    // Exchange authorization code for access token
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

    // Redirect to the front-end page or send the tokens as a response
   res.redirect(`http://localhost:3000/publish?access_token=${access_token}`); // Replace '/publish' with your desired frontend route
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    res.status(500).send('Failed to get access token');
  }
});

//Save content to The DataBase

app.post('/publish', async (req, res) => {
  const { platform } = req.query;
  const { content, accessToken } = req.body;
   console.log("this is request body",req.body)
    console.log("this is request params",req.query);
 
  const newContent =  new Content({
    platform:platform,
    content,
    accessToken
  });

   console.log("this is new content",newContent);

  try {
    await newContent.save();
    res.status(200).json({ message: 'Content saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save content', error });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
