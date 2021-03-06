import {BaseEntity} from '../entity.model';

export class PermissionModel extends BaseEntity {
  flag: number;
  name: string;
  auditstat: number;
  description: string;
  kind: number;
  order_no: number;
  method: string;
  route: string;
}
