import passport = require('passport');
import knex = require('../db/connection');
import entity = require('../db/entity/entity');

export = () => {

  passport.serializeUser((user:entity.m_user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id:number, done) => {
    knex('m_user').where({id}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err, null); });
  });

};