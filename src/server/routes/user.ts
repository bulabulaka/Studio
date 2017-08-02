import {Router} from 'express';
import {handleResponse, verifyToken} from '../shared/index'

const router = Router();
import {adminRequired} from '../auth/_helpers';

router.get('/user', verifyToken, (req, res, next) => {
  console.log(res.locals.decoded);
  handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', null);
});

router.get('/admin', adminRequired, (req, res, next) => {
  handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', null);
});


export const UserRouter = router;
