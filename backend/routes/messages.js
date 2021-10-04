//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

// Middleware pour l'enregistrement des images
const multer = require('../middleware/multer-config');

//import du controller
const messagesCtrl = require('../controllers/messages');

//Routes pour appeler les controllers messages
router.post('/post/:id', auth, multer, messagesCtrl.createMessages);
router.put('/post/:id/:userId', auth, multer, messagesCtrl.modifyMessages)
router.delete('/post/:id/:userId', auth, messagesCtrl.deleteMessages);
router.get('/', auth, messagesCtrl.getAllMessages);



module.exports = router;//Export du fichier