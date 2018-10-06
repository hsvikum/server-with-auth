const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const customAuth = require('./auth/custom-auth');


module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));

  app.configure(jwt());
  app.configure(local());
  app.configure(customAuth(
    {
      userService: 'users'
    }
  ));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  function customizeJWTPayload() {
    return function(hook) {
      hook.params.payload = {
        userId: hook.params.user._id
      };
      return Promise.resolve(hook);
    };
  }

  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        customizeJWTPayload()
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
