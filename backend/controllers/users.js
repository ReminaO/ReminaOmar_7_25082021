const bcrypt = require('bcrypt'); // import Bcrypt module
const User = require('../models/user'); // import modèle user
const jwt = require('jsonwebtoken'); // import jsonwebtoken module
const CryptoJS = require("crypto-js"); // import crypto tool

// Controllers pour créer un compte
exports.signup = (req, res, next) => {
    //Hachage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
    const user = new User({
        email: CryptoJS.SHA256(req.body.email), //cryptage de l'adresse mail avec la fonction crypto
        username: req.body.username,
        password: hash,
        bio: req.body.bio,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        isAdmin: 0
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
        .catch(error => res.status(500).json({ error }));
};

// Controllers pour se connecter au site
exports.login = (req, res, next) => {
    User.findOne({ email: CryptoJS.SHA256(req.body.email).toString() }) // appel de l'adresse mail crypté et conversion de l'objet en string
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // comparaison du mot de passe enregistré avec le mot de passe saisi
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' },
                        )
                    })
                    .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        });
}

// Controllers pour afficher le profil grâce a l'ID

exports.getOneProfile = (req, res, next) => {
    User.findOne({ id: req.params.id })
        .then(message => res.status(200).json(message))
        .catch(error => res.status(404).json({ error }));
};

// Controllers pour modifier une message
exports.modifyProfile = (req, res, next) => {
    const userObject = req.file ?
    {
      ...JSON.parse(req.body.user),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    
    // Met a jour la base de données avec les nouveaux éléments 
      User.updateOne({ id: req.params.id }, { ...userObject, id: req.params.id })
          .then(() => res.status(200).json({ message: 'Profile modifiée !' }))
          .catch(error => res.status(400).json({ error }));
};
  
// Controllers por effacer un profil grâce a l'ID
exports.deleteMessages = (req, res, next) => {
    User.findOne({ id: req.params.id })
      .then(user => {
        const filename = user.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          user.destroy()
          .then(() => res.status(200).json({ message: 'message supprimée !' }))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
      
  };
  