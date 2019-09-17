module.exports = function (app) {
  const logger = require('../utils/logger')
  const util = require('util')

  app.use(function (req, res, next) {
    // User may not be logged in so pass on the request
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(util.format('%s request from:- %s', req.url, ip))

    if (req.method.toLowerCase() === 'get') {
      logger.info(util.format('request query:- %j', req.query))
    } else {
      logger.info(util.format('request body:- %j', req.body))
    }
    next()
  })
}
