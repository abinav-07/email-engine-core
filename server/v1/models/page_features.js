const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class PageFeatures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      PageFeatures.belongsTo(models.Pages, { foreignKey: "page_id", as: "page" })
    }
  }
  PageFeatures.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "PageFeatures",
      tableName: "page_features",
    },
  )
  return PageFeatures
}
