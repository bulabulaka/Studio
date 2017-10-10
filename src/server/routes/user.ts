import * as  express from 'express';
import {verifyToken,handleResponse,ReturnModel} from '../shared/index'
import {getUserInfoById,createUser} from '../controllers/business_controllers/user';
import {registerModel,m_user} from '../../shared/index';

const router = express.Router();

/*根据用户ID查找用户信息*/
router.get('/get_userinfo', verifyToken, (req:express.Request, res:express.Response, next:any) => {
  getUserInfoById(parseInt(res.locals.userId) ,(returnVal:ReturnModel<m_user>) =>{
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

/*注册用户*/
router.post('/register', (req: express.Request, res: express.Response, next: any) => {
  try{
    let _register:registerModel = req.body.register;
    createUser(_register,(returnVal:ReturnModel<number>) =>{
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
  }catch(err){
    next(err);
  }
});

export const UserRouter = router;
