var path = require('path');

var winston = require('winston');
var fs = require('fs-plus');

var MONTH_ABBREVIATIONS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];

// Format today's date and this month's date
var today = new Date();
var day = today.getDate();
var month = MONTH_ABBREVIATIONS[today.getMonth()];
var year = today.getFullYear();

// pad year if necessary
if(day<10) {
  day = '0' + day;
}

var directoryName = month + '-' + year;
var logFileName = day + '-' + month + '-' + year + '.log';

var appDirectory = fs.absolute('.');
var filePath = path.join(appDirectory, "log/" + directoryName + "/" + logFileName);
if (!fs.existsSync(filePath)) {
  try {
    fs.writeFileSync(filePath, '', {});
  } catch (e) {
      throw e;
  }
}

var gitIgnoreFilePath = path.join(appDirectory, '.gitignore');
fs.readFile(gitIgnoreFilePath, {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;
  if(data.indexOf('log/') < 0){
    fs.appendFile(gitIgnoreFilePath, '\n # Ignore log files directory \n log/', function(err) {
      if (err !== null) {
        throw new Error("Failed to read/append 'log/' to .gitignore file.");
      }
    });
  }
});

winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: filePath,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};
