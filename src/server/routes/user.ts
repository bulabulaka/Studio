import * as  express from 'express';
import {handleResponse,ReturnModel} from '../shared/index'
import {getUserInfoById} from '../controllers/business_controllers/user';
import {userModel} from '../../shared/index';

const router = express.Router();

/*根据用户ID查找用户信息*/
router.get('/get_userinfo', (req:express.Request, res:express.Response, next:any) => {
  getUserInfoById(parseInt(res.locals.userId) ,(returnVal:ReturnModel<userModel>) =>{
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

export const UserRouter = router;
