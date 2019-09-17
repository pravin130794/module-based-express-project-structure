const bcrypt = require('bcrypt')
const cryptoJS = require('crypto-js')
const config = require('../configurations/config')

// Get password hash with salt
const getEncryptedPasswordWithSalt = function (password) {
  const salt = bcrypt.genSaltSync(10)
  const passwordHashWithSalt = bcrypt.hashSync(password, salt)
  const passwordHash = passwordHashWithSalt.substring(29)
  return {
    password: passwordHash,
    salt: salt
  }
}

const getEncryptedPassword = function (password, salt) {
  const passwordHashWithSalt = bcrypt.hashSync(password, salt)
  const passwordHash = passwordHashWithSalt.substring(29)
  return {
    password: passwordHash,
    salt: salt
  }
}

const validateCustomerPassword = function (plainPassword, passwordHash) {
  let isValidCustomerPassword = false
  const splitValues = passwordHash.split(':')
  const salt = splitValues[1]
  const hashValue = bcrypt.hashSync(plainPassword, salt).substring(29)
  if (hashValue === splitValues[0]) {
    isValidCustomerPassword = true
  }
  return isValidCustomerPassword
}

const decryptRequestData = function (encryptedDetails) {
  // Crypto JS Function To Decrypt the Encrypted Data.
  const cryptoDetails = cryptoJS.AES.decrypt(encryptedDetails, config.get('server.security.salt'))
  // To Convert the Encrypted Data in the JSON Format.
  const decrtpyedDetails = JSON.parse(cryptoDetails.toString(cryptoJS.enc.Utf8))
  return decrtpyedDetails
}

const encryptData = function (plainDataObject) {
  // Crypto JS Function To Encrypted the Decrypt Data.
  const encryptedData = cryptoJS.AES.encrypt(JSON.stringify(plainDataObject), config.get('server.security.salt')).toString()
  return encryptedData
}

module.exports = {
  getEncryptedPasswordWithSalt: getEncryptedPasswordWithSalt,
  validateCustomerPassword: validateCustomerPassword,
  decryptRequestData: decryptRequestData,
  encryptData: encryptData,
  getEncryptedPassword: getEncryptedPassword
}
