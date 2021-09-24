//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

//import du controller
const commentsCtrl = require('../controllers/comments');

//Routes pour appeler les controllers messages
router.post('/post/:id', auth, commentsCtrl.createComment);
router.put('/:id', auth, commentsCtrl.modifyComment)
router.delete('/:id/', auth, commentsCtrl.deleteComment);
router.get('/', auth, commentsCtrl.getAllComments);


module.exports = router;//Export du fichier