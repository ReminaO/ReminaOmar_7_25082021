//Import des modules
const fs = require('fs');

//import des modèles
const Message = require('../models/message');

// Controllers pour créer un message
exports.createMessages = (req, res, next) => {
  // récupère et transforme chaine en objet js
  const messageObject = JSON.parse(req.body.message);
  // Efface L'id prédéfini pour en créer une nouvelle
    delete messageObject.id;
    const message = new Message ({
      ...messageObject,
      attachement: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
    });
  // sauvegarde le nouveau message dans la base de données
    message.save()
      .then(() => res.status(201).json({ message: 'Message enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

// Controllers pour modifier un message
exports.modifyMessages = (req, res, next) => {
  const messageObject = req.file ?
  {
    ...JSON.parse(req.body.message),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
  // Met a jour la base de données avec les nouveaux éléments 
    Message.updateOne({ id: req.params.id }, { ...messageObject, id: req.params.id })
        .then(() => res.status(200).json({ message: 'Message modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Controllers por effacer un message grâce a l'ID
exports.deleteMessages = (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      const filename = message.attachement.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        message.destroy({
          where: {
            id: req.params.id
    }
  })
        .then(() => res.status(200).json({ message: 'message supprimée !' }))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
    
};

// Controllers pour afficher toutes les messages
exports.getAllMessages = (req, res, next) => {
    Message.find()
      .then(message => res.status(200).json(message))
      .catch(error => res.status(400).json({ error }));
}
