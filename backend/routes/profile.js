//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

// Middleware pour l'enregistrement des images
const multer = require('../middleware/multer-config');

//import du controller
const profileCtrl = require('../controllers/profile');

//Routes pour appeler le controller profile
router.get('/:id', auth, profileCtrl.getOneProfile);
router.put('/:id', auth, multer, messagesCtrl.modifyProfile)

module.exports = router;//Export du fichier