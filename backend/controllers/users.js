const bcrypt = require('bcrypt'); // import Bcrypt module
const jwt = require('jsonwebtoken'); // import jsonwebtoken module
const models = require('../models/'); // import des modèles
const asyncLib = require('async'); // import async Waterfall module

// Paramètres
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Controllers pour créer un compte
exports.signup = (req, res, next) => {
    //Paramètres
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;
    const imageUrl = "https://pic.onlinewebfonts.com/svg/img_24787.png";
    const isAdmin = 0;

    //Vérification des champs vides
    if (username == null || email == null || password == null) {
        return res.status(400).json({
            'error': 'Merci de renseigner tous las champs !'
        });
    }

    //Vérification de la longuer de l'username
    if (username >= 13 || username <= 4) {
        return res.status(400).json({'error' : 'le pseudo doit comporter entre 5 et 12 caractères'})
    }

    //Vérification de l'email avec RegEx
    if (!EMAIL_REGEX.test(req.body.email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
    }
    asyncLib.waterfall([
        // 1. Vérification de l'existance de l'utilisateur
        function(done) { // done = paramètre principal
            models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then(function(userFound) { // userFound sera le paramètre suivant
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },
        // 2. Si l'utilisateur n'existe pas, le mot de passe est hashé
        function(userFound, done) { 
            if (!userFound) {
                // Mot de passe salé 12 fois (paramètre par défait)
                bcrypt.hash(password, 12, function(err, bcryptedPassword) { // nouveau paramètre
                    done(null, userFound, bcryptedPassword);
                });
            } else {
                return res.status(409).json({ error: 'Utilisateur déjà existant' });
            }
        },

        // 3. Création d'un nouvel utilisateur dans la DB
        function(userFound, bcryptedPassword, done) { 
            // Utilisation du model pour la création d'un nouel utilisateur
            models.User.create({
                email: email,
                username: username,
                password: bcryptedPassword,
                bio : bio,
                imageUrl: imageUrl,
                isAdmin: isAdmin
                })
                .then(function(newUser) {
                    done(newUser); 
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Impossible de créer le compte' });
                });
        }
    ],
        // 4. utilisateur créé, retourne new User id
        function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'utilisateur ne peut être ajouté' });
            }
        });
};

// Controllers pour se connecter au site
exports.login = (req, res, next) => {
    //Paramètres
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([

        // 1. Vérification que l'utilisateur existe
        function(done) {
            models.User.findOne({
                    where: { email: email }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },

        // 2. si l'utilisateur existe le hash du mot de passe est comparé
        function(userFound, done) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                    done(null, userFound, resBycrypt);
                });
            } else {
                return res.status(404).json({ 'error': 'Utilisateur non trouvé dasn la base de données' });
            }
        },

        // 3. si le hash correspond, l'utilisateur est selectionné
        function(userFound, resBycrypt, done) {
            if (resBycrypt) {
                done(userFound);
            } else {
                return res.status(403).json({ 'error': 'Mot de passe invalide' });
            }
        }

        // 4. Retourne userId avec un token unique
    ], function(userFound) {
        if (userFound) {
            return res.status(200).json({
                userId: userFound.id,
                // créé un token avec la method jwt.sign
                token: jwt.sign({ userId: userFound.id },
                    process.env.DB_TOKEN,
                    // Limite la validité du token a 24h
                    { expiresIn: process.env.DB_EXPIRES_IN }
                ),
                isAdmin: userFound.isAdmin
            });
        } else {
            return res.status(500).json({ 'error': 'cannot log on user' });
        }
    });
}

// Controllers pour afficher le profil grâce a l'ID

exports.getOneProfile = (req, res, next) => {
    // Récupération des information du profile
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'bio', 'imageUrl', 'isAdmin'],
        where: { id: req.params.id }
    }).then((user) => {
        if (user) {
            res.status(201).json(user); // confirmation si trouvé
        } else {
            res.status(404).json({ 'error': 'Utilisateur non trouvé' });
        }
    }).catch((err) => {
        res.status(500).json({ 'error': 'cannot fetch user' });
    });
};


// Controllers pour modifier un profil
exports.modifyProfile = (req, res, next) => {
    // Paramètres
    let username = req.body.username;
    let bio = req.body.bio;
    let imageUrl = req.body && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    let password = req.body.password;

    if (password == null) {
        return res.status(400).json({ 'error': 'Champs manquant' });
    }

        asyncLib.waterfall([
            // Vérifie que la requête est envoyé par un compte existant
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'bio', 'imageUrl', 'username'],
                    where: { id: req.params.id}
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function () {
                        return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
                    });
            },
            //Si l'utilisateur existe, le mot de passe est hashé
            function(userFound, done) { 
                if (userFound) {
                    // Mot de passe salé 12 fois (paramètre par défait)
                    bcrypt.hash(password, 12, function(err, bcryptedPassword) { // nouveau paramètre
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ error: 'Utilisateur déjà existant' });
                }
            },
            function (userFound, bcryptedPassword, done) {
                // Vérification que l'utilisateur est le propriétaire du profil
                if (userFound) {
                    userFound.update({
                        username: (username ? username : userFound.username),
                        password: (bcryptedPassword ? bcryptedPassword : userFound.password),
                        bio: (bio ? bio : userFound.bio),
                        imageUrl: (imageUrl ? imageUrl : userFound.imageUrl)
                    })
                        .then(function () {
                            done(userFound, bcryptedPassword);
                        })
                        .catch(function () {
                            res.status(500).json({ 'error' : 'Impossible de mettre a jour l\'utilisateur' });
                        })
                }
            },
            
        ],
            function (userFound) {
                if (userFound) {
                    return res.status(201).json(userFound);
                } else {
                    return res.status(500).json({ 'error': 'cannot update user profile' });
                }
            });
        };

// Controllers por effacer un profil grâce a l'ID
exports.deleteProfile = (req, res, next) => {
    asyncLib.waterfall([

        // Vérification que la requête soit envoyé par un compte existant
        function(done) {
            models.User.findOne({
                    where: { id: req.params.id}
                }).then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'impossible de vérifiér l\'utilisateur' });
                });
        },

        function(userFound, done) {
            //Vérification que la requête soit envoyé par le propriétaire du compte
            if (userFound.id == req.params.id || userFound.isAdmin == true) { // ou s'il est admin

                // Suppression du profil
                models.User.destroy({
                        where: { id: req.params.id }
                    })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé' })) // envoie un message de confirmation une fois fait
                    .catch(error => res.status(500).json({ 'error': 'L\'utilisateur ne peut être supprimé' }))

            } else {
                res.status(401).json({ 'error': 'Utilisateur non autorisé' });
            }
        },
    ],

    function(userFound) {
        if (userFound) {
            return res.status(201).json({ 'message': 'profile supprimé' });
        } else {
            return res.status(500).json({ 'error': 'Le profil ne peut être supprimé' });
        }
    });
      
  };
  