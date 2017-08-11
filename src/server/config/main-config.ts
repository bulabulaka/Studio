// *** main dependencies *** //
import * as path from 'path';
import * as bodyParser from 'body-parser';
import flash = require('connect-flash');
import * as morgan from 'morgan';
import * as nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
import * as express from 'express';

// *** load environment variables *** //
dotenv.config();

export function main_config_init(app: any, express: any) {

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
  // uncomment if using express-session
  app.use(flash());
  app.use(express.static(path.join(process.env.DIST_PATH, 'dist')));

  //logging information middleware
  app.use(function (req: express.Request, res: express.Response, next) {
    console.log(req.ip);
    console.log(req.headers['x-access-token']);
    console.log(req.headers['user-agent']);
    console.log(req.headers['content-type']);
    console.log(req.headers['accept-encoding']);
    console.log(req.path);
    console.log(req.method);
    console.log(req.params);
    console.log(req.query);
    console.log(new Date());
    //when res.end() is called, it will emit a "finish" event.
    res.on('finish', () => {
      console.log(new Date());
      console.log(res.statusCode);
    });
    next();
  });
}





