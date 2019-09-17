const convict = require('convict')
const path = require('path')

const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'qa'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env'
  },
  cluster: {
    workerCount: {
      doc: 'No of worker Thread',
      format: Number,
      default: 12
    }
  },
  server: {
    port: {
      doc: 'HTTP port to bind',
      format: 'Number',
      default: 3001
    },
    timeout: {
      doc: 'Server Timeout',
      format: 'Number',
      default: 60000
    },
    enableHttpLogging: {
      doc: 'Enable HTTP Logging',
      format: Boolean,
      default: true
    },
    enableCompression: {
      doc: 'Enable HTTP compression',
      format: Boolean,
      default: true
    },
    security: {
      enableXframe: {
        doc: 'Enable Iframe protection',
        format: Boolean,
        default: true
      },
      enableHidePoweredBy: {
        doc: 'Hide X powered by Header',
        format: Boolean,
        default: true
      },
      enableNoCaching: {
        doc: 'Enable No caching',
        format: Boolean,
        default: true
      },
      enableCSP: {
        doc: 'Enable CSP policy',
        format: Boolean,
        default: false
      },
      enableHSTS: {
        doc: 'Enable HSTS',
        format: Boolean,
        default: true
      },
      enableXssFilter: {
        doc: 'Enable XSS filter protection',
        format: Boolean,
        default: true
      },
      enableForceContentType: {
        doc: 'Enable force content type',
        format: Boolean,
        default: false
      },
      salt: {
        doc: 'Server Security Salt',
        format: String,
        default: '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe'
      }
    },
    bodyParser: {
      limit: {
        doc: 'maximum request body size',
        format: String,
        default: '100kb'
      }
    }
  },
  mysql: {
    host: {
      doc: 'Holds the SQL Server Host',
      format: String,
      default: ''
    },
    port: {
      doc: 'Holds the SQL Server Port',
      format: Number,
      default: 3306
    },
    username: {
      doc: 'Holds the SQL Server Username',
      format: String,
      default: ''
    },
    password: {
      doc: 'Holds the SQL Server Password',
      format: String,
      default: ''
    },
    database: {
      doc: 'Holds the Database In SQL Server',
      format: String,
      default: ''
    },
    dialect: {
      doc: 'Holds the Dialect Details That we are using for the Connection',
      format: String,
      default: 'mysql'
    },
    connectTimeout: {
      doc: 'Holds the Connection Timeout Time in ms',
      format: Number,
      default: 10000
    },
    pool: {
      max: {
        doc: 'Holds the Maximum SQL Pool Size',
        format: Number,
        default: 5
      },
      min: {
        doc: 'Holds the Minimum SQL Pool Size',
        format: Number,
        default: 0
      },
      acquire: {
        doc: 'Holds the Value for the time to Acquire the SQL Connection.',
        format: Number,
        default: 30000
      },
      idle: {
        doc: 'Holds the Idle Time for SQL To Reset the Connection.',
        format: Number,
        default: 10000
      }
    },
    dialectOptions: {
      multipleStatements: {
        doc: 'Whether to allow Multiple SQL Statements or not',
        format: Boolean,
        default: true
      }
    },
    logging: {
      doc: 'Whether Logging is Enabled or not',
      format: Boolean,
      default: false
    }
  },
  aws: {
    s3: {
      AWS_ACCESS_KEY: {
        doc: 'Holds the AWS S3 Storage Access Key',
        format: String,
        default: ''
      },
      AWS_SECRET_ACCESS_KEY: {
        doc: 'Holds the AWS S3 Storage Secret Access Key',
        format: String,
        default: ''
      },
      BUCKET_NAME: {
        doc: 'Holds the AWS S3 Storage Bucket Name',
        format: String,
        default: ''
      },
      STORAGE_REGION: {
        doc: 'Holds the AWS S3 Storage Region',
        format: String,
        default: ''
      },
      STORAGE_ENV: {
        doc: 'Holds the AWS S3 Storage Environment Folder',
        format: String,
        default: ''
      },
      BASE_URL: {
        doc: 'Holds the AWS S3 Storage Environment Base URL',
        format: String,
        default: ''
      }
    }
  },
  JWT_TOKEN: {
    SECRET: {
      doc: 'Holds the JWT secret',
      format: String,
      default: '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe'
    },
    ALGORITHM: {
      doc: 'Holds the JWT Algorithm',
      format: String,
      default: 'HS512'
    },
    expireTime: {
      doc: 'Holds the JWT Token Expiration Time',
      format: String,
      default: '1d'
    },
    ttl: {
      doc: 'Holds the JWT Token Time to Leave',
      format: Number,
      default: 86400000
    }
  },
  logger: {
    httpLogFormat: {
      doc: 'HTTP log format',
      format: String,
      default: ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] | :response-time ms ":referrer" ":user-agent"'
    },
    httpLogFileName: {
      doc: 'HTTP log File name',
      format: String,
      default: 'http.log'
    },
    logFileName: {
      doc: 'Log File name',
      format: String,
      default: 'logs.log'
    },
    exceptionLogFileName: {
      doc: 'Exception log File name',
      format: String,
      default: 'exceptions.log'
    },
    logFileSize: {
      doc: 'logs File Max File size',
      format: Number,
      default: 5242880
    },
    path: {
      doc: 'Holds the Log Path',
      format: String,
      default: './logs/'
    }
  },
  mailer: {
    host: {
      doc: 'Mailer Host',
      format: String,
      default: ''
    },
    port: {
      doc: 'Mailer Port',
      format: Number,
      default: 000
    },
    email: {
      doc: 'Mailer Authentication Email',
      format: String,
      default: ''
    },
    password: {
      doc: 'Mailer Authentication Password',
      format: String,
      default: ''
    },
    supportMail: {
      doc: 'Mailer Support Email',
      format: String,
      default: ''
    }
  }
})

// config.loadFile('./configurations/config-' + config.get('env') + '.json');
config.loadFile(path.join(__dirname, '/config-' + config.get('env') + '.json'))

config.set('logger.httpLogFileName', config.get('logger.path') + config.get('logger.httpLogFileName'))
config.set('logger.logFileName', config.get('logger.path') + config.get('logger.logFileName'))
config.set('logger.exceptionLogFileName', config.get('logger.path') + config.get('logger.exceptionLogFileName'))

// validate
config.validate()

module.exports = config
