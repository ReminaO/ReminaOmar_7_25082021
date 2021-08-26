//Import des modules
const fs = require('fs');
const Message = require('../models/message');

// Controllers pour créer une message
exports.createMessages = (req, res, next) => {
  // récupère et transforme chaine en objet js
  const messageObject = JSON.parse(req.body.message);
  // Efface L'id prédéfini pour en créer une nouvelle
    delete messageObject._id;
    const message = new Message ({
      ...messageObject,
      attachement: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      
    });
  // sauvegarde la nouvelle message dans la bas de données
    message.save()
      .then(() => res.status(201).json({ message: 'Message enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};
  
// Controllers pour liker ou disliker une message
exports.likeMessages = (req, res, next) => {

  const choice = {
    LIKE: 1,
    DISLIKE: -1,
    RESET: 0,
  }
  const messageId = req.params.id;
  const { userId, like: userChoice } = req.body;

  if (!(Number.isInteger(userChoice) && (userChoice >= -1 && userChoice <= 1))) {
    console.log('error ');
    return null
  }

  Message.findOne({ _id: req.params.id })
    .then(message => {
      // Condition si la message n'est plus aimée ou n'est plus dislikée
      if (userChoice === choice.RESET) {
        console.log('reset all likes ')
        removeUser(userId, message.usersLiked);
        removeUser(userId, message.usersDisliked);
      }
    // Condition si la message est likée
      if (userChoice === choice.LIKE) {
        console.log('user liked the message ');
        if (message.usersLiked.find(u => u === userId)) {
          console.log('user already voted ‍');
          return 'you have déjà voté !';
        }
        message['usersLiked'].push(userId);
        message['likes'] = message['usersLiked'].length;

        if (message.usersDisliked.find(u => u === userId)) {
          removeUser(userId, message.userDislikes);
        }
      }
      // Condition si la message est dislikée
      if (userChoice === choice.DISLIKE) {
        console.log('user hate the message ');
        if (message.usersDisliked.find(u => u === userId)) {
          console.log('user already voted ‍');
          return 'you have déjà voté !';
        }
        message['usersDisliked'].push(userId);
        message['dislikes'] = message['usersDisliked'].length;

        if (message.usersLiked.find(u => u === userId)) {
          removeUser(userId, message.usersLiked);
        }
      }

      message.likes = message.usersLiked.length;
      message.dislikes = message.usersDisliked.length;

      //console.log(message)
      const { usersLiked, usersDisliked, likes, dislikes } = message;
      const fields = {
        usersLiked, usersDisliked, likes, dislikes
      }

      // Met a jour la base de données avec le nouveau statut
      message.findByIdAndUpdate(messageId, fields, { new: true })
        .then(messageLike => {
          res.status(200).json({ message: 'Statut mis a jour !', messageLike })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}

const removeUser = (userId, likesTab) => {
  const index = likesTab.indexOf(userId);
  if (index > -1) {
    likesTab.splice(index, 1);
  }

  return likesTab;
}  



// Controllers pour modifier une message
exports.modifyMessages = (req, res, next) => {
  const messageObject = req.file ?
  {
    ...JSON.parse(req.body.message),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
  // Met a jour la base de données avec les nouveaux éléments 
    Message.updateOne({ _id: req.params.id }, { ...messageObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Message modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Controllers por effacer une message grâce a l'ID
exports.deleteMessages = (req, res, next) => {
  Message.findOne({ _id: req.params.id })
    .then(message => {
      const filename = message.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        message.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'message supprimée !' }))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
    
};

// Controllers pour afficher une message grâce a l'ID
exports.getOneMessage = (req, res, next) => {
    Message.findOne({ _id: req.params.id })
        .then(message => res.status(200).json(message))
        .catch(error => res.status(404).json({ error }));
};

// Controllers pour afficher toutes les messages
exports.getAllMessages = (req, res, next) => {
    Message.find()
      .then(message => res.status(200).json(message))
      .catch(error => res.status(400).json({ error }));
}

