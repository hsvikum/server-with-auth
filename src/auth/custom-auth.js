const Strategy = require('passport-custom');

module.exports = opts => {
    return function() {
      const verifier = async (req, done) => {

        const user = await this.service(opts.userService).create({
          "name": req.body.name
        });
  
        // authenticate the request with this user
        return done(null, user, {
          userId: user._id
        });
      };
  
      // register the strategy in the app.passport instance
      this.passport.use('customAuth', new Strategy(verifier));
    };
  };