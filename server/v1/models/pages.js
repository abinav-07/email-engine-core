const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      Pages.hasMany(models.PageFeatures, { foreignKey: "page_id",as:"page_features"  })
    }
  }
  Pages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "Pages",
      tableName: "pages",
    },
  )
  return Pages
}
