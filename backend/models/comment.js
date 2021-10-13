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
        hooks: true,
        foreignKey: {
          name: 'userId',
          allowNull: false }
      });
      models.Comment.belongsTo(models.Message, {
        onDelete: 'cascade',
        hooks: true,
        foreignKey: {
          name: 'messageId',
          allowNull: false}
          
      })
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

    comment:{
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};