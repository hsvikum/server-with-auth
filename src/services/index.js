const users = require('./users/users.service.js');
const direction = require('./direction/direction.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(direction);
};
