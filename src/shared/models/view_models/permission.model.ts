import {BaseEntity} from '../entity.model';

export class permissionModel extends BaseEntity {
  name: string;
  auditstat: number;
  description: string;
  kind: number;
  order_no: number;
  method: string;
  route: string;
}
