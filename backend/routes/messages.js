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
router.post('/post', auth, multer, messagesCtrl.createMessages);
router.put('/:id/post', auth, multer, messagesCtrl.modifyMessages)
router.delete('/:id/post', auth, messagesCtrl.deleteMessages);
router.get('/', auth, messagesCtrl.getAllMessages);



module.exports = router;//Export du fichier