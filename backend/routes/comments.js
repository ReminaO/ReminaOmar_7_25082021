//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

//import du controller
const commentsCtrl = require('../controllers/comments');

//Routes pour appeler les controllers messages
router.post('/comment/:messageId/:userId', auth, commentsCtrl.createComment);
router.put('/comment/:id', auth, commentsCtrl.modifyComment)
router.delete('/comment/:id', auth, commentsCtrl.deleteComment);
router.get('/', auth, commentsCtrl.getAllComments);


module.exports = router;//Export du fichier