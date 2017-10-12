/*routes config*/
import * as express from 'express';
import {AuthRouter} from '../routes/auth';
import {UserRouter} from '../routes/user';
import {PermissionRouter} from '../routes/permission';
import {RoleRouter} from '../routes/role';
import {verifyToken, ReturnModel, handleResponse, handleReturn} from '../shared/index';
import {registerModel, loginModel, userModel} from '../../shared/index';
import {registerUser, login} from '../controllers/system_controllers/user';
import * as path from 'path';

export function route_config_init(app: express.Application) {

  app.get('', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(process.env.DIST_PATH, 'dist/main.html'));
  });

  /*register user*/
  app.post('/api/register', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const _register: registerModel = req.body.register;
    registerUser(_register, (returnVal: ReturnModel<number>) => {
      handleReturn(returnVal, res, next);
    });
  });

  /*login*/
  app.post('/api/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const _loginModel: loginModel = req.body;
    login(_loginModel, (returnVal: ReturnModel<userModel>) => {
      handleReturn(returnVal, res, next);
    });
  });

  /*logout*/
  app.get('/api/logout', verifyToken, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.SUCCESS_CODE, 10), 'success', null);
  });

  /*checkout token isValid*/
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    verifyToken(req, res, next);
  });
  app.use('/api/user', UserRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/permission', PermissionRouter);
  app.use('/api/role', RoleRouter);

}



