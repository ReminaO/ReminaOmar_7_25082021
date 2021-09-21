//import des modèles
const models = require('../models/');
const asyncLib = require('async');

// Controllers pour créer un commenataire
exports.createComment = (req, res, next) => {
     // Paramètre
     const userId = req.body.userId;

     if (content == null) {
         return res.status(400).json({ 'error': 'missing body' });
     }
 
     asyncLib.waterfall([
 
         // 1. recherche l'utilsateur
         function(done) {
             models.User.findOne({
                     where: { id: userId }
                 })
                 .then(function(userFound) {
                     done(null, userFound);
                 })
                 .catch(function(err) {
                     return res.status(500).json({ 'error': 'Utilisateur introuvable' });
                 });
         },
 
         // 2. si trouvé créé le commentaire
         function(userFound, done) {
             if (userFound) {
                 // Créé le post et l'enregistre dans la BD
                 models.Comment.create({
                         content: req.body.content,
                         UserId: userFound.id,
                         messageId: req.params.id,
                     })
                     .then(function(newComment) {
                         done(newComment)
                     })
                     .catch(() => res.status(400).json({ message: "erreur commentaire controller" }));
             } else {
                 res.status(404).json({ 'error': 'user not found' });
             }
         },
 
         // 3. Confiramtion une fois le commenatire créé
     ], function(newComment) {
         if (newComment) {
             return res.status(201).json(newComment);
         } else {
             return res.status(500).json({ 'error': 'le commentaire ne peut être envoyé' });
         }
     })
};
  
// Controllers pour effacer un commentaire grâce a l'ID
exports.deleteComment = (req, res, next) => {
const userId = req.body.userId;

  asyncLib.waterfall([

    // Vérifie que l'utilisateur soit existant
    function(done) {
        models.User.findOne({
                where: { id: userId }
            }).then(function(userFound) {
                done(null, userFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Utilisateur inexistant' });
            });
    },

    // appel du commentaire concerné
    function(userFound, done) {
        models.Comment.findOne({
                where: { id: req.params.id }
            })
            .then(function(commentFound) {
                done(null, userFound, commentFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'commentaire non trouvé' });
            });
    },

    function(userFound, commentFound, done) {

        // Checks if the user is the owner of the targeted one
        if (userFound.id == commentFound.userId || userFound.isAdmin == true) { // or if he's admin

            // Soft-deletion modifying the post the ad a timestamp to deletedAt
            models.Comment.destroy({
                    where: { id: req.params.id }
                })
                .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                .catch(error => res.status(400).json({ error }));

        } else {
            res.status(401).json({ 'error': 'utilisateur non autorisé' });
        }
    },
],

  function(userFound) {
      if (userFound) {
          return res.status(201).json({ 'message': 'commentaire effacé' });
      } else {
          return res.status(500).json({ 'error': 'le commentaire ne peut être effacé' });
      }
  });
};
  
  // Controllers pour afficher toutes les commentaires
  exports.getAllComments = (req, res, next) => {
    models.Comment.findAll({
      include: [{ // relie le poste et l'utilisateur
          model: User,
          attributes: ['username', 'imageUrl', 'isAdmin']
      }]
  })
  .then((comment => res.status(200).json(comment)))
  .catch(() => res.status(400).json({ error: "Erreur lors de l'affichage des commentaires" }));
},

  
// Controllers pour modifier un commentaire
  exports.modifyComment = (req, res, next) => {
      
      const userId = req.body.userId;
      
  asyncLib.waterfall([

    // Checks if the request is sent from an registered user
    function(done) {
        User.findOne({
                where: { id: userId }
            }).then(function(userFound) {
                done(null, userFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'utilisateur inexistant' });
            });
    },

    // Get the targeted comment infos
    function(userFound, done) {
        models.Comment.findOne({
                where: { id: req.params.id }
            })
            .then(function(commentFound) {
                done(null, userFound, commentFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Commentaire non trouvé' });
            });
    },

    function(userFound, commentFound, done) {

        // Checks if the user is the owner of the targeted one
        if (userFound.id == commentFound.userId || userFound.isAdmin == true) { // or if he's admin

            // Soft-deletion modifying the post the ad a timestamp to deletedAt
            models.Comment.updateOne({
              where: { id: req.params.id },
              content: req.body.content,
                })
                .then(() => res.status(200).json({ message: 'Comment supprimé !' }))
                .catch(error => res.status(400).json({ error }));

        } else {
            res.status(401).json({ 'error': 'utilisateur non autorisé' });
        }
    },
],

function(userFound) {
    if (userFound) {
        return res.status(201).json({ 'message': 'commentaire modifié' });
    } else {
        return res.status(500).json({ 'error': 'commentaire ne peut être modifié' });
    }
});
  };