import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import {comparePass} from './_helpers';
import {knex} from '../db/connection';
import {passport_init} from './passports';

let options = <any>{};

passport_init();
passport.use(new LocalStrategy.Strategy(options, (username: string, password: string, done: (error: any, user?: any, options?: LocalStrategy.IVerifyOptions) => void) => {
    // check to see if the username exists
    knex('m_user').where('username', username).first()
      .then((user) => {
        if (!user) return done(null, false);
        if (!comparePass(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch((err) => {
        return done(err);
      });
  }
));

export const local = passport;


