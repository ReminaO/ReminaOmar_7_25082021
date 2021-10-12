//Import des modules
const asyncLib = require('async');
//import des modèles
const models = require('../models/');



//Paramètres
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 2;
const ITEMS_LIMIT = 50;

// Controllers pour créer un message
exports.createMessages = (req, res, next) => {
  

  // Paramètres
  const title   = req.body.title;
  const content = req.body.content;
  const userId =  req.params.id;

  //Vérification d'un fichier existant ou laisse le lien vide
  const attachement = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

  if (title == null || content == null) {
    return res.status(400).json({ 'error': 'champs manquant' });
  }

  if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
    return res.status(400).json({ 'error': 'champs invalide' });
  }

  asyncLib.waterfall([

    // 1. recherche de l'utilisateur
    function (done) {
      models.User.findOne({
        where: { id: userId }
      })
        .then(function (userFound) {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
        });
    },
      
    // 2. Une fois trouvé crée le poste avec l'input
    function (userFound, done) {
      if (userFound) {
        models.Message.create({
          title: title,
          content: content,
          attachement: attachement,
          UserId: userFound.id,
          likes: 0,
          userName: userFound.username,
        })
          .then(function (newPost) {
            done(newPost);
          });
      } else {
        res.status(404).json({ 'error': 'Utilisateur introuvable' });
      }
    },
    // 3. Confirmation une fois fait
  ],
    function (newPost) {
    if (newPost) {
      return res.status(201).json(newPost);
    } else {
      return res.status(500).json({ 'error': 'Le message ne peut être publié' });
    }
  })
};
  // Controllers por effacer un message grâce a l'ID
exports.deleteMessages = (req, res, next) => {

  const userId = req.params.userId;
  
    asyncLib.waterfall([

      // Vérification que la requête est envoye d'un compte existant
      function (done) {
        models.User.findOne({
          where: { id: userId }
        }).then(function (userFound) {
          done(null, userFound);
        })
          .catch(function (err) {
            return res.status(500).json({ 'error': 'Utilisateur inexistant' });
          });
      },

      // Affichage du message ciblé
      function (userFound, done) {
        models.Message.findOne({
          where: { id: req.params.id }
        })
          .then(function (postFound) {
            done(null, userFound, postFound);
          })
          .catch(function (err) {
            return res.status(500).json({ 'error': 'Message non trouvé' });
          });
      },

      function (userFound, postFound) {

        // Checks if the user is the owner of the targeted one
        if (userFound.id == postFound.UserId || userFound.isAdmin == true) { // or if he's admin

          // Soft-deletion modifying the post and add a timestamp to deletedAt
          models.Message.destroy({
            where: { id: req.params.id }
          })
            .then(() => res.status(200).json({ message: 'Post supprimé !' }))
            .catch(error => res.status(400).json({ message: "Post introuvable", error: error }))

        } else {
          res.status(401).json({ 'error': 'utilisateur non autorisé' });
        }
      },
    ],

      function (userFound) {
        if (userFound) {
          return res.status(201).json({ 'message': 'post effacé' });
        } else {
          return res.status(500).json({ 'error': 'Impossible d\'effacer le post' });
        }
      })
    
  };

  // Controllers pour afficher toutes les messages
  exports.getAllMessages = (req, res, next) => {
    const fields = req.query.fields; // DB table fields to load
    const limit = parseInt(req.query.limit); // Limits the number..
    const offset = parseInt(req.query.offset); // ..of posts loaded
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    asyncLib.waterfall([

      // 2. Affiche les post par username
      function (done) {
        models.Message.findAll({
          // Test des input de l'utilisateur
          order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          include: [{ // Relie le message avec les tables User and Comments  
            model: models.User,
            model: models.Comment,
            // required: true,
          }
           ]
        }).then(function (posts) {
          done(posts)
        }).catch(function (err) {
          console.log(err);
          res.status(500).json({ "error": "Champs invalide" });
        });
      },
      // 3. Confirmation, une fois vérifié
    ],
      function (posts) {
        if (posts) {
          return res.status(201).json(posts);
        } else {
          return res.status(500).json({ 'error': 'Le message ne peut être posté' });
        }
      })
  }

