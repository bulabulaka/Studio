// *** routes *** //z
import {AuthRouter} from '../routes/auth';
import {UserRouter} from '../routes/user';
import {PermissionRouter} from '../routes/permission';
import {RoleRouter} from '../routes/role';

import * as path from 'path';

export function route_config_init(app) {
  // *** register routes *** //
  app.get('', (req, res) => {
    res.sendFile(path.join(process.env.DIST_PATH, 'dist/main.html'));
  });

  app.use('/api/user', UserRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/permission', PermissionRouter);
  app.use('/api/role', RoleRouter);

}



