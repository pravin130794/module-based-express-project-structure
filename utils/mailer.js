const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const util = require('util')
const moment = require('moment')
const config = require('../configurations/config')
const logger = require('./logger')

const mailer = function () {
}

const transporter = nodemailer.createTransport(smtpTransport({
  host: config.get('mailer.host'),
  port: config.get('mailer.port'),
  auth: {
    user: config.get('mailer.email'),
    pass: config.get('mailer.password')
  },
  // For SSL
  secure: true,
  debug: true
}))

const sendMail = function (mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, information) {
      if (error) {
        logger.error(util.format('Error While Sending Email. Error: %j', error))
        reject(error)
      } else {
        logger.info(util.format('Mail Sending Successful.'))
        resolve(information)
      }
    })
  })
}

mailer.sendMail = function (data) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: config.get('mailer.supportMail'),
      to: data.recipientMail,
      cc: data.ccTo,
      bcc: data.bccTo,
      subject: data.mailSubject,
      html: data.content
    }
    sendMail(mailOptions).then((status) => {
      logger.info(util.format('Mail Sending Successful To User: ', data.recipientMail + '. Time: ', moment().utc().format()))
      resolve(true)
    }).catch((error) => {
      logger.error(util.format('Error While Sending Mail To User: ', data.recipientMail + '. Time: ', moment().utc().format() + '. Error: %j', error))
      reject(error)
    })
  })
}

module.exports = mailer
