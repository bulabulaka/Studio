import {ResultValue} from '../../shared/models/index';

export function handleResponse<T>(res, resStatusCode: number, code: number, msg: string, data: T, totalPage?: number) {
  let resultData = new ResultValue<T>();
  resultData.RCode = code;
  resultData.RMsg = msg;
  resultData.Data = data;
  resultData.TotalPage = totalPage;
  res.status(resStatusCode).json({resultValue: resultData});
}
