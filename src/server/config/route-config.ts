/*routes config*/
import * as express from 'express';
import {authRouter} from '../routes/auth';
import {userRouter} from '../routes/user';
import {permissionRouter} from '../routes/permission';
import {roleRouter} from '../routes/role';
import {verifyToken, handleResponse, handleReturn, ReturnModel} from '../shared/index';
import {RegisterModel, LoginModel, UserModel} from '../../shared/index';
import {registerUser, login} from '../controllers/system_controllers/user';
import * as path from 'path';

export function routeConfigInit(app: express.Application) {

  app.get('', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(path.resolve(process.env.DIST_PATH), 'main.html'));
  });

  /*register user*/
  app.post('/api/register', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const _register: RegisterModel = req.body.register;
    registerUser(_register, (returnVal: ReturnModel<number>) => {
      handleReturn(returnVal, res, next);
    });
  });

  /*login*/
  app.post('/api/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const _loginModel: LoginModel = req.body;
    login(_loginModel, (returnVal: ReturnModel<UserModel>) => {
      handleReturn(returnVal, res, next);
    });
  });

  /*checkout token isValid*/
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    verifyToken(req, res, next);
  });
  app.use('/api/user', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/permission', permissionRouter);
  app.use('/api/role', roleRouter);
}



