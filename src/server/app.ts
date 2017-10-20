// *** dependencies *** //
import * as express from 'express';
import {mainConfigInit} from './config/main-config';
import {routeConfigInit} from './config/route-config';
import {errorConfigInit} from './config/error-config';
import {knex} from './db/connection';
import * as NodeCache from 'node-cache';

export function initConfig() {
  // *** express instance *** //
  const app: express.Application = express();
  const nodeCache = new NodeCache();
  // *** config *** //
  mainConfigInit(knex, app, nodeCache);
  routeConfigInit(app, nodeCache);
  errorConfigInit(app, nodeCache);
  return app;
}



