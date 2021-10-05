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
      // models.User.belongsToMany(models.Message, {
      //   onDelete: 'cascade',
      //   through: models.Comment,
      //   foreignKey: 'userId',
      //   otherKey: 'messageId',
      // });
      // models.Message.belongsToMany(models.User, {
      //     onDelete: 'cascade',
      //     through: models.Comment,
      //     foreignKey: 'messageId',
      //     otherKey: 'userId',
      // });
      models.Comment.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'userId',
          allowNull: false,
      },
      });
      models.Comment.belongsTo(models.Message, {
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'messageId',
          allowNull: false,
      },
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

    comment:{
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'Comment',
    paranoid: true,
  });
  return Comment;
};