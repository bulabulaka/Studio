// *** routes *** //
import * as routes from "../routes/index";
import * as authRoutes from "../routes/auth";
import * as userRoutes from "../routes/user";
import * as path from "path";

export function route_config_init(app) {
  // *** register routes *** //
  app.get('', (req, res) => {
    res.sendFile(path.join(process.env.DIST_PATH, 'dist/main.html'));
  });
  app.use('/api', routes);
  app.use('/api/auth', authRoutes);
  app.use('/api', userRoutes);
}



