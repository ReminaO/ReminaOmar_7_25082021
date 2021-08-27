//import des modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//import des routes
const messagesRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

const app = express();

//Mise en place des headers pour autoriser la communication entre nos deux serveurs front et back
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//Définition du chemin contenant les images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Définition du chemin des routes
app.use('/api/messages', messagesRoutes);
app.use('/api/users', userRoutes);


module.exports = app;