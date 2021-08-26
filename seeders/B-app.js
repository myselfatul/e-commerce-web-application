'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('app', [
      {
        bundle: 'com.admin',
        token:'hc87yf8hu7y4iuehcuyg',
        user_role_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        bundle: 'com.customer',
        token:'kmvkuhueyrh87hfjrniuh',
        user_role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('app', null, {});
     
  }
};
