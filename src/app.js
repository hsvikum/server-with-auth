const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const app = express(feathers());
const roundRobin = require("./services/round_robin/round_robin.js");

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio(function(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', (reason) => {
          if(socket.feathers.user && socket.feathers.user._id) {
            let userId = socket.feathers.user._id;
            let user = socket.feathers.user;
            if (socket.feathers.user.active !== false) {
              socket.feathers.user.active = Date.now() - 3600000;
              app.service('users').update(userId, user).then(function(){
                roundRobin(app);
                // timeout to let round robin to switch to next user
                setTimeout(function() {
                  app.service('users').remove(userId).then(function() {
                    console.log("active user delete success");
                  }, function() {
                    console.log("active user delete error");
                  });
                },1000);
              });
            } else {
              app.service('users').remove(userId);
            }
          }
        });
      });
}));

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
