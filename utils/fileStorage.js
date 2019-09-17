const aws = require('aws-sdk')
const fs = require('fs')
const uuid = require('uuid')
const logger = require('./logger')
const util = require('util')
const config = require('../configurations/config')

const s3 = new aws.S3({
  accessKeyId: config.get('aws.s3.AWS_ACCESS_KEY'),
  secretAccessKey: config.get('aws.s3.AWS_SECRET_ACCESS_KEY'),
  region: config.get('aws.s3.STORAGE_REGION')
})

const uploadFile = function (imageData, imageExtension) {
  return new Promise((resolve, reject) => {
    fs.readFile("upload/" + imageData.path, function (err, contents) {
      const params = {
        Bucket: config.get('aws.s3.BUCKET_NAME'),
        Key: config.get('aws.s3.STORAGE_ENV') + '/' + uuid.v4() + imageExtension,
        Body: contents
      }
      s3.upload(params, function (error, data) {
        if (error) {
          logger.error(util.format('Error While Uploading Profile Picture. Error: %j', error))
          reject(error)
        } else {
          logger.info(util.format('Profile Picture Upload Done Successfully'))
          resolve(data)
        }
      })

    });
  })
}

const deleteFile = function (path, customerId) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.get('aws.s3.BUCKET_NAME'),
      Key: path
    }
    s3.deleteObject(params, function (error, data) {
      if (error) {
        logger.error(util.format('Error While Removing Previous Profile Picture From S3 Bucket For Customer ID: ', customerId))
        reject(error)
      } else {
        logger.info(util.format('Previous Profile Picture Deleted From S3 Bucket For Customer ID: ', customerId))
        resolve(true)
      }
    })
  })
}

module.exports = {
  uploadFile: uploadFile,
  deleteFile: deleteFile
}
