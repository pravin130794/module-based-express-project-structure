const service = require('./customer-service')

module.exports = function (app) {
  // Index API
  app.get('/index', service.index)

}
