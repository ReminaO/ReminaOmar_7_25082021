'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Comment),
      models.Message.hasMany(models.Comment, {
        foreignKey: {
          name: 'messageId',
          allowNull: false,
        }
    }),
      models.Message.belongsTo(models.User, {
        onDelete: 'cascade',
        hooks: true,
        foreignKey: {
          allowNull: false
        }
      })
        
    }
  };
  Message.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    userName:{
      type: DataTypes.STRING,
      references : {
        model : 'User',
        key : 'username'
      }
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};