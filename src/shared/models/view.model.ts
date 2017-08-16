import {BaseEntity} from './entity.model';

export class permission extends BaseEntity {
  id: number;
  name: string;
  auditstat: number;
  description: string;
  kind: number;
  order_no: number;
  method: string;
  route: string;
}
