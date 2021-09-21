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
      models.Message.belongsTo(models.User, {
        onDelete: 'cascade',
        foreignKey: {
          allowNull: false
        }
      });
      models.Message.hasMany(models.Comment, {
        onDelete: 'cascade',
      });
    }
  };
  Message.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    likes: DataTypes.INTEGER,
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
    paranoid: true,
  });
  return Message;
};