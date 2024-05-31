module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "pages",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          url: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction: t },
      )
      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          first_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          last_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            validate: {
              isEmail: true,
            },
            unique: true,
          },
          password: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          role: {
            type: Sequelize.DataTypes.ENUM("Admin", "User"),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction: t },
      )

      await queryInterface.createTable(
        "page_features",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          page_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "pages",
              key: "id",
            },
          },
          type: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          value: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("pages", { transaction: t })
      await queryInterface.dropTable("users", { transaction: t })
      await queryInterface.dropTable("page_features", { transaction: t })
    })
  },
}
