export class ReturnModel<T>{
  RCode: number;
  RMsg:string;
  Data:T;
  error:Error;
  errorCode:number;

  constructor(RCode?:number,RMsg?:string,Data?:T,error?:Error,errorCode?:number){
     this.RCode = RCode;
     this.RMsg = RMsg;
     this.Data = Data;
     this.error = error;
     this.errorCode = errorCode;
  }
}
