const { PageFeatures } = require("../models")

/*
 Create a class named pageFeatures which will be used to
 communicate with the database using sequelize
*/
class PageFeaturesQueries {
  table() {
    return PageFeatures
  }

  async getAll(query) {
    return await this.table().findAll(query)
  }

  // Get using id or any fitler
  async getOne(filter = null) {
    const query = {
      raw: true,
    }

    if (filter) query.where = filter

    return await this.table().findOne(query)
  }

  // Create new
  async create(pageFeatures, transaction = null) {
    return await this.table().create({ ...pageFeatures }, { transaction })
  }

  // update using id and values
  async update(values, transaction = null) {
    return await this.table().update(
      { ...values },
      {
        where: {
          page_id: values?.feature_id,
          type: values?.type,
        },
        transaction,
      },
    )
  }

  // delete using id
  async delete(query, transaction = null) {
    return await this.table().destroy({
      ...query,
      transaction,
    })
  }
}

module.exports = new PageFeaturesQueries()
