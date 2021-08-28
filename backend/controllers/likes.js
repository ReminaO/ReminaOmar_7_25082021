//Import du module
var asyncLib = require('async');

// Import du model
const Message = require('../models/like');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likeMessage: function(req, res) {

    // Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Message.findOne({
          where: { id: messageId }
        })
        .then(function(messageFound) {
          done(null, messageFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(messageFound, done) {
        if(messageFound) {
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(messageFound, userFound, done) {
        if(userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId
            }
          })
          .then(function(userAlreadyLikedFound) {
            done(null, messageFound, userFound, userAlreadyLikedFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      function(messageFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {
          messageFound.addUser(userFound, { isLike: LIKED })
          .then(function (alreadyLikeFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound.update({
              isLike: LIKED,
            }).then(function() {
              done(null, messageFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'message already liked' });
          }
        }
      },
      function(messageFound, userFound, done) {
        messageFound.update({
          likes: messageFound.likes + 1,
        }).then(function() {
          done(messageFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });
      },
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },
  dislikeMessage: function(req, res) {

   // Params
   var messageId = parseInt(req.params.messageId);

   if (messageId <= 0) {
     return res.status(400).json({ 'error': 'invalid parameters' });
   }

   asyncLib.waterfall([
    function(done) {
       models.Message.findOne({
         where: { id: messageId }
       })
       .then(function(messageFound) {
         done(null, messageFound);
       })
       .catch(function(err) {
         return res.status(500).json({ 'error': 'unable to verify message' });
       });
     },
     function(messageFound, done) {
       if(messageFound) {
         models.User.findOne({
           where: { id: userId }
         })
         .then(function(userFound) {
           done(null, messageFound, userFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify user' });
         });
       } else {
         res.status(404).json({ 'error': 'post already liked' });
       }
     },
     function(messageFound, userFound, done) {
       if(userFound) {
         models.Like.findOne({
           where: {
             userId: userId,
             messageId: messageId
           }
         })
         .then(function(userAlreadyLikedFound) {
            done(null, messageFound, userFound, userAlreadyLikedFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify is user already liked' });
         });
       } else {
         res.status(404).json({ 'error': 'user not exist' });
       }
     },
     function(messageFound, userFound, userAlreadyLikedFound, done) {
      if(!userAlreadyLikedFound) {
        messageFound.addUser(userFound, { isLike: DISLIKED })
        .then(function (alreadyLikeFound) {
          done(null, messageFound, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to set user reaction' });
        });
      } else {
        if (userAlreadyLikedFound.isLike === LIKED) {
          userAlreadyLikedFound.update({
            isLike: DISLIKED,
          }).then(function() {
            done(null, messageFound, userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user reaction' });
          });
        } else {
          res.status(409).json({ 'error': 'message already disliked' });
        }
      }
     },
     function(messageFound, userFound, done) {
       messageFound.update({
         likes: messageFound.likes - 1,
       }).then(function() {
         done(messageFound);
       }).catch(function(err) {
         res.status(500).json({ 'error': 'cannot update message like counter' });
       });
     },
   ], function(messageFound) {
     if (messageFound) {
       return res.status(201).json(messageFound);
     } else {
       return res.status(500).json({ 'error': 'cannot update message' });
     }
   });
  }
}
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
  
  