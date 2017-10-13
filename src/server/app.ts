// *** dependencies *** //
import * as express from 'express';
import {mainConfigInit} from './config/main-config';
import {routeConfigInit} from './config/route-config';
import {errorConfigInit} from './config/error-config';
import {knex} from './db/connection';

export function initConfig() {
  // *** express instance *** //
  const app: express.Application = express();
  // *** config *** //
  mainConfigInit(knex, app);
  routeConfigInit(app);
  errorConfigInit(app);
  return app;
}



