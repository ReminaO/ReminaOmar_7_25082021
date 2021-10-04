//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

//import du controller
const commentsCtrl = require('../controllers/comments');

//Routes pour appeler les controllers comment
router.post('/comment/:messageId/:userId', auth, commentsCtrl.createComment);
router.delete('/comment/:messageId/:userId', auth, commentsCtrl.deleteComment);
router.get('/', auth, commentsCtrl.getAllComments);


module.exports = router;//Export du fichier