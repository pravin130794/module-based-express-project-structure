const express = require('express')
const util = require('util')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./configurations/config')
const routes = require('./routes/index')
const db = require('./database/mysql')
const app = express()

// Global Variable Declarations
const middlewares = require('./middlewares/index')

// use cors
app.use(cors())

// required to get client IP when running via reverse proxy (HA proxy)
app.set('trust proxy', true)

// setup middlewares
middlewares(app)

// setup routes
routes(app)

// Function Call To Sync App Database Tables Before the Start of the Application
db.sequelize.sync().then((status) => {
  logger.info(util.format('My SQL Tables Synced Successfully.'))
  // start Express server
  app.listen(process.env.PORT || config.get('server.port'), function () {
    logger.info(util.format('API Server with pid: %s listening on port: %s', process.pid, config.get('server.port')))
    logger.info(util.format('Environment: %s', config.get('env')))
  })
}).catch((error) => {
  logger.error(util.format('Error While Syncing My SQL Tables. Error: %j', error))
})

app.timeout = config.get('server.timeout')

process.on('uncaughtException', function (e) {
  logger.error(util.format('uncaught exception:- ', e.stack))
})
