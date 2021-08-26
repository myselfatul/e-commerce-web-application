'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class app extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      app.belongsTo(models.user_role,{
        foreignKey: 'user_role_id'
      })


    }
  };
  app.init({
    bundle: DataTypes.STRING,
    token: DataTypes.STRING,
    user_role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'app',
    underscored: true,
    freezeTableName: true
  });
  return app;
};