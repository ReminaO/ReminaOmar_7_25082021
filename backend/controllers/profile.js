const User = require('../models/user');

// Controllers pour afficher le profil grâce a l'ID

exports.getOneProfile = (req, res, next) => {
    User.findOne({ _id: req.params.id })
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
      Message.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Profile modifiée !' }))
          .catch(error => res.status(400).json({ error }));
  };
  