'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('user_role', [
       {
       role: 'ADMIN',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       role:'CUSTOMER',
       created_at: new Date(),
       updated_at: new Date()
     }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('user_role', null, {});
     
  }
};
