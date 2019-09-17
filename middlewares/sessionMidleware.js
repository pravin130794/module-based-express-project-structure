const util = require('util')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')
const config = require('../configurations/config')
const db = require('../database/mysql')
const logger = require('../utils/logger')
const constants = require('../utils/constants')

module.exports = {
  verifyToken: function (req, res, next) {
    if (req.headers.devicetype !== undefined && (req.headers.devicetype.toLowerCase() === 'android' || req.headers.devicetype.toLowerCase() === 'ios')) {
      if (req.headers.authorization && constants.publicAPIs.indexOf(req.path) < 0) {
        const token = req.headers.authorization
        const customer_id = (jwt.decode(token)) ? jwt.decode(token).customer_id : ''
        // Function Call To Check that Whether the Customer is a valid Customer Or not
        checkValidTokenForCustomers(token, customer_id, req, next)
      } else {
        if (constants.publicAPIs.indexOf(req.path) >= 0) {
          req.isAuthenticatedCustomer = true
          next()
        } else {
          req.isAuthenticatedCustomer = false
          next()
        }
      }
    } else {
      if (req.headers.authorization && constants.publicAPIs.indexOf(req.path) < 0) {
        const token = req.headers.authorization
        const userId = (jwt.decode(token) && jwt.decode(token).user_session_id) ? jwt.decode(token).user_session_id : (jwt.decode(token) && jwt.decode(token).customer_session_id) ? jwt.decode(token).customer_session_id : ''
        // Function Call To Check that Whether the Customer is a valid Customer Or not
        checkValidToken(token, userId, req, next)
      } else {
        if (constants.publicAPIs.indexOf(req.path) >= 0) {
          req.isAuthenticatedUser = true
          next()
        } else {
          req.isAuthenticatedUser = false
          next()
        }
      }
    }
  }
}

const checkValidToken = function (token, userId, req, next) {
  if (token) {
    verifyTokenForAdmin(token, function (error, status) {
      if (status === constants.httpStatusCode.success) {
        db.sequelize.models.admin_users.findOne({
          where: {
            admin_id: userId
          },
          raw: true
        }).then((userDetails) => {
          if (userDetails) {
            req.isAuthenticatedUser = true
            req.user = {}
            req.user.user_id = userDetails.admin_id
            req.user.first_name = userDetails.first_name
            req.user.last_name = userDetails.last_name
            req.user.email = userDetails.email
            next()
          }
        })
      } else {
        req.isAuthenticatedUser = false
        next()
      }
    })
  } else {
    req.isAuthenticatedUser = false
    next()
  }
}

let verifyTokenForAdmin = function (token, cb) {
  let payload
  try {
    payload = JSON.parse(base64.decode(token.split('.')[1]))
  } catch (ex) {
    logger.error(util.format('Error While Splitting the Token. Payload: %j', payload))
  }
  if (payload) {
    // if it's a JWT token and if we have decoded it
    // verify it with the signing password(from config)
    jwt.verify(token, config.get('JWT_TOKEN.SECRET'), function (error, decoded) {
      if (error) {
        let errorMessage = 'Token Expired, Please login again'
        cb(errorMessage, constants.httpStatusCode.badRequest)
      } else {
        db.sequelize.models.admin_users_session.findOne({
          where: {
            uuid: payload.uuid
          },
          raw: true
        }).then((adminSessionDetails) => {
          if (adminSessionDetails) {
            if (adminSessionDetails.is_logged_out !== undefined && adminSessionDetails.is_logged_out !== 1) {
              cb(null, constants.httpStatusCode.success)
            } else {
              cb('Session Expired...!!', constants.httpStatusCode.forbidden)
            }
          }
        }).catch((error) => {
          let errorMessage = 'Cannot Find User Details in SQL Session'
          cb(errorMessage, constants.httpStatusCode.badRequest)
        })
      }
    })
  } else {
    cb('Invalid token, please login again.', constants.httpStatusCode.badRequest)
  }
}

const verifyTokenForCustomers = function (token, cb) {
  let payload
  try {
    payload = JSON.parse(base64.decode(token.split('.')[1]))
  } catch (ex) {
    logger.error(util.format('Error While Splitting the Token. Payload: %j', payload))
  }
  if (payload) {
    // if it's a JWT token and if we have decoded it
    // verify it with the signing password(from config)
    jwt.verify(token, config.get('JWT_TOKEN.SECRET'), function (error, decoded) {
      if (error) {
        const errorMessage = 'Token Expired, Please login again'
        cb(errorMessage, constants.httpStatusCode.badRequest)
      } else {
        db.sequelize.models.customer_session.findOne({
          where: {
            uuid: payload.uuid
          },
          raw: true
        }).then((customerSessionDetails) => {
          if (customerSessionDetails) {
            if (customerSessionDetails.is_logged_out !== undefined && customerSessionDetails.is_logged_out !== 1) {
              cb(null, constants.httpStatusCode.success)
            } else {
              cb('Session Expired...!!', constants.httpStatusCode.forbidden)
            }
          }
        }).catch((error) => {
          const errorMessage = 'Cannot Find User Details in SQL Session'
          cb(errorMessage, constants.httpStatusCode.badRequest)
        })
      }
    })
  } else {
    cb('Invalid token, please login again.', constants.httpStatusCode.badRequest)
  }
}

const checkValidTokenForCustomers = function (token, customer_id, req, next) {
  if (token) {
    verifyTokenForCustomers(token, function (error, status) {
      if (status === constants.httpStatusCode.success) {
        db.sequelize.models.customers.findOne({
          where: {
            customer_id: customer_id
          }
        }, { raw: true }).then((customerDetails) => {
          req.isAuthenticatedCustomer = true
          req.customer = {}
          req.customer.customer_id = customerDetails.customer_id
          req.customer.email = customerDetails.email_address
          next()
        })
      } else {
        req.isAuthenticatedUser = false
        next()
      }
    })
  } else {
    req.isAuthenticatedCustomer = false
    next()
  }
}
