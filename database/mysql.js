const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const util = require('util')
const sequelizeTransforms = require('sequelize-transforms')
const logger = require('../utils/logger')
const constants = require('../utils/constants')
const config = require('../configurations/config')
const db = {}
const sequelize = new Sequelize(config.get('mysql.database'), config.get('mysql.username'), config.get('mysql.password'), config.get('mysql'))

sequelizeTransforms(sequelize)

// To Read All Files from the database directory and we will exclude index.js from the directory
fs.readdirSync(path.join(__dirname, '../' + constants.moduleNames.models + '/')).forEach(function (file) {
  const model = sequelize.import(path.join(__dirname, '/../' + constants.moduleNames.models + '/' + file))
  db[model.name] = model
})

// verify the connection
sequelize.authenticate().then(() => {
  logger.info(util.format('My SQL Database Connection is established Successfully.'))
}).catch((error) => {
  logger.error(util.format('Error While Connecting To the My SQL Database. Error: %j', error))
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
