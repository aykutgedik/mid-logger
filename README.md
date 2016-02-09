# mid-logger for node.js

npm install mid-logger

in app.js


var midLogger = require('mid-logger');

app.user(midLogger);

example usage

app.get('/', function(req, res) {


  //Logging Levels --> { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }


  req.logger.info('logging info');


  res.send('hello world');

});
