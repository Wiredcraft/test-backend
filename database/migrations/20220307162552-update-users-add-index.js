module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE tbl_friends ADD unique index unique_index_following_follower(following, follower)');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE tbl_friends DROP INDEX unique_index_following_follower');
  }
};
