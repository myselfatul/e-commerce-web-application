'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_role.hasOne(models.app)

      user_role.hasOne(models.user2user_role)
    }
  };
  user_role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_role',
    underscored: true,
    freezeTableName: true
  });
  return user_role;
};