export class ResultValue<T> {
  RCode: number;
  RMsg: string;
  Data: T;
  TotalPage?: number;
}
