//import des modules
const express = require('express');
const router = express.Router();

// Middleware pour l'autentification
const auth = require('../middleware/auth');

//import du controller
const likesCtrl = require('../controllers/likes');


router.post('/:id/like', auth, likesCtrl.likeMessage);
router.post('/:id/dislike', auth, likesCtrl.dislikeMessage);

module.exports = router;