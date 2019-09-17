
const db = require('../../../database/mysql')
const Op = db.Sequelize.Op

const customer = function () {

}

customer.index = function () {
  return new Promise((resolve, reject) => {
      resolve('success')
  })
}


module.exports = customer
