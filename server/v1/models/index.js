const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || "development"
const config = require(`${__dirname}/../config/config.js`)[env]
const db = {}

// This file reads all the models that we created inside this folder and initializes them with sequelize
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// Sync the database models with the database schema
// sequelize
//   .sync({force:true})
//   .then(() =>{
//     return sequelize.seeders.run()
//   }).then(()=>{
//     console.log("Connected to the database")
//   })
//   .catch((err) => console.error("Unable to connect to the database", err));

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
