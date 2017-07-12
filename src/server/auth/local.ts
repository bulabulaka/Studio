import  passport = require('passport');
import LocalStrategy = require('passport-local');
import init = require('./passport');
import knex = require('../db/connection');
import authHelpers = require('./_helpers');
var options =<any>{};

//var doneR:(error: any, user?: any, options?: IVerifyOptions) = null;

init();
passport.use(new LocalStrategy.Strategy(options, (username:string, password:string, done:(error: any, user?: any, options?: LocalStrategy.IVerifyOptions)) => {
  // check to see if the username exists
  knex('m_user').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

export = passport;


