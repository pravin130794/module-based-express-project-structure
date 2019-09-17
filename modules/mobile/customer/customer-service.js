const customer = require('./customer-model')
const constants = require('../../../utils/constants')

const index = (req, res) => {
  customer.index().then((status) => {
    res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.successfulOperation,
      message: constants.messageKeys[req.headers[constants.rqstHeaders.langCode]].msg_success,
      data: status
    })
  }).catch((error) => {
    return res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.failedOperation,
      message: constants.messageKeys[req.headers[constants.rqstHeaders.langCode]].msg_failed,
      data: error
    })
  })
}

module.exports = {
  index: index
}
