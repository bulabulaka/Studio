// *** main dependencies *** //
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import flash = require("connect-flash");
import * as morgan from "morgan";
import * as nunjucks from "nunjucks";
import * as passport from "passport";
import * as dotenv from "dotenv";
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
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  // uncomment if using express-session
  app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(express.static(path.join(process.env.DIST_PATH, 'dist')));
}





