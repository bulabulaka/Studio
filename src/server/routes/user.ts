import * as  express from 'express';
import {ReturnModel,handleReturn} from '../shared/index'
import {getUserInfoById} from '../controllers/business_controllers/user';
import {userModel} from '../../shared/index';

const router = express.Router();

/*get userinfo by userId*/
router.get('/get_userinfo', (req:express.Request, res:express.Response, next:express.NextFunction) => {
  getUserInfoById(parseInt(res.locals.userId) ,(returnVal:ReturnModel<userModel>) =>{
    handleReturn(returnVal,res,next);
  });
});

export const UserRouter = router;
