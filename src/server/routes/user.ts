import * as  express from 'express';
import {ReturnModel, handleReturn, handleResponse} from '../shared/index'
import {getUserInfoById, getUsers} from '../controllers/system_controllers/user';
import {userModel} from '../../shared/index';
import * as _ from 'lodash';

const router = express.Router();

/*get userinfo by userId*/
router.get('/get_userinfo', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  getUserInfoById(parseInt(res.locals.userId, 10), (returnVal: ReturnModel<userModel>) => {
    handleReturn(returnVal, res, next);
  });
});

/*get all users*/
router.get('/get_users', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getUsers(parseInt(query.page, 10), parseInt(query.pageSize, 10), (returnVal: ReturnModel<userModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

export const UserRouter = router;
