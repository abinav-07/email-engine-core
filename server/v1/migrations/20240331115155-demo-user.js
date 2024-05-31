module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          first_name: "John",
          last_name: "Don",
          email: "admin@gmail.com",
          role: "Admin",
          password: "$2a$12$rEp6m9wsUklwdoVhrQ7gnOW1RtfbzGj/Eme2XVrfJbiwjFk/H6oMa",
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {})
  },
}
