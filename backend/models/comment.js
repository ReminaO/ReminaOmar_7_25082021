'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        onDelete: 'cascade',
        foreignKey: 'userId',
        as: 'user',
      });

      models.Comment.belongsTo(models.Message, {
        onDelete: 'cascade',
        foreignKey: 'messageId',
        as: 'message',
      });
    }
  };

  Comment.init({
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },

    userName:{
      type: DataTypes.STRING,
      references : {
        model : 'User',
        key : 'username'
      }
    },

    post:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: true, 
        min: 2,
      }
    },
  }, {
    sequelize,
    modelName: 'Comment',
    paranoid: true,
  });
  return Comment;
};