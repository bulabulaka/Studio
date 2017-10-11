import {BaseEntity} from '../entity.model';

export class roleModel extends BaseEntity {
  name: string;
  description: string;
  order_no: number;
  auditstat: number;
}
