//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

//import du controller user
const userCtrl = require('../controllers/users');

// Middleware pour l'enregistrement des images
const multer = require('../middleware/multer-config');

//Routes pour appeler les controllers user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id/profile', auth, userCtrl.getOneProfile);
router.put('/:id/profile', auth, multer, userCtrl.modifyProfile)

module.exports = router; // Export du fichier