/*routes config*/
import * as express from 'express';
import {AuthRouter} from '../routes/auth';
import {UserRouter} from '../routes/user';
import {PermissionRouter} from '../routes/permission';
import {RoleRouter} from '../routes/role';
import {verifyToken,ReturnModel,handleResponse} from '../shared/index';
import {registerModel,loginModel,userModel} from '../../shared/index';
import {registerUser,login} from '../controllers/business_controllers/user';

import * as path from 'path';

export function route_config_init(app) {

  app.get('', (req, res) => {
    res.sendFile(path.join(process.env.DIST_PATH, 'dist/main.html'));
  });

  /*register user*/
  app.post('/api/register', (req: express.Request, res: express.Response, next: any) => {
      let _register:registerModel = req.body.register;
      registerUser(_register,(returnVal:ReturnModel<number>) =>{
        if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
          return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
        }else if(returnVal.error){
          if(returnVal.errorCode){
            res.locals.errorCode = returnVal.errorCode;
          }
          return next(returnVal.error);
        }else{
          return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
        }
      });
  });

  /*login*/
  app.post('/api/login', (req: express.Request, res: express.Response, next: any) => {
      let _loginModel:loginModel = req.body;
      login(_loginModel,(returnVal:ReturnModel<userModel>,token:string) =>{
         if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
            return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data,0,token);
         }else if(returnVal.error){
            if(returnVal.errorCode){
               res.locals.errorCode = returnVal.errorCode;
            }
            return next(returnVal.error);
         }else{
           return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
         }
      });
  });

  /*logout*/
  app.get('/api/logout', verifyToken, (req: express.Request, res: express.Response, next: any) => {
    handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', null);
  });

  app.use((req: express.Request, res: express.Response, next: any) => {
    verifyToken(req,res,next);
  });
  app.use('/api/user', UserRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/permission', PermissionRouter);
  app.use('/api/role', RoleRouter);

}



