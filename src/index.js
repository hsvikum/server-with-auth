/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const roundRobin = require("./services/round_robin/round_robin.js");
process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>{
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
  setInterval(function() {
    roundRobin(app);
  } , 1000);
}
);
