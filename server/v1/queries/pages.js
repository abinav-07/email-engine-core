const { Pages } = require("../models")

/*
 Create a class named PagesQueries which will be used to
 communicate with the database using sequelize
*/
class PagesQueries {
  table() {
    return Pages
  }

  async getAll(query) {
    return await this.table().findAll(query)
  }

  // Get User using id or any fitler
  async getPage(filter = null) {
    const query = {
      raw: true,
    }

    if (filter) query.where = filter

    return await this.table().findOne(query)
  }

  // Create new Page
  async createPage(pageData, transaction = null) {
    return await this.table().create({ ...pageData }, { transaction })
  }

  // update Page using id and values
  async updatePage(id, values, transaction = null) {
    return await this.table().update(
      { ...values },
      {
        where: {
          id,
        },
        transaction,
      },
    )
  }

  // delete Page using id
  async delete(id, transaction) {
    return await this.table().destroy({
      where: {
        id,
      },
      transaction,
    })
  }
}

module.exports = new PagesQueries()
