export class ResultValue<T> {
  RCode: number;
  RMsg: string;
  Data: T;
  TotalCount?: number;
  Token?: string;
}
