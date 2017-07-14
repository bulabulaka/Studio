import {Router} from "express";
const router = Router();
import {loginRequired, adminRequired} from "../auth/_helpers";

router.get('/user', loginRequired, (req, res, next) => {
  handleResponse(res, 200, 'success');
});

router.get('/admin', adminRequired, (req, res, next) => {
  handleResponse(res, 200, 'success');
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

export const UserRouter: Router = router;
module.exports = router;
