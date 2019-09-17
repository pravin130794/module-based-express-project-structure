const constants = {
  httpStatusCode: {
    success: 200,
    unauthorised: 401,
    forbidden: 403,
    badRequest: 400
  },
  responseCodes: {
    successfulOperation: 200,
    noContent: 204,
    noEmail: 410,
    failedOperation: 500,
    unauthorizedAccess: 401,
    invalidOTP: 402,
    revalidation: 400,
    limitExceeded: 402
  },
  rqstHeaders: {
    langCode: 'language_code'
  },
  messageKeys: {
    en: {
      msg_success: 'Successful Operation',
      msg_failed: 'Something went wrong',
      msg_unauthorised: 'Unauthorized access',
      msg_revalidate: 'Schema Validation Failed'
    }
  },
  moduleNames: {
    models: 'models'
  },
  publicAPIs: [
    '/user/login'
  ],
}

module.exports = constants
