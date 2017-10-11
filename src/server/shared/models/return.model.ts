export class ReturnModel<T>{
  constructor(public RCode?:number,public RMsg?:string,public Data?:T,public error?:Error,public errorCode?:number,public token?:string,public totalCount?:number){}
}
