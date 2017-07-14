// *** dependencies *** //
import * as express from "express";
import {main_config_init} from "./config/main-config";
import {route_config_init} from "./config/route-config";
import {error_config_init} from "./config/error-config";

export function init_config() {
  // *** express instance *** //
  const app = express();
  // *** config *** //
  main_config_init(app, express);
  route_config_init(app);
  error_config_init(app);
  return app;
}



