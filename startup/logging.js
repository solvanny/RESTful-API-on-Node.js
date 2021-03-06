require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

module.exports = function() {

  winston.createLogger(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
   );
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  winston.add(new winston.transports.File ({ 
    filename: 'logfile.log', 
    format: winston.format.json(),
    level: 'error'
  }));

  winston.add( new winston.transports.File({
    filename: 'uncaughtExceptions.log',
    format: winston.format.json(),
    level: 'error'
  }));

  
  // winston.add(new winston.transports.MongoDB ({
  //   db: 'mongodb://localhost/vidlydb', 
  //   level: 'info'
  // }));
}