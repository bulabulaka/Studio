import * as  express from 'express';
import {ReturnModel, handleReturn, handleResponse} from '../shared/index'
import {
  getUserInfoById,
  getUsers,
  getUserRoles,
  getUserAddOrMinusPermissionGroup,
  addUserRoles
} from '../controllers/system_controllers/user';
import {UserModel, RoleModel, PermissionGroupModel} from '../../shared/index';
import * as _ from 'lodash';

const router = express.Router();

/*get userinfo by userId*/
router.get('/get_userinfo', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  getUserInfoById(parseInt(res.locals.userId, 10), (returnVal: ReturnModel<UserModel>) => {
    handleReturn(returnVal, res, next);
  });
});

/*get all users*/
router.get('/get_users', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getUsers(parseInt(query.page, 10), parseInt(query.pageSize, 10), (returnVal: ReturnModel<UserModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*get user roles*/
router.get('/get_user_roles', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.userId || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 ||
    parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getUserRoles(parseInt(query.userId, 10), parseInt(query.page, 10), parseInt(query.pageSize, 10),
    (returnVal: ReturnModel<RoleModel[]>) => {
      handleReturn(returnVal, res, next);
    })
});

/*get user don't have roles*/
router.get('/get_user_donot_have_roles', (req: express.Request, res: express.Response, next: express.NextFunction) => {

});

/*add roles to the user  batch add*/
router.post('/add_user_roles', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const roleIdArray = req.body.roleIdArray;
  const userId = req.body.userId;
  const roleIdArrayLength = req.body.roleIdArrayLength;
  const operatorId = req.body.operatorId;
  if (!roleIdArray || !userId || !roleIdArrayLength || !operatorId) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  addUserRoles(userId, roleIdArray, roleIdArrayLength, operatorId, (returnVal: ReturnModel<Boolean>) => {
    handleReturn(returnVal, res, next);
  })
});

/*get user add or minus permission groups*/
router.get('/get_user_add_or_minus_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.userId || !query.pageSize || parseInt(query.page, 10) < 1 ||
    parseInt(query.pageSize, 10) < 1 || !query.flag || (parseInt(query.flag, 10) !== 1 && parseInt(query.flag, 10) !== 2)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getUserAddOrMinusPermissionGroup(parseInt(query.flag, 10), parseInt(query.userId, 10),
    parseInt(query.page, 10), parseInt(query.pageSize, 10),
    (returnVal: ReturnModel<PermissionGroupModel[]>) => {
      handleReturn(returnVal, res, next);
    });
});

export const userRouter = router;
