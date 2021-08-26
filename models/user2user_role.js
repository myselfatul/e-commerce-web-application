'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user2user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user2user_role.belongsTo(models.user,{
        foreignKey:'user_id'
      })

      user2user_role.belongsTo(models.user_role,{
        foreignKey:'user_role_id'
      })
    }
  };
  user2user_role.init({
    user_id: DataTypes.INTEGER,
    user_role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user2user_role',
    underscored: true,
    freezeTableName: true
  });
  return user2user_role;
};