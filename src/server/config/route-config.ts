// *** routes *** //
import * as routes from "../routes/index";
import * as authRoutes from "../routes/auth";
import * as userRoutes from "../routes/user";

export function route_config_init(app) {
  // *** register routes *** //
  app.use('/', routes);
  app.use('/auth', authRoutes);
  app.use('/', userRoutes);
}



