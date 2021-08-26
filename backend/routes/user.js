//import des modules
const express = require('express');
const router = express.Router();

//import du controller user
const userCtrl = require('../controllers/user');

//Routes pour appeler les controllers
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // Export du fichier