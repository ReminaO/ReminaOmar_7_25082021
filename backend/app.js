const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const profileRoutes = require('./routes/profile')
const messagesRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());
  
app.use('/images', express.static(path.join(__dirname, 'images')));

//Définition du chemin des routes
app.use('/api/messages', messagesRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app;