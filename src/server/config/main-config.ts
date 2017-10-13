// *** main dependencies *** //
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as Knex from 'knex';
import flash = require('connect-flash');
import {logOperate} from '../controllers/system_controllers/log';

// *** load environment variables *** //
dotenv.config();

export function mainConfigInit(knex: Knex, app: express.Application) {

  // *** view folders *** //
  const viewFolders = [path.join(__dirname, '..', 'views')];
  // *** view engine *** //
  nunjucks.configure(viewFolders, {
    express: app,
    autoescape: true
  });
  app.set('view engine', 'html');
  // *** app middleware *** //
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  /*uncomment if using express-session*/
  app.use(flash());
  app.use(express.static(path.resolve(process.env.DIST_PATH)));
  /*logging information middleware*/
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    logOperate(knex, req, res, next);
  });
}





