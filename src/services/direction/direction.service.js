// Initializes the `direction` service on path `/direction`
const createService = require('./direction.class.js');
const hooks = require('./direction.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/direction', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('direction');

  service.hooks(hooks);
};
