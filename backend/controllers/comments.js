//import des modèles
const Comment = require('../models/comment');

// Controllers pour créer un commenataire
exports.createComment = (req, res, next) => {
    // récupère et transforme chaine en objet js
    const commentObject = JSON.parse(req.body.comment);
    // Efface L'id prédéfini pour en créer une nouvelle
      delete commentObject.id;
      const comment = new Comment ({
          ...commentObject,
          comment: req.body.post,
          username: req.body.userName,
      });
    // sauvegarde le nouveau commentaire dans la base de données
      comment.save()
        .then(() => res.status(201).json({ message: 'commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};
  
// Controllers pour effacer un commentaire grâce a l'ID
exports.deleteComment = (req, res, next) => {
    comment.findOne({ id: req.params.id })
    .then(comment => {
        comment.destroy({
          where: {
            id: req.params.id
          }
        })
        .then(() => res.status(200).json({ message: 'commentaire supprimé !' }))
        .catch(error => res.status(400).json({ error }));
    });
};
  
  // Controllers pour afficher toutes les commentaires
  exports.getAllComments = (req, res, next) => {
      comment.find()
        .then(message => res.status(200).json(message))
        .catch(error => res.status(400).json({ error }));
}
  
// Controllers pour modifier un commentaire
exports.modifyComment = (req, res, next) => {
    const messageObject = req.file ?
    {
      ...JSON.parse(req.body.message),
      } : { ...req.body };
    
    // Met a jour la base de données avec les nouveaux éléments 
      Comment.updateOne({ id: req.params.id }, { ...messageObject, id: req.params.id })
          .then(() => res.status(200).json({ message: 'Message modifiée !' }))
          .catch(error => res.status(400).json({ error }));
  };