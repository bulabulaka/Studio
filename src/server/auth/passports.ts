import * as passport from "passport";
import * as Promise from "bluebird";
import {knex} from "../db/connection";
import {m_user} from "../db/entity/entity";


export function passport_init() {
  passport.serializeUser((user: m_user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id: number, done) => {
    knex('m_user').where({id}).first()
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
}

