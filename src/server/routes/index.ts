import {Router} from "express";
const router = Router();
import {sum} from "../controllers/index";

router.get('/', function (req, res, next) {
  let renderObject = {
    title: "Welcome to Express!",
    sum: 0
  };
  sum(1, 2, (error, results) => {
    if (error) return next(error);
    if (results) {
      renderObject.sum = results;
      res.render('index', renderObject);
    }
  });
});

export const IndexRouter: Router = router;
module .exports = router;
